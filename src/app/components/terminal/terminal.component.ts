import { Component, signal, ViewChild, ElementRef, effect, inject } from '@angular/core';
import { NavigationService } from '../../data/navigation.service';

interface TermLine {
  html: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css',
})
export class TerminalComponent {
  @ViewChild('termOutput') termOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('termInput') termInput!: ElementRef<HTMLInputElement>;

  nav = inject(NavigationService);
  isOpen = this.nav.terminalOpen;

  readonly lines = signal<TermLine[]>([]);
  readonly inputValue = signal('');

  private history: string[] = [];
  private histIdx = -1;
  private booted = false;

  private readonly BOOT_MSG = [
    `<span class="tl-dim">──────────────────────────────────────────</span>`,
    `<span class="tl-ok">  ✓ jaren-portfolio v2.5.0 [developer mode]</span>`,
    `<span class="tl-dim">──────────────────────────────────────────</span>`,
    `<span class="tl-dim">  System: Full Stack Portfolio • Angular 21</span>`,
    `<span class="tl-dim">  Location: Pampanga, Philippines 🇵🇭</span>`,
    `<span class="tl-dim">  Status: <span class="tl-ok">● seeking internship</span></span>`,
    `<span class="tl-dim">──────────────────────────────────────────</span>`,
    `  Type <span class="tl-acc">help</span> to see available commands.`,
  ];

