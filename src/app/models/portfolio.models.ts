export interface Project {
  num: string;
  name: string;
  tags: string[];
  desc: string;
  purpose: string;
  features: string[];
  live: { name: string; url: string }[] | null;
  github: string | null;
  imgs: string[];
  subtitle: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  abbr: string;
  color: string;
  date: string;
  url: string;
}

export interface BlogPost {
  date: string;
  title: string;
  excerpt: string;
  content: string;
  img?: string; // Optional image path
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initial: string;
  placeholder?: boolean;
  img?: string; // Optional image path
}

export interface NavItem {
  label: string;
  short: string;
  index: number;
}