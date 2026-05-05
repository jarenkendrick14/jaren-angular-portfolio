import { Component, inject, signal, AfterViewInit, OnDestroy, output, Input } from '@angular/core';
import { PortfolioDataService } from '../../data/portfolio.data';
import { NavigationService } from '../../data/navigation.service';
import { DecryptDirective } from '../../directives/decrypt.directive';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecryptDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @Input() active = false;

  data = inject(PortfolioDataService);
  nav  = inject(NavigationService);
  projectOpened = output<number>();
  previewHover  = output<number | null>();
  resumeOpened  = output<void>();

  readonly featuredIndices = [0, 1, 3];

  readonly pampangaTime = signal(this.getPhTime());
  readonly pampangaIcon = signal(this.getPhIcon());
  private clockTimer: any = null;

  private getPhDate(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
  }

  private getPhTime(): string {
    const ph = this.getPhDate();
    const h = ph.getHours();
    const m = ph.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = ((h % 12) || 12);
    return `${h12}:${m} ${ampm} in Pampanga`;
  }

  private getPhIcon(): 'moon' | 'sun' | 'cloud' {
    const h = this.getPhDate().getHours();
    return (h >= 18 || h < 6) ? 'moon' : (h >= 12 ? 'sun' : 'cloud');
  }

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private latticePoints: {
    ox: number;
    oy: number;
    x: number;
    y: number;
    phase: number;
    accent: 'violet' | 'indigo';
  }[] = [];
  private latticeLinks: { a: number; b: number; weight: number }[] = [];
  private cmx = -9999;
  private cmy = -9999;

  private readonly INFLUENCE = 170;

  private _docMouseMove!: (e: MouseEvent) => void;
  private _docMouseLeave!: () => void;
  private _resizeHandler!: () => void;
  private resizeTimer: any = null;

  get featuredProjects() {
    return this.featuredIndices.map(i => ({ project: this.data.projects[i], index: i }));
  }


  ngAfterViewInit() {
    this.clockTimer = setInterval(() => {
      this.pampangaTime.set(this.getPhTime());
      this.pampangaIcon.set(this.getPhIcon());
    }, 1000);
    this.canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;

    // Initial resize — slight delay so the DOM has settled and scrollHeight is accurate
    setTimeout(() => this.resize(), 50);

    this._resizeHandler = () => {
      this.resize();
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 180);
    };
    window.addEventListener('resize', this._resizeHandler);
    document.addEventListener('fullscreenchange', this._resizeHandler);

    this._docMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.cmx = e.clientX - rect.left;
      this.cmy = e.clientY - rect.top;
    };
    this._docMouseLeave = () => {
      this.cmx = -9999;
      this.cmy = -9999;
    };

    document.addEventListener('mousemove',  this._docMouseMove);
    document.addEventListener('mouseleave', this._docMouseLeave);

    this.draw();
  }

  ngOnDestroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    cancelAnimationFrame(this.animId);
    document.removeEventListener('mousemove',  this._docMouseMove);
    document.removeEventListener('mouseleave', this._docMouseLeave);
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    if (this._resizeHandler) document.removeEventListener('fullscreenchange', this._resizeHandler);
  }

  private resize() {
    const section = this.canvas.closest('.page-section') as HTMLElement;
    const page = this.canvas.closest('.page-home') as HTMLElement;
    const content = page?.querySelector('.pin') as HTMLElement | null;
    const W = this.canvas.clientWidth || (section ? section.clientWidth : window.innerWidth);
    const contentBottom = content
      ? content.offsetTop + content.offsetHeight + parseFloat(getComputedStyle(page).paddingBottom || '0')
      : 0;
    const H = Math.max(section?.clientHeight || window.innerHeight, contentBottom);

    this.canvas.style.height = H + 'px';
    this.canvas.width  = W;
    this.canvas.height = H;

    const sx = Math.max(62, Math.min(86, W / 13));
    const sy = sx * 0.58;
    const cols = Math.ceil(W / sx) + 4;
    const rows = Math.ceil(H / sy) + 4;

    this.latticePoints = [];
    this.latticeLinks = [];

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const i = this.latticePoints.length;
        const x = c * sx + (r % 2) * sx * 0.5;
        const y = r * sy;
        this.latticePoints.push({
          ox: x,
          oy: y,
          x,
          y,
          phase: r * 0.72 + c * 1.17,
          accent: (r + c) % 5 === 0 ? 'indigo' : 'violet',
        });

        if (c > -1 && (r * 5 + c * 3) % 7 !== 0) {
          this.latticeLinks.push({ a: i, b: i + 1, weight: 0.72 });
        }
        if (r > -1 && (r * 2 + c * 5) % 6 !== 1) {
          this.latticeLinks.push({ a: i, b: i + cols, weight: 0.48 });
        }
        if (r > -1 && (r * 3 + c * 7) % 5 !== 2) {
          this.latticeLinks.push({ a: i, b: i + cols + 1, weight: 0.56 });
        }
      }
    }
  }

  private draw() {
    const { ctx, canvas: { width: W, height: H } } = this;
    ctx.clearRect(0, 0, W, H);
    const isDark = this.nav.isDark();
    const t = performance.now() * 0.001;
    const mx = this.cmx < -1000 ? -9999 : this.cmx;
    const my = this.cmy < -1000 ? -9999 : this.cmy;
    const px = mx > -1000 ? (mx / Math.max(1, W) - 0.5) : 0;
    const py = my > -1000 ? (my / Math.max(1, H) - 0.5) : 0;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, isDark ? 'rgba(9,9,15,0.94)' : 'rgba(253,252,255,0.92)');
    bg.addColorStop(0.52, isDark ? 'rgba(10,14,20,0.86)' : 'rgba(247,250,252,0.86)');
    bg.addColorStop(1, isDark ? 'rgba(15,12,23,0.94)' : 'rgba(246,242,255,0.88)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const stage = ctx.createRadialGradient(W * (0.32 + px * 0.04), H * (0.34 + py * 0.03), 0, W * 0.32, H * 0.34, Math.max(W, H) * 0.75);
    stage.addColorStop(0, isDark ? 'rgba(139,92,246,0.11)' : 'rgba(139,92,246,0.1)');
    stage.addColorStop(0.45, isDark ? 'rgba(99,102,241,0.065)' : 'rgba(99,102,241,0.075)');
    stage.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = stage;
    ctx.fillRect(0, 0, W, H);

    for (const p of this.latticePoints) {
      const dx = p.ox - mx;
      const dy = p.oy - my;
      const dist = Math.hypot(dx, dy) || 1;
      const hover = Math.max(0, 1 - dist / this.INFLUENCE);
      const wave = Math.sin(t * 0.55 + p.phase) * 4;
      const drift = Math.cos(t * 0.38 + p.phase * 0.7) * 2.5;

      p.x = p.ox + wave + (dx / dist) * hover * 22 + px * 10;
      p.y = p.oy + drift + (dy / dist) * hover * 22 + py * 10;
    }

    ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
    for (const link of this.latticeLinks) {
      const a = this.latticePoints[link.a];
      const b = this.latticePoints[link.b];
      if (!a || !b) continue;
      if ((a.x < -80 && b.x < -80) || (a.x > W + 80 && b.x > W + 80) || (a.y < -80 && b.y < -80) || (a.y > H + 80 && b.y > H + 80)) continue;

      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const hover = Math.max(0, 1 - Math.hypot(midX - mx, midY - my) / this.INFLUENCE);
      const alpha = (isDark ? 0.12 : 0.16) * link.weight + hover * 0.13;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isDark
        ? `rgba(166,151,219,${alpha})`
        : `rgba(109,91,154,${alpha})`;
      ctx.lineWidth = 0.65 + hover * 0.75;
      ctx.stroke();
    }

    for (const p of this.latticePoints) {
      if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue;
      const pulse = 0.5 + Math.sin(t * 1.4 + p.phase) * 0.5;
      const hover = Math.max(0, 1 - Math.hypot(p.x - mx, p.y - my) / this.INFLUENCE);
      const alpha = 0.14 + pulse * 0.06 + hover * 0.36;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.45 + hover * 2.1, 0, Math.PI * 2);
      ctx.fillStyle = p.accent === 'indigo'
        ? (isDark ? `rgba(129,140,248,${alpha})` : `rgba(79,70,229,${alpha})`)
        : (isDark ? `rgba(196,181,253,${alpha})` : `rgba(109,40,217,${alpha})`);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    this.animId = requestAnimationFrame(() => this.draw());
  }
}
