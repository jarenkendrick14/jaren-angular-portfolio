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
    'AI developer focused on the engineering around LLMs: provider integration, cost control and failure handling.';

  // ── Experience (roles grouped by company, newest first) ────
  readonly experience = [
    {
      company: 'HumanSide Technologies',
      type: 'Part-time · Remote',
      roles: [
        {
          title: 'AI Developer',
          period: 'Feb 2026 — Present',
          bullets: [
            'Grew <strong>Symposium</strong> from one model to 15+ AI providers behind one interface, with streaming, tool use, web search, citations and bring-your-own-AI endpoints.',
            'Built per-provider cost telemetry, spend ceilings and billed-versus-logged cost reconciliation on a Stripe + RevenueCat credit system.',
            'Built a document RAG pipeline that grounds AI answers in uploaded PDF, DOCX, XLSX and PPTX files.',
            'Shipped AI-to-AI debate and multi-model research papers, where AI seats challenge each other\'s findings over four rounds.',
            'Scaled the backend with Redis + BullMQ queues and added OAuth sign-in.',
          ],
        },
        {
          title: 'Game Developer',
          period: 'Apr 2025 — Feb 2026',
          bullets: [
            'Shipped <strong>PathFinder</strong> to the Meta Quest Store (Unreal Engine 5.5 Blueprints, Wit.ai voice journaling) with a Unity Android companion.',
          ],
        },
      ],
    },
    {
      company: 'Symph',
      type: 'Internship · Remote',
      roles: [
        {
          title: 'Web and App Developer',
          period: 'Jul 2026 — Oct 2026',
          bullets: [
            'Built the brand intake pipeline for <strong>Echoic</strong>, Symph\'s AI content-automation platform, with an evaluation harness to measure scraping quality.',
            'Added review-and-repair quality gates to AI image and carousel generation, plus per-provider usage telemetry.',
            'Built features across a property management platform and brought its Flutter app to parity with web.',
          ],
        },
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
      ],
      live: 'https://github.com/jarenkendrick14/taripa-web-app',
      liveLabel: 'GitHub ↗',
    },
  ];

  // ── Education ─────────────────────────────────────────────
  readonly education = [
    {
      period: '2023 — 2027',
      school: 'Holy Angel University',
      location: 'Pampanga, Philippines',
      degree: 'BS Information Technology',
    },
  ];

  // ── Skills: only what this page backs up (the site keeps the fuller list) ──
  private readonly resumeOmit = ['Vue.js 3', 'MongoDB', 'Ionic + Capacitor', 'Netlify', 'Figma'];
  readonly skillGroups = this.data.skillGroups
    .map(g => ({ ...g, items: g.items.filter(item => !this.resumeOmit.includes(item)) }))
    .filter(g => g.items.length);

  // ── Certifications — relevant to web & app dev field only ─
  readonly resumeCerts = this.data.certificates.filter(c => [
    'Claude Certified Architect – Foundations',
  ].includes(c.name));

  // ── Contact links (used by the PDF export) ────────────────
  readonly contacts = [
    { label: 'jarenkendrick.com',             url: 'https://jarenkendrick.com' },
    { label: 'jarenkendricky@gmail.com',      url: 'mailto:jarenkendricky@gmail.com' },
    { label: 'github.com/jarenkendrick14',    url: 'https://github.com/jarenkendrick14' },
    { label: 'linkedin.com/in/jarenkendrick', url: 'https://linkedin.com/in/jarenkendrick' },
  ];

  // ── Download: writes a real text PDF (single column) so ATS parsers can read it ──
  async downloadPDF() {
    if (this.downloading()) return;

    this.downloading.set(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf   = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const M = 42;              // page margin
      const W = pageW - M * 2;   // content width
      const INK = 20, SOFT = 85; // grey levels
      const BODY = 9.5;
      let y = M;

      // Fold typographic characters to ASCII: the built-in PDF fonts don't map them for text extraction
      const clean = (s: string) => s
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\s*\u00B7\s*/g, ', ');

      const lh = (size: number) => size * 1.28;
      const font = (style: 'normal' | 'bold', size: number, grey = INK) => {
        pdf.setFont('helvetica', style);
        pdf.setFontSize(size);
        pdf.setTextColor(grey, grey, grey);
      };
      const ensure = (h: number) => {
        if (y + h > pageH - M) { pdf.addPage(); y = M; }
      };
      const text = (str: string, x: number, opts: Record<string, unknown> = {}) =>
        pdf.text(str, x, y, { baseline: 'top', ...opts });

      const section = (title: string) => {
        y += 6;
        ensure(lh(10.5) + 30);
        font('bold', 10.5);
        text(title.toUpperCase(), M);
        y += lh(10.5);
        pdf.setDrawColor(INK, INK, INK);
        pdf.setLineWidth(0.6);
        pdf.line(M, y, pageW - M, y);
        y += 5;
      };

      // Left text, right-aligned text on the same line (role / dates, org / location)
      const row = (left: string, right: string, size: number, bold: boolean, url?: string) => {
        ensure(lh(size));
        font(bold ? 'bold' : 'normal', size, bold ? INK : SOFT);
        text(clean(left), M);
        font('normal', BODY, SOFT);
        text(clean(right), pageW - M, { align: 'right' });
        if (url) {
          const w = pdf.getTextWidth(clean(right));
          pdf.link(pageW - M - w, y, w, lh(BODY), { url });
        }
        y += lh(size);
      };

      const para = (str: string, size = BODY, grey = INK) => {
        font('normal', size, grey);
        for (const line of pdf.splitTextToSize(clean(str), W) as string[]) {
          ensure(lh(size));
          text(line, M);
          y += lh(size);
        }
      };

      const bullet = (str: string) => {
        const indent = 11;
        font('normal', BODY);
        (pdf.splitTextToSize(clean(str), W - indent) as string[]).forEach((line, i) => {
          ensure(lh(BODY));
          if (i === 0) {
            pdf.setFillColor(INK, INK, INK);
            pdf.circle(M + 3.2, y + BODY * 0.48, 1.1, 'F');
          }
          text(line, M + indent);
          y += lh(BODY);
        });
      };

      // Bold label, then plain text that wraps back to the margin ("Frontend: TypeScript, ...")
      const labeled = (label: string, str: string) => {
        ensure(lh(BODY));
        font('bold', BODY);
        const lw = pdf.getTextWidth(clean(label));
        text(clean(label), M);
        font('normal', BODY);
        let x = M + lw, avail = W - lw, line = '';
        for (const word of clean(str).split(' ')) {
          const next = line ? `${line} ${word}` : word;
          if (line && pdf.getTextWidth(next) > avail) {
            text(line, x);
            y += lh(BODY);
            ensure(lh(BODY));
            x = M; avail = W; line = word;
          } else {
            line = next;
          }
        }
        text(line, x);
        y += lh(BODY);
      };

      // ── Header ──
      font('bold', 20);
      text('Jaren Kendrick Yambao', M);
      y += 24;
      font('normal', 10.5, SOFT);
      // Phone sits with the location; the links row below is already full width
      text('AI Developer | Pampanga, Philippines | ', M);
      const phoneX = M + pdf.getTextWidth('AI Developer | Pampanga, Philippines | ');
      text('+63 976 338 0683', phoneX);
      pdf.link(phoneX, y, pdf.getTextWidth('+63 976 338 0683'), lh(10.5), { url: 'tel:+639763380683' });
      y += lh(10.5) + 1;
      font('normal', 9, INK);
      let cx = M;
      const sep = '   |   ';
      this.contacts.forEach((c, i) => {
        const w = pdf.getTextWidth(c.label);
        if (i && cx + pdf.getTextWidth(sep) + w > pageW - M) { cx = M; y += lh(9); }
        else if (i) { text(sep, cx); cx += pdf.getTextWidth(sep); }
        text(c.label, cx);
        pdf.link(cx, y, w, lh(9), { url: c.url });
        cx += w;
      });
      y += lh(9);

      section('Summary');
      para(this.summary);

      section('Experience');
      this.experience.forEach((job, i) => {
        if (i) y += 6;
        ensure(lh(10.5) + lh(BODY) * 3);
        row(job.company, job.type, 10.5, true);
        job.roles.forEach((role, j) => {
          if (j) y += 3;
          ensure(lh(BODY) * 3);
          font('bold', BODY, SOFT);
          text(clean(role.title), M);
          font('normal', BODY, SOFT);
          text(clean(role.period), pageW - M, { align: 'right' });
          y += lh(BODY);
          role.bullets.forEach(bullet);
        });
      });

      section('Projects');
      this.projects.forEach((proj, i) => {
        if (i) y += 5;
        ensure(lh(10.5) + lh(BODY) * 3);
        row(proj.name, this.cleanUrl(proj.live), 10.5, true, proj.live);
        para(proj.stack.replace(/ · /g, ', '), 9, SOFT);
        para(proj.desc.replace(/ · /g, '. '));
        proj.bullets.forEach(bullet);
      });

      section('Education');
      for (const edu of this.education) {
        row(edu.degree, edu.period, 10.5, true);
        row(edu.school, edu.location, BODY, false);
      }

      section('Skills');
      this.skillGroups.forEach(g => labeled(`${g.category}: `, g.items.join(', ')));

      section('Certifications');
      this.resumeCerts.forEach(c => labeled(`${c.name} - `, `${c.issuer}, ${c.date}`));

      pdf.setProperties({
        title: 'Jaren Kendrick Yambao - Resume',
        author: 'Jaren Kendrick Yambao',
        subject: 'Resume',
        keywords: 'AI Developer, Angular, Node.js, TypeScript, LLM integration',
      });
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
    /* Single column: ATS parsers read multi-column layouts out of order */
    .rd-body { display: block; }

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
    .rd-entry { margin-bottom: 6pt; padding-bottom: 5pt; border-bottom: 0.5pt solid #f0eef8; }
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

    .rd-role { margin-top: 3pt; }
    .rd-role-head { display: flex; align-items: baseline; justify-content: space-between; gap: 6pt; }
    .rd-role-title { font-size: 8.5pt; font-weight: 600; color: #2d2b3b; }

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
    .rd-proj { margin-bottom: 5pt; padding-bottom: 5pt; border-bottom: 0.5pt solid #f0eef8; }
    .rd-proj:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .rd-proj-head { display: flex; align-items: baseline; justify-content: space-between; gap: 6pt; margin-bottom: 1.5pt; }
    .rd-proj-name { font-size: 8.5pt; font-weight: 700; color: #1a1824; }
    .rd-proj-link { font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; color: #6d28d9; text-decoration: none; font-weight: 500; }
    .rd-proj-stack { font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; color: #5c597a; margin-bottom: 2pt; }
    .rd-proj-desc { font-size: 7.5pt; color: #2d2b3b; line-height: 1.45; }

    /* ── SKILLS ── */
    .rd-skill-group { margin-bottom: 2pt; line-height: 1.45; }
    .rd-skill-cat  { display: inline; font-size: 8pt; font-weight: 700; color: #1a1824; }
    .rd-skill-cat::after { content: ': '; }
    .rd-skill-list { display: inline; font-size: 8pt; color: #2d2b3b; }

    /* ── CERTS ── */
    .rd-cert { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; margin-bottom: 2pt; }
    .rd-cert:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .rd-cert-name   { font-size: 8pt; font-weight: 600; color: #1a1824; line-height: 1.3; }
    .rd-cert-meta   { display: flex; gap: 8pt; align-items: baseline; }
    .rd-cert-issuer { font-size: 7.5pt; color: #4a4868; }
    .rd-cert-date   { font-family: 'JetBrains Mono', monospace; font-size: 7pt; color: #6d28d9; font-weight: 500; }

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
