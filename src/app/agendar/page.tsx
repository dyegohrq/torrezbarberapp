import { redirect } from "next/navigation";
import { BookingFlow } from "@/app/_components/booking-flow";
import { SiteHeader } from "@/app/_components/site-header";
import {
  getFutureAppointment,
  getPublicContent,
  getSessionProfile,
  mapAppointment,
} from "@/app/_data-access/get-public-content";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ remarcar?: string }>;
}) {
  const query = await searchParams;
  const profile = await getSessionProfile();

  if (!profile && hasSupabaseEnv()) {
    const next = query.remarcar ? `/agendar?remarcar=${query.remarcar}` : "/agendar";
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }

  const content = await getPublicContent();
  const futureAppointment = profile ? await getFutureAppointment(profile.id) : null;
  let rescheduleFrom = null;

  if (query.remarcar && profile && hasSupabaseEnv()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("appointments")
      .select("id, starts_at, duration_minutes, price_cents, status, appointment_services(*)")
      .eq("id", query.remarcar)
      .eq("client_id", profile.id)
      .eq("status", "confirmed")
      .maybeSingle();

    rescheduleFrom = data ? mapAppointment(data) : null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <SiteHeader profile={profile} />
      <main className="mx-auto flex max-w-3xl justify-center px-4 py-10">
        <BookingFlow
          services={content.services}
          hours={content.hours}
          profile={profile}
          futureAppointment={futureAppointment}
          rescheduleFrom={rescheduleFrom}
        />
      </main>
    </div>
  );
}
