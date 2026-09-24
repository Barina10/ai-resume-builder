"use client";

import { AiButton } from "@/components/ui/AiButton";
import { AiProposal } from "@/components/ui/AiProposal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createProject } from "@/lib/empty-resume";
import { useAiAction } from "@/lib/use-ai-action";
import type { ProjectEntry, ResumeData } from "@/lib/types";

type ProjectsSectionProps = {
  data: ResumeData;
  onChange: (items: ProjectEntry[]) => void;
};

function ProjectCard({
  item,
  index,
  canRemove,
  data,
  onUpdate,
  onRemove,
}: {
  item: ProjectEntry;
  index: number;
  canRemove: boolean;
  data: ResumeData;
  onUpdate: (patch: Partial<ProjectEntry>) => void;
  onRemove: () => void;
}) {
  const improve = useAiAction();

  return (
    <div className="space-y-3 border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Project {index + 1}</p>
        {canRemove ? (
          <Button variant="danger" onClick={onRemove}>
            Remove
          </Button>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Project name"
          value={item.name}
          onChange={(event) => onUpdate({ name: event.target.value })}
          placeholder="Portfolio website"
        />
        <Input
          label="Project URL"
          value={item.link}
          onChange={(event) => onUpdate({ link: event.target.value })}
          placeholder="https://..."
        />
        <Input
          label="Technologies"
          value={item.technologies}
          onChange={(event) => onUpdate({ technologies: event.target.value })}
          placeholder="React, TypeScript"
        />
      </div>
      <Textarea
        label="Description"
        value={item.description}
        onChange={(event) => onUpdate({ description: event.target.value })}
        placeholder="What the project does and your role"
        rows={3}
      />
      <Textarea
        label="Highlights"
        value={item.highlights}
        onChange={(event) => onUpdate({ highlights: event.target.value })}
        placeholder="One highlight per line"
        rows={3}
      />
      <AiButton
        loading={improve.loading}
        onClick={() => improve.run({ action: "improve-project", resume: data, projectId: item.id })}
      >
        Improve with AI
      </AiButton>
      <AiProposal
        title="Improved project description"
        loading={improve.loading}
        result={improve.result}
        note={improve.note}
        error={improve.error}
        onAccept={() => {
          if (improve.result) onUpdate({ description: improve.result });
          improve.clear();
        }}
        onRegenerate={() =>
          improve.run({ action: "improve-project", resume: data, projectId: item.id })
        }
        onCancel={improve.clear}
      />
    </div>
  );
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const items = data.projects;
  function update(id: string, patch: Partial<ProjectEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createProject()])}>
          Add project
        </Button>
      </div>
      {items.map((item, index) => (
        <ProjectCard
          key={item.id}
          item={item}
          index={index}
          canRemove={items.length > 1}
          data={data}
          onUpdate={(patch) => update(item.id, patch)}
          onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
        />
      ))}
    </div>
  );
}
