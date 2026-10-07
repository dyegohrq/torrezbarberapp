"use server";

import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/app/_data-access/get-public-content";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function ownerClient() {
  if (!hasSupabaseEnv()) {
    return { error: "Configure o Supabase para usar o painel." as const, supabase: null };
  }

  const profile = await getSessionProfile();
  if (profile?.role !== "owner") {
    return { error: "Acesso restrito ao dono." as const, supabase: null };
  }

  return { error: null, supabase: await createClient() };
}

export async function cancelByOwner(appointmentId: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return { success: false, message: gate.error };

  const { error } = await gate.supabase.rpc("cancel_appointment_by_owner", {
    p_appointment_id: appointmentId,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/painel");
  revalidatePath("/minha-agenda");
  return { success: true, message: "Agendamento cancelado. O horário ficou livre." };
}

export async function createBlock(startsAt: string, endsAt: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return { success: false, message: gate.error };

  const { error } = await gate.supabase.rpc("create_time_block", {
    p_starts_at: startsAt,
    p_ends_at: endsAt,
  });

  if (error) {
    return {
      success: false,
      message: error.message.includes("ocupado")
        ? "Horário ocupado. Cancele o agendamento antes de bloquear."
        : error.message,
    };
  }

  revalidatePath("/painel");
  return { success: true, message: "Horário bloqueado." };
}

export async function removeBlock(blockId: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return { success: false, message: gate.error };

  const { error } = await gate.supabase.rpc("delete_time_block", { p_block_id: blockId });
  if (error) return { success: false, message: error.message };

  revalidatePath("/painel");
  return { success: true, message: "Bloqueio removido." };
}

export async function markNotificationRead(id: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return;

  await gate.supabase
    .from("owner_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .is("read_at", null);

  revalidatePath("/painel");
}
