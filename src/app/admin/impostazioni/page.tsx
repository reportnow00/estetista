import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { saveSiteSettingsAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });

  return (
    <>
      <PageHero
        badge="Admin · Contenuti home"
        title="Impostazioni base sito"
        description="Questi campi governano headline, CTA e micro-copy principali della home."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/impostazioni" />
        <form action={saveSiteSettingsAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="siteName" defaultValue={settings?.siteName || ""} placeholder="Nome sito" />
            <Input name="siteTagline" defaultValue={settings?.siteTagline || ""} placeholder="Tagline sito" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input name="supportEmail" defaultValue={settings?.supportEmail || ""} placeholder="Email supporto" />
            <Input name="supportPhone" defaultValue={settings?.supportPhone || ""} placeholder="Telefono" />
          </div>
          <Input name="headOffice" className="mt-4" defaultValue={settings?.headOffice || ""} placeholder="Sede" />
          <Textarea name="heroTitle" className="mt-4" defaultValue={settings?.heroTitle || ""} placeholder="Hero title" />
          <Textarea name="heroSubtitle" className="mt-4" defaultValue={settings?.heroSubtitle || ""} placeholder="Hero subtitle" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input name="heroPrimaryCtaLabel" defaultValue={settings?.heroPrimaryCtaLabel || ""} placeholder="CTA primaria label" />
            <Input name="heroPrimaryCtaHref" defaultValue={settings?.heroPrimaryCtaHref || ""} placeholder="CTA primaria href" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input name="heroSecondaryCtaLabel" defaultValue={settings?.heroSecondaryCtaLabel || ""} placeholder="CTA secondaria label" />
            <Input name="heroSecondaryCtaHref" defaultValue={settings?.heroSecondaryCtaHref || ""} placeholder="CTA secondaria href" />
          </div>
          <Textarea name="trustLine" className="mt-4" defaultValue={settings?.trustLine || ""} placeholder="Trust line" />
          <FormSubmit className="mt-6">Salva impostazioni</FormSubmit>
        </form>
      </Container>
    </>
  );
}
