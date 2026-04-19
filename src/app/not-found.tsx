import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Pagina non trovata"
        description="L'URL richiesto non esiste o non e piu disponibile. Ti riportiamo subito verso le sezioni utili del sito."
      />
      <Container className="flex flex-wrap gap-4 py-20">
        <ButtonLink href="/">Torna alla home</ButtonLink>
        <ButtonLink href="/corsi" variant="outline">
          Vai ai corsi
        </ButtonLink>
      </Container>
    </>
  );
}
