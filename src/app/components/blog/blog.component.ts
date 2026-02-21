import { Component, inject, output, Input } from '@angular/core';
import { PortfolioDataService } from '../../data/portfolio.data';
import { BlogPost } from '../../models/portfolio.models';

@Component({
  selector: 'app-blog',
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {
  @Input() active = false;
  data = inject(PortfolioDataService);
  postOpened = output<BlogPost>();
}