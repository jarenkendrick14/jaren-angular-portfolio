import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PortfolioDataService } from '../../data/portfolio.data';
import { Certificate } from '../../models/portfolio.models';
import { CommonModule } from '@angular/common';

interface HeatmapDay { date: string; count: number; level: number; }
interface Commit { sha: string; message: string; repo: string; date: string; url: string; }

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() active = false;
  data = inject(PortfolioDataService);

  @ViewChild('sphereContainer') sphereContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('sphereWrap') sphereWrap!: ElementRef<HTMLDivElement>;

  readonly skillsExpanded = signal(false);
  readonly certIndex = signal(0);
  readonly certAnimClass = signal('');

  /* ── Counters ── */
  readonly counters = [
    { target: 5,  label: 'Projects Shipped', suffix: '', current: signal(0) },
    { target: 13, label: 'Certifications',   suffix: '', current: signal(0) },
    { target: 2,  label: 'Years Coding',     suffix: '+', current: signal(0) },
  ];

  /* ── GitHub Heatmap ── */
  readonly heatmapWeeks = signal<HeatmapDay[][]>([]);
  readonly heatmapMonths = signal<{ col: number, label: string }[]>([]);
  readonly heatmapTotal = signal(0);
  readonly heatmapLoading = signal(true);
  readonly heatmapError = signal(false);

  /* ── Recent Commits ── */
  readonly recentCommits = signal<Commit[]>([]);
  readonly commitsLoading = signal(true);

  readonly skills = [
    { name: 'JavaScript', time: '2 yrs', pct: 85 },
    { name: 'TypeScript', time: '1.5 yrs', pct: 80 },
    { name: 'Angular', time: '1 yr', pct: 75 },
    { name: 'Node.js & Express', time: '1 yr', pct: 75 },
    { name: 'Vue.js 3', time: '1 yr', pct: 70 },
    { name: 'C#', time: '1 yr', pct: 70 },
    { name: 'MongoDB', time: '1 yr', pct: 65 },
    { name: 'PostgreSQL', time: '6 mo', pct: 55 },
  ];

  readonly sphereTags = [
    { text: 'Angular', color: '#dd0031' }, { text: 'Vue.js 3', color: '#42b883' },
    { text: 'Node.js', color: '#339933' }, { text: 'MongoDB', color: '#47a248' },
    { text: 'TypeScript', color: '#3178c6' }, { text: 'C#', color: '#9b59b6' },
    { text: 'Unity', color: '#a78bfa' }, { text: 'Express.js', color: '#7a7a9c' },
    { text: 'REST APIs', color: '#60a5fa' }, { text: 'Git', color: '#f05030' },
    { text: 'PostgreSQL', color: '#336791' }, { text: 'Prisma', color: '#7c8cf8' },
    { text: 'Ionic', color: '#3880ff' }, { text: 'WebSockets', color: '#f59e0b' },
  ];

  get currentCert(): Certificate { return this.data.certificates[this.certIndex()]; }
  get certTotal(): number { return this.data.certificates.length; }

  private animId = 0;
  private rotX = 0.4; private rotY = 0;
  private isDrag = false; private lx = 0; private ly = 0;
  private velX = 0; private velY = 0.004;

  toggleSkills() { this.skillsExpanded.update(v => !v); }

  certNav(dir: number) {
    this.certAnimClass.set('');
    this.certIndex.update(i => (i + dir + this.certTotal) % this.certTotal);
    setTimeout(() => this.certAnimClass.set(dir > 0 ? 'cert-in' : 'cert-in-r'), 10);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && this.active) {
      // RESET AND ANIMATE EVERY TIME
      this.counters.forEach(c => c.current.set(0));
      setTimeout(() => this.animateCounters(), 350);
    }
  }

  ngAfterViewInit() {
    this.initSphere();
    this.fetchHeatmap();
    this.fetchCommits();
  }

  ngOnDestroy() { cancelAnimationFrame(this.animId); }

  private animateCounters() {
    this.counters.forEach(c => {
      const duration = 1400;
      const steps = 30;
      const stepTime = duration / steps;
      let step = 0;
      const iv = setInterval(() => {
        step++;
        const t = step / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        c.current.set(Math.round(eased * c.target));
        if (step >= steps) { c.current.set(c.target); clearInterval(iv); }
      }, stepTime);
    });
  }

  /* ── 100% ACCURATE DIRECT GITHUB HTML SCRAPER ── */
  private async fetchHeatmap() {
    try {
      const url = '/api/github';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Proxy fetch failed');
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const h2 = doc.querySelector('h2.f4');
      if (h2) {
        const match = h2.textContent?.match(/([\d,]+)\s+contributions/);
        if (match) this.heatmapTotal.set(parseInt(match[1].replace(/,/g, ''), 10));
      }

      const dayMap = new Map<string, { count: number, level: number }>();
      const cells = doc.querySelectorAll('td.ContributionCalendar-day');
      
      cells.forEach(cell => {
        const date = cell.getAttribute('data-date');
        const level = parseInt(cell.getAttribute('data-level') || '0', 10);
        if (date) dayMap.set(date, { count: 0, level });
      });

      if (dayMap.size === 0) throw new Error('No cells found');

      this.generateGrid(dayMap);
      this.heatmapLoading.set(false);
    } catch (err) {
      this.heatmapError.set(true);
      this.heatmapLoading.set(false);
    }
  }

  private generateGrid(dayMap: Map<string, { count: number, level: number }>) {
    const WEEKS_TO_SHOW = 20; 
    const weeks: HeatmapDay[][] = [];
    const months: { col: number, label: string }[] = [];
    
    const today = new Date();
    const endOffset = 6 - today.getDay(); 
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + endOffset);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (WEEKS_TO_SHOW * 7) + 1);

    let lastMonth = -1;

    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      const week: HeatmapDay[] = [];
      
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (w * 7));
      const m = weekStart.getMonth();
      
      if (m !== lastMonth) {
        months.push({ col: w, label: weekStart.toLocaleString('default', { month: 'short' }) });
        lastMonth = m;
      }

      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (w * 7) + d);
        
        const year = cellDate.getFullYear();
        const month = String(cellDate.getMonth() + 1).padStart(2, '0');
        const day = String(cellDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const data = dayMap.get(dateStr);
        week.push({
          date: dateStr,
          count: data ? data.count : 0,
          level: data ? data.level : 0 
        });
      }
      weeks.push(week);
    }
    
    this.heatmapMonths.set(months);
    this.heatmapWeeks.set(weeks);
  }

  /* ── Recent Commits ── */
  private async fetchCommits() {
    try {
      const res = await fetch('https://api.github.com/users/jarenkendrick14/events/public?per_page=30');
      if (!res.ok) throw new Error('API error');
      const events: any[] = await res.json();
      const commits: Commit[] = [];
      for (const ev of events) {
        if (ev.type === 'PushEvent' && ev.payload?.commits?.length) {
          const repoName = ev.repo?.name?.split('/')[1] || ev.repo?.name || 'unknown';
          for (const c of ev.payload.commits) {
            if (commits.length >= 5) break;
            commits.push({
              sha: c.sha?.substring(0, 7) || '', message: c.message?.split('\n')[0] || '',
              repo: repoName, date: this.timeAgo(new Date(ev.created_at)),
              url: `https://github.com/${ev.repo?.name}/commit/${c.sha}`,
            });
          }
          if (commits.length >= 5) break;
        }
      }
      this.recentCommits.set(commits);
      this.commitsLoading.set(false);
    } catch { this.commitsLoading.set(false); }
  }

  private timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  getHeatColor(level: number): string {
    const colors = [
      'var(--bg)',                  
      'rgba(139,92,246,0.2)',      
      'rgba(139,92,246,0.45)',     
      'rgba(139,92,246,0.7)',      
      'rgba(139,92,246,1)',        
    ];
    return colors[Math.min(level, 4)];
  }

  /* ── Custom Vanilla JS Sphere ── */
  private initSphere() {
    const RADIUS = 95;
    const items = this.sphereTags.map((tag, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / this.sphereTags.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const el = document.createElement('span');
      el.className = 'sphere-tag';
      el.textContent = tag.text;
      el.style.color = tag.color;
      el.style.position = 'absolute';
      el.style.background = 'var(--surf)';
      el.style.padding = '4px 8px';
      el.style.borderRadius = '4px';
      el.style.border = '1px solid var(--bord)';
      el.style.cursor = 'grab';
      el.style.userSelect = 'none';
      el.style.fontFamily = "'JetBrains Mono', monospace";
      el.style.fontSize = "12px";
      el.style.whiteSpace = "nowrap";
      if (this.sphereContainer?.nativeElement) {
        this.sphereContainer.nativeElement.appendChild(el);
      }
      return { el, phi, theta };
    });

    const render = () => {
      const cosRX = Math.cos(this.rotX), sinRX = Math.sin(this.rotX);
      const cosRY = Math.cos(this.rotY), sinRY = Math.sin(this.rotY);
      items.forEach((item) => {
        let x = Math.sin(item.phi) * Math.cos(item.theta);
        let y = Math.cos(item.phi);
        let z = Math.sin(item.phi) * Math.sin(item.theta);
        const x2 = x * cosRY - z * sinRY;
        const z2 = x * sinRY + z * cosRY;
        const y3 = y * cosRX - z2 * sinRX;
        const z3 = y * sinRX + z2 * cosRX;
        const scale = (z3 + 2.2) / 3.2;
        const px = x2 * RADIUS;
        const py = y3 * RADIUS;
        item.el.style.transform = `translate(-50%,-50%) translate(${px}px,${py}px)`;
        item.el.style.opacity = Math.max(0.1, scale).toString();
        item.el.style.zIndex = Math.round(scale * 20).toString();
        item.el.style.borderColor = z3 > 0 ? 'rgba(167,139,250, 0.6)' : 'var(--bord)';
      });
    };

    const animate = () => {
      if (!this.isDrag) { this.rotY += this.velY; this.rotX += this.velX; this.velX *= 0.97; }
      render();
      this.animId = requestAnimationFrame(animate);
    };

    const wrap = this.sphereWrap?.nativeElement;
    if (wrap) {
      wrap.addEventListener('mousedown', e => { this.isDrag = true; this.lx = e.clientX; this.ly = e.clientY; });
      document.addEventListener('mousemove', e => {
        if (!this.isDrag) return;
        this.velY = (e.clientX - this.lx) * 0.006;
        this.velX = (e.clientY - this.ly) * 0.006;
        this.rotY += this.velY; this.rotX += this.velX;
        this.lx = e.clientX; this.ly = e.clientY;
      });
      document.addEventListener('mouseup', () => this.isDrag = false);
    }
    animate();
  }
}