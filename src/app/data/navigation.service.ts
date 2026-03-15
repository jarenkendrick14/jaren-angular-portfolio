import { Injectable, signal, computed } from '@angular/core';

const PAGE_PATHS: Record<number, string> = {
  0: '/', 1: '/about', 2: '/projects', 3: '/experience',
  4: '/blog', 5: '/testimonials', 6: '/contact', 7: '/resume',
};

const PATH_TO_PAGE: Record<string, number> = {
  '/': 0, '/about': 1, '/projects': 2, '/experience': 3,
  '/blog': 4, '/testimonials': 5, '/contact': 6, '/resume': 7,
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly currentPage = signal<number>(0);
  readonly isAnimating = signal<boolean>(false);
  readonly theme = signal<'dark' | 'light'>('dark');
  readonly terminalOpen = signal<boolean>(false);

  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    try {
      const saved = localStorage.getItem('jk-theme') as 'dark' | 'light' | null;
      if (saved) this.theme.set(saved);
    } catch (err) {
      console.warn('Local storage restricted.');
    }

    // Set initial page from URL
    const initialPage = PATH_TO_PAGE[window.location.pathname] ?? 0;
    if (initialPage !== 0) this.currentPage.set(initialPage);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      const page = typeof e.state?.page === 'number'
        ? e.state.page
        : (PATH_TO_PAGE[window.location.pathname] ?? 0);
      this.currentPage.set(page);
    });
  }

  getPath(index: number): string {
    return PAGE_PATHS[index] ?? '/';
  }

  goTo(next: number, total: number): void {
    if (next === this.currentPage() || this.isAnimating() || next < 0 || next >= total) return;
    this.isAnimating.set(true);
    this.currentPage.set(next);
    history.pushState({ page: next }, '', PAGE_PATHS[next] ?? '/');
    setTimeout(() => this.isAnimating.set(false), 520);
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try {
      localStorage.setItem('jk-theme', next);
    } catch (err) {}
  }

  toggleTerminal(): void {
    this.terminalOpen.update(v => !v);
  }
}
