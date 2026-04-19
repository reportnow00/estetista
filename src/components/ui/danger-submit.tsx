"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  children?: string;
  pendingLabel?: string;
  confirmMessage?: string;
  className?: string;
};

export function DangerSubmit({
  children = "Elimina",
  pendingLabel = "Eliminazione...",
  confirmMessage = "Confermi l'eliminazione?",
  className
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      className={cn("border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800", className)}
      disabled={pending}
      onClick={(event) => {
        if (!confirmMessage || pending) return;

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
