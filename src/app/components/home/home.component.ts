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
  private islands: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    rot: number;
    phase: number;
    drift: number;
    rings: number;
  }[] = [];
  private cmx = -9999;
  private cmy = -9999;

  private readonly INFLUENCE = 190;

  private _docMouseMove!: (e: MouseEvent) => void;
  private _docMouseLeave!: () => void;
  private _resizeHandler!: () => void;

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

    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);

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
    cancelAnimationFrame(this.animId);
    document.removeEventListener('mousemove',  this._docMouseMove);
    document.removeEventListener('mouseleave', this._docMouseLeave);
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
  }

  private resize() {
    /*
      FIX: Canvas must cover the FULL scrollable content of the page section,
      not just the viewport-sized container. Use the scroll container's
      scrollHeight so the grid extends behind the featured projects section.
    */
    const section = this.canvas.closest('.page-section') as HTMLElement;
    const W = this.canvas.clientWidth || (section ? section.clientWidth : window.innerWidth);
    const H = section
      ? Math.max(section.scrollHeight, section.clientHeight)
      : window.innerHeight;

    // Override CSS height so the canvas physically stretches
    this.canvas.style.height = H + 'px';
    this.canvas.width  = W;
    this.canvas.height = H;

    this.islands = [];
    const count = Math.max(7, Math.min(18, Math.round((W * H) / 125000)));

    for (let i = 0; i < count; i++) {
      const band = i / Math.max(1, count - 1);
      const sideBias = i % 3 === 0 ? -0.12 : i % 3 === 1 ? 0.12 : 0;
      this.islands.push({
        cx: (0.16 + ((i * 0.381966) % 0.72) + sideBias) * W,
        cy: (0.08 + band * 0.9) * H,
        rx: 70 + ((i * 47) % 120),
        ry: 42 + ((i * 31) % 95),
        rot: ((i * 29) % 180) * Math.PI / 180,
        phase: i * 1.73,
        drift: i % 2 === 0 ? 1 : -1,
        rings: 4 + (i % 4),
      });
    }
  }

  private draw() {
    const { ctx, canvas: { width: W, height: H } } = this;
    ctx.clearRect(0, 0, W, H);
    const isDark = this.nav.isDark();
    const t = performance.now() * 0.00035;

    const glow = ctx.createRadialGradient(W * 0.72, H * 0.18, 0, W * 0.72, H * 0.18, Math.max(W, H) * 0.75);
    glow.addColorStop(0, isDark ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.12)');
    glow.addColorStop(0.42, isDark ? 'rgba(139,92,246,0.055)' : 'rgba(139,92,246,0.075)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    for (const island of this.islands) {
      const cx = island.cx + Math.sin(t * 0.7 + island.phase) * 10 * island.drift;
      const cy = island.cy + Math.cos(t * 0.55 + island.phase) * 8;
      const dx = cx - this.cmx;
      const dy = cy - this.cmy;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.max(0, 1 - dist / this.INFLUENCE);
      const px = cx + (dx / dist) * pull * 28;
      const py = cy + (dy / dist) * pull * 28;

      for (let ring = island.rings; ring >= 1; ring--) {
        const scale = ring / island.rings;
        const alpha = (isDark ? 0.11 : 0.16) * (1 - scale * 0.18) + pull * 0.08;
        ctx.strokeStyle = ring === 1
          ? `rgba(20,184,166,${alpha + 0.04})`
          : `rgba(139,92,246,${alpha})`;
        ctx.lineWidth = ring === 1 ? 1.1 : 0.75;
        ctx.beginPath();

        const steps = 88;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const wobble =
            1 +
            Math.sin(a * 3 + island.phase + t * island.drift) * 0.08 +
            Math.cos(a * 5 - island.phase * 0.7 + t * 1.4) * 0.045 +
            pull * Math.sin(a - Math.atan2(dy, dx)) * 0.16;

          const ex = Math.cos(a) * island.rx * scale * wobble;
          const ey = Math.sin(a) * island.ry * scale * wobble;
          const x = px + ex * Math.cos(island.rot) - ey * Math.sin(island.rot);
          const y = py + ex * Math.sin(island.rot) + ey * Math.cos(island.rot);
          s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.stroke();
      }
    }

    ctx.fillStyle = isDark ? 'rgba(230,225,255,0.13)' : 'rgba(71,65,102,0.13)';
    for (let i = 0; i < 52; i++) {
      const x = ((i * 137.5 + Math.sin(t + i) * 7) % W + W) % W;
      const y = ((i * 83.25 + Math.cos(t * 1.3 + i) * 7) % H + H) % H;
      ctx.beginPath();
      ctx.arc(x, y, i % 5 === 0 ? 1.3 : 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.draw());
  }
}
