import { BrandLogo } from "@/app/_components/brand-logo";

export default function MinhaAgendaLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#141414]/95">
        <div className="mx-auto flex h-16 max-w-300 items-center px-5 md:px-8 lg:px-12">
          <BrandLogo />
        </div>
      </header>
      <main className="mx-auto max-w-xl px-5 py-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Sua conta</p>
        <h1 className="font-display mt-2 text-4xl text-white">Meu agendamento</h1>
        <div className="mt-8 border border-[#262626] bg-[#1C1C1C] p-6" aria-busy="true" aria-live="polite">
          <p className="sr-only">Carregando seu agendamento</p>
          <div className="h-8 w-2/3 animate-pulse bg-[#262626]" />
          <div className="mt-4 h-4 w-1/2 animate-pulse bg-[#262626]" />
          <div className="mt-3 h-4 w-24 animate-pulse bg-[#262626]" />
          <div className="mt-6 h-4 w-40 animate-pulse bg-[#262626]" />
        </div>
      </main>
    </div>
  );
}
