import {
  Component, inject, signal, computed, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../data/navigation.service';

interface PaletteItem {
  icon: string;
  label: string;
  description: string;
  action: () => void;
  keywords: string[];
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css',
})
export class CommandPaletteComponent implements AfterViewInit, OnDestroy {
  nav = inject(NavigationService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly isOpen = signal(false);
  readonly query  = signal('');
  readonly selectedIndex = signal(0);

  private allItems: PaletteItem[] = [
    {
      icon: 'home',
      label: 'Go to Home',
      description: 'Navigate to the home page',
      keywords: ['home', 'start', 'hero'],
      action: () => this.navigate(0),
    },
    {
      icon: 'user',
      label: 'Go to About',
      description: 'Learn about Jaren Kendrick',
      keywords: ['about', 'bio', 'skills', 'github'],
      action: () => this.navigate(1),
    },
    {
      icon: 'code',
      label: 'Go to Projects',
      description: 'Browse all 5 projects',
      keywords: ['projects', 'work', 'portfolio', 'pathfinder', 'symposium'],
      action: () => this.navigate(2),
    },
    {
      icon: 'briefcase',
      label: 'Go to Experience',
      description: 'View work history and skills',
      keywords: ['experience', 'jobs', 'career', 'virtui'],
      action: () => this.navigate(3),
    },
    {
      icon: 'book',
      label: 'Go to Blog',
      description: 'Read developer blog posts',
      keywords: ['blog', 'posts', 'writing', 'articles'],
      action: () => this.navigate(4),
    },
    {
      icon: 'star',
      label: 'Go to Testimonials',
      description: 'What colleagues say',
      keywords: ['testimonials', 'reviews', 'recommendations'],
      action: () => this.navigate(5),
    },
    {
      icon: 'mail',
      label: 'Go to Contact',
      description: 'Get in touch',
      keywords: ['contact', 'hire', 'email', 'message'],
      action: () => this.navigate(6),
    },
    {
      icon: 'file',
      label: 'View Resume',
      description: 'Open the resume page',
      keywords: ['resume', 'cv', 'download'],
      action: () => this.navigate(7),
    },
    {
      icon: 'copy',
      label: 'Copy Email',
      description: 'jarenkendricky@gmail.com',
      keywords: ['email', 'copy', 'contact', 'gmail'],
      action: () => this.copyToClipboard('jarenkendricky@gmail.com', 'Email copied!'),
    },
    {
      icon: 'link',
      label: 'Open GitHub',
      description: 'github.com/jarenkendrick14',
      keywords: ['github', 'code', 'repos'],
      action: () => window.open('https://github.com/jarenkendrick14', '_blank'),
    },
    {
      icon: 'link',
      label: 'Open LinkedIn',
      description: 'linkedin.com/in/jarenkendrick',
      keywords: ['linkedin', 'profile', 'connect'],
      action: () => window.open('https://linkedin.com/in/jarenkendrick', '_blank'),
    },
    {
      icon: 'sun',
      label: 'Toggle Theme',
      description: 'Switch between dark and light mode',
      keywords: ['theme', 'dark', 'light', 'mode'],
      action: () => this.nav.toggleTheme(),
    },
  ];

  readonly filteredItems = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.allItems;
    return this.allItems.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    );
  });

  private copyMessage = signal('');

  open() {
    this.isOpen.set(true);
    this.query.set('');
    this.selectedIndex.set(0);
    setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
  }

  close() {
    this.isOpen.set(false);
    this.query.set('');
  }

  private navigate(index: number) {
    this.close();
    this.nav.goTo(index, 8);
  }

  private copyToClipboard(text: string, _msg: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    this.close();
  }

  executeSelected() {
    const items = this.filteredItems();
    const item = items[this.selectedIndex()];
    if (item) { item.action(); }
  }

  moveDown() {
    const max = this.filteredItems().length - 1;
    this.selectedIndex.set(Math.min(this.selectedIndex() + 1, max));
  }

  moveUp() {
    this.selectedIndex.set(Math.max(this.selectedIndex() - 1, 0));
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.isOpen() ? this.close() : this.open();
      return;
    }
    if (!this.isOpen()) return;
    if (e.key === 'Escape')    { this.close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); this.moveDown(); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); this.moveUp(); return; }
    if (e.key === 'Enter')     { e.preventDefault(); this.executeSelected(); return; }
  }

  onQueryChange(val: string) {
    this.query.set(val);
    this.selectedIndex.set(0);
  }

  getIcon(icon: string): string {
    const icons: Record<string, string> = {
      home:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      user:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      code:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      briefcase:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      book:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      star:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      mail:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/></svg>`,
      file:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      copy:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
      link:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
      sun:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`,
    };
    return icons[icon] ?? icons['file'];
  }

  ngAfterViewInit() {}
  ngOnDestroy() {}
}
