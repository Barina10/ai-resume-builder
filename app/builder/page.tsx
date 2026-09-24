import { Suspense } from "react";
import { BuilderShell } from "@/components/builder/BuilderShell";

export default function BuilderPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-slate-500">Loading builder...</p>}>
      <BuilderShell />
    </Suspense>
  );
}
