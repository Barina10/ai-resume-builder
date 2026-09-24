import { hasText } from "@/lib/empty-resume";
import type { ResumeData } from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldError = {
  path: string;
  message: string;
};

export function validateResume(data: ResumeData): FieldError[] {
  const errors: FieldError[] = [];

  if (!hasText(data.personal.fullName)) {
    errors.push({ path: "personal.fullName", message: "Add your full name." });
  }
  if (hasText(data.personal.email) && !EMAIL_PATTERN.test(data.personal.email.trim())) {
    errors.push({ path: "personal.email", message: "Enter a valid email address." });
  }

  const skillNames = new Set<string>();
  data.skills.forEach((skill, index) => {
    const name = skill.name.trim().toLowerCase();
    if (!name) return;
    if (skillNames.has(name)) {
      errors.push({ path: `skills.${index}`, message: `"${skill.name}" is listed twice.` });
    }
    skillNames.add(name);
  });

  data.experience.forEach((item, index) => {
    const hasContent =
      hasText(item.role) ||
      hasText(item.company) ||
      hasText(item.description) ||
      hasText(item.bullets);
    if (!hasContent) {
      errors.push({
        path: `experience.${index}`,
        message: "This experience entry is empty. Add details or remove it.",
      });
    }
    if (hasText(item.startDate) && hasText(item.endDate) && !item.current) {
      if (item.endDate < item.startDate) {
        errors.push({
          path: `experience.${index}.dates`,
          message: "End date should be after the start date.",
        });
      }
    }
  });

  return errors;
}

export function errorFor(errors: FieldError[], path: string) {
  return errors.find((error) => error.path === path)?.message;
}
