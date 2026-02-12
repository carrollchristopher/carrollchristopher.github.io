
export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  major: string;
  date: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}
