import { Component, Input, OnChanges, SimpleChanges, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnChanges, AfterViewInit {
  @Input() active = false;
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;

  readonly barsReady   = signal(false);
  readonly lineReady   = signal(false);
  private barsAnimated = false;

  readonly radarAxes = [
    { label: 'Frontend',       value: 0.78 },
    { label: 'Backend',        value: 0.72 },
    { label: 'Game Dev',       value: 0.70 },
    { label: 'API Design',     value: 0.68 },
    { label: 'Problem Solving',value: 0.82 },
    { label: 'UI/UX',          value: 0.62 },
  ];

  // ─── Stats with count-up ───
  readonly counters = [
    { target: 2,  suffix: '+', label: 'Years Coding',               current: signal(0) },
    { target: 5,  suffix: '+', label: 'Projects Completed',          current: signal(0) },
    { target: 8,  suffix: '+', label: 'Technologies Used',           current: signal(0) },
    { target: 12, suffix: '+', label: 'Certifications',              current: signal(0) },
  ];

  ngOnChanges(changes: SimpleChanges) {
    // Standard desktop trigger: Run when the slide becomes active
    if (changes['active'] && this.active && !this.barsAnimated) {
      this.triggerAnimations();
    }
  }

  ngAfterViewInit() {
    // Mobile FIX: On mobile, the "active" input doesn't trigger via scrolling.
    // We force the animations to ready-state so they are visible as the user scrolls.
    if (window.innerWidth < 960) {
      setTimeout(() => {
        this.triggerAnimations();
      }, 500);
    }
  }

  private triggerAnimations() {
    if (this.barsAnimated) return;
    this.barsAnimated = true;

    this.counters.forEach(c => c.current.set(0));
    setTimeout(() => this.animateCounters(), 350);
    setTimeout(() => this.lineReady.set(true),  300);
    setTimeout(() => this.barsReady.set(true),  700);
    setTimeout(() => this.animateRadar(),        900);
  }

  private animateRadar() {
    const canvas = this.radarCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2, cy = size / 2;
    const r = size * 0.32;
    const n = this.radarAxes.length;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#8b5cf6';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#888';
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(42,42,64,0.55)' : 'rgba(190,185,215,0.35)';

    let progress = 0;
    const duration = 60;

    const draw = () => {
      progress = Math.min(progress + 1, duration);
      const t = 1 - Math.pow(1 - progress / duration, 3);
      ctx.clearRect(0, 0, size, size);

      // Grid rings
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.8;
      [0.25, 0.5, 0.75, 1].forEach(ring => {
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const px = cx + Math.cos(a) * r * ring;
          const py = cy + Math.sin(a) * r * ring;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Axis lines
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.strokeStyle = gridColor;
        ctx.stroke();
      }

      // Data polygon
      ctx.beginPath();
      this.radarAxes.forEach((ax, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const dist = r * ax.value * t;
        const px = cx + Math.cos(a) * dist;
        const py = cy + Math.sin(a) * dist;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(139,92,246,0.18)';
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Dots
      this.radarAxes.forEach((ax, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const dist = r * ax.value * t;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      });

      // Labels
      ctx.font = `500 10px "JetBrains Mono", monospace`;
      ctx.fillStyle = textColor;
      ctx.textBaseline = 'middle';
      this.radarAxes.forEach((ax, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const cosA = Math.cos(a);
        const lx = cx + cosA * (r + 26);
        const ly = cy + Math.sin(a) * (r + 24);
        ctx.textAlign = cosA > 0.2 ? 'left' : cosA < -0.2 ? 'right' : 'center';
        const words = ax.label.split(' ');
        if (words.length > 1) {
          ctx.fillText(words[0], lx, ly - 7);
          ctx.fillText(words[1], lx, ly + 7);
        } else {
          ctx.fillText(ax.label, lx, ly);
        }
      });

      if (progress < duration) requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }

  private animateCounters() {
    this.counters.forEach(c => {
      const duration = 1400;
      const steps    = 30;
      const stepTime = duration / steps;
      let step = 0;
      const iv = setInterval(() => {
        step++;
        const t     = step / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        c.current.set(Math.round(eased * c.target));
        if (step >= steps) { 
          c.current.set(c.target); 
          clearInterval(iv); 
        }
      }, stepTime);
    });
  }

  // ─── Work experience ───
  readonly jobs = [
    {
      period:    'Feb 2026 — Present',
      isLive:    true,
      company:   'VirtuIntelligence',
      type:      'Part-time · Remote · Contract',
      headline:  'Angular Developer',
      bullets: [
        'Architected <strong>Symposium</strong>, a real-time AI-mediated chat platform (Angular + Ionic + Node.js + PostgreSQL) with WebSocket streaming & xAI Grok integration.',
        'Building and maintaining full-stack web features across multiple time zones in an async-first remote workflow.',
        'Participating in sprint planning, async code reviews, and shipping production-ready Angular components.',
      ],
      tags: ['Angular', 'Ionic', 'Node.js', 'PostgreSQL', 'WebSockets', 'TypeScript'],
    },
    {
      period:    'Apr 2025 — Jan 2026',
      isLive:    false,
      company:   'VirtuIntelligence',
      type:      'Part-time · Remote · Contract',
      headline:  'Game/App Developer',
      bullets: [
        'Shipped <strong>PathFinder</strong> — a VR self-discovery app — to the Meta Quest Store using Unreal Engine 5.5 Blueprints; built its Android companion in Unity.',
        'Actively developed <strong>Robots vs Aliens</strong>, a mobile tower-defense game in Unity (C#) with procedural level generation.',
        'Managed own sprint tasks and participated in async code reviews across multiple time zones.',
      ],
      tags: ['Unreal Engine 5.5', 'Blueprints', 'Unity', 'C#'],
    },
  ];

  // ─── Education ───
  readonly education = [
    {
      period:  'Jun 2023 — 2027',
      school:  'Holy Angel University',
      type:    'BS Information Technology · Pampanga, PH',
      detail:  'Specialization in Web Development. Coursework in full-stack architecture, database systems, software engineering, networking, and deployment. Maintaining strong academic standing while working part-time.',
    },
  ];

  // ─── Skills split by domain ───
  readonly webSkills = [
    { name: 'JavaScript',      time: '2 yrs',   pct: 85 },
    { name: 'TypeScript',      time: '1.5 yrs', pct: 80 },
    { name: 'Angular',         time: '1 yr',    pct: 75 },
    { name: 'Node.js/Express', time: '1 yr',    pct: 75 },
    { name: 'Vue.js 3',        time: '1 yr',    pct: 70 },
    { name: 'PostgreSQL',      time: '6 mo',    pct: 55 },
  ];

  readonly gameSkills = [
    { name: 'Unreal Engine 5.5', time: '1 yr',  pct: 72 },
    { name: 'Blueprints',        time: '1 yr',  pct: 75 },
    { name: 'Unity',             time: '1 yr',  pct: 68 },
    { name: 'C#',                time: '1 yr',  pct: 70 },
    { name: 'Game Architecture', time: '1 yr',  pct: 65 },
    { name: '3D Scene Design',   time: '6 mo',  pct: 55 },
  ];

  // ─── Tools ───
  readonly tools = [
    'Git & GitHub', 'Prisma ORM', 'Ionic + Capacitor', 'WebSockets',
    'REST APIs', 'JWT Auth', 'Figma', 'VS Code', 'Vercel', 'Netlify',
    'Wit.ai', 'Pinia',
  ];
}
