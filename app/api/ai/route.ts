import { NextResponse } from "next/server";
import { runAiAction, type AiAction, type AiRequest } from "@/lib/ai/actions";

const ACTIONS = new Set<AiAction>([
  "improve-summary",
  "generate-summary",
  "improve-experience",
  "generate-bullets",
  "improve-project",
  "suggest-skills",
  "analyze-job",
  "improve-ats",
  "rewrite-for-job",
]);

export async function POST(request: Request) {
  let body: AiRequest;
  try {
    body = (await request.json()) as AiRequest;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  if (!ACTIONS.has(body.action) || !body.resume) {
    return NextResponse.json({ error: "Invalid AI request." }, { status: 400 });
  }

  try {
    const result = await runAiAction(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Try again." },
      { status: 500 },
    );
  }
}
