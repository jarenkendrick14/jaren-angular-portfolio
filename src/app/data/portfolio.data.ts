import { Injectable } from '@angular/core';
import { Project, Certificate, BlogPost, Testimonial, NavItem } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {

  readonly navItems: NavItem[] = [
    { label: 'Home', short: 'Home', index: 0 },
    { label: 'About', short: 'About', index: 1 },
    { label: 'Work', short: 'Work', index: 2 },
    { label: 'Experience', short: 'Exp.', index: 3 },
    { label: 'Blog', short: 'Blog', index: 4 },
    { label: 'Testimonials', short: 'reviews', index: 5 },
    { label: 'Contact', short: 'Contact', index: 6 },
  ];

  readonly projects: Project[] = [
    {
      num: '01', name: 'PathFinder',
      subtitle: 'VR self-discovery app · Unreal Engine 5.5 + Unity',
      tags: ['Unreal Engine 5.5', 'Unity', 'C#', 'VR'],
      desc: 'A VR self-discovery app built in Unreal Engine 5.5 using Blueprints for gameplay systems. Users interact with metaphorical cards, with Wit.ai handling voice-to-text. Also deployed an Android companion app built in Unity.',
      purpose: 'Engineered immersive, privacy-first VR mechanics and a scalable Android companion app for VirtuIntelligence.',
      features: ['Interactive card mechanics in VR', 'AI voice journaling via Wit.ai', 'Local data persistence for privacy', 'Cross-platform deployment'],
      live: [{ name: 'Meta Store ↗', url: 'https://www.meta.com/experiences/' }, { name: 'Google Play ↗', url: 'https://play.google.com/store/' }],
      github: null,
      imgs: ['rgba(167,139,250,.12)', 'rgba(167,139,250,.08)', 'rgba(167,139,250,.05)']
    },
    {
      num: '02', name: 'Symposium',
      subtitle: 'Real-time AI-mediated chat platform · Angular + Ionic + Node.js',
      tags: ['Angular', 'Ionic', 'Node.js', 'PostgreSQL', 'Prisma', 'WebSockets'],
      desc: 'A full-stack real-time chat application with an AI mediator powered by xAI\'s Grok. Features WebSocket-based messaging, streaming AI responses, configurable turn management, and a full @mention system. Built with Angular 21 + Ionic 8 for cross-platform support and a Node.js/Express backend with PostgreSQL via Prisma ORM.',
      purpose: 'Architected a complete real-time communication platform with AI integration, demonstrating proficiency in WebSocket protocols, streaming APIs, and full-stack TypeScript development.',
      features: ['Real-time WebSocket messaging with auto-reconnect', 'Streaming AI responses via xAI Grok', 'Turn management system (strict & round-robin)', '@mention system with live-filtered dropdown', 'Cross-platform via Ionic + Capacitor'],
      live: [{ name: 'Live Site ↗', url: 'https://symposium.jarenkendrick.com/' }],
      github: null,
      imgs: ['rgba(56,189,248,.12)', 'rgba(56,189,248,.08)', 'rgba(56,189,248,.05)']
    },
    {
      num: '03', name: 'Travel Atelier',
      subtitle: 'Full-stack travel booking platform · Vue.js + Node.js',
      tags: ['Vue.js 3', 'Node.js', 'Express', 'JWT'],
      desc: 'Full-stack travel booking platform featuring secure JWT authentication, protected routing, and real-time destination searches. Built a robust REST API backend for user management and booking workflows.',
      purpose: 'Architected a complete full-stack application demonstrating secure data flow from database to frontend UI.',
      features: ['JWT-based authentication system', 'Protected routing and navigation', 'Backend-connected dynamic forms', 'Real-time destination filtering'],
      live: [{ name: 'Live Site ↗', url: 'https://travel-atelier.jarenkendrick.com/' }],
      github: 'https://github.com/jarenkendrick14/travel-atelier',
      imgs: ['rgba(96,165,250,.12)', 'rgba(96,165,250,.08)', 'rgba(96,165,250,.05)']
    },
    {
      num: '04', name: 'Dropify',
      subtitle: 'E-commerce platform · Vue.js + MongoDB + Express',
      tags: ['Vue.js 3', 'MongoDB', 'Express', 'Node.js', 'Pinia'],
      desc: 'Comprehensive e-commerce platform for a streetwear brand, featuring a full shopping experience with persistent cart, checkout flow, JWT authentication, and a dedicated admin dashboard for managing products, users, and orders.',
      purpose: 'Designed a scalable MongoDB schema with embedded cart architecture and integrated it with a reactive Vue 3 + Pinia frontend.',
      features: ['Persistent cart with server-synced state', 'Full CRUD admin dashboard (products, users, orders)', 'JWT authentication with role-based access', 'Product search, sort, and paginated filtering'],
      live: [{ name: 'Live Site ↗', url: 'https://dropify.jarenkendrick.com/' }],
      github: 'https://github.com/jarenkendrick14/dropify',
      imgs: ['rgba(52,211,153,.12)', 'rgba(52,211,153,.08)', 'rgba(52,211,153,.05)']
    },
    {
      num: '05', name: "Einstein's Art",
      subtitle: 'Dynamic company website for a hand-painted bag brand',
      tags: ['Angular', 'TypeScript', 'Netlify'],
      desc: "Company website for a local brand built in Angular. Implemented client-side routing, dynamic rendering components, and a custom employee directory.",
      purpose: "Built a fast, scalable frontend structure using Angular best practices and structural directives.",
      features: ['Angular client-side routing', 'Dynamic product rendering', 'Conditional component styling', 'Deployed directly to Netlify'],
      live: [{ name: 'Live Demo ↗', url: 'https://69359c7c680ce1935fafb306--prelim-project-einsteins-art.netlify.app/' }],
      github: 'https://github.com/jarenkendrick14/einsteins-art',
      imgs: ['rgba(167,139,250,.12)', 'rgba(167,139,250,.08)', 'rgba(124,58,237,.06)']
    }
  ];

  readonly certificates: Certificate[] = [
    { name: 'CompTIA IT Fundamentals (ITF+)', issuer: 'CompTIA', abbr: 'COMP', color: '#c8202f', date: 'Nov 2023', url: 'https://www.comptia.org/certifications/it-fundamentals' },
    { name: 'Responsive Web Design', issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Sep 2024', url: 'https://www.freecodecamp.org/certification/jarenkendrickyambao-rwd/responsive-web-design' },
    { name: 'JavaScript Essentials 1', issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'Oct 2024', url: 'https://skillsforall.com/course/javascript-essentials-1' },
    { name: 'Introduction to Figma', issuer: 'Simplilearn', abbr: 'SL', color: '#5c67f2', date: 'Sep 2024', url: 'https://www.simplilearn.com/' },
    { name: 'Introduction to PHP', issuer: 'Simplilearn', abbr: 'SL', color: '#5c67f2', date: 'Feb 2025', url: 'https://www.simplilearn.com/' },
    { name: 'Back End Development & APIs', issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Jul 2025', url: 'https://www.freecodecamp.org/certification/jarenkendrickyambao-bedaa/back-end-development-and-apis' },
    { name: 'Legacy JS Algorithms & Data Structures', issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Jul 2025', url: 'https://www.freecodecamp.org/certification/jarenkendrickyambao-ljaads/javascript-algorithms-and-data-structures-v8' },
    { name: 'Digital Marketing', issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Jul 2025', url: 'https://academy.hubspot.com/' },
    { name: 'Endpoint Security', issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'Aug 2025', url: 'https://skillsforall.com/' },
    { name: 'CCNA: Introduction to Networks', issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'May 2025', url: 'https://skillsforall.com/' },
    { name: 'Content Marketing', issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Sep 2025', url: 'https://academy.hubspot.com/' },
    { name: 'Digital Advertising', issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Oct 2025', url: 'https://academy.hubspot.com/' },
    { name: 'SEO', issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Jan 2026', url: 'https://academy.hubspot.com/' },
  ];

  readonly blogPosts: BlogPost[] = [
    {
      date: 'January 2025',
      title: 'From Game Dev to Full Stack: What Shipping a VR App Taught Me',
      excerpt: 'When I shipped PathFinder to the Meta Quest store, I learned more about software development than any tutorial ever taught me. Here\'s what directly translates to web development.',
      content: `<p>When I joined VirtuIntelligence as a part-time Game Developer, I wasn't sure how working in Unreal Engine and Unity would shape me as a web developer. After shipping PathFinder to the Meta Quest store, I figured it out — a lot transfers, and some of it surprised me.</p><h3>Users don't read. They react.</h3><p>In VR, if a UI isn't immediately intuitive, users just stop. They look around confused. There are no tooltips, no second chances, no "skip tutorial" button. I learned to design every interaction for the first <em>three seconds</em> — no assumptions about prior knowledge.</p><p>That thinking now applies to every web interface I build. Before writing a single line of frontend code, I ask: what does a user see first? What do they click? Why would they scroll? What would make them leave? Questions I used to skip. I don't anymore.</p><h3>State management is state management</h3><p>Unity's component system is event-driven and reactive. A player picks up an item — the inventory updates, the HUD reflects it, the game state records it. Sound familiar? When I picked up Vue.js and its Composition API, the mental model was <strong>already there</strong>. Data changes, view updates. The syntax was different. The thinking wasn't.</p><p>C# gave me a very clear sense of data flow and component responsibility before I ever wrote a composable. I think that's a genuine advantage — understanding architecture before you're handed a framework that handles it for you.</p><h3>Performance is non-negotiable</h3><p>In VR, a frame drop makes you nauseous. Literally. That obsession transferred directly to web development. I check bundle sizes. I lazy-load images. I debounce API calls. Not because a tutorial told me to — because I've felt the pain of ignoring performance and watched someone rip a headset off their face.</p><h3>Shipping teaches more than studying</h3><p>PathFinder had to pass Meta's content review. It had to work on multiple headset hardware configurations. It needed a separate Android companion app in Unity — a completely different toolchain, different lifecycle, different debugging process. None of that is in any course.</p><p>Real software has constraints that force you to problem-solve in ways tutorials never reach. I now expect the last 30% of any project to be the hardest. I plan for it instead of being surprised by it.</p><p>If you're a web developer who hasn't shipped something to a real user or a real store — do it once. The clarity it gives you about what "done" actually means is worth every painful hour.</p>`
    },
    {
      date: 'December 2024',
      title: 'Vue.js vs Starting from Scratch: Why I Chose a Framework',
      excerpt: 'When building Travel Atelier, I faced a real choice: vanilla JavaScript or Vue.js. Here\'s the honest breakdown — when frameworks earn their place, and when they don\'t.',
      content: `<p>When I started building Travel Atelier, I had a real choice: vanilla JavaScript or Vue.js. Here's the honest breakdown — why I picked a framework, when that's the right call, and what I'd do differently now.</p><h3>The case for vanilla first</h3><p>I've done it. I've built projects with pure HTML, CSS, and JavaScript. No build step. No dependencies. Total control. I knew exactly what every line did because I wrote every line. For a showcase site — a product page, a portfolio — vanilla is often the right answer.</p><p>It's fast, it's transparent, and it forces you to understand fundamentals. If you've never built a simple SPA without a framework, you don't really know what frameworks are solving for you. I mean that seriously.</p><h3>But Travel Atelier wasn't a showcase</h3><p>It needed <strong>JWT authentication</strong>, <strong>protected routing</strong>, reactive form state, live destination search, a customer messages dashboard, and a Node.js REST API backend — all wired together. Building that in vanilla JS wasn't a learning exercise. It was reinventing wheels that Vue already shipped, tested, and documented.</p><p>Vue's Composition API handles reactivity, component state, and routing with patterns tested by millions of developers. I wasn't going to out-architect that in a weekend. The framework earned its place.</p><h3>Why Vue specifically, not React?</h3><p>The job market clearly favors React. I know that. But Vue's Composition API fits how I think. Logic lives in <code>setup()</code>. You compose behavior in reusable composables. The template syntax doesn't feel like a fight. For someone learning reactivity for the first time — especially coming from Unity's component-based architecture in C# — Vue's mental model clicked faster.</p><p>I'm not against React. I'll learn it. But for a solo developer building a real app with a deadline, you pick the tool you can move fastest with while still writing code you're proud of.</p><h3>What I'd do differently</h3><p>Spend two weeks in vanilla JavaScript before touching any framework. Not because frameworks are bad — but because you don't fully appreciate what they give you until you've felt the pain of doing it yourself. Reactivity, component lifecycle, two-way binding — these are harder concepts when a framework is handling them invisibly for you.</p><p><em>Understanding the "why" behind your tools makes you significantly better at using them.</em></p><p>Pick the right tool. But understand what the tool is doing for you. That understanding is the difference between a developer who can use a framework and a developer who can build without one.</p>`
    }
  ];

  readonly testimonials: Testimonial[] = [
    { quote: '"Jaren\'s ability to ship functional, well-designed applications is impressive. The architecture in his VR app shows real care for the end user and system stability."', name: 'Carlos M.', role: 'Senior Developer · VirtuIntelligence', initial: 'C', placeholder: true },
    { quote: '"Working with Jaren is refreshing. He takes ownership, communicates effectively, and the code he submits is clean and functional on the first pull request."', name: 'Mikaella T.', role: 'Classmate & Collaborator · HAU', initial: 'M', placeholder: true },
    { quote: '"The web application Jaren built exceeded expectations. Clean database structure, solid API design, and delivered on time. A strong full-stack candidate."', name: 'Prof. [Name]', role: 'IT Instructor · Holy Angel University', initial: 'P', placeholder: true },
  ];
}