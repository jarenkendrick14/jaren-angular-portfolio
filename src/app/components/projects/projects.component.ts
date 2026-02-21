import { Component, inject, output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  @Input() active = false;
  data = inject(PortfolioDataService);
  projectOpened = output<number>();
  previewHover = output<number | null>();
}