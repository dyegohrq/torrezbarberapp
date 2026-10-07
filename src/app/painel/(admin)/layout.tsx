import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/_actions/sign-out";
import { getSessionProfile } from "@/app/_data-access/get-public-content";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "owner") {
    redirect("/painel/entrar");
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <header className="border-b border-[#262626] bg-[#141414]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Painel</p>
            <p className="text-sm text-white">{profile.fullName}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/painel" className="text-white">Agenda</Link>
            <Link href="/painel/conteudo" className="text-white">Conteúdo</Link>
            <Link href="/" className="text-[#9CA3AF]">Site</Link>
            <form action={signOut}>
              <input type="hidden" name="next" value="/painel/entrar" />
              <button type="submit" className="text-[#C5A059]">Sair</button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1200px] px-5 py-8">{children}</div>
    </div>
  );
}
