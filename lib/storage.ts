import { normalizeResumeData } from "@/lib/empty-resume";
import type { ResumeData, StoredResume } from "@/lib/types";

type ApiResume = {
  _id: string;
  name: string;
  ownerId: string | null;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
};

function hydrate(record: ApiResume): StoredResume {
  return {
    id: record._id,
    name: record.name,
    ownerId: record.ownerId ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    data: normalizeResumeData(record.data),
  };
}

export async function listResumes(): Promise<StoredResume[]> {
  const response = await fetch("/api/resumes", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load resumes");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to load resumes");
  }

  return (result.resumes as ApiResume[])
    .map(hydrate)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getResume(
  id: string
): Promise<StoredResume | null> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load resume");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to load resume");
  }

  return hydrate(result.resume as ApiResume);
}

export async function createResume(options?: {
  name?: string;
  data?: ResumeData;
}): Promise<StoredResume> {
  const response = await fetch("/api/resumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: options?.name?.trim() || "Untitled resume",
      ownerId: null,
      data: options?.data,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create resume");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to create resume");
  }

  return hydrate(result.resume as ApiResume);
}

export async function saveResume(
  id: string,
  data: ResumeData,
  name?: string
): Promise<StoredResume | null> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      ownerId: null,
      data,
    }),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to save resume");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to save resume");
  }

  return hydrate(result.resume as ApiResume);
}

export async function renameResume(
  id: string,
  name: string
): Promise<StoredResume | null> {
  const existing = await getResume(id);

  if (!existing) {
    return null;
  }

  return saveResume(id, existing.data, name);
}

export async function duplicateResume(
  id: string
): Promise<StoredResume | null> {
  const original = await getResume(id);

  if (!original) {
    return null;
  }

  return createResume({
    name: `${original.name} copy`,
    data: structuredClone(original.data),
  });
}

export async function deleteResume(id: string): Promise<boolean> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error("Failed to delete resume");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to delete resume");
  }

  return true;
}

export function subscribeStore(_listener: () => void) {
  return () => {};
}