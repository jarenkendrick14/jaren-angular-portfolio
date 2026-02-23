import { Component, inject, ElementRef, AfterViewInit, OnDestroy, output, Input, effect } from '@angular/core';
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

  readonly featuredIndices = [0, 1, 3];

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private pts: { ox: number; oy: number; x: number; y: number }[] = [];
  private vx: number[] = [];
  private vy: number[] = [];
  private cmx = -9999;
  private cmy = -9999;

  private readonly SP     = 42;
  private readonly REPEL  = 110;
  private readonly FORCE  = 22;
  private readonly RESTORE = 0.07;
  private readonly DAMP   = 0.82;

  private _docMouseMove!: (e: MouseEvent) => void;
  private _docMouseLeave!: () => void;
  private _resizeHandler!: () => void;

  get featuredProjects() {
    return this.featuredIndices.map(i => ({ project: this.data.projects[i], index: i }));
  }

  ngAfterViewInit() {
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

    this.pts = [];
    this.vx  = [];
    this.vy  = [];

    for (let c = 0; c <= Math.ceil(W / this.SP) + 1; c++) {
      for (let r = 0; r <= Math.ceil(H / this.SP) + 1; r++) {
        this.pts.push({ ox: c * this.SP, oy: r * this.SP, x: c * this.SP, y: r * this.SP });
        this.vx.push(0);
        this.vy.push(0);
      }
    }
  }

  private draw() {
    const { ctx, canvas: { width: W, height: H } } = this;
    ctx.clearRect(0, 0, W, H);
    const rows = Math.ceil(H / this.SP) + 2;
    const cols = Math.ceil(W / this.SP) + 2;

    this.pts.forEach((p, i) => {
      const dx   = p.x - this.cmx;
      const dy   = p.y - this.cmy;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < this.REPEL) {
        const mag = ((this.REPEL - dist) / this.REPEL) * this.FORCE;
        this.vx[i] += (dx / dist) * mag;
        this.vy[i] += (dy / dist) * mag;
      }
      this.vx[i] += (p.ox - p.x) * this.RESTORE;
      this.vy[i] += (p.oy - p.y) * this.RESTORE;
      this.vx[i] *= this.DAMP;
      this.vy[i] *= this.DAMP;
      p.x += this.vx[i];
      p.y += this.vy[i];
    });

    const isDark = this.nav.isDark();
    ctx.strokeStyle = isDark ? 'rgba(42,42,64,0.65)' : 'rgba(200,195,224,0.55)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    this.pts.forEach((p, i) => {
      const c = Math.floor(i / rows);
      const r = i % rows;
      if (c < cols - 1) {
        const n = this.pts[(c + 1) * rows + r];
        if (n) { ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); }
      }
      if (r < rows - 1) {
        const n = this.pts[c * rows + r + 1];
        if (n) { ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); }
      }
    });
    ctx.stroke();

    this.pts.forEach(p => {
      const d    = Math.hypot(p.x - this.cmx, p.y - this.cmy);
      const prox = Math.max(0, 1 - d / this.REPEL);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1 + prox * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${0.14 + prox * 0.65})`;
      ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.draw());
  }
}