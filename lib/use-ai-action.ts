"use client";

import { useState } from "react";
import type { AiAction, AiResponse } from "@/lib/ai/actions";
import type { ResumeData } from "@/lib/types";

export function useAiAction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extra, setExtra] = useState<Pick<AiResponse, "analysis" | "ats">>({});

  async function run(payload: {
    action: AiAction;
    resume: ResumeData;
    experienceId?: string;
    projectId?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AiResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The AI request failed.");
      }
      setResult(data.result || null);
      setNote(data.note || null);
      setExtra({ analysis: data.analysis, ats: data.ats });
      return data;
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "The AI request failed. Try again.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setResult(null);
    setNote(null);
    setError(null);
    setExtra({});
  }

  return { loading, result, note, error, extra, run, clear };
}
