import { ClassicTemplate } from "@/components/preview/templates/ClassicTemplate";
import { ExecutiveTemplate } from "@/components/preview/templates/ExecutiveTemplate";
import { MinimalTemplate } from "@/components/preview/templates/MinimalTemplate";
import { ModernTemplate } from "@/components/preview/templates/ModernTemplate";
import type { ResumeData } from "@/lib/types";

export function ResumePreview({ data }: { data: ResumeData }) {
  const template =
    data.template === "modern"
      ? "modern"
      : data.template === "minimal"
        ? "minimal"
        : data.template === "executive"
          ? "executive"
          : "classic";

  return (
    <div
      id="resume-paper"
      className="mx-auto w-full max-w-[816px] overflow-hidden bg-white shadow-[0_12px_40px_rgba(15,23,42,0.1)]"
    >
      {template === "modern" ? <ModernTemplate data={data} /> : null}
      {template === "minimal" ? <MinimalTemplate data={data} /> : null}
      {template === "executive" ? <ExecutiveTemplate data={data} /> : null}
      {template === "classic" ? <ClassicTemplate data={data} /> : null}
    </div>
  );
}