  private readonly COMMANDS: Record<string, () => string[] | null> = {
    help: () => [
      `<span class="tl-head">Available commands:</span>`,
      `  <span class="tl-acc">ls</span>            list projects`,
      `  <span class="tl-acc">cat resume.txt</span> view career summary`,
      `  <span class="tl-acc">skills</span>        show skill stack`,
      `  <span class="tl-acc">whoami</span>        who is jaren`,
      `  <span class="tl-acc">contact</span>       get contact info`,
      `  <span class="tl-acc">github</span>        open github profile`,
      `  <span class="tl-acc">run pathfinder</span> launch vr app`,
      `  <span class="tl-acc">clear</span>         clear terminal`,
      `  <span class="tl-acc">exit</span>          close terminal`,
    ],
    ls: () => [
      `<span class="tl-head">projects/</span>`,
      `  01  <span class="tl-acc">PathFinder</span>        <span class="tl-dim">·  Unreal 5.5 + Unity + C# · VR</span>`,
      `  02  <span class="tl-acc">Symposium</span>         <span class="tl-dim">·  Angular + Ionic + Node.js + PostgreSQL</span>`,
      `  03  <span class="tl-acc">Travel Atelier</span>    <span class="tl-dim">·  Vue.js 3 + Node.js + JWT</span>`,
      `  04  <span class="tl-acc">Dropify</span>           <span class="tl-dim">·  Vue.js 3 + MongoDB + Express</span>`,
      `  05  <span class="tl-acc">Einstein's Art</span>    <span class="tl-dim">·  Angular + TypeScript + Netlify</span>`,
    ],
    'cat resume.txt': () => [
      `<span class="tl-head">== JAREN KENDRICK YAMBAO ==</span>`,
      `<span class="tl-dim">Full Stack Developer · Game/App Developer · HAU IT Student</span>`,
      ``,
      `<span class="tl-warn">EXPERIENCE</span>`,
      `  Game/App Developer @ VirtuIntelligence  <span class="tl-dim">Apr 2025 – Present</span>`,
      `  <span class="tl-dim">• Shipped PathFinder to Meta Quest (Unreal 5.5 + Unity)</span>`,
      `  <span class="tl-dim">• Built Symposium real-time AI chat (Angular + Ionic + Node.js)</span>`,
      `  <span class="tl-dim">• Building Robots vs Aliens in Unity (C#)</span>`,
      ``,
      `<span class="tl-warn">STACK</span>`,
      `  Angular · Vue.js 3 · Node.js · PostgreSQL · MongoDB · C# · TypeScript`,
      ``,
      `<span class="tl-warn">LOOKING FOR</span>`,
      `  Full-stack internship <span class="tl-acc">→ jarenkendrickyambao@gmail.com</span>`,
    ],
    skills: () => [
      `<span class="tl-head">Technical Stack:</span>`,
      `  JavaScript <span class="tl-acc">█████████░</span> 85%  <span class="tl-dim">2 yrs</span>`,
      `  TypeScript  <span class="tl-acc">████████░░</span> 80%  <span class="tl-dim">1.5 yrs</span>`,
      `  Angular     <span class="tl-acc">████████░░</span> 75%  <span class="tl-dim">1 yr</span>`,
      `  Node.js     <span class="tl-acc">████████░░</span> 75%  <span class="tl-dim">1 yr</span>`,
      `  Vue.js 3    <span class="tl-acc">███████░░░</span> 70%  <span class="tl-dim">1 yr</span>`,
      `  C#          <span class="tl-acc">███████░░░</span> 70%  <span class="tl-dim">1 yr</span>`,
      `  MongoDB     <span class="tl-acc">███████░░░</span> 65%  <span class="tl-dim">1 yr</span>`,
      `  PostgreSQL  <span class="tl-acc">██████░░░░</span> 55%  <span class="tl-dim">6 mo</span>`,
    ],
    whoami: () => [
      `<span class="tl-head">jaren kendrick yambao</span>`,
      `<span class="tl-dim">──────────────────────────────</span>`,
      `  Role     Full Stack Developer + Game/App Dev`,
      `  Age      20 years old`,
      `  Location Pampanga, Philippines 🇵🇭`,
      `  Uni      Holy Angel University (2027)`,
      `  Status   <span class="tl-ok">● Open to internship</span>`,
      `  "I don't just write code — I ship things."`,
    ],
    contact: () => [
      `<span class="tl-head">Contact info:</span>`,
      `  Email     <span class="tl-acc">jarenkendrickyambao@gmail.com</span>`,
      `  LinkedIn  <span class="tl-acc">linkedin.com/in/jarenkendrick</span>`,
      `  GitHub    <span class="tl-acc">github.com/jarenkendrick14</span>`,
    ],
    github: () => {
      window.open('https://github.com/jarenkendrick14', '_blank');
      return [`<span class="tl-ok">✓ Opening github.com/jarenkendrick14...</span>`];
    },
    'run pathfinder': () => {
      const outputLines = [
        `<span class="tl-dim">Initializing VR runtime environment...</span>`,
        `<span class="tl-ok">  ✓ Unreal Engine 5.5 loaded</span>`,
        `<span class="tl-ok">  ✓ Meta Quest SDK connected</span>`,
        `<span class="tl-dim">Mounting PathFinder.apk to device...</span>`,
        `<span class="tl-ok">  ✓ APK verified (23.4 MB)</span>`,
        `<span class="tl-dim">Launching VR session...</span>`,
        `  <span class="tl-acc">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span> 100%`,
        `<span class="tl-ok">  ✓ PathFinder v1.0.0 running</span>`,
        `  🥽 Put on your headset. The journey begins.`,
      ];
      outputLines.forEach((line, i) => {
        setTimeout(() => this.addLine(line), i * 180);
      });
      return null;
    },
    clear: () => { this.lines.set([]); return null; },
    exit: () => { this.close(); return null; },
    quit: () => { this.close(); return null; },
  };

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        if (!this.booted) {
          this.booted = true;
          this.BOOT_MSG.forEach((msg, i) => {
            setTimeout(() => this.addLine(msg), i * 55);
          });
          // Auto-run 'help' command after booting
          setTimeout(() => this.runCmd('help'), (this.BOOT_MSG.length * 55) + 300);
        }
        setTimeout(() => this.termInput?.nativeElement.focus(), 460);
      }
    });
  }

  close() { this.nav.terminalOpen.set(false); }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const val = this.inputValue();
      this.inputValue.set('');
      this.runCmd(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      if (this.histIdx < this.history.length - 1) {
        this.histIdx++;
        this.inputValue.set(this.history[this.histIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      if (this.histIdx > 0) { this.histIdx--; this.inputValue.set(this.history[this.histIdx]); }
      else { this.histIdx = -1; this.inputValue.set(''); }
    }
  }

  private runCmd(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    this.history.unshift(raw);
    this.histIdx = -1;
    this.addLine(`<span class="tl-dim">jaren@portfolio:~$</span> <span class="tl-cmd">${this.esc(raw)}</span>`);
    const fn = this.COMMANDS[cmd];
    if (fn) {
      const result = fn();
      if (result) result.forEach(l => this.addLine(l));
    } else {
      this.addLine(`<span class="tl-err">bash: ${this.esc(cmd)}: command not found. Type 'help'.</span>`);
    }
    this.addLine('');
  }

  // Handle scroll ONLY when adding lines, allowing manual scrolling otherwise
  private addLine(html: string) {
    this.lines.update(l => [...l, { html }]);
    setTimeout(() => {
      if (this.termOutput?.nativeElement) {
        this.termOutput.nativeElement.scrollTop = this.termOutput.nativeElement.scrollHeight;
      }
    }, 10);
  }

  private esc(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}