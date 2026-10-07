import { AuthCard, SignInForm } from "@/app/entrar/_components/auth-forms";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; pedido?: string; erro?: string }>;
}) {
  const query = await searchParams;

  return (
    <AuthCard title="Entrar">
      {query.erro === "config" ? (
        <p className="mb-4 text-sm text-[#9CA3AF]">
          O Supabase ainda não está configurado neste ambiente.
        </p>
      ) : null}
      <SignInForm next={query.next} pedido={query.pedido} />
    </AuthCard>
  );
}
