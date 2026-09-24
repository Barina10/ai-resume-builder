"use client";

import { useRouter } from "next/navigation";
import { createResume } from "@/lib/storage";

type CreateResumeButtonProps = {
  children: string;
  className?: string;
};

export function CreateResumeButton({ children, className }: CreateResumeButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const record = createResume();
        router.push(`/builder?id=${record.id}`);
      }}
    >
      {children}
    </button>
  );
}
