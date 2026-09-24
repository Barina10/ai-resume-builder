import { createEmptyResume, normalizeResumeData } from "@/lib/empty-resume";
import { createId } from "@/lib/id";
import type { ResumeData, StoredResume } from "@/lib/types";

const STORAGE_KEY = "ai-resume-builder:v1";

// Persistence is local until auth is added. StoredResume.ownerId is reserved
// so private per-account resumes can be attached without rewriting the builder.

type StoreShape = {
  resumes: StoredResume[];
};

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function hydrate(record: StoredResume): StoredResume {
  return { ...record, data: normalizeResumeData(record.data) };
}

function readStore(): StoreShape {
  if (!canUseStorage()) return { resumes: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { resumes: [] };
    const parsed = JSON.parse(raw) as StoreShape;
    return { resumes: Array.isArray(parsed.resumes) ? parsed.resumes.map(hydrate) : [] };
  } catch {
    return { resumes: [] };
  }
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function writeStore(store: StoreShape) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  emit();
}

export function listResumes(): StoredResume[] {
  return readStore().resumes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getResume(id: string): StoredResume | null {
  return readStore().resumes.find((item) => item.id === id) ?? null;
}

export function createResume(options?: {
  name?: string;
  data?: ResumeData;
}): StoredResume {
  const now = new Date().toISOString();
  const record: StoredResume = {
    id: createId(),
    name: options?.name?.trim() || "Untitled resume",
    ownerId: null,
    createdAt: now,
    updatedAt: now,
    data: options?.data ?? createEmptyResume(),
  };
  const store = readStore();
  store.resumes.unshift(record);
  writeStore(store);
  return record;
}

export function saveResume(id: string, data: ResumeData, name?: string) {
  const store = readStore();
  const index = store.resumes.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.resumes[index] = {
    ...store.resumes[index],
    data,
    name: name?.trim() || store.resumes[index].name,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.resumes[index];
}

export function renameResume(id: string, name: string) {
  const store = readStore();
  const index = store.resumes.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.resumes[index] = {
    ...store.resumes[index],
    name: name.trim() || store.resumes[index].name,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.resumes[index];
}

export function duplicateResume(id: string) {
  const original = getResume(id);
  if (!original) return null;
  return createResume({
    name: `${original.name} copy`,
    data: structuredClone(original.data),
  });
}

export function deleteResume(id: string) {
  const store = readStore();
  store.resumes = store.resumes.filter((item) => item.id !== id);
  writeStore(store);
}
