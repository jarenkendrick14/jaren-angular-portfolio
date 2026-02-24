import {
  Component, inject, signal, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy, effect
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationService } from './data/navigation.service';
import { PortfolioDataService } from './data/portfolio.data';
import { Project, BlogPost } from './models/portfolio.models';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { BlogComponent } from './components/blog/blog.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProjectOverlayComponent } from './components/project-overlay/project-overlay.component';
import { BlogOverlayComponent } from './components/blog-overlay/blog-overlay.component';
import { TerminalComponent } from './components/terminal/terminal.component';

// ─── Per-page metadata ────────────────────────────────────────────────────────
const PAGE_META: { title: string; description: string }[] = [
  {
    title: 'Jaren Kendrick — Full Stack Developer & VR Engineer',
    description:
      'Portfolio of Jaren Kendrick Yambao — a 20-year-old Full Stack Developer from Pampanga, PH. Builds web apps in Angular & Node.js, and ships VR experiences to the Meta Quest Store.',
  },
  {
    title: 'About — Jaren Kendrick',
    description:
      'Learn about Jaren Kendrick: BS IT student at Holy Angel University, part-time Game/App Developer at VirtuIntelligence, and aspiring Full Stack intern with skills in Angular, Node.js, and Unreal Engine.',
  },
  {
    title: 'Projects — Jaren Kendrick',
    description:
      'Explore Jaren\'s projects: PathFinder (Meta Quest VR app), Symposium (AI chat platform), Travel Atelier, Dropify e-commerce, and more — built with Angular, Vue.js, Node.js, and PostgreSQL.',
  },
  {
    title: 'Experience — Jaren Kendrick',
    description:
      'Jaren\'s professional experience as a Game/App Developer at VirtuIntelligence — shipping VR apps in Unreal Engine 5.5 and building full-stack platforms with Angular and Node.js.',
  },
  {
    title: 'Blog — Jaren Kendrick',
    description:
      'Developer blog by Jaren Kendrick — writing about shipping VR apps, choosing frameworks, and lessons learned building real software as a student developer.',
  },
  {
    title: 'Testimonials — Jaren Kendrick',
    description:
      'What colleagues, classmates, and collaborators say about working with Jaren Kendrick as a developer and teammate.',
  },
  {
    title: 'Contact — Jaren Kendrick',
    description:
      'Get in touch with Jaren Kendrick for internship opportunities, freelance web development, or collaboration on full-stack or VR projects.',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent, HomeComponent, AboutComponent, ProjectsComponent,
    ExperienceComponent, BlogComponent, TestimonialsComponent, ContactComponent,
    ProjectOverlayComponent, BlogOverlayComponent, TerminalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  nav  = inject(NavigationService);
  data = inject(PortfolioDataService);

  private titleService = inject(Title);
  private metaService  = inject(Meta);

  @ViewChild(TerminalComponent) terminal!: TerminalComponent;
  @ViewChild('cdot') cdot!: ElementRef<HTMLDivElement>;
  @ViewChild('cring') cring!: ElementRef<HTMLDivElement>;
  @ViewChild('prvw') prvw!: ElementRef<HTMLDivElement>;

  readonly activeProject  = signal<Project | null>(null);
  readonly activeBlogPost = signal<BlogPost | null>(null);
  readonly mobileMenuOpen = signal(false);
  readonly totalPages     = this.data.navItems.length;

  readonly cursorHover  = signal(false);
  readonly previewActive = signal<number | null>(null);

  private mx = 0; private my = 0;
  private rx = 0; private ry = 0;
  private prx = 0; private pry = 0;
  private animId = 0;

  constructor() {
    // Reactively update <title> and <meta> whenever the active page changes
    effect(() => {
      const page = this.nav.currentPage();
      const meta = PAGE_META[page] ?? PAGE_META[0];

      this.titleService.setTitle(meta.title);

      this.metaService.updateTag({ name: 'description',          content: meta.description });
      this.metaService.updateTag({ property: 'og:title',        content: meta.title });
      this.metaService.updateTag({ property: 'og:description',  content: meta.description });
      this.metaService.updateTag({ name: 'twitter:title',       content: meta.title });
      this.metaService.updateTag({ name: 'twitter:description', content: meta.description });
    });
  }

  openProject(index: number) {
    if (index === -1) { this.goTo(2); return; }
    this.activeProject.set(this.data.projects[index]);
  }
  closeProject() { this.activeProject.set(null); }
  openBlog(post: BlogPost) { this.activeBlogPost.set(post); }
  closeBlog() { this.activeBlogPost.set(null); }

  setPreview(index: number | null) {
    this.previewActive.set(index);
    if (index !== null) { this.prx = this.mx; this.pry = this.my; }
  }

  goTo(index: number) {
    if (window.innerWidth < 960) {
      const sections = document.querySelectorAll('.page-section');
      const el = sections[index] as HTMLElement;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
      this.nav.currentPage.set(index);
    } else {
      this.nav.goTo(index, this.totalPages);
    }
    this.mobileMenuOpen.set(false);
  }

  ngAfterViewInit() {
    const lerp = () => {
      this.rx += (this.mx - this.rx) * 0.11;
      this.ry += (this.my - this.ry) * 0.11;
      if (this.cring) {
        this.cring.nativeElement.style.left = `${this.rx}px`;
        this.cring.nativeElement.style.top  = `${this.ry}px`;
      }
      if (this.previewActive() !== null && this.prvw) {
        this.prx += (this.mx - this.prx) * 0.1;
        this.pry += (this.my - this.pry) * 0.1;
        this.prvw.nativeElement.style.left = `${this.prx}px`;
        this.prvw.nativeElement.style.top  = `${this.pry}px`;
      }
      this.animId = requestAnimationFrame(lerp);
    };
    lerp();
  }

  ngOnDestroy() { cancelAnimationFrame(this.animId); }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mx = e.clientX;
    this.my = e.clientY;
    if (this.cdot) {
      this.cdot.nativeElement.style.left = `${this.mx}px`;
      this.cdot.nativeElement.style.top  = `${this.my}px`;
    }
    const target = e.target as HTMLElement;
    const isHoverable = target.closest('a, button, .btn, .sdw, .pi, .bc, .tmc, .feat-card, .term-trigger, .skill-toggle-btn, .cert-nav, .cert-card');
    this.cursorHover.set(!!isHoverable);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (this.activeProject() || this.activeBlogPost()) {
      if (e.key === 'Escape') {
        this.activeProject.set(null);
        this.activeBlogPost.set(null);
      }
      return;
    }
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') this.goTo(Math.min(this.nav.currentPage() + 1, this.totalPages - 1));
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  this.goTo(Math.max(this.nav.currentPage() - 1, 0));
    if (e.key === 'Escape' && this.nav.terminalOpen()) this.nav.terminalOpen.set(false);
  }

  private wheelTimer: any = null;
  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (window.innerWidth < 960) return;
    if (this.activeProject() || this.activeBlogPost() || this.wheelTimer) return;
    if (this.mobileMenuOpen()) return;

    const activePage = document.querySelector('.page-section.active') as HTMLElement;
    if (!activePage) return;

    const atTop    = activePage.scrollTop <= 5;
    const atBottom = Math.ceil(activePage.scrollTop + activePage.clientHeight) >= activePage.scrollHeight - 5;

    if (e.deltaY > 20 && atBottom) {
      if (this.nav.currentPage() < this.totalPages - 1) {
        this.goTo(this.nav.currentPage() + 1);
        this.wheelTimer = setTimeout(() => { this.wheelTimer = null; }, 800);
      }
    } else if (e.deltaY < -20 && atTop) {
      if (this.nav.currentPage() > 0) {
        this.goTo(this.nav.currentPage() - 1);
        this.wheelTimer = setTimeout(() => { this.wheelTimer = null; }, 800);
      }
    }
  }
}