
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  date: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  date: string;
}

export interface Skill {
    category: string;
    items: string[];
}

export interface CustomSection {
    title: string;
    content: string; // Using simple string content for flexibility
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  customSections?: CustomSection[];
}
