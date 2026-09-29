"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TEMPLATES } from "@/components/builder/TemplatePicker";
import {
  createResume,
  deleteResume,
  duplicateResume,
  listResumes,
  renameResume,
} from "@/lib/storage";
import type { StoredResume } from "@/lib/types";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function ResumeDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<StoredResume[]>([]);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [items],
  );

  async function refresh() {
    try {
      const resumes = await listResumes();
      setItems(resumes);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createNew() {
    try {
      const record = await createResume();
      router.push(`/builder?id=${record.id}`);
    } catch (error) {
      console.error("Failed to create resume:", error);
      window.alert("Could not create resume. Please try again.");
    }
  }

  async function handleDuplicate(id: string) {
    try {
      await duplicateResume(id);
      await refresh();
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
      window.alert("Could not duplicate resume. Please try again.");
    }
  }

  async function handleRename() {
    if (!renameId) return;

    try {
      await renameResume(renameId, renameValue);
      setRenameId(null);
      await refresh();
    } catch (error) {
      console.error("Failed to rename resume:", error);
      window.alert("Could not rename resume. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      await deleteResume(deleteId);
      setDeleteId(null);
      await refresh();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      window.alert("Could not delete resume. Please try again.");
    }
  }

  return (
    <div className="min-h-full bg-[#f4f1ea]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-medium text-slate-500">
            AI Resume Builder
          </Link>

          <Button onClick={createNew}>Create new resume</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">My Resumes</h1>

        <p className="mt-2 text-slate-600">
          Your resumes are saved securely in your MongoDB database.
        </p>

        {sorted.length === 0 ? (
          <div className="mt-10 border border-dashed border-slate-300 bg-white p-8">
            <p className="font-medium">No resumes yet</p>

            <p className="mt-1 text-sm text-slate-600">
              Create one to start building.
            </p>

            <Button className="mt-4" onClick={createNew}>
              Create my resume
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {sorted.map((resume) => (
              <article
                key={resume.id}
                className="border border-slate-200 bg-white p-5"
              >
                <h2 className="text-lg font-semibold">{resume.name}</h2>

                <p className="mt-1 text-sm text-slate-600">
                  Target job: {resume.data.targetJob.title || "Not set"}
                </p>

                <p className="text-sm text-slate-600">
                  Template:{" "}
                  {TEMPLATES.find(
                    (item) => item.id === resume.data.template,
                  )?.label || resume.data.template}
                </p>

                <p className="text-sm text-slate-500">
                  Updated {formatDate(resume.updatedAt)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/builder?id=${resume.id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleDuplicate(resume.id)}
                  >
                    Duplicate
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setRenameId(resume.id);
                      setRenameValue(resume.name);
                    }}
                  >
                    Rename
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/builder?id=${resume.id}`)
                    }
                  >
                    Download
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setDeleteId(resume.id)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Modal
        open={Boolean(renameId)}
        title="Rename resume"
        onClose={() => setRenameId(null)}
      >
        <Input
          label="Name"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setRenameId(null)}
          >
            Cancel
          </Button>

          <Button onClick={handleRename}>Save</Button>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteId)}
        title="Delete resume?"
        onClose={() => setDeleteId(null)}
      >
        <p className="text-sm text-slate-600">
          This will permanently delete the resume from MongoDB.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}