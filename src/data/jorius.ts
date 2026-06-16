// Personal record content for the brutalist editorial homepage.
// Real content seeded from Jose's CV (Apr 2026) and stated current focus.
// WHY entries are drafted in his voice — refine wording any time.

export interface ExperienceEntry {
  key: string;
  co: string;
  mark: string;
  accent: string;
  logo: string;
  loc: string;
  from: string;
  to: string;
}

export interface TestimonialEntry {
  who: string;
  role: string;
  body: string;
}

export interface HireWhyEntry {
  n: string;
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
  experience: ExperienceEntry[];
  testimonials: TestimonialEntry[];
  hire_why: HireWhyEntry[];
}

export const JORIUS: JoriusData = {
  name: 'Jose Ríos',
  handle: 'jorius',
  role: 'Senior full-stack engineer / technical lead',
  locale: 'Colombia → remote',
  years: 10,
  email: 'josed.riosc@gmail.com',
  affiliations: [],
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
  experience: [
    {
      key: 'perficient_current',
      co: 'Perficient',
      mark: 'P',
      accent: '#CE1E20',
      logo: '/images/perficient_logo.png',
      loc: 'Colombia',
      from: 'Dec 2025',
      to: 'Present',
    },
    {
      key: 'celerik_recent',
      co: 'Celerik',
      mark: 'C',
      accent: '#0F132A',
      logo: '/images/celerik_logo.png',
      loc: 'Colombia',
      from: 'Nov 2024',
      to: 'Dec 2025',
    },
    {
      key: 'perficient',
      co: 'Perficient Latin America',
      mark: 'P',
      accent: '#CE1E20',
      logo: '/images/perficient_logo.png',
      loc: 'Colombia',
      from: 'Oct 2021',
      to: 'Nov 2024',
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
    },
    {
      key: 'celerik_2019',
      co: 'Celerik',
      mark: 'C',
      accent: '#0F132A',
      logo: '/images/celerik_logo.png',
      loc: 'Colombia',
      from: 'Jan 2019',
      to: 'Nov 2020',
    },
    {
      key: 'comtic',
      co: 'COMTIC S.A.S',
      mark: 'C',
      accent: '#6B7280',
      logo: '/images/comtic_logo.jpeg',
      loc: 'Colombia',
      from: '2015',
      to: '2017',
    },
  ],
  testimonials: [],
  hire_why: [
    { n: '01' },
    { n: '02' },
    { n: '03' },
    { n: '04' },
  ],
};
