"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionProfile } from "@/app/_data-access/get-public-content";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const clockSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/);

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
  return { success: true, message: "Horário bloqueado neste dia." };
}

export async function createDailyBlock(startsAt: string, endsAt: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return { success: false, message: gate.error };

  const parsed = z.object({ startsAt: clockSchema, endsAt: clockSchema }).safeParse({ startsAt, endsAt });
  if (!parsed.success) {
    return { success: false, message: "Informe um horário válido." };
  }

  const startMinutes = clockToMinutes(parsed.data.startsAt);
  const endMinutes = clockToMinutes(parsed.data.endsAt);
  if (endMinutes <= startMinutes) {
    return { success: false, message: "O fim do bloqueio precisa ser depois do início." };
  }

  const { error } = await gate.supabase.rpc("create_daily_time_block", {
    p_starts_at: parsed.data.startsAt.slice(0, 5),
    p_ends_at: parsed.data.endsAt.slice(0, 5),
  });

  if (error) {
    return { success: false, message: blockErrorMessage(error.message) };
  }

  revalidatePath("/painel");
  return { success: true, message: "Horário bloqueado todos os dias." };
}

export async function removeDailyBlock(blockId: string) {
  const gate = await ownerClient();
  if (!gate.supabase) return { success: false, message: gate.error };

  const parsed = z.string().uuid().safeParse(blockId);
  if (!parsed.success) return { success: false, message: "Bloqueio não encontrado." };

  const { error } = await gate.supabase.rpc("delete_daily_time_block", { p_block_id: parsed.data });
  if (error) return { success: false, message: blockErrorMessage(error.message) };

  revalidatePath("/painel");
  return { success: true, message: "Bloqueio diário removido." };
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

function clockToMinutes(value: string) {
  const [hour, minute] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

function blockErrorMessage(message: string) {
  if (message.includes("create_daily_time_block") || message.includes("delete_daily_time_block")) {
    return "Rode a migration 014_daily_time_blocks.sql no SQL Editor para ativar o bloqueio diário.";
  }

  if (message.includes("ocupado")) {
    return "Horário ocupado. Cancele o agendamento antes de bloquear.";
  }

  return message;
}
