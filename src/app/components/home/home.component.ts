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
  private ribbons: {
    base: number;
    amp: number;
    thickness: number;
    phase: number;
    speed: number;
    tilt: number;
    color: 'violet' | 'teal' | 'rose';
  }[] = [];
  private cmx = -9999;
  private cmy = -9999;

  private readonly INFLUENCE = 260;

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

    const colors: Array<'violet' | 'teal' | 'rose'> = ['violet', 'teal', 'rose'];
    this.ribbons = Array.from({ length: 9 }, (_, i) => ({
      base: -0.08 + i * 0.145,
      amp: 34 + (i % 3) * 18,
      thickness: 90 + (i % 4) * 26,
      phase: i * 1.27,
      speed: 0.55 + (i % 5) * 0.12,
      tilt: (i % 2 === 0 ? 1 : -1) * (0.035 + (i % 3) * 0.018),
      color: colors[i % colors.length],
    }));
  }

  private draw() {
    const { ctx, canvas: { width: W, height: H } } = this;
    ctx.clearRect(0, 0, W, H);
    const isDark = this.nav.isDark();
    const t = performance.now() * 0.00045;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, isDark ? 'rgba(15,12,24,0.74)' : 'rgba(255,255,255,0.72)');
    bg.addColorStop(0.48, isDark ? 'rgba(8,17,27,0.54)' : 'rgba(238,250,247,0.64)');
    bg.addColorStop(1, isDark ? 'rgba(20,12,31,0.78)' : 'rgba(246,241,255,0.72)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * 0.78, H * 0.2, 0, W * 0.78, H * 0.2, Math.max(W, H) * 0.82);
    glow.addColorStop(0, isDark ? 'rgba(20,184,166,0.16)' : 'rgba(20,184,166,0.2)');
    glow.addColorStop(0.45, isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
    for (const ribbon of this.ribbons) {
      const grad = ctx.createLinearGradient(0, H * ribbon.base, W, H * (ribbon.base + 0.18));
      if (ribbon.color === 'teal') {
        grad.addColorStop(0, isDark ? 'rgba(20,184,166,0)' : 'rgba(20,184,166,0)');
        grad.addColorStop(0.45, isDark ? 'rgba(20,184,166,0.11)' : 'rgba(20,184,166,0.14)');
        grad.addColorStop(1, isDark ? 'rgba(20,184,166,0)' : 'rgba(20,184,166,0)');
      } else if (ribbon.color === 'rose') {
        grad.addColorStop(0, isDark ? 'rgba(244,114,182,0)' : 'rgba(219,39,119,0)');
        grad.addColorStop(0.48, isDark ? 'rgba(244,114,182,0.075)' : 'rgba(219,39,119,0.08)');
        grad.addColorStop(1, isDark ? 'rgba(244,114,182,0)' : 'rgba(219,39,119,0)');
      } else {
        grad.addColorStop(0, isDark ? 'rgba(139,92,246,0)' : 'rgba(109,40,217,0)');
        grad.addColorStop(0.5, isDark ? 'rgba(139,92,246,0.13)' : 'rgba(109,40,217,0.11)');
        grad.addColorStop(1, isDark ? 'rgba(139,92,246,0)' : 'rgba(109,40,217,0)');
      }

      ctx.fillStyle = grad;
      this.drawRibbonPath(W, H, t, ribbon, ribbon.thickness);
      ctx.fill();

      ctx.strokeStyle = ribbon.color === 'teal'
        ? (isDark ? 'rgba(94,234,212,0.18)' : 'rgba(15,118,110,0.18)')
        : ribbon.color === 'rose'
          ? (isDark ? 'rgba(244,114,182,0.14)' : 'rgba(190,24,93,0.12)')
          : (isDark ? 'rgba(196,181,253,0.16)' : 'rgba(109,40,217,0.14)');
      ctx.lineWidth = 0.9;
      this.drawRibbonPath(W, H, t, ribbon, 0);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = isDark ? 'rgba(230,225,255,0.1)' : 'rgba(71,65,102,0.1)';
    for (let i = 0; i < 90; i++) {
      const x = ((i * 137.5 + Math.sin(t * 1.7 + i) * 10) % W + W) % W;
      const y = ((i * 83.25 + Math.cos(t * 1.2 + i) * 10) % H + H) % H;
      ctx.beginPath();
      ctx.arc(x, y, i % 6 === 0 ? 1.2 : 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.draw());
  }

  private drawRibbonPath(
    W: number,
    H: number,
    t: number,
    ribbon: { base: number; amp: number; thickness: number; phase: number; speed: number; tilt: number },
    thickness: number
  ) {
    const steps = 34;
    const xPad = 140;
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = -xPad + (i / steps) * (W + xPad * 2);
      const center =
        H * ribbon.base +
        Math.sin(x * 0.004 + t * ribbon.speed + ribbon.phase) * ribbon.amp +
        Math.cos(x * 0.011 - t * (ribbon.speed + 0.35) + ribbon.phase) * ribbon.amp * 0.34 +
        (x - W / 2) * ribbon.tilt;
      const d = Math.hypot(x - this.cmx, center - this.cmy) || 1;
      const push = Math.max(0, 1 - d / this.INFLUENCE);
      points.push({ x, y: center + ((center - this.cmy) / d) * push * 46 });
    }

    this.ctx.beginPath();
    if (thickness <= 0) {
      points.forEach((p, i) => i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y));
      return;
    }

    points.forEach((p, i) => i === 0 ? this.ctx.moveTo(p.x, p.y - thickness / 2) : this.ctx.lineTo(p.x, p.y - thickness / 2));
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      this.ctx.lineTo(p.x, p.y + thickness / 2);
    }
    this.ctx.closePath();
  }
}
