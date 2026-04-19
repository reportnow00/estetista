export type EditorialGuide = {
  href: string;
  title: string;
  description: string;
  badge: string;
};

export const editorialGuides: EditorialGuide[] = [
  {
    href: "/diventare-personal-trainer",
    title: "Come diventare Personal Trainer",
    description: "Guida completa per capire da dove partire, quali competenze sviluppare e come scegliere un percorso serio.",
    badge: "Guida professionale"
  },
  {
    href: "/quanto-guadagna-un-personal-trainer",
    title: "Quanto guadagna un Personal Trainer",
    description: "Analisi chiara su compensi, differenze tra palestra e freelance e fattori che incidono davvero.",
    badge: "Guida carriera"
  },
  {
    href: "/personal-trainer-cosa-studiare",
    title: "Personal Trainer: cosa studiare",
    description: "Le materie e le competenze chiave da conoscere se vuoi costruire basi solide nel fitness.",
    badge: "Guida formazione"
  },
  {
    href: "/come-trovare-clienti-personal-trainer",
    title: "Come trovare clienti da Personal Trainer",
    description: "Strategie pratiche per lavorare su proposta, posizionamento e fiducia percepita.",
    badge: "Guida business"
  },
  {
    href: "/corso-personal-trainer-riconosciuto-coni",
    title: "Corso Personal Trainer riconosciuto CONI",
    description: "Cosa controllare davvero prima di iscriverti e come valutare un percorso in modo più maturo.",
    badge: "Guida certificazioni"
  }
];

export function getRelatedGuides(currentPath: string, limit?: number) {
  const relatedGuides = editorialGuides.filter((guide) => guide.href !== currentPath);
  return typeof limit === "number" ? relatedGuides.slice(0, limit) : relatedGuides;
}
