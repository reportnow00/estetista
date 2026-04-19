import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FormSubmit } from "@/components/ui/form-submit";
import { requestPasswordResetAction } from "@/actions/auth";

export const metadata = buildMetadata({
  title: "Recupero password | Professione Fitness Academy",
  description: "Richiedi un link per reimpostare la password del tuo account.",
  noindex: true
});

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <>
      <PageHero
        badge="Recupero password"
        title="Richiedi il link di reset"
        description="Inserisci la tua email per ricevere il link di reimpostazione password."
      />
      <Container className="max-w-xl py-16">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {decodeURIComponent(error)}
          </div>
        ) : null}
        {sent ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Se l&apos;email esiste, il link di reset e stato generato correttamente.
          </div>
        ) : null}
        <form action={requestPasswordResetAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input name="email" type="email" className="mt-2" required />
          <FormSubmit className="mt-6 w-full">Invia richiesta</FormSubmit>
        </form>
      </Container>
    </>
  );
}
