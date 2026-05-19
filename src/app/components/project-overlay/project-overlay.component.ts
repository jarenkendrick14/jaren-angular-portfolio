import { Component, input, output, signal, HostListener } from '@angular/core';
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
  lightboxImg = signal<string | null>(null);

  close() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isClosing.set(false);
      this.closed.emit();
    }, 500);
  }

  openLightbox(img: string) {
    this.lightboxImg.set(img);
  }

  closeLightbox() {
    this.lightboxImg.set(null);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.lightboxImg()) this.closeLightbox();
  }
}