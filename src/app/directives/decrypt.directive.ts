import { Directive, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

@Directive({
  selector: '[appDecrypt]',
  standalone: true
})
export class DecryptDirective implements OnChanges {
  @Input('appDecrypt') targetText = '';
  @Input() active = false; // Trigger from parent component
  @Input() delay = 600;    // Wait for page slide (default 600ms)

  private el = inject(ElementRef);
  private readonly GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/[]{}|';
  private originalHTML = '';
  private plainText = '';
  private running = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['targetText']) {
      this.originalHTML = this.el.nativeElement.innerHTML;
      this.plainText = this.targetText || this.el.nativeElement.textContent.trim();
    }

    // Only run if the component is physically active AND not already running
    if (changes['active'] && this.active) {
      if (!this.running) {
        this.running = true; // Lock execution immediately 
        setTimeout(() => this.runEffect(), this.delay);
      }
    }
  }

  private runEffect() {
    const el = this.el.nativeElement;
    
    // 1. Lock Dimensions to prevent layout jumping
    const rect = el.getBoundingClientRect();
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.display = 'block'; 
    el.style.whiteSpace = 'nowrap'; 
    el.style.overflow = 'hidden';

    if (!this.originalHTML) this.originalHTML = el.innerHTML;
    el.classList.add('decrypting');

    const len = this.plainText.length;
    let frame = 0;
    const duration = 800;
    const totalFrames = Math.round(duration / 40);
    
    const iv = setInterval(() => {
      const progress = frame / totalFrames;
      let scrambled = '';
      
      for (let i = 0; i < len; i++) {
        const ch = this.plainText[i];
        if (ch === ' ' || ch === '\n') { 
          scrambled += ' '; 
        } else if (progress > i / len) { 
          scrambled += ch; 
        } else { 
          scrambled += this.GLYPHS[Math.floor(Math.random() * this.GLYPHS.length)]; 
        }
      }
      
      el.textContent = scrambled;
      frame++;
      
      if (frame >= totalFrames) {
        // 2. Restore Original HTML (tags and all)
        el.innerHTML = this.originalHTML;
        
        // 3. Unlock Dimensions
        el.style.width = ''; 
        el.style.height = '';
        el.style.display = '';
        el.style.whiteSpace = '';
        el.style.overflow = '';
        
        el.classList.remove('decrypting');
        this.running = false; // Release lock
        clearInterval(iv);
      }
    }, 40);
  }
}