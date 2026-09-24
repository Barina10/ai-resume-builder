import { getQualityItems } from "@/lib/quality";
import type { ResumeData } from "@/lib/types";

export function QualityChecklist({ data }: { data: ResumeData }) {
  const items = getQualityItems(data);
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex gap-2">
          <span className="w-4">
            {item.status === "ok" ? "✓" : item.status === "warning" ? "!" : "○"}
          </span>
          <span>
            <span className="font-medium text-slate-900">{item.label}</span>
            {item.detail ? <span className="block text-slate-600">{item.detail}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
