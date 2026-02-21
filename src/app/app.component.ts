import {
  Component, inject, signal, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy
} from '@angular/core';
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
  nav = inject(NavigationService);
  data = inject(PortfolioDataService);

  @ViewChild(TerminalComponent) terminal!: TerminalComponent;
  @ViewChild('cdot') cdot!: ElementRef<HTMLDivElement>;
  @ViewChild('cring') cring!: ElementRef<HTMLDivElement>;
  @ViewChild('prvw') prvw!: ElementRef<HTMLDivElement>;

  readonly activeProject = signal<Project | null>(null);
  readonly activeBlogPost = signal<BlogPost | null>(null);
  readonly mobileMenuOpen = signal(false);
  readonly totalPages = this.data.navItems.length;

  readonly cursorHover = signal(false);
  readonly previewActive = signal<number | null>(null);

  private mx = 0; private my = 0;
  private rx = 0; private ry = 0;
  private prx = 0; private pry = 0;
  private animId = 0;

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
      // Mobile: scroll to section using window.scrollTo with 70px nav offset
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