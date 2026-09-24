import { analyzeJobDescription, getAtsReport } from "@/lib/ats";
import {
  localGenerateBullets,
  localGenerateSummary,
  localImproveExperience,
  localImproveProject,
  localImproveSummary,
  localRewriteForJob,
  localSuggestSkills,
} from "@/lib/ai/local";
import { completeJson, parseJsonObject } from "@/lib/ai/openai";
import type { ResumeData } from "@/lib/types";

export type AiAction =
  | "improve-summary"
  | "generate-summary"
  | "improve-experience"
  | "generate-bullets"
  | "improve-project"
  | "suggest-skills"
  | "analyze-job"
  | "improve-ats"
  | "rewrite-for-job";

export type AiRequest = {
  action: AiAction;
  resume: ResumeData;
  experienceId?: string;
  projectId?: string;
};

export type AiResponse = {
  result: string;
  note?: string;
  analysis?: ResumeData["jobAnalysis"];
  ats?: ReturnType<typeof getAtsReport>;
};

function stringField(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function runAiAction(request: AiRequest): Promise<AiResponse> {
  const { action, resume } = request;
  const experience = resume.experience.find((item) => item.id === request.experienceId);
  const project = resume.projects.find((item) => item.id === request.projectId);

  if (action === "analyze-job") {
    const analysis = analyzeJobDescription(resume);
    return { result: `Estimated keyword match: ${analysis.matchPercent}%`, analysis };
  }

  if (action === "improve-ats") {
    const ats = getAtsReport({ ...resume, jobAnalysis: analyzeJobDescription(resume) });
    return {
      result: ats.suggestions.join("\n"),
      note: "This is an estimated ATS review, not a guarantee.",
      ats,
      analysis: analyzeJobDescription(resume),
    };
  }

  const prompt = buildPrompt(request, experience, project);
  const model = await completeJson(prompt);
  const parsed = parseJsonObject(model.text);
  if (parsed && stringField(parsed.result)) {
    return {
      result: stringField(parsed.result),
      note: stringField(parsed.note) || undefined,
    };
  }

  switch (action) {
    case "improve-summary":
      return localImproveSummary(resume);
    case "generate-summary":
      return localGenerateSummary(resume);
    case "improve-experience":
      return localImproveExperience(experience?.description ?? "", experience?.bullets ?? "");
    case "generate-bullets":
      return localGenerateBullets(experience?.description ?? "", experience?.role ?? "");
    case "improve-project":
      return localImproveProject(project?.description ?? "");
    case "suggest-skills":
      return localSuggestSkills(resume);
    case "rewrite-for-job":
      return localRewriteForJob(resume);
    default:
      return { result: "", note: "Unknown action." };
  }
}

function buildPrompt(
  request: AiRequest,
  experience?: ResumeData["experience"][number],
  project?: ResumeData["projects"][number],
) {
  const resumeJson = JSON.stringify({
    personal: request.resume.personal,
    summary: request.resume.summary,
    experience: request.resume.experience,
    education: request.resume.education,
    skills: request.resume.skills,
    projects: request.resume.projects,
    targetJob: request.resume.targetJob,
  });

  const task: Record<AiAction, string> = {
    "improve-summary": "Rewrite the existing summary. If empty, return note asking for a draft. JSON: {result, note?}",
    "generate-summary": "Write a summary using only provided title, skills, and experience. If too little info, result empty and note what is missing. JSON: {result, note?}",
    "improve-experience": `Improve this experience without adding employers or dates. Experience: ${JSON.stringify(experience)}. JSON: {result} where result is improved bullets, one per line.`,
    "generate-bullets": `Create achievement-focused bullets from the user's description only. Experience: ${JSON.stringify(experience)}. JSON: {result} bullets one per line.`,
    "improve-project": `Improve project description without inventing tech. Project: ${JSON.stringify(project)}. JSON: {result}`,
    "suggest-skills": "Suggest skills that appear in the target job and are plausible given the resume. Never insist the user has them. JSON: {result} one skill per line, {note}",
    "analyze-job": "unused",
    "improve-ats": "unused",
    "rewrite-for-job": "Rewrite the summary for the target job using only existing facts. JSON: {result, note}",
  };

  return `${task[request.action]}\nResume JSON:\n${resumeJson}`;
}
