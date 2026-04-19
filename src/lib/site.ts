import { getAppUrl, getOptionalEnv } from "@/lib/env";

export const siteConfig = {
  name: "Professione Fitness Academy",
  shortName: "Professione Fitness",
  description:
    "Academy premium per chi vuole trasformare la passione per il fitness in una professione concreta, con un percorso chiaro e credibile per diventare Personal Trainer.",
  url: getAppUrl(),
  ogImage:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
  contact: {
    email: getOptionalEnv("NEXT_PUBLIC_CONTACT_EMAIL") || "info@professionefitnessacademy.it",
    phone: getOptionalEnv("NEXT_PUBLIC_CONTACT_PHONE") || "+39 06 9475 2201",
    location: getOptionalEnv("NEXT_PUBLIC_CONTACT_LOCATION") || "Roma - supporto in tutta Italia"
  },
  social: {
    instagram: getOptionalEnv("NEXT_PUBLIC_INSTAGRAM_URL") || "",
    linkedin: getOptionalEnv("NEXT_PUBLIC_LINKEDIN_URL") || "",
    facebook: getOptionalEnv("NEXT_PUBLIC_FACEBOOK_URL") || ""
  }
};

export const mainNavigation = [
  { href: "/corsi", label: "Corsi" },
  { href: "/certificazioni-validita-professionale", label: "Certificazioni" },
  { href: "/docenti", label: "Docenti" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/blog", label: "Blog" },
  { href: "/contatti", label: "Contatti" }
];

export const footerNavigation = {
  academy: [
    { href: "/chi-siamo", label: "Chi siamo" },
    { href: "/docenti", label: "Docenti" },
    { href: "/faq", label: "FAQ" },
    { href: "/contatti", label: "Contatti" }
  ],
  guide: [
    { href: "/diventare-personal-trainer", label: "Come diventare Personal Trainer" },
    { href: "/quanto-guadagna-un-personal-trainer", label: "Quanto guadagna un Personal Trainer" },
    { href: "/personal-trainer-cosa-studiare", label: "Personal Trainer: cosa studiare" },
    { href: "/come-trovare-clienti-personal-trainer", label: "Come trovare clienti" },
    { href: "/corso-personal-trainer-riconosciuto-coni", label: "Corso PT riconosciuto CONI" }
  ],
  legale: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/termini-condizioni", label: "Termini e condizioni" }
  ]
};
