import { hasText } from "@/lib/empty-resume";
import type { JobAnalysis, ResumeData } from "@/lib/types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "the",
  "to",
  "of",
  "in",
  "for",
  "with",
  "on",
  "or",
  "as",
  "by",
  "at",
  "is",
  "are",
  "be",
  "our",
  "you",
  "we",
  "will",
  "this",
  "that",
  "from",
  "your",
  "their",
  "have",
  "has",
  "able",
  "using",
  "use",
  "into",
  "across",
  "about",
  "such",
  "other",
  "more",
  "than",
  "including",
  "work",
  "role",
  "team",
  "experience",
  "years",
  "year",
  "job",
  "position",
]);

const SKILL_HINTS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node",
  "python",
  "java",
  "sql",
  "aws",
  "azure",
  "gcp",
  "figma",
  "excel",
  "salesforce",
  "project management",
  "communication",
  "leadership",
  "agile",
  "scrum",
  "css",
  "html",
  "docker",
  "kubernetes",
  "git",
  "ci/cd",
  "machine learning",
  "data analysis",
  "customer service",
  "product management",
  "ux",
  "ui",
  "research",
  "stakeholder",
];

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\s-]/g, " ")
    .split(/[\s,/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function resumeCorpus(data: ResumeData) {
  const parts = [
    data.personal.title,
    data.summary,
    ...data.skills.map((skill) => skill.name),
    ...data.experience.flatMap((item) => [
      item.role,
      item.company,
      item.description,
      item.bullets,
    ]),
    ...data.projects.flatMap((item) => [item.name, item.description, item.technologies]),
    ...data.education.flatMap((item) => [item.degree, item.school, item.details]),
  ];
  return parts.filter(hasText).join(" ").toLowerCase();
}

export function analyzeJobDescription(data: ResumeData): JobAnalysis {
  const description = data.targetJob.description;
  if (!hasText(description)) {
    return {
      keywords: [],
      requiredSkills: [],
      preferredSkills: [],
      missingKeywords: [],
      matchPercent: 0,
      suggestions: ["Paste a job description to estimate keyword match."],
    };
  }

  const tokens = tokenize(description);
  const freq = new Map<string, number>();
  for (const token of tokens) freq.set(token, (freq.get(token) ?? 0) + 1);

  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([word]) => word);

  const lower = description.toLowerCase();
  const requiredSkills = SKILL_HINTS.filter(
    (skill) =>
      lower.includes(skill) &&
      /(required|must|need|minimum|proficien)/i.test(description),
  );
  const preferredSkills = SKILL_HINTS.filter(
    (skill) => lower.includes(skill) && !requiredSkills.includes(skill),
  );

  const corpus = resumeCorpus(data);
  const missingKeywords = unique(
    [...keywords, ...requiredSkills, ...preferredSkills].filter(
      (keyword) => !corpus.includes(keyword.toLowerCase()),
    ),
  ).slice(0, 12);

  const tracked = unique([...keywords, ...requiredSkills, ...preferredSkills]);
  const matched = tracked.filter((keyword) => corpus.includes(keyword.toLowerCase()));
  const matchPercent = tracked.length
    ? Math.round((matched.length / tracked.length) * 100)
    : 0;

  const suggestions: string[] = [];
  if (missingKeywords.length) {
    suggestions.push(
      "Only add a missing keyword if it is a skill or tool you actually have. Do not invent experience.",
    );
    suggestions.push(
      `Consider whether you can honestly include: ${missingKeywords.slice(0, 6).join(", ")}.`,
    );
  } else {
    suggestions.push("Keyword coverage looks strong for this posting.");
  }
  if (!hasText(data.summary)) {
    suggestions.push("Add a professional summary that uses the target job title.");
  }

  return {
    keywords,
    requiredSkills: requiredSkills.length ? requiredSkills : preferredSkills.slice(0, 6),
    preferredSkills,
    missingKeywords,
    matchPercent,
    suggestions,
  };
}

export type AtsReport = {
  score: number;
  matchPercent: number;
  wordCount: number;
  missingKeywords: string[];
  skillsDetected: string[];
  warnings: string[];
  suggestions: string[];
};

export function getAtsReport(data: ResumeData): AtsReport {
  const analysis = data.jobAnalysis ?? analyzeJobDescription(data);
  const skillsDetected = data.skills.map((skill) => skill.name.trim()).filter(Boolean);
  const text = [data.summary, ...data.experience.map((item) => item.bullets)].join(" ");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (data.personal.photo && data.template === "classic") {
    warnings.push("Classic ATS template hides photos, which is usually safer for parsers.");
  }
  if (wordCount < 120) {
    warnings.push("Resume content looks short. Add more achievement-focused bullets.");
  }
  if (wordCount > 900) {
    warnings.push("Resume may be too long for a one- or two-page ATS parse.");
  }
  if (!hasText(data.personal.email)) {
    warnings.push("Email is missing from contact information.");
  }
  if (analysis.missingKeywords.length) {
    suggestions.push("Review missing keywords and add only those you truly have.");
  }
  suggestions.push("This ATS score is an estimate, not a guarantee that a parser will accept the file.");

  const completeness =
    (hasText(data.personal.fullName) ? 15 : 0) +
    (hasText(data.personal.email) ? 10 : 0) +
    (hasText(data.summary) ? 15 : 0) +
    (data.experience.some((item) => hasText(item.role)) ? 20 : 0) +
    (skillsDetected.length ? 10 : 0) +
    (data.education.some((item) => hasText(item.school) || hasText(item.degree)) ? 10 : 0);
  const keywordScore = Math.round(analysis.matchPercent * 0.2);
  const score = Math.min(100, completeness + keywordScore);

  return {
    score,
    matchPercent: analysis.matchPercent,
    wordCount,
    missingKeywords: analysis.missingKeywords,
    skillsDetected,
    warnings,
    suggestions,
  };
}
