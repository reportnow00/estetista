"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <PageHero
        badge="Errore"
        title="Qualcosa non ha funzionato come previsto"
        description="Stiamo lavorando per rendere l'esperienza piu solida possibile. Puoi riprovare subito oppure tornare alle pagine principali."
      />
      <Container className="flex flex-wrap gap-4 py-20">
        <Button onClick={reset}>Riprova</Button>
        <ButtonLink href="/" variant="outline">
          Torna alla home
        </ButtonLink>
      </Container>
    </>
  );
}
