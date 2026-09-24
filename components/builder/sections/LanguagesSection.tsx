import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createLanguage } from "@/lib/empty-resume";
import type { LanguageEntry } from "@/lib/types";

type LanguagesSectionProps = {
  items: LanguageEntry[];
  onChange: (items: LanguageEntry[]) => void;
};

export function LanguagesSection({ items, onChange }: LanguagesSectionProps) {
  function update(id: string, patch: Partial<LanguageEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createLanguage()])}>
          Add language
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Input
            label={`Language ${index + 1}`}
            value={item.name}
            onChange={(event) => update(item.id, { name: event.target.value })}
            placeholder="Spanish"
          />
          <Input
            label="Proficiency"
            value={item.proficiency}
            onChange={(event) => update(item.id, { proficiency: event.target.value })}
            placeholder="Professional working"
          />
          {items.length > 1 ? (
            <Button
              variant="danger"
              className="mb-0.5"
              onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
            >
              Remove
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
