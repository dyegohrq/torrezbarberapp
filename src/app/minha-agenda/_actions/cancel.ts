"use server";

import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/app/_data-access/get-public-content";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function cancelOwnAppointment(appointmentId: string) {
  if (!hasSupabaseEnv()) {
    return { success: false, message: "Configure o Supabase para cancelar." };
  }

  const profile = await getSessionProfile();
  if (!profile) return { success: false, message: "Entre na sua conta." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_appointment_by_client", {
    p_appointment_id: appointmentId,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/minha-agenda");
  revalidatePath("/painel");
  return { success: true, message: "Agendamento cancelado. O horário foi liberado." };
}
