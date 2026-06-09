import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../data/portfolio.data';
import { NavigationService } from '../../data/navigation.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent {
  @Input() active = false;

  data       = inject(PortfolioDataService);
  nav        = inject(NavigationService);
  downloading = signal(false);
  plainView   = signal(false);

  togglePlain() { this.plainView.update(v => !v); }

  // Strip protocol and trailing slash for cleaner URL display
  cleanUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  goBack() {
    if (window.innerWidth < 960 && window.history.length > 1) {
      history.back();
    } else {
      this.nav.goTo(0, this.data.navItems.length);
    }
  }

  // ── Professional Summary ───────────────────────────────────
  readonly summary =
    'Third-year BSIT student with production full-stack experience at HumanSide Technologies — building Angular 21 + Node.js + PostgreSQL platforms with real-time WebSocket features and JWT-secured REST APIs. Also shipped a published VR app to the Meta Quest Store. Seeking a full-stack internship to contribute to real-world software projects.';

  // ── Experience ────────────────────────────────────────────
  readonly experience = [
    {
      period: 'Feb 2026 — Present',
      company: 'HumanSide Technologies',
      type: 'Contract · Remote',
      title: 'Full Stack Developer',
      bullets: [
        'Architected and shipped <strong>Symposium</strong> — a real-time multi-AI chat platform on Angular 21 + Ionic (Vercel) with an Express + WebSocket backend (Railway) and PostgreSQL via Prisma ORM.',
        'Implemented streaming AI responses over WebSocket with Angular signals, JWT authentication, and a role-based admin dashboard.',
        'Collaborates on agile sprints and code reviews across time zones; cross-platform builds via Ionic + Capacitor.',
      ],
    },
    {
      period: 'Apr 2025 — Jan 2026',
      company: 'HumanSide Technologies',
      type: 'Contract · Remote',
      title: 'Game / App Developer',
      bullets: [
        'Shipped <strong>PathFinder</strong> to the Meta Quest Store using Unreal Engine 5.5 Blueprints with Wit.ai speech-to-text voice journaling.',
        'Built the Android companion app in Unity (C#); passed Meta\'s hardware and content review.',
      ],
    },
  ];

  // ── Projects (personal / academic — not covered in experience) ──
  readonly projects = [
    {
      name: 'MonsoonAI',
      stack: 'Node.js · TypeScript · Express · PocketBase · WebSockets · Google Gemini · turf.js',
      desc: 'Disaster early-warning PWA for Philippine households · Entry for the Asian Hackathon for Green Future.',
      bullets: [
        'Multi-hazard risk engine fusing live weather, flood, and wildfire data sources',
        'turf.js per-address flood-zone lookup; SMS-first alert pipeline for low-connectivity areas',
      ],
      live: 'https://github.com/jarenkendrick14/monsoon-ai',
      liveLabel: 'GitHub ↗',
    },
    {
      name: 'TARIPA',
      stack: 'Angular 21 · Signals · Node.js · Express · MySQL · JWT · PDFKit · node-cron',
      desc: 'Civic-tech PWA for Angeles City commuters.',
      bullets: [
        'MySQL geospatial queries aggregating reports by transport terminal',
        'Scheduled PDFKit + Nodemailer pipeline designed to deliver weekly summaries to the local transport office',
      ],
      live: 'https://github.com/jarenkendrick14/taripa-web-app',
      liveLabel: 'GitHub ↗',
    },
    {
      name: 'Dropify',
      stack: 'Vue.js 3 · Composition API · Node.js · Express · MongoDB · Pinia · JWT',
      desc: 'Full-stack e-commerce platform.',
      bullets: [
        'MongoDB-backed persistent cart that survives sessions and logouts',
        'CRUD admin dashboard with role-based access control and order status tracking',
      ],
      live: 'https://dropifystore.netlify.app/',
      liveLabel: 'Live ↗',
    },
  ];

  // ── Education ─────────────────────────────────────────────
  readonly education = [
    {
      period: '2023 — 2027',
      school: 'Holy Angel University',
      location: 'Pampanga, Philippines',
      degree: 'BS Information Technology',
      courses: 'Web Development · Database Systems · Software Engineering · Networking',
    },
  ];

  // ── Skills (grouped by category) ──────────────────────────
  readonly skillGroups = [
    { category: 'Frontend',   items: ['TypeScript', 'JavaScript', 'Angular 21 (Signals, PWA)', 'Vue.js 3 (Composition API, Pinia)', 'Ionic + Capacitor'] },
    { category: 'Backend',    items: ['Node.js', 'Express.js', 'WebSockets', 'REST APIs', 'JWT'] },
    { category: 'Database',   items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Prisma ORM'] },
    { category: 'Deployment', items: ['Git', 'Netlify', 'Vercel', 'Railway', 'CI/CD via Netlify/Vercel auto-deploy from GitHub'] },
    { category: 'Game Dev',   items: ['C#', 'Unreal Engine 5.5', 'Blueprints', 'Unity'] },
  ];

  // ── Certifications — relevant to web & app dev field only ─
  readonly resumeCerts = this.data.certificates.filter(c => [
    'Back End Development & APIs',
    'JS Algorithms & Data Structures',
    'Endpoint Security',
  ].includes(c.name));

  // ── Download: renders resume-doc to PDF via html2canvas ─────
  async downloadPDF() {
    const el = document.getElementById('resume-document');
    if (!el || this.downloading()) return;

    this.downloading.set(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF }   = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW   = 210;
      const pageH   = 297;
      const imgH    = (canvas.height * pageW) / canvas.width;

      // Fit full page width; paginate only when overflow is meaningful (>20mm).
      // Page margins are handled via the .resume-doc.plain CSS padding (see resume.component.css).
      const overflowTolerance = 20; // mm
      if (imgH <= pageH + overflowTolerance) {
        const fitH = Math.min(imgH, pageH);
        const fitW = imgH > pageH ? pageW * (pageH / imgH) : pageW;
        const xOffset = (pageW - fitW) / 2;
        // Center vertically so the top and bottom margins are symmetric.
        const yOffset = Math.max(0, (pageH - fitH) / 2);
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, fitW, fitH);
      } else {
        let remaining = imgH;
        let offset    = 0;
        while (remaining > 0) {
          pdf.addImage(imgData, 'PNG', 0, -offset, pageW, imgH);
          remaining -= pageH;
          offset    += pageH;
          if (remaining > overflowTolerance) pdf.addPage();
          else break;
        }
      }

      pdf.save('Jaren_Kendrick_Resume.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      this.downloading.set(false);
    }
  }

  // ── Print: opens a standalone clean window ─────────────────
  printResume() {
    const el = document.getElementById('resume-document');
    if (!el) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jaren Kendrick Yambao — Résumé</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @page { size: letter; margin: 0.38in 0.48in; }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #fff;
      color: #1a1824;
      font-size: 8.5pt;
      line-height: 1.45;
    }

    a { color: inherit; text-decoration: none; }

    /* ── HEADER ── */
    .rd-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12pt;
      padding-bottom: 6pt;
      margin-bottom: 7pt;
      border-bottom: 1.5pt solid #1a1824;
    }
    .rd-name-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .rd-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22pt;
      font-weight: 600;
      color: #1a1824;
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: 3pt;
    }
    .rd-title { font-size: 8pt; color: #5c597a; font-weight: 400; }
    .rd-contacts { display: flex; flex-direction: column; align-items: flex-end; gap: 2.5pt; }
    .rd-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 3pt;
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      color: #4a4868;
    }
    .rd-contact-item svg { width: 8pt; height: 8pt; flex-shrink: 0; }
    .rd-loc svg, .rd-phone svg { fill: #4a4868; stroke: none; }

    /* ── SUMMARY ── */
    .rd-summary {
      font-size: 8pt;
      color: #2d2b3b;
      line-height: 1.55;
      margin-bottom: 8pt;
      padding-bottom: 7pt;
      border-bottom: 0.5pt solid #d8d5ee;
    }

    /* ── BODY ── */
    .rd-body { display: grid; grid-template-columns: 1fr 186pt; gap: 18pt; }

    /* ── SECTION ── */
    .rd-section { margin-bottom: 10pt; }
    .rd-section:last-child { margin-bottom: 0; }
    .rd-sec-title {
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #6d28d9;
      margin-bottom: 3pt;
    }
    .rd-rule { height: 0.6pt; background: #d8d5ee; margin-bottom: 6pt; }

    /* ── ENTRY ── */
    .rd-entry { margin-bottom: 9pt; padding-bottom: 8pt; border-bottom: 0.5pt solid #f0eef8; }
    .rd-entry:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .rd-entry-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 6pt;
      margin-bottom: 1.5pt;
    }
    .rd-entry-left { display: flex; flex-direction: column; gap: 1pt; }
    .rd-entry-right { display: flex; flex-direction: column; align-items: flex-end; gap: 1pt; flex-shrink: 0; }
    .rd-entry-role { font-size: 9pt; font-weight: 700; color: #1a1824; line-height: 1.15; }
    .rd-entry-org  { font-size: 8pt; font-weight: 500; color: #4a4868; }
    .rd-entry-period { font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; color: #6d28d9; font-weight: 500; white-space: nowrap; }
    .rd-entry-type   { font-size: 6.5pt; color: #7a7898; white-space: nowrap; }

    .rd-bullets { list-style: none; padding: 0; margin: 4pt 0 0; display: flex; flex-direction: column; gap: 2pt; }
    .rd-bullets li {
      font-size: 8pt;
      color: #2d2b3b;
      line-height: 1.45;
      padding-left: 9pt;
      position: relative;
    }
    .rd-bullets li::before { content: '▸'; position: absolute; left: 0; color: #6d28d9; font-size: 6.5pt; top: 1.5pt; }
    .rd-bullets li strong { color: #1a1824; font-weight: 700; }

    .rd-edu-courses { font-size: 7.5pt; color: #5c597a; margin-top: 3pt; line-height: 1.4; }

    /* ── PROJECTS ── */
    .rd-proj { margin-bottom: 7pt; padding-bottom: 7pt; border-bottom: 0.5pt solid #f0eef8; }
    .rd-proj:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .rd-proj-head { display: flex; align-items: baseline; justify-content: space-between; gap: 6pt; margin-bottom: 1.5pt; }
    .rd-proj-name { font-size: 8.5pt; font-weight: 700; color: #1a1824; }
    .rd-proj-link { font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; color: #6d28d9; text-decoration: none; font-weight: 500; }
    .rd-proj-stack { font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; color: #5c597a; margin-bottom: 2pt; }
    .rd-proj-desc { font-size: 7.5pt; color: #2d2b3b; line-height: 1.45; }

    /* ── SKILLS ── */
    .rd-skill-group { margin-bottom: 5.5pt; }
    .rd-skill-cat  { display: block; font-size: 7pt; font-weight: 700; color: #1a1824; margin-bottom: 1pt; }
    .rd-skill-list { font-size: 7pt; color: #4a4868; line-height: 1.4; }

    /* ── CERTS ── */
    .rd-cert { margin-bottom: 5pt; padding-bottom: 5pt; border-bottom: 0.5pt solid #f0eef8; }
    .rd-cert:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .rd-cert-name   { display: block; font-size: 7pt; font-weight: 600; color: #1a1824; line-height: 1.25; margin-bottom: 1.5pt; }
    .rd-cert-meta   { display: flex; justify-content: space-between; align-items: center; }
    .rd-cert-issuer { font-size: 6pt; color: #7a7898; }
    .rd-cert-date   { font-family: 'JetBrains Mono', monospace; font-size: 6pt; color: #6d28d9; font-weight: 500; }

    /* ── Hide UI chrome ── */
    .res-topbar { display: none !important; }
  </style>
</head>
<body>
  ${el.innerHTML}
  <script>document.fonts.ready.then(function() { window.print(); });</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) {
      alert('Please allow pop-ups for this site to use Print / Save as PDF.');
      return;
    }
    win.document.write(html);
    win.document.close();
  }
}
