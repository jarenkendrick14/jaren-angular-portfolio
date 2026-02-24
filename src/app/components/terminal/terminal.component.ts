import { Component, signal, ViewChild, ElementRef, effect, inject } from '@angular/core';
import { NavigationService } from '../../data/navigation.service';

interface TermLine { html: string; }

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
    `<span class="tl-dim">  System:</span> <span class="tl-val">Full Stack Portfolio • Angular 21</span>`,
    `<span class="tl-dim">  Location:</span> <span class="tl-val">Pampanga, Philippines</span> 🇵🇭`,
    `<span class="tl-dim">  Status:</span> <span class="tl-ok">● seeking internship</span>`,
    `<span class="tl-dim">──────────────────────────────────────────</span>`,
    `  Type <span class="tl-acc">help</span> to see available commands.`,
  ];

  private readonly COMMANDS: Record<string, () => string[] | null> = {
    help: () => [
      ``,
      `<span class="tl-head">  COMMANDS</span>`,
      `<span class="tl-dim">  ──────────────────────────────</span>`,
      `  <span class="tl-acc">ls</span>              <span class="tl-dim">list projects</span>`,
      `  <span class="tl-acc">cat resume.txt</span>  <span class="tl-dim">view career summary</span>`,
      `  <span class="tl-acc">skills</span>          <span class="tl-dim">show skill stack</span>`,
      `  <span class="tl-acc">whoami</span>          <span class="tl-dim">who is jaren</span>`,
      `  <span class="tl-acc">contact</span>         <span class="tl-dim">get contact info</span>`,
      `  <span class="tl-acc">github</span>          <span class="tl-dim">open github profile</span>`,
      `  <span class="tl-acc">run pathfinder</span>  <span class="tl-dim">launch vr app</span>`,
      `  <span class="tl-acc">clear</span>           <span class="tl-dim">clear terminal</span>`,
      `  <span class="tl-acc">exit</span>            <span class="tl-dim">close terminal</span>`,
    ],
    ls: () => [
      ``,
      `<span class="tl-head">  projects/</span>`,
      `<span class="tl-dim">  ──────────────────────────────</span>`,
      `  <span class="tl-dim">01</span>  <span class="tl-head">PathFinder</span>        <span class="tl-dim">·</span> <span class="tl-val">Unreal 5.5 + Unity</span>   <span class="tl-warn">VR</span>`,
      `  <span class="tl-dim">02</span>  <span class="tl-head">Symposium</span>         <span class="tl-dim">·</span> <span class="tl-val">Angular + Node.js</span>    <span class="tl-warn">REAL-TIME</span>`,
      `  <span class="tl-dim">03</span>  <span class="tl-head">Travel Atelier</span>    <span class="tl-dim">·</span> <span class="tl-val">Vue.js 3 + Node.js</span>   <span class="tl-warn">FULL-STACK</span>`,
      `  <span class="tl-dim">04</span>  <span class="tl-head">Dropify</span>           <span class="tl-dim">·</span> <span class="tl-val">Vue.js 3 + MongoDB</span>   <span class="tl-warn">E-COMMERCE</span>`,
      `  <span class="tl-dim">05</span>  <span class="tl-head">Einstein's Art</span>    <span class="tl-dim">·</span> <span class="tl-val">Angular + TypeScript</span> <span class="tl-warn">DEPLOYED</span>`,
    ],
    'cat resume.txt': () => [
      ``,
      `<span class="tl-head">  ╔══════════════════════════════════╗</span>`,
      `<span class="tl-head">  ║   JAREN KENDRICK YAMBAO          ║</span>`,
      `<span class="tl-head">  ╚══════════════════════════════════╝</span>`,
      `  <span class="tl-dim">Full Stack Developer · Game/App Developer · HAU IT Student</span>`,
      ``,
      `  <span class="tl-warn">▸ EXPERIENCE</span>`,
      `  <span class="tl-acc">  Game/App Developer</span> <span class="tl-dim">@ VirtuIntelligence</span>  <span class="tl-dim">Apr 2025 – Present</span>`,
      `    <span class="tl-val">• Shipped PathFinder to Meta Quest (Unreal 5.5 + Unity)</span>`,
      `    <span class="tl-val">• Built Symposium real-time AI chat (Angular + Node.js)</span>`,
      `    <span class="tl-val">• Building Robots vs Aliens mobile game (Unity + C#)</span>`,
      ``,
      `  <span class="tl-warn">▸ STACK</span>`,
      `    <span class="tl-val">Angular · Vue.js 3 · Node.js · PostgreSQL · MongoDB · C# · TypeScript</span>`,
      ``,
      `  <span class="tl-warn">▸ LOOKING FOR</span>`,
      `    <span class="tl-val">Full-stack internship</span> <span class="tl-acc">→ jarenkendrickyambao@gmail.com</span>`,
    ],
    skills: () => [
      ``,
      `  <span class="tl-head">Technical Stack</span>`,
      `<span class="tl-dim">  ──────────────────────────────</span>`,
      `  <span class="tl-val">JavaScript</span>  <span class="tl-acc">█████████░</span> <span class="tl-head">85%</span>  <span class="tl-dim">2 yrs</span>`,
      `  <span class="tl-val">TypeScript</span>  <span class="tl-acc">████████░░</span> <span class="tl-head">80%</span>  <span class="tl-dim">1.5 yrs</span>`,
      `  <span class="tl-val">Angular</span>     <span class="tl-acc">████████░░</span> <span class="tl-head">75%</span>  <span class="tl-dim">1 yr</span>`,
      `  <span class="tl-val">Node.js</span>     <span class="tl-acc">████████░░</span> <span class="tl-head">75%</span>  <span class="tl-dim">1 yr</span>`,
      `  <span class="tl-val">Vue.js 3</span>    <span class="tl-acc">███████░░░</span> <span class="tl-head">70%</span>  <span class="tl-dim">1 yr</span>`,
      `  <span class="tl-val">C#</span>          <span class="tl-acc">███████░░░</span> <span class="tl-head">70%</span>  <span class="tl-dim">1 yr</span>`,
      `  <span class="tl-val">MongoDB</span>     <span class="tl-acc">███████░░░</span> <span class="tl-head">65%</span>  <span class="tl-dim">1 yr</span>`,
      `  <span class="tl-val">PostgreSQL</span>  <span class="tl-acc">██████░░░░</span> <span class="tl-head">55%</span>  <span class="tl-dim">6 mo</span>`,
    ],
    whoami: () => [
      ``,
      `  <span class="tl-head">jaren kendrick yambao</span>`,
      `<span class="tl-dim">  ──────────────────────────────</span>`,
      `  <span class="tl-acc">Role</span>      <span class="tl-val">Full Stack Developer + Game/App Dev</span>`,
      `  <span class="tl-acc">Age</span>       <span class="tl-val">20 years old</span>`,
      `  <span class="tl-acc">Location</span>  <span class="tl-val">Pampanga, Philippines</span> 🇵🇭`,
      `  <span class="tl-acc">Uni</span>       <span class="tl-val">Holy Angel University (2027)</span>`,
      `  <span class="tl-acc">Status</span>    <span class="tl-ok">● Open to internship</span>`,
      ``,
      `  <span class="tl-quote">""Student by day. Developer by night. Always learning."</span>`,
    ],
    contact: () => [
      ``,
      `  <span class="tl-head">Contact</span>`,
      `<span class="tl-dim">  ──────────────────────────────</span>`,
      `  <span class="tl-acc">Email</span>     <span class="tl-val">jarenkendrickyambao@gmail.com</span>`,
      `  <span class="tl-acc">LinkedIn</span>  <span class="tl-val">linkedin.com/in/jarenkendrick</span>`,
      `  <span class="tl-acc">GitHub</span>    <span class="tl-val">github.com/jarenkendrick14</span>`,
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
          this.BOOT_MSG.forEach((msg, i) => { setTimeout(() => this.addLine(msg), i * 55); });
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
      e.preventDefault(); e.stopPropagation();
      if (this.histIdx < this.history.length - 1) { this.histIdx++; this.inputValue.set(this.history[this.histIdx] || ''); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); e.stopPropagation();
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
    if (fn) { const result = fn(); if (result) result.forEach(l => this.addLine(l)); }
    else { this.addLine(`<span class="tl-err">bash: ${this.esc(cmd)}: command not found. Type 'help'.</span>`); }
    this.addLine('');
  }

  private addLine(html: string) {
    this.lines.update(l => [...l, { html }]);
    setTimeout(() => {
      if (this.termOutput?.nativeElement) {
        this.termOutput.nativeElement.scrollTop = this.termOutput.nativeElement.scrollHeight;
      }
    }, 10);
  }

  private esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
}