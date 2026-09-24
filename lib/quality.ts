import { hasText, splitLines } from "@/lib/empty-resume";
import type { ResumeData } from "@/lib/types";

export type QualityItem = {
  id: string;
  label: string;
  status: "ok" | "warning" | "missing";
  detail?: string;
};

const WEAK_VERBS =
  /\b(helped|worked on|responsible for|tried|did|made sure|various|stuff)\b/i;

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function getQualityItems(data: ResumeData): QualityItem[] {
  const items: QualityItem[] = [];
  const experienceFilled = data.experience.some(
    (item) => hasText(item.role) || hasText(item.company),
  );
  const educationFilled = data.education.some(
    (item) => hasText(item.school) || hasText(item.degree),
  );
  const skillsFilled = data.skills.some((item) => hasText(item.name));

  items.push({
    id: "contact",
    label: "Contact information",
    status: hasText(data.personal.fullName) && hasText(data.personal.email) ? "ok" : "missing",
    detail:
      hasText(data.personal.fullName) && hasText(data.personal.email)
        ? undefined
        : "Add your name and a valid email.",
  });
  items.push({
    id: "summary",
    label: "Professional summary",
    status: !hasText(data.summary)
      ? "missing"
      : wordCount(data.summary) < 30
        ? "warning"
        : "ok",
    detail:
      wordCount(data.summary) > 0 && wordCount(data.summary) < 30
        ? "Summary is short. Aim for 3–5 sentences."
        : undefined,
  });
  items.push({
    id: "experience",
    label: "Work experience",
    status: experienceFilled ? "ok" : "missing",
  });
  items.push({
    id: "education",
    label: "Education",
    status: educationFilled ? "ok" : "missing",
  });
  items.push({
    id: "skills",
    label: "Skills",
    status: skillsFilled ? "ok" : "missing",
  });

  if (!hasText(data.personal.linkedin)) {
    items.push({
      id: "linkedin",
      label: "LinkedIn",
      status: "warning",
      detail: "Missing LinkedIn URL.",
    });
  }

  const weak = data.experience.some((item) =>
    splitLines(item.bullets).some((line) => WEAK_VERBS.test(line)),
  );
  if (weak) {
    items.push({
      id: "verbs",
      label: "Experience language",
      status: "warning",
      detail: "Some experience bullets use weak verbs. Prefer measurable achievements.",
    });
  }

  if (hasText(data.targetJob.description) && data.jobAnalysis) {
    if (data.jobAnalysis.missingKeywords.length > 0) {
      items.push({
        id: "keywords",
        label: "Job keywords",
        status: "warning",
        detail: `Missing keywords: ${data.jobAnalysis.missingKeywords.slice(0, 8).join(", ")}`,
      });
    }
  }

  return items;
}
