import { Component, Input, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent implements OnChanges {
  @Input() active = false;
  data = inject(PortfolioDataService);

  private barsAnimated = false;
  readonly barsReady = signal(false);

  /* ── Cert Carousel ── */
  readonly certIndex = signal(0);
  readonly certAnimClass = signal('');

  get currentCert() { return this.data.certificates[this.certIndex()]; }
  get certTotal()   { return this.data.certificates.length; }

  certNav(dir: number) {
    this.certAnimClass.set('');
    this.certIndex.update(i => (i + dir + this.certTotal) % this.certTotal);
    setTimeout(() => this.certAnimClass.set(dir > 0 ? 'cert-in' : 'cert-in-r'), 10);
  }

  readonly experience = [
    {
      period: 'Apr 2025 — Present',
      company: 'VirtuIntelligence',
      type: 'Part-time · Remote',
      title: 'Game/App Developer',
      bullets: [
        'Shipped <strong>PathFinder</strong> VR app to Meta Quest store using Unreal Engine 5.5 Blueprints; built its Android companion in Unity.',
        'Architected <strong>Symposium</strong>, a full-stack real-time AI-mediated chat platform (Angular + Ionic + Node.js + PostgreSQL) with WebSocket + streaming xAI Grok.',
        'Currently developing <strong>Robots vs Aliens</strong>, a mobile action game in Unity (C#) with procedural level generation.',
        'Managing own sprint tasks and code reviews across multiple time zones.',
      ],
      tags: ['Unreal 5.5', 'Unity', 'C#', 'Angular', 'Ionic', 'Node.js', 'PostgreSQL', 'WebSockets'],
    },
  ];

  readonly education = [
    {
      period: 'Jun 2023 — 2027',
      school: 'Holy Angel University',
      location: 'Pampanga, Philippines',
      degree: 'BS Information Technology',
      detail: 'Specialization in Web Development. Coursework in full-stack architecture, database systems, software engineering, networking, and deployment workflows. Maintaining strong academic standing while working part-time.',
    },
  ];

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

  readonly toolsList = [
    'Git & GitHub', 'Prisma ORM', 'Ionic + Capacitor', 'WebSockets',
    'REST APIs', 'JWT Auth', 'Pinia', 'Wit.ai',
    'Figma', 'Netlify', 'Vercel', 'VS Code',
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && this.active && !this.barsAnimated) {
      this.barsAnimated = true;
      setTimeout(() => this.barsReady.set(true), 400);
    }
  }
}