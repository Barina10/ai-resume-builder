import { createId } from "@/lib/id";
import type {
  AwardEntry,
  CertificationEntry,
  Customization,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  ProjectEntry,
  ResumeData,
  SkillEntry,
} from "@/lib/types";

export function createEducation(): EducationEntry {
  return {
    id: createId(),
    school: "",
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
    details: "",
  };
}

export function createExperience(): ExperienceEntry {
  return {
    id: createId(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: "",
  };
}

export function createSkill(): SkillEntry {
  return { id: createId(), name: "", level: "" };
}

export function createProject(): ProjectEntry {
  return {
    id: createId(),
    name: "",
    description: "",
    technologies: "",
    link: "",
    highlights: "",
  };
}

export function createCertification(): CertificationEntry {
  return { id: createId(), name: "", issuer: "", year: "", url: "" };
}

export function createLanguage(): LanguageEntry {
  return { id: createId(), name: "", proficiency: "" };
}

export function createAward(): AwardEntry {
  return { id: createId(), title: "", organization: "", date: "", description: "" };
}

export const defaultCustomization: Customization = {
  font: "sans",
  fontSize: "md",
  headingStyle: "uppercase",
  accentColor: "#0f172a",
  spacing: "normal",
  margins: "normal",
};

export function createEmptyResume(): ResumeData {
  return {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photo: "",
    },
    summary: "",
    education: [createEducation()],
    experience: [createExperience()],
    skills: [createSkill()],
    projects: [createProject()],
    certifications: [createCertification()],
    languages: [createLanguage()],
    awards: [createAward()],
    targetJob: { title: "", description: "" },
    jobAnalysis: null,
    template: "classic",
    customization: { ...defaultCustomization },
  };
}

export function normalizeResumeData(input: Partial<ResumeData> | undefined): ResumeData {
  const base = createEmptyResume();
  if (!input) return base;
  const template =
    input.template === "modern" ||
    input.template === "minimal" ||
    input.template === "executive" ||
    input.template === "classic"
      ? input.template
      : "classic";
  return {
    ...base,
    ...input,
    personal: { ...base.personal, ...input.personal },
    education: input.education?.length ? input.education.map((item) => ({ ...createEducation(), ...item })) : base.education,
    experience: input.experience?.length
      ? input.experience.map((item) => ({ ...createExperience(), ...item }))
      : base.experience,
    skills: input.skills?.length ? input.skills.map((item) => ({ ...createSkill(), ...item })) : base.skills,
    projects: input.projects?.length ? input.projects.map((item) => ({ ...createProject(), ...item })) : base.projects,
    certifications: input.certifications?.length
      ? input.certifications.map((item) => ({ ...createCertification(), ...item }))
      : base.certifications,
    languages: input.languages?.length
      ? input.languages.map((item) => ({ ...createLanguage(), ...item }))
      : base.languages,
    awards: input.awards?.length ? input.awards.map((item) => ({ ...createAward(), ...item })) : base.awards,
    targetJob: { ...base.targetJob, ...input.targetJob },
    jobAnalysis: input.jobAnalysis ?? null,
    template,
    customization: { ...base.customization, ...input.customization },
  };
}

export function hasText(value: string | undefined | null) {
  return Boolean(value?.trim());
}

export function splitLines(value: string | undefined) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

export function formatDateRange(startDate: string, endDate: string, current?: boolean) {
  const start = startDate.trim();
  const end = current ? "Present" : endDate.trim();
  if (start && end) return `${start} – ${end}`;
  return start || end;
}
