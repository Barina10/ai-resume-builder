import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createAward } from "@/lib/empty-resume";
import type { AwardEntry } from "@/lib/types";

type AwardsSectionProps = {
  items: AwardEntry[];
  onChange: (items: AwardEntry[]) => void;
};

export function AwardsSection({ items, onChange }: AwardsSectionProps) {
  function update(id: string, patch: Partial<AwardEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createAward()])}>
          Add award
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="space-y-3 border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Award {index + 1}</p>
            {items.length > 1 ? (
              <Button
                variant="danger"
                onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
              >
                Remove
              </Button>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Title"
              value={item.title}
              onChange={(event) => update(item.id, { title: event.target.value })}
              placeholder="Dean's List"
            />
            <Input
              label="Organization"
              value={item.organization}
              onChange={(event) => update(item.id, { organization: event.target.value })}
              placeholder="University of Texas"
            />
            <Input
              label="Date"
              value={item.date}
              onChange={(event) => update(item.id, { date: event.target.value })}
              placeholder="2021"
            />
          </div>
          <Textarea
            label="Description"
            value={item.description}
            onChange={(event) => update(item.id, { description: event.target.value })}
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
