import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FormSubmit } from "@/components/ui/form-submit";
import { loginAction } from "@/actions/auth";
import { getSafeRedirectPath } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Login | Professione Fitness Academy",
  description: "Accedi alla tua area utente o al pannello admin della piattaforma.",
  noindex: true
});

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const nextPath = getSafeRedirectPath(next, "");
  const registerHref = nextPath ? `/registrazione?next=${encodeURIComponent(nextPath)}` : "/registrazione";

  return (
    <>
      <PageHero
        badge="Login"
        title="Accedi alla tua area riservata"
        description="Utenti e amministratori utilizzano lo stesso sistema di autenticazione. Il ruolo definisce poi l'area di destinazione."
      />
      <Container className="max-w-xl py-16">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{decodeURIComponent(error)}</div> : null}
        <form action={loginAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <input type="hidden" name="next" value={nextPath} />
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input name="email" type="email" className="mt-2" required />
          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <Input name="password" type="password" className="mt-2" required />
          <FormSubmit className="mt-6 w-full">Accedi</FormSubmit>
          <div className="mt-5 flex justify-between text-sm">
            <Link href={registerHref} className="text-brand-800">
              Crea un account
            </Link>
            <Link href="/recupero-password" className="text-brand-800">
              Password dimenticata
            </Link>
          </div>
        </form>
      </Container>
    </>
  );
}
