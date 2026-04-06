export interface LocalizedText {
  es: string;
  en: string;
}

export interface ProjectTestimonial {
  quote: LocalizedText;
  author: string;
  role: string;
}

export interface Project {
  title: string;
  slug: string;
  shortDescription: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  techStack: string[];
  screenshots: string[];
  results: LocalizedText;
  testimonial: ProjectTestimonial | null;
  url: string;
  featured: boolean;
}
