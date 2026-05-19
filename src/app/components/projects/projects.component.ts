import { Component, inject, output, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../../data/portfolio.data';
import { Project } from '../../models/portfolio.models';

type SortMode = 'featured' | 'all' | 'angular' | 'vue' | 'node' | 'game' | 'vanilla';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  @Input() active = false;
  data = inject(PortfolioDataService);
  projectOpened = output<number>();
  previewHover = output<number | null>();

  readonly searchQuery = signal('');
  readonly sortMode = signal<SortMode>('featured');

  readonly sortOptions: { value: SortMode; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'all',      label: 'All' },
    { value: 'angular',  label: 'Angular' },
    { value: 'vue',      label: 'Vue.js' },
    { value: 'node',     label: 'Node.js' },
    { value: 'game',     label: 'Unity / Unreal' },
    { value: 'vanilla',  label: 'Vanilla HTML/JS' },
  ];

  private readonly featuredOrder = ['Symposium', 'PathFinder', 'MonsoonAI', 'TARIPA', 'Dropify'];

  private readonly techMatchers: Record<Exclude<SortMode, 'featured' | 'all'>, (p: Project) => boolean> = {
    angular: p => p.tags.some(t => /^Angular/i.test(t)),
    vue:     p => p.tags.some(t => /^Vue/i.test(t)),
    node:    p => p.tags.some(t => /^Node\.js$/i.test(t)),
    game:    p => p.tags.some(t => /^(Unity|Unreal)/i.test(t)),
    vanilla: p => p.tags.includes('HTML5') && !p.tags.some(t => /^(Angular|Vue|React)/i.test(t)),
  };

  readonly displayProjects = computed<Project[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const mode = this.sortMode();

    let list = this.data.projects;
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q)
        || p.subtitle.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q)
        || p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (mode === 'featured') {
      const featured = new Set(this.featuredOrder);
      return list
        .filter(p => featured.has(p.name))
        .sort((a, b) => this.featuredOrder.indexOf(a.name) - this.featuredOrder.indexOf(b.name));
    }
    if (mode === 'all') {
      return list;
    }
    return list.filter(this.techMatchers[mode]);
  });

  indexOf(proj: Project): number {
    return this.data.projects.indexOf(proj);
  }
}
