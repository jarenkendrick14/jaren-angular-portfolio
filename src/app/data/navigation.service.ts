import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly currentPage = signal<number>(0);
  readonly isAnimating = signal<boolean>(false);
  readonly theme = signal<'dark' | 'light'>('dark');
  
  // Terminal state management
  readonly terminalOpen = signal<boolean>(false);

  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    const saved = localStorage.getItem('jk-theme') as 'dark' | 'light' | null;
    if (saved) this.theme.set(saved);
  }

  goTo(next: number, total: number): void {
    if (next === this.currentPage() || this.isAnimating() || next < 0 || next >= total) return;
    this.isAnimating.set(true);
    this.currentPage.set(next);
    setTimeout(() => this.isAnimating.set(false), 520);
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('jk-theme', next);
  }

  toggleTerminal(): void {
    this.terminalOpen.update(v => !v);
  }
}