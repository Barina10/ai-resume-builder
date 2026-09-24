import { NextResponse } from "next/server";
import { runAiAction } from "@/lib/ai/actions";
import { createEmptyResume } from "@/lib/empty-resume";

// Optional: set OPENAI_API_KEY in .env.local to use a real model. Without it, a local rewrite is used.

type ImproveRequest = {
  summary?: string;
  jobTitle?: string;
};

export async function POST(request: Request) {
  let body: ImproveRequest = {};
  try {
    body = (await request.json()) as ImproveRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const resume = createEmptyResume();
  resume.summary = typeof body.summary === "string" ? body.summary : "";
  resume.personal.title = typeof body.jobTitle === "string" ? body.jobTitle : "";

  const result = await runAiAction({ action: "improve-summary", resume });
  if (!result.result) {
    return NextResponse.json({ error: result.note || "Could not improve the summary." }, { status: 400 });
  }
  return NextResponse.json({ improved: result.result });
}
