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
  private counterRan = false;

  /* ── GitHub Heatmap ── */
  readonly heatmapWeeks = signal<HeatmapDay[][]>([]);
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
    if (changes['active'] && this.active && !this.counterRan) {
      this.counterRan = true;
      // Small delay so the slide animation is underway
      setTimeout(() => this.animateCounters(), 350);
    }
  }

  ngAfterViewInit() {
    this.initSphere();
    this.fetchHeatmap();
    this.fetchCommits();
  }

  ngOnDestroy() { cancelAnimationFrame(this.animId); }

  /* ── Counter Animation ── */
  private animateCounters() {
    this.counters.forEach(c => {
      const duration = 1400;
      const steps = 30;
      const stepTime = duration / steps;
      let step = 0;
      const iv = setInterval(() => {
        step++;
        // Ease-out cubic
        const t = step / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        c.current.set(Math.round(eased * c.target));
        if (step >= steps) { c.current.set(c.target); clearInterval(iv); }
      }, stepTime);
    });
  }

  /* ── GitHub Heatmap ── */
  private async fetchHeatmap() {
    try {
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/jarenkendrick14?y=last');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const contributions: HeatmapDay[] = data.contributions || [];
      this.heatmapTotal.set(data.total?.lastYear || contributions.reduce((s: number, d: HeatmapDay) => s + d.count, 0));

      // Take last 20 weeks (140 days) for compact display
      const recent = contributions.slice(-140);

      // Group into weeks (columns of 7)
      const weeks: HeatmapDay[][] = [];
      for (let i = 0; i < recent.length; i += 7) {
        weeks.push(recent.slice(i, i + 7));
      }
      this.heatmapWeeks.set(weeks);
      this.heatmapLoading.set(false);
    } catch {
      this.heatmapError.set(true);
      this.heatmapLoading.set(false);
    }
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
    // Match GitHub's green gradient but in our accent purple
    const colors = [
      'var(--bg)',                  // level 0 — empty
      'rgba(139,92,246,0.2)',      // level 1
      'rgba(139,92,246,0.45)',     // level 2
      'rgba(139,92,246,0.7)',      // level 3
      'rgba(139,92,246,1)',        // level 4
    ];
    return colors[Math.min(level, 4)];
  }

  /* ── Sphere ── */
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