import { Component, Input, OnChanges, SimpleChanges, signal, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnChanges, AfterViewInit {
  @Input() active = false;
  readonly data = inject(PortfolioDataService);

  readonly lineReady   = signal(false);
  private animated     = false;

  // ─── Stats with count-up ───
  readonly counters = [
    { target: 2,  suffix: '+', label: 'Years Coding',               current: signal(0) },
    { target: 5,  suffix: '+', label: 'Projects Completed',          current: signal(0) },
    { target: 8,  suffix: '+', label: 'Technologies Used',           current: signal(0) },
    { target: this.data.certificates.length, suffix: '+', label: 'Certifications', current: signal(0) },
  ];

  ngOnChanges(changes: SimpleChanges) {
    // Standard desktop trigger: Run when the slide becomes active
    if (changes['active'] && this.active && !this.animated) {
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
    if (this.animated) return;
    this.animated = true;

    this.counters.forEach(c => c.current.set(0));
    setTimeout(() => this.animateCounters(), 350);
    setTimeout(() => this.lineReady.set(true),  300);
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
      company:   'HumanSide Technologies',
      type:      'Part-time · Remote',
      headline:  'AI Developer',
      bullets: [
        'Building <strong>Symposium</strong>, a platform where people and multiple AI models deliberate, investigate and research together in real time.',
        'Grew it from a single model to 15+ AI providers behind one interface (Claude, GPT, Gemini, Grok, Mistral, DeepSeek and more), plus bring-your-own-AI endpoints with streaming, tool use, web search and citations.',
        'Built per-provider cost telemetry, spend ceilings and billed-versus-logged cost reconciliation on a Stripe + RevenueCat credit system, with prompt caching to cut spend.',
        'Shipped AI-to-AI debate, a document RAG pipeline (PDF, DOCX, XLSX, PPTX), structured deliberation workspaces, and Redis + BullMQ scaling.',
      ],
      tags: ['Angular 21', 'Ionic', 'Node.js', 'WebSockets', 'PostgreSQL', 'Prisma', 'Redis', 'Azure'],
    },
    {
      period:    'Jul 2026 — Oct 2026',
      isLive:    false,
      company:   'Symph',
      type:      'Internship · Remote · 360 hours',
      headline:  'Web and App Developer',
      bullets: [
        'On <strong>Echoic</strong>, Symph\'s AI content-automation platform, built the brand intake pipeline: a crawler that respects robots and sitemaps, recovers redirects and falls back to a bounded raw scrape, plus an evaluation harness to measure scraping quality.',
        'Added quality gates with a bounded review-and-repair loop to AI image and carousel generation, and made generation costs transparent with per-provider usage telemetry.',
        'Built and fixed features across team management, invoicing and the tenant experience on a property management platform, and brought its Flutter mobile app to parity with web.',
      ],
      tags: ['Next.js', 'TypeScript', 'Flutter', 'Dart', 'Firebase', 'Google Cloud Run'],
    },
    {
      period:    'Apr 2025 — Feb 2026',
      isLive:    false,
      company:   'HumanSide Technologies',
      type:      'Part-time · Remote',
      headline:  'Game Developer',
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
      period:  'Jul 2023 — 2027',
      school:  'Holy Angel University',
      type:    'BS Information Technology · Pampanga, PH',
      detail:  'Specialization in Web Development. Coursework in full-stack architecture, database systems, software engineering, networking, and deployment. Maintaining strong academic standing while working part-time.',
    },
  ];
}
