import { requireUser } from "@/lib/session";
import { updateProfileAction } from "@/actions/auth";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <>
      <PageHero
        badge="Profilo"
        title="Dati utente"
        description="Questa area gestisce i dati essenziali dell'utente senza appesantire l'esperienza."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar pathname="/dashboard/profilo" />
        <form action={updateProfileAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <input type="hidden" name="id" value={user.id} />
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <Input name="name" defaultValue={user.name} className="mt-2" />
          <label className="mt-4 block text-sm font-medium text-slate-700">Telefono</label>
          <Input name="phone" defaultValue={user.phone || ""} className="mt-2" />
          <label className="mt-4 block text-sm font-medium text-slate-700">Città</label>
          <Input name="city" defaultValue={user.city || ""} className="mt-2" />
          <label className="mt-4 block text-sm font-medium text-slate-700">Bio</label>
          <Textarea name="bio" defaultValue={user.bio || ""} className="mt-2" />
          <FormSubmit className="mt-6">Salva profilo</FormSubmit>
        </form>
      </Container>
    </>
  );
}
