"use client";

import { AiButton } from "@/components/ui/AiButton";
import { AiProposal } from "@/components/ui/AiProposal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createExperience } from "@/lib/empty-resume";
import { useAiAction } from "@/lib/use-ai-action";
import type { ExperienceEntry, ResumeData } from "@/lib/types";

type ExperienceSectionProps = {
  data: ResumeData;
  errors: Array<{ path: string; message: string }>;
  onChange: (items: ExperienceEntry[]) => void;
};

function ExperienceCard({
  item,
  index,
  canRemove,
  data,
  error,
  onUpdate,
  onRemove,
}: {
  item: ExperienceEntry;
  index: number;
  canRemove: boolean;
  data: ResumeData;
  error?: string;
  onUpdate: (patch: Partial<ExperienceEntry>) => void;
  onRemove: () => void;
}) {
  const improve = useAiAction();
  const bullets = useAiAction();

  return (
    <div className="space-y-3 border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Role {index + 1}</p>
        {canRemove ? (
          <Button variant="danger" onClick={onRemove}>
            Remove
          </Button>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Job title"
          value={item.role}
          onChange={(event) => onUpdate({ role: event.target.value })}
          placeholder="Frontend Engineer"
        />
        <Input
          label="Company"
          value={item.company}
          onChange={(event) => onUpdate({ company: event.target.value })}
          placeholder="Acme Inc."
        />
        <Input
          label="Location"
          value={item.location}
          onChange={(event) => onUpdate({ location: event.target.value })}
          placeholder="Remote"
        />
        <Input
          label="Start date"
          value={item.startDate}
          onChange={(event) => onUpdate({ startDate: event.target.value })}
          placeholder="Jan 2023"
        />
        <Input
          label="End date"
          value={item.current ? "Present" : item.endDate}
          onChange={(event) => onUpdate({ endDate: event.target.value })}
          placeholder="Mar 2025"
          disabled={item.current}
        />
        <label className="flex items-center gap-2 pt-7 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={item.current}
            onChange={(event) =>
              onUpdate({ current: event.target.checked, endDate: event.target.checked ? "" : item.endDate })
            }
          />
          Current position
        </label>
      </div>
      <Textarea
        label="Description"
        value={item.description}
        onChange={(event) => onUpdate({ description: event.target.value })}
        placeholder="What you did in this role"
        rows={3}
      />
      <Textarea
        label="Bullet points"
        value={item.bullets}
        onChange={(event) => onUpdate({ bullets: event.target.value })}
        placeholder="One accomplishment per line"
        rows={4}
      />
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <AiButton
          loading={improve.loading}
          onClick={() =>
            improve.run({ action: "improve-experience", resume: data, experienceId: item.id })
          }
        >
          Improve with AI
        </AiButton>
        <AiButton
          loading={bullets.loading}
          onClick={() =>
            bullets.run({ action: "generate-bullets", resume: data, experienceId: item.id })
          }
        >
          Generate bullet points
        </AiButton>
      </div>
      <AiProposal
        title="Improved experience"
        loading={improve.loading}
        result={improve.result}
        note={improve.note}
        error={improve.error}
        onAccept={() => {
          if (improve.result) onUpdate({ bullets: improve.result });
          improve.clear();
        }}
        onRegenerate={() =>
          improve.run({ action: "improve-experience", resume: data, experienceId: item.id })
        }
        onCancel={improve.clear}
      />
      <AiProposal
        title="Suggested bullets"
        loading={bullets.loading}
        result={bullets.result}
        note={bullets.note}
        error={bullets.error}
        onAccept={() => {
          if (bullets.result) onUpdate({ bullets: bullets.result });
          bullets.clear();
        }}
        onRegenerate={() =>
          bullets.run({ action: "generate-bullets", resume: data, experienceId: item.id })
        }
        onCancel={bullets.clear}
      />
    </div>
  );
}

export function ExperienceSection({ data, errors, onChange }: ExperienceSectionProps) {
  const items = data.experience;

  function update(id: string, patch: Partial<ExperienceEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createExperience()])}>
          Add experience
        </Button>
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <ExperienceCard
            key={item.id}
            item={item}
            index={index}
            canRemove={items.length > 1}
            data={data}
            error={errors.find((error) => error.path === `experience.${index}` || error.path === `experience.${index}.dates`)?.message}
            onUpdate={(patch) => update(item.id, patch)}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          />
        ))}
      </div>
    </div>
  );
}
