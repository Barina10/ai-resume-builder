"use client";

import { AiButton } from "@/components/ui/AiButton";
import { AiProposal } from "@/components/ui/AiProposal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createSkill } from "@/lib/empty-resume";
import { useAiAction } from "@/lib/use-ai-action";
import type { ResumeData, SkillEntry, SkillLevel } from "@/lib/types";

type SkillsSectionProps = {
  data: ResumeData;
  errors: Array<{ path: string; message: string }>;
  onChange: (items: SkillEntry[]) => void;
};

export function SkillsSection({ data, errors, onChange }: SkillsSectionProps) {
  const items = data.skills;
  const suggest = useAiAction();

  function update(id: string, patch: Partial<SkillEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <AiButton
          loading={suggest.loading}
          onClick={() => suggest.run({ action: "suggest-skills", resume: data })}
        >
          Suggest skills from job
        </AiButton>
        <Button variant="secondary" onClick={() => onChange([...items, createSkill()])}>
          Add skill
        </Button>
      </div>
      <AiProposal
        title="Suggested skills"
        loading={suggest.loading}
        result={suggest.result}
        note={suggest.note}
        error={suggest.error}
        onAccept={() => {
          const names = (suggest.result ?? "")
            .split("\n")
            .map((name) => name.trim())
            .filter(Boolean);
          const existing = new Set(items.map((item) => item.name.trim().toLowerCase()));
          const next = names
            .filter((name) => !existing.has(name.toLowerCase()))
            .map((name) => ({ ...createSkill(), name }));
          onChange([...items, ...next]);
          suggest.clear();
        }}
        onRegenerate={() => suggest.run({ action: "suggest-skills", resume: data })}
        onCancel={suggest.clear}
      />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_160px_auto] sm:items-end">
            <Input
              label={`Skill ${index + 1}`}
              value={item.name}
              onChange={(event) => update(item.id, { name: event.target.value })}
              placeholder="React"
            />
            <Select
              label="Level (optional)"
              value={item.level}
              onChange={(event) => update(item.id, { level: event.target.value as SkillLevel })}
            >
              <option value="">Not specified</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </Select>
            {items.length > 1 ? (
              <Button
                variant="danger"
                className="mb-0.5"
                onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
              >
                Remove
              </Button>
            ) : null}
            {errors.find((error) => error.path === `skills.${index}`) ? (
              <p className="text-xs text-red-700 sm:col-span-3">
                {errors.find((error) => error.path === `skills.${index}`)?.message}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
