import { Component, Input, OnChanges, SimpleChanges, signal, AfterViewInit } from '@angular/core';
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

  readonly barsReady   = signal(false);
  readonly lineReady   = signal(false);
  private barsAnimated = false;

  // ─── Stats with count-up ───
  readonly counters = [
    { target: 2,  suffix: '+', label: 'Years Coding',               current: signal(0) },
    { target: 5,  suffix: '+', label: 'Projects Completed',          current: signal(0) },
    { target: 8,  suffix: '+', label: 'Technologies in Production',  current: signal(0) },
    { target: 12, suffix: '+', label: 'Certifications Earned',       current: signal(0) },
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
      period:    'Apr 2025 — Present',
      isLive:    true,
      company:   'VirtuIntelligence',
      type:      'Game/App Developer · Part-time · Remote',
      headline:  'Game/App Developer',
      bullets: [
        'Shipped <strong>PathFinder</strong> — a VR self-discovery app — to the Meta Quest Store using Unreal Engine 5.5 Blueprints; built its Android companion in Unity.',
        'Architected <strong>Symposium</strong>, a real-time AI-mediated chat platform (Angular + Ionic + Node.js + PostgreSQL) with WebSocket streaming & xAI Grok integration.',
        'Actively developing <strong>Robots vs Aliens</strong>, a mobile tower-defense game in Unity (C#) with procedural level generation.',
        'Managing own sprint tasks and participating in async code reviews across multiple time zones.',
      ],
      tags: ['Unreal Engine 5.5', 'Blueprints', 'Unity', 'C#', 'Angular', 'Ionic', 'Node.js', 'PostgreSQL', 'WebSockets'],
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