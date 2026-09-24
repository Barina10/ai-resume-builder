"use client";

import { AiButton } from "@/components/ui/AiButton";
import { AiProposal } from "@/components/ui/AiProposal";
import { Textarea } from "@/components/ui/Textarea";
import { useAiAction } from "@/lib/use-ai-action";
import type { ResumeData } from "@/lib/types";

type SummarySectionProps = {
  data: ResumeData;
  onChange: (summary: string) => void;
};

export function SummarySection({ data, onChange }: SummarySectionProps) {
  const improve = useAiAction();
  const generate = useAiAction();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <AiButton
          loading={improve.loading}
          onClick={() => improve.run({ action: "improve-summary", resume: data })}
        >
          Improve with AI
        </AiButton>
        <AiButton
          loading={generate.loading}
          onClick={() => generate.run({ action: "generate-summary", resume: data })}
        >
          Generate professional summary
        </AiButton>
      </div>
      <Textarea
        label="Summary"
        name="summary"
        value={data.summary}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write a short overview of your background, strengths, and goals."
        rows={5}
      />
      <AiProposal
        title="Improved summary"
        loading={improve.loading}
        result={improve.result}
        note={improve.note}
        error={improve.error}
        onAccept={() => {
          if (improve.result) onChange(improve.result);
          improve.clear();
        }}
        onRegenerate={() => improve.run({ action: "improve-summary", resume: data })}
        onCancel={improve.clear}
      />
      <AiProposal
        title="Generated summary"
        loading={generate.loading}
        result={generate.result}
        note={generate.note}
        error={generate.error}
        onAccept={() => {
          if (generate.result) onChange(generate.result);
          generate.clear();
        }}
        onRegenerate={() => generate.run({ action: "generate-summary", resume: data })}
        onCancel={generate.clear}
      />
    </div>
  );
}
