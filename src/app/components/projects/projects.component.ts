import { Component, inject, output, Input } from '@angular/core';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  @Input() active = false;
  data = inject(PortfolioDataService);
  projectOpened = output<number>();
  previewHover = output<number | null>();
}