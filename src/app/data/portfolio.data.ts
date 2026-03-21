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
    { label: 'Resume', short: 'Resume', index: 7, hidden: true },
  ];

  readonly projects: Project[] = [
    {
      num: '01',
      name: 'PathFinder',
      subtitle: 'VR self-discovery app · Published on Meta Quest Store & Google Play',
      tags: ['Unreal Engine 5.5', 'Blueprints', 'Unity', 'C#', 'Wit.ai', 'Meta Quest', 'Android'],
      purpose: 'Shipped a privacy-first immersive VR experience to the Meta Quest Store and Google Play for VirtuIntelligence.',
      desc: 'PathFinder is an immersive VR tool for self-discovery and creative thinking, built in Unreal Engine 5.5 using Blueprints. Users select metaphorical cards and journal their reflections via voice — powered by Wit.ai for real-time speech-to-text transcription. A companion Android app was built in Unity. All journal data is stored locally on the device; no account is required. The app is rated 3+ and runs on Meta Quest 2, 3, 3S, and Pro.',
      features: [
        'Interactive card-drawing mechanic built entirely in Unreal Engine 5.5 Blueprints',
        'AI voice journaling via Wit.ai speech-to-text — real-time transcription with no stored recordings',
        'Fully private by design — all data stored locally on-device, no account required',
        'Dual-platform deployment: Meta Quest Store (VR) and Google Play (Android companion)',
        'Supports Meta Quest 2, 3, 3S & Pro across both sitting and room-scale modes',
        'Guided reflection prompts designed to bypass logical blocks and surface intuitive thinking',
      ],
      live: [
        { name: 'Meta Store ↗', url: 'https://www.meta.com/experiences/pathfinder/24710873175273758/' },
        { name: 'Google Play ↗', url: 'https://play.google.com/store/apps/details?id=com.HumanSide.Pathfinder' }
      ],
      github: null,
      imgs: [
        'assets/images/pathfinder-1.webp',
        'assets/images/pathfinder-2.webp',
        'assets/images/pathfinder-3.webp'
      ],
      category: 'Game',
      outcome: 'Published on the Meta Quest Store and Google Play. Live product used by VirtuIntelligence clients — passed Meta\'s hardware and content review across Quest 2, 3, 3S, and Pro.'
    },
    {
      num: '02',
      name: 'Symposium',
      subtitle: 'Real-time multi-AI group chat platform · Angular + Node.js',
      tags: ['Angular', 'Ionic', 'Node.js', 'PostgreSQL', 'WebSockets', 'Express', 'Prisma', 'TypeScript'],
      purpose: 'Architected a full-stack real-time platform for VirtuIntelligence where humans collaborate with AI personas in shared chat rooms.',
      desc: 'Symposium is a real-time multi-AI group chat platform where human users converse with AI participants in shared rooms. The frontend is built with Angular 21 and Ionic, deployed on Vercel; the backend is an Express + WebSocket server on Railway, backed by a PostgreSQL database managed via Prisma ORM. The system supports streaming AI responses, room creation with invite links, turn management, and a role-based admin dashboard.',
      features: [
        'Real-time WebSocket messaging with low-latency streaming AI responses',
        'Multi-AI integration — human users interact with distinct AI personas in shared rooms',
        'Room system with invite links, join flows, and admin-level user management',
        '@mention system with a live-filtered dropdown for addressing AI or human participants',
        'Cross-platform deployment via Ionic + Capacitor (web, iOS, Android)',
        'Role-based admin dashboard for user oversight and room management',
        'PostgreSQL persistence via Prisma ORM with automatic hourly cleanup of inactive rooms',
        'Rate limiting, CORS allowlist, and JWT authentication for secure API access',
      ],
      live: [{ name: 'Live Site ↗', url: 'https://www.theaisymposium.net/' }],
      github: null,
      imgs: [
        'assets/images/symposium-1.webp',
        'assets/images/symposium-2.webp',
        'assets/images/symposium-3.webp'
      ],
      category: 'Full Stack',
      outcome: 'Live at theaisymposium.net. Deployed on Vercel + Railway — actively used by VirtuIntelligence for AI-assisted ideation sessions with real users in shared rooms.'
    },
    {
      num: '03',
      name: 'Travel Atelier',
      subtitle: 'Full-stack travel booking platform · Vue.js 3 + Node.js',
      tags: ['Vue.js 3', 'Node.js', 'Express', 'JWT', 'Vue Router', 'Vite', 'Composition API'],
      purpose: 'Built a complete full-stack travel platform demonstrating secure end-to-end data flow from a REST API to a reactive Vue 3 frontend.',
      desc: 'Travel Atelier is a modern full-stack web application for browsing and booking international travel destinations. The Vue.js 3 Composition API frontend features smooth page transitions, animated card interactions, and a functional search bar. The Node.js/Express backend powers a REST API handling JWT-based authentication, protected routing via navigation guards, a contact form messaging system viewable in real-time, and a backend-connected booking form. An embedded Google Maps integration is included on the contact page.',
      features: [
        'Full JWT authentication — registration, login, and persistent session via localStorage',
        'Protected routes with Vue Router navigation guards; unauthenticated users are redirected to login',
        'Live destination search with animated filtering and interactive card hover effects',
        'Real-time contact messaging system — form submissions immediately visible on a protected admin page',
        'Embedded Google Maps showing business location on the contact page',
        'Backend-connected registration and booking forms with server-side validation',
        'Sticky transparent-to-solid header transition on scroll with smooth page-level animations',
        'Default test user for easy evaluation (user@example.com / password)',
      ],
      live: [{ name: 'Live Site ↗', url: 'https://travelatelier.netlify.app/' }],
      github: 'https://github.com/jarenkendrick14/FINALS-Travel-Atelier',
      imgs: [
        'assets/images/travel-atelier-1.webp',
        'assets/images/travel-atelier-2.webp',
        'assets/images/travel-atelier-3.webp'
      ],
      category: 'Full Stack',
      outcome: 'Live on Vercel. Demonstrates complete full-stack ownership — from database schema to a polished, animated frontend — in a single cohesive codebase.'
    },
    {
      num: '04',
      name: 'Dropify',
      subtitle: 'Full-stack e-commerce platform · Vue.js 3 + MongoDB',
      tags: ['Vue.js 3', 'MongoDB', 'Express', 'Node.js', 'Pinia', 'JWT', 'Axios', 'Vite'],
      purpose: 'Designed a scalable e-commerce platform with a MongoDB-backed persistent cart and a comprehensive admin panel built with Vue 3 and Pinia.',
      desc: 'Dropify is a complete full-stack e-commerce platform for a content creator streetwear brand. The Vue 3 Composition API frontend features a sticky header with scroll-based transparency, staggered product grid animations, and custom pop-up notifications. The Node.js/Express/MongoDB backend manages persistent, user-specific shopping carts that survive logouts, a multi-step checkout flow with permanent order records, and a fully-featured admin panel for products, users, and orders — including role promotion/demotion and order status tracking.',
      features: [
        'Persistent user-specific shopping cart stored in MongoDB — survives sessions and logouts',
        'Full CRUD admin dashboard for products, users, and orders with search, sort, and pagination',
        'Role-based access control — promote regular users to admin or demote admins via the panel',
        'JWT authentication with case-insensitive login and bcrypt password hashing',
        'Live search and price/date sort on all product category pages (Shirts, Hoodies, Caps)',
        'Multi-step checkout with a shipping details form and permanent order records in the database',
        'Order management panel with status updates (e.g. Processing → Shipped) and detailed order modals',
        'Seeder script to populate the database with initial product data',
      ],
      live: [{ name: 'Live Site ↗', url: 'https://dropifystore.netlify.app/' }],
      github: 'https://github.com/jarenkendrick14/6WCSERVER-WD303-Dropify',
      imgs: [
        'assets/images/dropify-1.webp',
        'assets/images/dropify-2.webp',
        'assets/images/dropify-3.webp'
      ],
      category: 'Full Stack',
      outcome: 'Live at dropifystore.netlify.app. Fully functional e-commerce platform with MongoDB-backed persistent cart, CRUD admin panel, and role-based access control.'
    },
    {
      num: '05',
      name: "Einstein's Art",
      subtitle: 'Dynamic company website · Angular + TypeScript · Deployed on Netlify',
      tags: ['Angular', 'TypeScript', 'Angular Router', 'Structural Directives', 'Netlify'],
      purpose: "Built a fast, scalable Angular frontend for a local brand using component-based architecture, client-side routing, and structural directives.",
      desc: "Einstein's Art is a dynamic company website built for a local brand using Angular and TypeScript. The site uses Angular's client-side router for seamless page transitions, structural directives for conditional rendering, and dynamic components for product and employee directory displays. The project was deployed to Netlify with a continuous deployment pipeline from GitHub.",
      features: [
        'Angular client-side routing with smooth, zero-reload page transitions',
        'Dynamic product rendering using *ngFor and reactive component inputs',
        'Conditional component styling and layout using *ngIf and Angular directives',
        'Custom employee directory with dynamic data binding',
        'Deployed to Netlify with automatic CI/CD from GitHub on every push',
        'Built with TypeScript throughout for type-safe component logic',
      ],
      live: [{ name: 'Live Site ↗', url: 'https://einsteins-art.netlify.app/' }],
      github: 'https://github.com/jarenkendrick14/einsteins-art',
      imgs: [
        'assets/images/einsteins-art-1.webp',
        'assets/images/einsteins-art-2.webp',
        'assets/images/einsteins-art-3.webp'
      ],
      category: 'Web',
      outcome: 'Live at einsteins-art.netlify.app. Production Angular site for a real local brand — shipped with CI/CD from GitHub and zero-reload routing.'
    }
  ];

  readonly certificates: Certificate[] = [
    {
      name: 'CompTIA IT Fundamentals (ITF+)',
      issuer: 'CompTIA', abbr: 'COMP', color: '#c8202f', date: 'Nov 2023',
      url: 'https://cp.certmetrics.com/comptia/en/public/verify/credential/0DPJNEYZN2F1QJG0'
    },
    {
      name: 'Responsive Web Design',
      issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Sep 2024',
      url: 'https://www.freecodecamp.org/certification/JarenKendrickYambao/responsive-web-design'
    },
    {
      name: 'JavaScript Essentials 1',
      issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'Oct 2024',
      url: 'https://www.credly.com/badges/8c85d65e-a1c1-4b32-9a73-5284f689b4d4/linked_in_profile'
    },
    {
      name: 'Introduction to Figma',
      issuer: 'Simplilearn', abbr: 'SL', color: '#5c67f2', date: 'Sep 2024',
      url: 'https://www.simplilearn.com/skillup-certificate-landing?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU3MDI1MTcyOTMzMTE0OC5WbmciLCJ1c2VybmFtZSI6IkphcmVuVEtlbmRyaWNfIlhbWjhbyJ9&utm_source=shared-certificate&utm_medium=lms&utm_campaign=shared-certificate-promotion&referrer=https%3A%2F%2Flms.simplilearn.com%2Fdashboard%2Fcertificate&%24web_only=true'
    },
    {
      name: 'Introduction to PHP',
      issuer: 'Simplilearn', abbr: 'SL', color: '#5c67f2', date: 'Feb 2025',
      url: 'https://www.simplilearn.com/skillup-certificate-landing?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcyIiwiY2VydG1hWnhkGVfdXJSijoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zYW1wbGUubV0Xc9zaGFyZVYwWVdGh1bWJfNzM5OTQ2OV8xNzI3MTQxMzk5LnBuZyIsInVzZXJuYW1lIjoismFyZW4vUUhjPY2sgUy4gWwFtYmFvIn0%3D&utm_source=shared-certificate&utm_medium=lms&utm_campaign=shared-certificate-promotion&referrer=https%3A%2F%2Flms.simplilearn.com%2Fdashboard%2Fcertificate&%24web_only=true'
    },
    {
      name: 'Back End Development & APIs',
      issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Jul 2025',
      url: 'https://www.freecodecamp.org/certification/JarenKendrickYambao/back-end-development-and-apis'
    },
    {
      name: 'Legacy JS Algorithms & Data Structures',
      issuer: 'freeCodeCamp', abbr: 'fCC', color: '#0a0a23', date: 'Jul 2025',
      url: 'https://www.freecodecamp.org/certification/JarenKendrickYambao/javascript-algorithms-and-data-structures'
    },
    {
      name: 'Digital Marketing',
      issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Jul 2025',
      url: 'https://app-na2.hubspot.com/academy/achievements/ipltmkkv/en/1/jaren-kendrick-yambao/digital-marketing'
    },
    {
      name: 'Endpoint Security',
      issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'Aug 2025',
      url: 'https://www.credly.com/badges/9f3070bc-6a7f-408a-b733-0a0e8da4943d/linked_in_profile'
    },
    {
      name: 'CCNA: Introduction to Networks',
      issuer: 'Cisco', abbr: 'CSCO', color: '#1ba0d7', date: 'May 2025',
      url: 'https://www.credly.com/badges/0a2a80b2-70eb-4ecc-94a4-1cf5d1e9d5a5/linked_in_profile'
    },
    {
      name: 'Content Marketing',
      issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Sep 2025',
      url: 'https://app-na2.hubspot.com/academy/achievements/30n1vfh7/en/1/jaren-kendrick-yambao/content-marketing'
    },
    {
      name: 'Digital Advertising',
      issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Oct 2025',
      url: 'https://app-na2.hubspot.com/academy/achievements/hc10p6t8/en/1/jaren-yambao/digital-advertising'
    },
    {
      name: 'SEO',
      issuer: 'HubSpot Academy', abbr: 'HS', color: '#ff7a59', date: 'Jan 2026',
      url: 'https://app-na2.hubspot.com/academy/achievements/k55jkfw9/en/1/jaren-kendrick-yambao/seo'
    },
  ];

  readonly blogPosts: BlogPost[] = [
    {
      date: 'February 2026',
      title: 'From Game Dev to Full Stack: What Shipping a VR App Taught Me',
      excerpt: 'When I shipped PathFinder to the Meta Quest store, I learned more about software development than any tutorial ever taught me. Here\'s what directly translates to web development.',
      img: 'assets/images/blog-vr-gamedev.webp',
      readingTime: '6 min read',
      category: 'Game Dev',
      content: `<p>When I joined VirtuIntelligence as a part-time Game Developer, I wasn't sure how working in Unreal Engine and Unity would shape me as a web developer. After shipping PathFinder to the Meta Quest store, I figured it out — a lot transfers, and some of it surprised me.</p>

<img src="assets/images/blog-vr-shipping.webp" alt="VR development workflow">
<div class="blog-img-caption">Shipping to Meta Quest taught me more about deployment than any course.</div>

<h3>Users don't read. They react.</h3>
<p>In VR, if a UI isn't immediately intuitive, users just stop. They look around confused. There are no tooltips, no second chances, no "skip tutorial" button. I learned to design every interaction for the first <em>three seconds</em> — no assumptions about prior knowledge.</p>
<p>That thinking now applies to every web interface I build. Before writing a single line of frontend code, I ask: what does a user see first? What do they click? Why would they scroll? What would make them leave? Questions I used to skip. I don't anymore.</p>

<h3>State management is state management</h3>
<p>Unity's component system is event-driven and reactive. A player picks up an item — the inventory updates, the HUD reflects it, the game state records it. Sound familiar? When I picked up Vue.js and its Composition API, the mental model was <strong>already there</strong>. Data changes, view updates. The syntax was different. The thinking wasn't.</p>
<p>C# gave me a very clear sense of data flow and component responsibility before I ever wrote a composable. I think that's a genuine advantage — understanding architecture before you're handed a framework that handles it for you.</p>

<img src="assets/images/blog-vr-code.webp" alt="Unity and Angular side by side">
<div class="blog-img-caption">From Unity's event systems to Angular's reactive signals — the pattern is the same.</div>

<h3>Performance is non-negotiable</h3>
<p>In VR, a frame drop makes you nauseous. Literally. That obsession transferred directly to web development. I check bundle sizes. I lazy-load images. I debounce API calls. Not because a tutorial told me to — because I've felt the pain of ignoring performance and watched someone rip a headset off their face.</p>

<h3>Shipping teaches more than studying</h3>
<p>PathFinder had to pass Meta's content review. It had to work on multiple headset hardware configurations. It needed a separate Android companion app in Unity — a completely different toolchain, different lifecycle, different debugging process. None of that is in any course.</p>
<p>Real software has constraints that force you to problem-solve in ways tutorials never reach. I now expect the last 30% of any project to be the hardest. I plan for it instead of being surprised by it.</p>
<p>If you're a web developer who hasn't shipped something to a real user or a real store — do it once. The clarity it gives you about what "done" actually means is worth every painful hour.</p>`
    },
    {
      date: 'February 2026',
      title: 'Vue.js vs Starting from Scratch: Why I Chose a Framework',
      excerpt: 'When building Travel Atelier, I faced a real choice: vanilla JavaScript or Vue.js. Here\'s the honest breakdown — when frameworks earn their place, and when they don\'t.',
      img: 'assets/images/travel-atelier-1.webp',
      readingTime: '5 min read',
      category: 'Full Stack',
      content: `<p>When I started building Travel Atelier, I had a real choice: vanilla JavaScript or Vue.js. Here's the honest breakdown — why I picked a framework, when that's the right call, and what I'd do differently now.</p>

<h3>The case for vanilla first</h3>
<p>I've done it. I've built projects with pure HTML, CSS, and JavaScript. No build step. No dependencies. Total control. I knew exactly what every line did because I wrote every line. For a showcase site — a product page, a portfolio — vanilla is often the right answer.</p>
<p>It's fast, it's transparent, and it forces you to understand fundamentals. If you've never built a simple SPA without a framework, you don't really know what frameworks are solving for you. I mean that seriously.</p>

<img src="assets/images/blog-vue-setup.webp" alt="Vue.js project setup">
<div class="blog-img-caption">Travel Atelier's Vue.js 3 project structure — Composition API all the way.</div>

<h3>But Travel Atelier wasn't a showcase</h3>
<p>It needed <strong>JWT authentication</strong>, <strong>protected routing</strong>, reactive form state, live destination search, a customer messages dashboard, and a Node.js REST API backend — all wired together. Building that in vanilla JS wasn't a learning exercise. It was reinventing wheels that Vue already shipped, tested, and documented.</p>
<p>Vue's Composition API handles reactivity, component state, and routing with patterns tested by millions of developers. I wasn't going to out-architect that in a weekend. The framework earned its place.</p>

<h3>Why Vue specifically, not React?</h3>
<p>The job market clearly favors React. I know that. But Vue's Composition API fits how I think. Logic lives in <code>setup()</code>. You compose behavior in reusable composables. The template syntax doesn't feel like a fight. For someone learning reactivity for the first time — especially coming from Unity's component-based architecture in C# — Vue's mental model clicked faster.</p>
<p>I'm not against React. I'll learn it. But for a solo developer building a real app with a deadline, you pick the tool you can move fastest with while still writing code you're proud of.</p>

<img src="assets/images/blog-vue-code.webp" alt="Vue.js Composition API code">
<div class="blog-img-caption">Composables in Vue feel natural coming from Unity's component model.</div>

<h3>What I'd do differently</h3>
<p>Spend two weeks in vanilla JavaScript before touching any framework. Not because frameworks are bad — but because you don't fully appreciate what they give you until you've felt the pain of doing it yourself. Reactivity, component lifecycle, two-way binding — these are harder concepts when a framework is handling them invisibly for you.</p>
<p><em>Understanding the "why" behind your tools makes you significantly better at using them.</em></p>
<p>Pick the right tool. But understand what the tool is doing for you. That understanding is the difference between a developer who can use a framework and a developer who can build without one.</p>`
    },
    {
      date: 'January 2026',
      title: 'Building Symposium: What I Learned Making a Real-Time Multi-AI Chat',
      excerpt: 'Symposium was the most architecturally complex thing I had built. WebSockets, streaming AI, shared rooms, admin dashboards — here\'s how I approached the hardest parts.',
      img: 'assets/images/symposium-1.webp',
      readingTime: '7 min read',
      category: 'Full Stack',
      content: `<p>Symposium started with a simple question from VirtuIntelligence: "What if multiple AI assistants could talk to each other and to a human user, all in the same room?" Six weeks later, it was live at theaisymposium.net. Here's what I learned building the hardest system I've tackled so far.</p>

<h3>The real-time problem</h3>
<p>HTTP request/response is fine for most web apps. But a chat platform — especially one with streaming AI responses — needed persistent, bidirectional connections. WebSockets were the obvious answer. The hard part wasn't the protocol. It was managing <em>state across connections</em>.</p>
<p>When a user joins a room, they need to see messages that arrived before they connected. When an AI responds, all connected clients need to receive it simultaneously. When a user disconnects and reconnects, their session needs to be recognized. That's three separate state synchronization problems before you've written a single AI integration.</p>

<h3>Streaming AI responses</h3>
<p>Nobody wants to wait 10 seconds for an AI response to appear all at once. The solution is streaming — sending tokens as they're generated and progressively rendering them in the UI. On the backend, this means handling the AI provider's stream, buffering tokens, and broadcasting them over WebSocket. On the frontend, it means appending characters to a live message element without triggering full re-renders.</p>
<p>Angular's signals made this surprisingly clean. A signal holding the current streaming message updates character by character, and the template reacts exactly as needed — no change detection overhead from re-rendering the full message list.</p>

<h3>Multi-AI turn management</h3>
<p>When you have multiple AI participants in a room, you need rules about who speaks when. An uncontrolled system will have all AIs responding simultaneously, which is chaotic and expensive. I implemented a turn-based queue on the server: when a human sends a message, the system determines which AI should respond next based on @mention priority, then round-robin order, with a cooldown to prevent response loops.</p>
<p>This required a small but careful state machine on the backend — the kind of thing that's easy to under-engineer and painful to debug under load.</p>

<h3>What I'd do differently</h3>
<p>I'd invest more time in the database schema upfront. I added features mid-build — invite links, admin dashboards, hourly room cleanup — and each one required schema changes that rippled through the Prisma models, API handlers, and frontend types. Design the data model for your v2 features, not just v1. The migration cost of schema changes compounds quickly.</p>
<p>Real-time systems expose architecture problems you'd never see in a traditional REST app. If you want to level up quickly as a full-stack developer, build something with WebSockets. The constraints force good decisions.</p>`
    },
    {
      date: 'March 2026',
      title: 'The Stack I Reach For in 2026 (And Why)',
      excerpt: 'After shipping 5 projects across web and VR, I have clear opinions about tooling. Here\'s my default stack, why I chose each piece, and what I\'d swap out for the right job.',
      img: 'assets/images/dropify-1.webp',
      readingTime: '4 min read',
      category: 'Opinion',
      content: `<p>After shipping five projects — across Angular, Vue.js, Node.js, Unreal Engine, and Unity — I've stopped treating my tool choices as experiments and started treating them as decisions. Here's where I land in 2026.</p>

<h3>Frontend: Angular for complex apps, Vue for everything else</h3>
<p><strong>Angular</strong> is my default for large, complex applications. The opinionated structure — standalone components, dependency injection, signals-based reactivity, strong typing throughout — removes a class of architectural debates that waste time on big codebases. It's verbose. It's also predictable. When I return to Angular code I wrote three months ago, I know exactly where everything is.</p>
<p><strong>Vue.js 3</strong> wins for medium-complexity projects and anything I need to ship quickly. The Composition API is genuinely elegant. For a full-stack project with a two-week deadline, Vue gets me to a polished frontend faster than Angular.</p>

<h3>Backend: Node.js + Express + Prisma</h3>
<p>I'm comfortable in this stack and I trust it. Express gives me just enough structure without hiding what's happening. Prisma's type-safe queries catch entire categories of bugs before runtime — and the schema-first approach forces you to think carefully about your data model before writing a single handler. PostgreSQL for relational data, MongoDB when I need document flexibility.</p>

<h3>Game/VR: Unreal Engine 5.5 for VR, Unity for cross-platform mobile</h3>
<p>PathFinder is a Meta Quest app — Unreal's native XR support and Blueprints visual scripting made iteration fast. The companion Android app lives in Unity, because deploying to Google Play from Unity is significantly simpler. Different tools, different jobs.</p>

<h3>What I'd swap out</h3>
<p>I'm increasingly skeptical of ORMs for simple data access patterns. Prisma is excellent for complex schemas, but raw SQL with a lightweight query builder is often faster to reason about for straightforward CRUD. The best stack is the one your team knows and your project actually needs. Having a default — a stack you can reach for without thinking — is a competitive advantage.</p>`
    }
  ];

  readonly testimonials: Testimonial[] = [
    {
      quote: '"Jaren\'s ability to ship functional, well-designed applications is impressive. The architecture in his VR app shows real care for the end user and system stability."',
      name: 'Louiery Sincioco',
      role: 'Chief Technology Officer · VirtuIntelligence',
      initial: 'L',
      img: 'assets/images/testimonial-louiery.webp'
    },
    {
      quote: '"Working with Jaren is refreshing. He takes ownership, communicates effectively, and the code he submits is clean and functional on the first pull request."',
      name: 'Samantha Tomoling',
      role: 'Classmate & Collaborator · Holy Angel University',
      initial: 'S',
      img: 'assets/images/testimonial-samantha.webp'
    },
    {
      quote: '"Jaren built a solid web application that really exceeded what we expected. Between the clean database structure and the reliable API design, he showed he is a very capable full-stack developer who stays on schedule."',
      name: 'Kenneth Punsalan',
      role: 'Classmate & Collaborator · Holy Angel University',
      initial: 'P',
      img: 'assets/images/testimonial-prof.webp'
    },
  ];
}