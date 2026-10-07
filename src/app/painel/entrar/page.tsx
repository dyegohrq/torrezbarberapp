import { AuthCard, OwnerSignInForm } from "@/app/entrar/_components/auth-forms";

export default async function PainelEntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const query = await searchParams;

  return (
    <AuthCard title="Painel do dono">
      <OwnerSignInForm denied={query.erro === "acesso"} />
    </AuthCard>
  );
}
