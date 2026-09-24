import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createEducation } from "@/lib/empty-resume";
import type { EducationEntry } from "@/lib/types";

type EducationSectionProps = {
  items: EducationEntry[];
  onChange: (items: EducationEntry[]) => void;
};

export function EducationSection({ items, onChange }: EducationSectionProps) {
  function update(id: string, patch: Partial<EducationEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createEducation()])}>
          Add education
        </Button>
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-3 border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">School {index + 1}</p>
              {items.length > 1 ? (
                <Button
                  variant="danger"
                  onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Degree"
                value={item.degree}
                onChange={(event) => update(item.id, { degree: event.target.value })}
                placeholder="B.S. Computer Science"
              />
              <Input
                label="Institution"
                value={item.school}
                onChange={(event) => update(item.id, { school: event.target.value })}
                placeholder="University of Texas"
              />
              <Input
                label="Location"
                value={item.location}
                onChange={(event) => update(item.id, { location: event.target.value })}
                placeholder="Austin, TX"
              />
              <Input
                label="Start date"
                value={item.startDate}
                onChange={(event) => update(item.id, { startDate: event.target.value })}
                placeholder="2018"
              />
              <Input
                label="End date"
                value={item.endDate}
                onChange={(event) => update(item.id, { endDate: event.target.value })}
                placeholder="2022"
              />
            </div>
            <Textarea
              label="Description"
              value={item.details}
              onChange={(event) => update(item.id, { details: event.target.value })}
              placeholder="GPA, honors, relevant coursework"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
