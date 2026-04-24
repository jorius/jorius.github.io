// Personal record content for the brutalist editorial homepage.
// Placeholder voice copy lifted from the Claude Design handoff;
// swap any field with the real version when it lands.

export interface NowEntry {
  k: string;
  v: string;
}

export interface ServiceEntry {
  id: string;
  title: string;
  body: string;
  stack: string[];
}

export interface ExperienceEntry {
  co: string;
  mark: string;
  accent: string;
  loc: string;
  from: string;
  to: string;
  role: string;
  body: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  tag: string;
  year: string;
  stack: string[];
  body: string;
}

export interface OssEntry {
  repo: string;
  stars: number;
  lang: string;
  desc: string;
}

export interface WritingEntry {
  date: string;
  title: string;
  len: string;
  tag: string;
}

export interface TestimonialEntry {
  who: string;
  role: string;
  body: string;
}

export interface HireWhyEntry {
  n: string;
  h: string;
  b: string;
}

export interface JoriusData {
  name: string;
  handle: string;
  role: string;
  locale: string;
  years: number;
  email: string;
  status: string;
  pgp: string;
  now: NowEntry[];
  services: ServiceEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  oss: OssEntry[];
  writing: WritingEntry[];
  testimonials: TestimonialEntry[];
  hire_why: HireWhyEntry[];
}

