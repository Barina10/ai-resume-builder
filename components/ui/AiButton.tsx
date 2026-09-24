import { Button } from "@/components/ui/Button";
import type { ButtonHTMLAttributes } from "react";

type AiButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function AiButton({ loading, children, disabled, ...props }: AiButtonProps) {
  return (
    <Button variant="secondary" disabled={disabled || loading} {...props}>
      {loading ? "Working..." : children}
    </Button>
  );
}
