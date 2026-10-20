import { mapAppointment } from "@/app/_data-access/get-public-content";
import type { AppointmentDetail, Profile } from "@/lib/content/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Lê a sessão que o proxy já validou e busca perfil e agendamento em paralelo.
 * `getUser()` iria repetir a ida ao servidor de autenticação.
 */
export async function getAgendaPage(): Promise<{
  profile: Profile | null;
  appointment: AppointmentDetail | null;
}> {
  if (!hasSupabaseEnv()) {
    return { profile: null, appointment: null };
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    return { profile: null, appointment: null };
  }

  const [profileResult, appointmentResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, role, full_name, phone, email")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("appointments")
      .select("id, starts_at, duration_minutes, price_cents, status, appointment_services(*)")
      .eq("client_id", userId)
      .eq("status", "confirmed")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(1)
      .maybeSingle(),
  ]);

  const profile: Profile | null = profileResult.data
    ? {
        id: profileResult.data.id,
        role: profileResult.data.role,
        fullName: profileResult.data.full_name,
        phone: profileResult.data.phone,
        email: profileResult.data.email,
      }
    : null;

  const appointment = appointmentResult.data ? mapAppointment(appointmentResult.data) : null;

  if (appointment && profile) {
    appointment.client = {
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
    };
  }

  return { profile, appointment };
}
