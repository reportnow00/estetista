import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FormSubmit } from "@/components/ui/form-submit";
import { registerAction } from "@/actions/auth";
import { getSafeRedirectPath } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Registrazione | Professione Fitness Academy",
  description: "Crea il tuo account per acquistare il corso e accedere all'area miei corsi.",
  noindex: true
});

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const nextPath = getSafeRedirectPath(next, "");
  const loginHref = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";

  return (
    <>
      <PageHero
        badge="Registrazione"
        title="Crea il tuo account"
        description="La registrazione e il primo passo per acquistare il corso, accedere alla dashboard e seguire i contenuti riservati."
      />
      <Container className="max-w-xl py-16">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{decodeURIComponent(error)}</div> : null}
        <form action={registerAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <input type="hidden" name="next" value={nextPath} />
          <label className="text-sm font-medium text-slate-700">Nome e cognome</label>
          <Input name="name" className="mt-2" required />
          <label className="mt-4 block text-sm font-medium text-slate-700">Email</label>
          <Input name="email" type="email" className="mt-2" required />
          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <Input name="password" type="password" className="mt-2" required />
          <FormSubmit className="mt-6 w-full">Registrati</FormSubmit>
          <div className="mt-5 text-sm">
            Hai gia un account?{" "}
            <Link href={loginHref} className="text-brand-800">
              Vai al login
            </Link>
          </div>
        </form>
      </Container>
    </>
  );
}
