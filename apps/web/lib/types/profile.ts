export interface LocalizedText {
  es: string;
  en: string;
}

export interface Skill {
  name: string;
  relevance: number;
}

export interface ProcessStep {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  details: LocalizedText;
}

export interface Education {
  degree: LocalizedText;
  school: string;
  period: string;
}

export interface Profile {
  id: string;
  bio: LocalizedText;
  bioPersonal: LocalizedText;
  location: LocalizedText;
  skills: Skill[];
  process: ProcessStep[];
  experience: Experience[];
  education: Education[];
  languages: string[];
}
