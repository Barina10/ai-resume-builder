"use client";

import { AiButton } from "@/components/ui/AiButton";
import { getAtsReport } from "@/lib/ats";
import { useAiAction } from "@/lib/use-ai-action";
import type { ResumeData } from "@/lib/types";

export function AtsPanel({
  data,
  onAnalysis,
}: {
  data: ResumeData;
  onAnalysis: (data: ResumeData) => void;
}) {
  const report = getAtsReport(data);
  const improve = useAiAction();

  return (
    <div className="space-y-3 text-sm">
      <p className="text-slate-900">
        Estimated ATS score: <strong>{report.score}</strong>
      </p>
      <p>Keyword match: {report.matchPercent}%</p>
      <p>Approx. word count: {report.wordCount}</p>
      <p>Skills detected: {report.skillsDetected.join(", ") || "None yet"}</p>
      <p>Missing keywords: {report.missingKeywords.join(", ") || "None"}</p>
      {report.warnings.length ? (
        <ul className="list-disc pl-5 text-slate-700">
          {report.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
      <ul className="list-disc pl-5 text-slate-600">
        {report.suggestions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <AiButton
        loading={improve.loading}
        onClick={async () => {
          const response = await improve.run({ action: "improve-ats", resume: data });
          if (response?.analysis) {
            onAnalysis({ ...data, jobAnalysis: response.analysis });
          }
        }}
      >
        Improve ATS compatibility
      </AiButton>
      {improve.result && !improve.loading ? (
        <p className="whitespace-pre-wrap text-slate-700">{improve.result}</p>
      ) : null}
      {improve.error ? <p className="text-red-700">{improve.error}</p> : null}
    </div>
  );
}
