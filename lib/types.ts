export type ResumeTemplateId = "classic" | "modern" | "minimal" | "executive";

export type FontFamily = "sans" | "serif";
export type FontSize = "sm" | "md" | "lg";
export type HeadingStyle = "uppercase" | "title" | "plain";
export type SpacingScale = "compact" | "normal" | "relaxed";
export type MarginScale = "narrow" | "normal" | "wide";

export type PersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string;
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string;
};

export type SkillLevel = "" | "beginner" | "intermediate" | "advanced" | "expert";

export type SkillEntry = {
  id: string;
  name: string;
  level: SkillLevel;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  highlights: string;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string;
};

export type LanguageEntry = {
  id: string;
  name: string;
  proficiency: string;
};

export type AwardEntry = {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
};

export type TargetJob = {
  title: string;
  description: string;
};

export type JobAnalysis = {
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  missingKeywords: string[];
  matchPercent: number;
  suggestions: string[];
};

export type Customization = {
  font: FontFamily;
  fontSize: FontSize;
  headingStyle: HeadingStyle;
  accentColor: string;
  spacing: SpacingScale;
  margins: MarginScale;
};

export type ResumeData = {
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  targetJob: TargetJob;
  jobAnalysis: JobAnalysis | null;
  template: ResumeTemplateId;
  customization: Customization;
};

export type StoredResume = {
  id: string;
  name: string;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
};
