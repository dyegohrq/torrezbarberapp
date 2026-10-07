import { AuthCard, SignUpForm } from "@/app/entrar/_components/auth-forms";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; pedido?: string }>;
}) {
  const query = await searchParams;

  return (
    <AuthCard title="Criar conta">
      <SignUpForm next={query.next ?? (query.pedido ? "/" : "/")} pedido={query.pedido} />
    </AuthCard>
  );
}
