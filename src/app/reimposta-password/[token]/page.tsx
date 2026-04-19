import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FormSubmit } from "@/components/ui/form-submit";
import { resetPasswordAction } from "@/actions/auth";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata = buildMetadata({
  title: "Reimposta password | Professione Fitness Academy",
  description: "Imposta una nuova password per accedere alla piattaforma.",
  noindex: true
});

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  const action = resetPasswordAction.bind(null, token);

  return (
    <>
      <PageHero
        badge="Nuova password"
        title="Scegli una nuova password"
        description="Una volta confermata, potrai tornare subito nella tua area riservata."
      />
      <Container className="max-w-xl py-16">
        <form action={action} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <label className="text-sm font-medium text-slate-700">Nuova password</label>
          <Input name="password" type="password" className="mt-2" required />
          <FormSubmit className="mt-6 w-full">Salva password</FormSubmit>
        </form>
      </Container>
    </>
  );
}
