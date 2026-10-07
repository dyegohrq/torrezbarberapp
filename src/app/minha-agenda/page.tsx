import { SiteHeader } from "@/app/_components/site-header";

export const dynamic = "force-dynamic";
import { getFutureAppointment, getSessionProfile } from "@/app/_data-access/get-public-content";
import { MyAppointment } from "@/app/minha-agenda/_components/my-appointment";

export default async function MinhaAgendaPage() {
  const profile = await getSessionProfile();
  const appointment = profile ? await getFutureAppointment(profile.id) : null;

  if (appointment && profile) {
    appointment.client = {
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
    };
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <SiteHeader profile={profile} />
      <main className="mx-auto max-w-xl px-5 py-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Sua conta</p>
        <h1 className="font-display mt-2 text-4xl text-white">Meu agendamento</h1>
        <div className="mt-8">
          <MyAppointment appointment={appointment} />
        </div>
      </main>
    </div>
  );
}
