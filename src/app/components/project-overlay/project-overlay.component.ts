import { Component, input, output, signal } from '@angular/core';
import { Project } from '../../models/portfolio.models';

@Component({
  selector: 'app-project-overlay',
  standalone: true,
  templateUrl: './project-overlay.component.html',
  styleUrl: './project-overlay.component.css',
})
export class ProjectOverlayComponent {
  project = input<Project | null>(null);
  closed = output<void>();
  isClosing = signal(false);

  close() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isClosing.set(false);
      this.closed.emit();
    }, 500); // Wait for CSS animation to finish
  }
}