// Personal record content for the brutalist editorial homepage.
// Real content seeded from Jose's CV (Apr 2026) and stated current focus.
// WHY entries are drafted in his voice — refine wording any time.

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
  key: string;
  co: string;
  mark: string;
  accent: string;
  logo: string;
  loc: string;
  from: string;
  to: string;
  role: string;
  body: string;
}

export interface OssEntry {
  repo: string;
  stars: number;
  lang: string;
  desc: string;
}

export interface WritingEntry {
  slug: string;
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

export interface AffiliationEntry {
  name: string;
  email: string;
  tag: string;
}

export interface JoriusData {
  name: string;
  handle: string;
  role: string;
  locale: string;
  years: number;
  email: string;
  affiliations: AffiliationEntry[];
  status: string;
  pgp: {
    fingerprint: string;
    keyId: string;
    algo: string;
  };
  whatsapp: string;
  links: {
    github: string;
    linkedin: string;
    stackoverflow: string;
  };
  now: NowEntry[];
  services: ServiceEntry[];
  experience: ExperienceEntry[];
  oss: OssEntry[];
  writing: WritingEntry[];
  testimonials: TestimonialEntry[];
  hire_why: HireWhyEntry[];
}

export const JORIUS: JoriusData = {
  name: 'Jose Ríos',
  handle: 'jorius',
  role: 'Senior full-stack engineer / technical lead',
  locale: 'Medellín → remote',
  years: 10,
  email: 'josed.riosc@gmail.com',
  affiliations: [],
  status: 'Open to roles · Q3 2026',
  pgp: {
    fingerprint: '5C63 48A7 862E 4138 372F  28CC 3656 0282 0FC1 B86C',
    keyId: '0x365602820FC1B86C',
    algo: 'ed25519',
  },
  whatsapp: '+57 301 393 02 89',
  links: {
    github: 'https://github.com/jorius',
    linkedin: 'https://www.linkedin.com/in/jose-rios-4ab123163/',
    stackoverflow: 'https://es.stackoverflow.com/users/18771/jorius',
  },
  now: [
    { k: 'writing', v: 'a sci-fi novel of my own — first draft, slow and steady' },
    { k: 'building', v: 'a 2D game set in the same sci-fi universe' },
    { k: 'looking', v: 'open to my next role — full-stack or security-focused, remote' },
    { k: 'home', v: 'raising a family and 4 demanding cats' },
    { k: 'co-founding', v: 'a small studio with a friend — custom software + SaaS' },
  ],
  services: [
    {
      id: '01',
      title: 'Full-stack delivery',
      body: 'Shipping production web apps end-to-end. TypeScript, React, Next.js, Node/NestJS, AWS Lambda, well-typed API boundaries, boring infra that wakes nobody up at 3am.',
      stack: ['TypeScript', 'React', 'Next.js', 'Node', 'AWS', 'Postgres'],
    },
    {
      id: '02',
      title: 'AppSec & pentesting',
      body: 'Application security reviews, manual penetration testing, and threat modeling for auth flows, session handling, and data-access layers. I read code, attack the app, write a report, then sit with your team until the fixes land.',
      stack: ['OWASP', 'OAuth/OIDC', 'Threat-modeling', 'Burp', 'Semgrep'],
    },
    {
      id: '03',
      title: 'Technical leadership',
      body: 'Fractional staff engineer for teams of 3–15. Architecture reviews, hiring loops, mentoring, unblocking the hard thing nobody wants to touch. Cross-timezone delivery between LATAM and U.S. teams.',
      stack: ['RFCs', 'Review', 'Hiring', 'Mentoring', 'Roadmaps'],
    },
  ],
  experience: [
    {
      key: 'perficient_current',
      co: 'Perficient',
      mark: 'P',
      accent: '#CE1E20',
      logo: '/images/perficient_logo.png',
      loc: 'Medellín, Colombia',
      from: 'Dec 2025',
      to: 'Present',
      role: 'Senior Technical Consultant',
      body: 'Leading technical delivery of insurance and caregiver workflows for a U.S. health services client. Architected and implemented solutions across the JS/TS stack and coordinated across time zones with distributed American engineering teams.',
    },
    {
      key: 'celerik_recent',
      co: 'Celerik',
      mark: 'C',
      accent: '#0F132A',
      logo: '/images/celerik_logo.png',
      loc: 'Medellín, Colombia',
      from: 'Nov 2024',
      to: 'Dec 2025',
      role: 'Senior Software Developer & Technical Lead',
      body: 'Led two JS/TS teams (8 mid-level + junior engineers). Owned full-stack architecture: NestJS / Node REST APIs, React frontends from Figma, relational + non-relational data modeling. Built and maintained Azure DevOps CI/CD pipelines across multiple concurrent client projects. Mentored engineers and standardized delivery practices across teams.',
    },
    {
      key: 'perficient',
      co: 'Perficient Latin America',
      mark: 'P',
      accent: '#CE1E20',
      logo: '/images/perficient_logo.png',
      loc: 'Medellín, Colombia',
      from: 'Oct 2021',
      to: 'Nov 2024',
      role: 'Full-Stack Software Analyst',
      body: 'Built serverless Node.js microservices on AWS Lambda for RTS ProTransport, a major U.S. trucking and logistics platform. Developed and helped architect ReactJS web applications for the same client. Provided architecture guidance for React Native mobile projects.',
    },
    {
      key: 'globant',
      co: 'Globant',
      mark: 'G',
      accent: '#A4CC3A',
      logo: '/images/globant_logo.png',
      loc: 'Remote',
      from: 'Nov 2020',
      to: 'Oct 2021',
      role: 'Web UI Developer (Ssr)',
      body: "Developed and maintained ReactJS applications for OpenBank's loans and mortgages team. Integrated frontends with the bank's core lending systems. Contributed to front-end architecture decisions across the product.",
    },
    {
      key: 'celerik_2019',
      co: 'Celerik',
      mark: 'C',
      accent: '#0F132A',
      logo: '/images/celerik_logo.png',
      loc: 'Medellín, Colombia',
      from: 'Jan 2019',
      to: 'Nov 2020',
      role: 'Front-End Lead Developer',
      body: 'Led development of GAIA, a geospatial cluster-mapping platform visualizing deforestation, mining, and other environmental data layers. Designed and managed the PostgreSQL + PostGIS data architecture backing the mapping engine. Owned front-end architecture across multiple concurrent client engagements.',
    },
    {
      key: 'comtic',
      co: 'COMTIC S.A.S',
      mark: 'C',
      accent: '#6B7280',
      logo: '/images/comtic_logo.jpeg',
      loc: 'Medellín, Colombia',
      from: '2015',
      to: '2017',
      role: 'Full-Stack Developer',
      body: 'Designed, modeled, and administered relational databases in MySQL and PostgreSQL. Administered Linux servers on DigitalOcean and Heroku. Developed and maintained web applications in PHP with CodeIgniter and Laravel.',
    },
  ],
  oss: [
    // Legacy fallback list — BOssWriting now hydrates from the GitHub API via
    // useGitHubRepos. Kept here as a safety net if the API is rate-limited or
    // offline; harmless empty array means the section just shows a loader/error.
  ],
  // Writing entries are intentionally empty until a real CMS (Strapi or
  // similar) is wired up. Don't seed AI-drafted blog posts here.
  writing: [],
  testimonials: [],
  hire_why: [
    { n: '01', h: 'I ship.', b: 'Ten years across six engagements. Every quarter has had something live in production — fintech, geospatial, logistics, lending.' },
    { n: '02', h: 'I write it down.', b: 'Architecture notes, ADRs, READMEs your next hire can actually read. The CV literally says "documentation that outlives the project" — it earned its place.' },
    { n: '03', h: 'Greenfield or legacy, I show up the same.', b: 'Equally happy architecting from scratch and diving into a tangled codebase to unblock the team. Both happen on every engagement.' },
    { n: '04', h: 'I work across time zones.', b: 'Years of distributed delivery between LATAM and U.S. teams. Async-first by habit, sync when it actually moves the work.' },
  ],
};
