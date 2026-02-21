import { Component, inject, effect } from '@angular/core';
import { NavigationService } from '../../data/navigation.service';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  nav = inject(NavigationService);
  data = inject(PortfolioDataService);

  readonly navItems = this.data.navItems;

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.nav.theme();
    });
  }

  goTo(index: number) {
    this.nav.goTo(index, this.navItems.length);
  }
}
