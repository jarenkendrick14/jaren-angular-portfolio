import { Component, inject, Input } from '@angular/core';
import { PortfolioDataService } from '../../data/portfolio.data';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {
  @Input() active = false;
  data = inject(PortfolioDataService);
}