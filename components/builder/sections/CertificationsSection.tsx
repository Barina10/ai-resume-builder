import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createCertification } from "@/lib/empty-resume";
import type { CertificationEntry } from "@/lib/types";

type CertificationsSectionProps = {
  items: CertificationEntry[];
  onChange: (items: CertificationEntry[]) => void;
};

export function CertificationsSection({ items, onChange }: CertificationsSectionProps) {
  function update(id: string, patch: Partial<CertificationEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => onChange([...items, createCertification()])}>
          Add certification
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="space-y-3 border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Certification {index + 1}</p>
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
              label="Certification name"
              value={item.name}
              onChange={(event) => update(item.id, { name: event.target.value })}
              placeholder="AWS Cloud Practitioner"
            />
            <Input
              label="Issuing organization"
              value={item.issuer}
              onChange={(event) => update(item.id, { issuer: event.target.value })}
              placeholder="Amazon Web Services"
            />
            <Input
              label="Date"
              value={item.year}
              onChange={(event) => update(item.id, { year: event.target.value })}
              placeholder="2024"
            />
            <Input
              label="Credential URL"
              value={item.url}
              onChange={(event) => update(item.id, { url: event.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
