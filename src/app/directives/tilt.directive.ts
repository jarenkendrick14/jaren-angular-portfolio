import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private el: HTMLElement;
  private resetTimer: any = null;

  constructor(ref: ElementRef<HTMLElement>) {
    this.el = ref.nativeElement;
    this.el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    this.el.style.willChange = 'transform';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.innerWidth < 960) return;
    const rect = this.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 8;
    this.el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    this.el.style.transition = 'transform 0.08s ease';
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
    this.el.style.transform = '';
  }

  ngOnDestroy() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }
}
