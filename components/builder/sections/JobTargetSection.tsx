"use client";

import { AiButton } from "@/components/ui/AiButton";
import { AiProposal } from "@/components/ui/AiProposal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAiAction } from "@/lib/use-ai-action";
import type { ResumeData } from "@/lib/types";

type JobTargetSectionProps = {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
};

export function JobTargetSection({ data, onChange }: JobTargetSectionProps) {
  const analyze = useAiAction();
  const rewrite = useAiAction();

  return (
    <div className="space-y-4">
      <Input
        label="Target job title"
        value={data.targetJob.title}
        onChange={(event) =>
          onChange({ ...data, targetJob: { ...data.targetJob, title: event.target.value } })
        }
        placeholder="Senior Product Designer"
      />
      <Textarea
        label="Job description"
        value={data.targetJob.description}
        onChange={(event) =>
          onChange({
            ...data,
            targetJob: { ...data.targetJob, description: event.target.value },
          })
        }
        placeholder="Paste the job posting here"
        rows={8}
      />
      <div className="flex flex-wrap gap-2">
        <AiButton
          loading={analyze.loading}
          onClick={async () => {
            const response = await analyze.run({ action: "analyze-job", resume: data });
            if (response?.analysis) {
              onChange({ ...data, jobAnalysis: response.analysis });
            }
          }}
        >
          Analyze job description
        </AiButton>
        <AiButton
          loading={rewrite.loading}
          onClick={() => rewrite.run({ action: "rewrite-for-job", resume: data })}
        >
          Rewrite resume for target job
        </AiButton>
      </div>
      {data.jobAnalysis ? (
        <div className="border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-900">
            Estimated keyword match: {data.jobAnalysis.matchPercent}%
          </p>
          <p className="mt-2 text-slate-600">
            Required / mentioned skills:{" "}
            {(data.jobAnalysis.requiredSkills.length
              ? data.jobAnalysis.requiredSkills
              : data.jobAnalysis.keywords
            )
              .slice(0, 10)
              .join(", ") || "None detected"}
          </p>
          <p className="mt-2 text-slate-600">
            Missing from your resume:{" "}
            {data.jobAnalysis.missingKeywords.join(", ") || "None"}
          </p>
          <ul className="mt-2 list-disc pl-5 text-slate-600">
            {data.jobAnalysis.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <AiProposal
        title="Target-job summary rewrite"
        loading={rewrite.loading}
        result={rewrite.result}
        note={rewrite.note}
        error={rewrite.error}
        onAccept={() => {
          if (rewrite.result) onChange({ ...data, summary: rewrite.result });
          rewrite.clear();
        }}
        onRegenerate={() => rewrite.run({ action: "rewrite-for-job", resume: data })}
        onCancel={rewrite.clear}
      />
    </div>
  );
}
