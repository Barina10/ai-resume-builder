"use client";

import { useRouter } from "next/navigation";
import { createResume } from "@/lib/storage";

type CreateResumeButtonProps = {
  children: string;
  className?: string;
};

export function CreateResumeButton({
  children,
  className,
}: CreateResumeButtonProps) {
  const router = useRouter();

  async function handleCreate() {
    try {
      const record = await createResume();
      router.push(`/builder?id=${record.id}`);
    } catch (error) {
      console.error("Failed to create resume:", error);
      window.alert("Could not create resume. Please try again.");
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleCreate}
    >
      {children}
    </button>
  );
}