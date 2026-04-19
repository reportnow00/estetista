import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { footerNavigation, siteConfig } from "@/lib/site";

const socialEntries = [
  { key: "instagram", href: siteConfig.social.instagram, label: "Instagram", icon: Instagram },
  { key: "facebook", href: siteConfig.social.facebook, label: "Facebook", icon: Facebook },
  { key: "linkedin", href: siteConfig.social.linkedin, label: "LinkedIn", icon: Linkedin }
].filter((entry) => Boolean(entry.href));

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 py-16 text-slate-300">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-xl font-extrabold uppercase tracking-[0.14em] text-white">
              Professione <span className="text-brand-400">Fitness</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Corso Personal Trainer e formazione fitness professionale per chi vuole costruire competenze solide e iniziare a lavorare nel settore con più credibilità.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:border-brand-500 hover:text-brand-300"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:border-brand-500 hover:text-brand-300"
              >
                <Phone className="h-4 w-4" />
                Telefono
              </a>
            </div>

            {socialEntries.length ? (
              <div className="mt-4 flex gap-3">
                {socialEntries.map(({ key, href, label, icon: Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-white transition hover:border-brand-500 hover:text-brand-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">Academy</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerNavigation.academy.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">Guide</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerNavigation.guide.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">Legale</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerNavigation.legale.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white">Contatti</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>{siteConfig.contact.location}</li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-400">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="hover:text-brand-400">
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
          (c) {new Date().getFullYear()} Professione Fitness Academy. Corso Personal Trainer, guide fitness e formazione orientata al lavoro reale.
        </div>
      </Container>
    </footer>
  );
}
