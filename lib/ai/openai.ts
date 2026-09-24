const SYSTEM_GUARD =
  "You help write resumes. Never invent jobs, employers, dates, education, certifications, awards, or skills the user did not provide. If information is missing, say what is needed instead of guessing. Keep facts, use concise professional language, and prefer measurable achievements when numbers are present. Return JSON only.";

type ChatResult = {
  text: string | null;
  usedModel: boolean;
};

export async function completeJson(userPrompt: string): Promise<ChatResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { text: null, usedModel: false };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_GUARD },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!response.ok) return { text: null, usedModel: false };
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return { text: payload.choices?.[0]?.message?.content?.trim() ?? null, usedModel: true };
  } catch {
    return { text: null, usedModel: false };
  }
}

export function parseJsonObject(text: string | null) {
  if (!text) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}
