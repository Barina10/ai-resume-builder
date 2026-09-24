import { improveSummaryLocal } from "@/lib/improve-summary-local";
import { analyzeJobDescription } from "@/lib/ats";
import { hasText, splitLines } from "@/lib/empty-resume";
import type { ResumeData } from "@/lib/types";

function factsFromResume(data: ResumeData) {
  const roles = data.experience
    .filter((item) => hasText(item.role) || hasText(item.company))
    .map((item) =>
      [item.role, item.company, item.description, splitLines(item.bullets).join("; ")]
        .filter(hasText)
        .join(" — "),
    );
  const skills = data.skills.map((skill) => skill.name).filter(hasText);
  return { roles, skills, title: data.personal.title };
}

export function localImproveSummary(data: ResumeData) {
  if (!hasText(data.summary) && !hasText(data.personal.title) && factsFromResume(data).roles.length === 0) {
    return {
      result: "",
      note: "Add a job title or a few experience highlights first. A summary should not be invented.",
    };
  }
  return { result: improveSummaryLocal(data.summary, data.personal.title || data.targetJob.title) };
}

export function localGenerateSummary(data: ResumeData) {
  const facts = factsFromResume(data);
  if (!facts.title && facts.roles.length === 0 && facts.skills.length === 0) {
    return {
      result: "",
      note: "Add a professional title, skills, or work experience before generating a summary.",
    };
  }
  const title = facts.title || data.targetJob.title || "professional";
  const skillText = facts.skills.slice(0, 6).join(", ");
  const roleText = facts.roles[0] || "relevant professional experience";
  return {
    result: `Accomplished ${title} with experience in ${roleText}. ${
      skillText ? `Core skills include ${skillText}. ` : ""
    }Known for delivering clear, high-quality work and collaborating across teams.`,
  };
}

export function localImproveExperience(description: string, bullets: string) {
  const source = [description, bullets].filter(hasText).join("\n");
  if (!hasText(source)) {
    return { result: "", note: "Add a description or bullets first. Experience cannot be invented." };
  }
  const improved = splitLines(source)
    .map((line) =>
      line
        .replace(/\bhelped\b/gi, "supported")
        .replace(/\bresponsible for\b/gi, "owned")
        .replace(/\bworked on\b/gi, "delivered"),
    )
    .join("\n");
  return { result: improved };
}

export function localGenerateBullets(description: string, role: string) {
  if (!hasText(description) && !hasText(role)) {
    return { result: "", note: "Describe what you actually did in this role, then generate bullets." };
  }
  const lines = splitLines(description);
  if (lines.length) {
    return {
      result: lines
        .map((line) => `Delivered ${line.charAt(0).toLowerCase()}${line.slice(1)}`.replace(/\.$/, ""))
        .join("\n"),
    };
  }
  return {
    result: `Contributed as ${role} with a focus on clear execution and collaboration.\nImproved team outcomes by documenting work and following through on commitments.`,
  };
}

export function localImproveProject(description: string) {
  if (!hasText(description)) {
    return { result: "", note: "Add a project description first." };
  }
  return {
    result: description
      .replace(/\bI\b/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (letter) => letter.toUpperCase()),
  };
}

export function localSuggestSkills(data: ResumeData) {
  const analysis = analyzeJobDescription(data);
  const existing = new Set(data.skills.map((skill) => skill.name.trim().toLowerCase()).filter(Boolean));
  const suggestions = analysis.missingKeywords
    .filter((keyword) => !existing.has(keyword.toLowerCase()))
    .slice(0, 8);
  return {
    result: suggestions.join("\n"),
    note: suggestions.length
      ? "These are keywords from the job posting. Add only skills you actually have."
      : "Add a target job description, or more resume content, to get skill suggestions.",
  };
}

export function localRewriteForJob(data: ResumeData) {
  const analysis = analyzeJobDescription(data);
  const title = data.targetJob.title || data.personal.title;
  if (!hasText(data.summary) && !hasText(title)) {
    return { result: "", note: "Add a summary or target job title first." };
  }
  const keywords = analysis.keywords.slice(0, 6).join(", ");
  const base = hasText(data.summary)
    ? improveSummaryLocal(data.summary, title)
    : localGenerateSummary(data).result;
  return {
    result: keywords ? `${base} Familiar with ${keywords}.` : base,
    note: "Review every keyword before accepting. Do not claim skills you do not have.",
  };
}
