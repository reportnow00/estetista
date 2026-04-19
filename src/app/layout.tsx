import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Professione Fitness Academy | Corsi fitness professionali",
  description:
    "Corso Personal Trainer e formazione fitness professionale per chi vuole lavorare nel settore con competenze concrete, programma chiaro e sbocchi reali.",
  keywords: [
    "corso personal trainer",
    "diventare personal trainer",
    "formazione fitness",
    "certificazione personal trainer",
    "corsi fitness online"
  ]
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
