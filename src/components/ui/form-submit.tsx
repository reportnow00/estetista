"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function FormSubmit({
  children,
  pendingLabel,
  className
}: {
  children: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel || "Invio in corso..." : children}
    </Button>
  );
}
