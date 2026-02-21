import { Component, input, output, signal } from '@angular/core';
import { BlogPost } from '../../models/portfolio.models';

@Component({
  selector: 'app-blog-overlay',
  standalone: true,
  templateUrl: './blog-overlay.component.html',
  styleUrl: './blog-overlay.component.css',
})
export class BlogOverlayComponent {
  post = input<BlogPost | null>(null);
  closed = output<void>();
  isClosing = signal(false);

  close() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isClosing.set(false);
      this.closed.emit();
    }, 500);
  }
}