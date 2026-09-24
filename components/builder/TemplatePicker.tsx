import type { ResumeTemplateId } from "@/lib/types";

export const TEMPLATES: Array<{ id: ResumeTemplateId; label: string }> = [
  { id: "classic", label: "Classic ATS" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "executive", label: "Executive" },
];

type TemplatePickerProps = {
  value: ResumeTemplateId;
  onChange: (value: ResumeTemplateId) => void;
};

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div className="flex flex-wrap border border-slate-300 bg-white p-1">
      {TEMPLATES.map((template) => {
        const selected = template.id === value;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`px-3 py-1.5 text-sm font-medium ${
              selected ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {template.label}
          </button>
        );
      })}
    </div>
  );
}