export const JORIUS: JoriusData = {
  name: 'Jorius',
  handle: 'jorius',
  role: 'Full-stack engineer / security consultant',
  locale: 'Bogotá → remote',
  years: 10,
  email: 'hi@jorius.dev',
  status: 'Open to contracts · Q3 2026',
  pgp: '0xF3A1 8B29 4C77 D0E2',
  now: [
    { k: 'contracting', v: 'hardening auth flows at a Series B fintech' },
    { k: 'writing', v: 'a long-form piece on OAuth device-flow pitfalls' },
    { k: 'reading', v: 'Designing Data-Intensive Applications, 2nd ed.' },
    { k: 'city', v: 'Medellín (GMT-5) — back in Bogotá next month' },
    { k: 'listening', v: 'Aphex Twin, Selected Ambient Works Vol. II' },
  ],
  services: [
    {
      id: '01',
      title: 'Full-stack delivery',
      body: 'Shipping production web apps end-to-end. TypeScript, Go, Postgres, well-typed API boundaries, boring infra that wakes nobody up at 3am.',
      stack: ['TypeScript', 'Go', 'Postgres', 'Next.js', 'Terraform'],
    },
    {
      id: '02',
      title: 'Security review',
      body: 'Independent audits of auth, session handling, and data-access layers. I read code, write a report, sit with your team until the fixes land.',
      stack: ['OWASP', 'OAuth/OIDC', 'Threat-modeling', 'Burp', 'Semgrep'],
    },
    {
      id: '03',
      title: 'Technical leadership',
      body: 'Fractional staff engineer for teams of 3–15. Architecture reviews, hiring loops, unblocking the hard thing nobody wants to touch.',
      stack: ['RFCs', 'Review', 'Hiring', 'Mentoring', 'Roadmaps'],
    },
  ],
  experience: [
    {
      co: 'Perficient',
      mark: 'P',
      accent: '#E14B3A',
      loc: 'USA / remote',
      from: 'Nov 2025',
      to: 'Present',
      role: 'Senior Technical Consultant',
      body: 'Leading technical consulting engagements and software architecture for enterprise clients. Specialized in cloud-native solutions and modern JavaScript frameworks.',
    },
    {
      co: 'Celerik',
      mark: 'C',
      accent: '#F08A1C',
      loc: 'Colombia / remote',
      from: 'Nov 2024',
      to: 'Jan 2026',
      role: 'Senior Software Developer & Technical Lead',
      body: 'Leading technically and humanly a couple of teams within the JavaScript and TypeScript ecosystem to build large-scale applications. Software architecture and software development overall as a Full-Stack.',
    },
    {
      co: 'Perficient',
      mark: 'P',
      accent: '#E14B3A',
      loc: 'USA / remote',
      from: 'Oct 2021',
      to: 'Nov 2024',
      role: 'Full-Stack Software Analyst',
      body: 'Microservices and software development in NodeJS with lambda serverless architecture in AWS. Software development and maintenance of web applications in ReactJS. Architecture support for React Native projects.',
    },
    {
      co: 'Globant',
      mark: 'G',
      accent: '#9BCB3A',
      loc: 'Argentina / remote',
      from: 'Nov 2020',
      to: 'Oct 2021',
      role: 'Web UI Developer Ssr',
      body: 'Software development, maintenance and architecture support of web applications in ReactJS.',
    },
  ],
  projects: [
    { id: 'otter', title: 'Otter', tag: 'Auth platform', year: '2025', stack: ['Go', 'Postgres', 'Redis'], body: 'Drop-in OIDC provider for small teams. Open-source core, hosted offering pays the bills.' },
    { id: 'calathea', title: 'Calathea', tag: 'E-commerce / iOS', year: '2024', stack: ['Swift', 'Node', 'Stripe'], body: 'Boutique plant-shop app. 12k MAU, rated 4.8. Built in three months with one designer.' },
    { id: 'mamboo', title: 'Mamboo', tag: 'Security dashboard', year: '2024', stack: ['TypeScript', 'Rust', 'WASM'], body: 'Real-time threat-intel dashboard for a regional MSSP. WASM-powered log query engine.' },
    { id: 'glastrade', title: 'Glastrade', tag: 'Trading tools', year: '2023', stack: ['Python', 'FastAPI', 'Kafka'], body: 'Order-book analytics for an independent commodities desk. Numbers that move, responsibly.' },
    { id: 'bayes', title: 'Bayes rural', tag: 'Lending platform', year: '2023', stack: ['TypeScript', 'Go'], body: 'Loan-origination tooling for rural cooperatives. 40% faster underwriting, 0% fraud incidents to date.' },
    { id: 'ghostport', title: 'Ghostport', tag: 'OSS CLI', year: '2022', stack: ['Rust'], body: 'Port-scanner that respects robots.txt for the internet. 4.2k stars, used by a few CERTs I can\'t name.' },
  ],
  oss: [
    { repo: 'jorius/otter', stars: 2140, lang: 'Go', desc: 'Small-team OIDC provider. Batteries included, footguns removed.' },
    { repo: 'jorius/ghostport', stars: 4210, lang: 'Rust', desc: 'Polite port-scanner for the open web.' },
    { repo: 'jorius/dotfiles', stars: 380, lang: 'Shell', desc: 'Neovim, tmux, zsh. Works on a fresh machine in 90s.' },
    { repo: 'jorius/semgrep-oauth', stars: 612, lang: 'YAML', desc: 'Semgrep ruleset for common OAuth/OIDC footguns.' },
    { repo: 'jorius/postgres-isolation-demo', stars: 190, lang: 'SQL', desc: 'Tiny repo demonstrating every isolation anomaly, with tests.' },
  ],
  writing: [
    { date: '2026-03-14', title: 'The OAuth device flow is quietly a mess', len: '18 min', tag: 'security' },
    { date: '2026-02-02', title: 'Boring Postgres at 10k QPS', len: '11 min', tag: 'databases' },
    { date: '2025-11-30', title: 'You probably don\'t need a queue', len: '7 min', tag: 'architecture' },
    { date: '2025-09-08', title: 'How I interview: a 90-minute pairing problem', len: '14 min', tag: 'hiring' },
    { date: '2025-06-21', title: 'Notes on shipping to Latin American enterprise', len: '22 min', tag: 'consulting' },
  ],
  testimonials: [
    { who: 'Pavel S.', role: 'CTO, Otter', body: 'Jorius found a session-fixation bug we\'d shipped to production two years earlier. Calmly. On a Tuesday. Hire him.' },
    { who: 'María José R.', role: 'VP Eng, Perficient client', body: 'The rare consultant who leaves the codebase in better shape than he found it. We still follow his testing conventions.' },
    { who: 'Andrés G.', role: 'Founder, Mamboo', body: 'Shipped in six weeks what we\'d failed to ship in six months. Didn\'t oversell. Didn\'t over-engineer.' },
  ],
  hire_why: [
    { n: '01', h: 'I ship.', b: 'Ten years, zero quarters without something in production.' },
    { n: '02', h: 'I write it down.', b: 'Every engagement ends with an RFC your next hire can actually read.' },
    { n: '03', h: 'I don\'t oversell.', b: 'If a library solves your problem, I\'ll tell you. Then send a smaller invoice.' },
    { n: '04', h: 'I stay.', b: 'Most engagements run 6+ months. Three of my clients have hired me twice.' },
  ],
};
