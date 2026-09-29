"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AtsPanel } from "@/components/builder/AtsPanel";
import { QualityChecklist } from "@/components/builder/QualityChecklist";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { TemplatePicker } from "@/components/builder/TemplatePicker";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createEmptyResume } from "@/lib/empty-resume";
import { createResume, getResume, saveResume } from "@/lib/storage";
import type { ResumeData } from "@/lib/types";
import { validateResume } from "@/lib/validate";

type SaveState = "saved" | "saving" | "unsaved";

export function BuilderShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const [id, setId] = useState<string | null>(resumeId);
  const [name, setName] = useState("Untitled resume");
  const [data, setData] = useState<ResumeData>(createEmptyResume);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const createdRef = useRef(false);
  const [ready, setReady] = useState(false);
  const errors = useMemo(() => validateResume(data), [data]);

  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      try {
        if (resumeId) {
          const existing = await getResume(resumeId);

          if (cancelled) return;

          if (existing) {
            setId(existing.id);
            setName(existing.name);
            setData(existing.data);
            setReady(true);
            return;
          }
        }

        if (createdRef.current) return;

        createdRef.current = true;

        const record = await createResume();

        if (cancelled) return;

        router.replace(`/builder?id=${record.id}`);
        setId(record.id);
        setName(record.name);
        setData(record.data);
        setReady(true);
      } catch (error) {
        console.error("Failed to load resume:", error);

        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadResume();

    return () => {
      cancelled = true;
    };
  }, [resumeId, router]);

  useEffect(() => {
    if (!ready || !id) return;

    setSaveState("unsaved");

    const timer = window.setTimeout(async () => {
      setSaveState("saving");

      try {
        await saveResume(id, data, name);
        setSaveState("saved");
      } catch (error) {
        console.error("Failed to save resume:", error);
        setSaveState("unsaved");
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [data, name, id, ready]);

  function printResume() {
    try {
      window.print();
    } catch {
      window.alert("Printing is unavailable in this browser.");
    }
  }

  if (!ready) {
    return <p className="p-8 text-sm text-slate-500">Loading resume...</p>;
  }

  return (
    <div className="min-h-full bg-[#f4f1ea] text-slate-900">
      <header className="print-hidden sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link href="/resumes" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              My Resumes
            </Link>
            <Input
              label="Resume name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
              {saveState === "saving"
                ? "Saving..."
                : saveState === "unsaved"
                  ? "Unsaved changes"
                  : "Saved"}
            </span>
            <Button variant="secondary" onClick={printResume}>
              Print resume
            </Button>
            <Button onClick={printResume}>Download PDF</Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 pb-3 sm:px-6">
          <TemplatePicker
            value={data.template}
            onChange={(template) =>
              setData((current) => ({ ...current, template }))
            }
          />

          <div className="flex lg:hidden">
            <button
              type="button"
              className={`px-3 py-1.5 text-sm ${
                mobileTab === "edit"
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
              onClick={() => setMobileTab("edit")}
            >
              Edit
            </button>

            <button
              type="button"
              className={`px-3 py-1.5 text-sm ${
                mobileTab === "preview"
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
              onClick={() => setMobileTab("preview")}
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start sm:px-6">
        <div
          className={`print-hidden bg-white p-5 sm:p-8 ${
            mobileTab === "preview" ? "hidden lg:block" : ""
          }`}
        >
          <ResumeForm data={data} errors={errors} onChange={setData} />

          <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 text-lg font-semibold">Resume quality</h2>
              <QualityChecklist data={data} />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold">ATS checker</h2>
              <AtsPanel data={data} onAnalysis={setData} />
            </div>
          </div>
        </div>

        <div
          className={`${
            mobileTab === "edit" ? "hidden lg:block" : ""
          } lg:sticky lg:top-28`}
        >
          <p className="print-hidden mb-3 text-sm font-medium text-slate-500">
            Live preview
          </p>
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}