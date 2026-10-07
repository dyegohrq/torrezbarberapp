"use server";

import { z } from "zod";
import { getPublicContent } from "@/app/_data-access/get-public-content";
import { listAvailableStarts, weekdayFromDate } from "@/lib/scheduling/availability";
import { todayInFortaleza } from "@/lib/format";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const slotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMinutes: z.number().int().positive(),
  ignoreId: z.string().uuid().optional(),
});

export async function getSlots(input: {
  date: string;
  durationMinutes: number;
  ignoreId?: string;
}): Promise<string[]> {
  const parsed = slotsSchema.safeParse(input);
  if (!parsed.success) return [];

  const content = await getPublicContent();
  const day = content.hours.find((item) => item.weekday === weekdayFromDate(parsed.data.date));

  if (!day) return [];

  const occupied = await loadOccupied(parsed.data.date, parsed.data.ignoreId);

  return listAvailableStarts({
    date: parsed.data.date,
    durationMinutes: parsed.data.durationMinutes,
    now: new Date(),
    hours: {
      isOpen: day.isOpen,
      opensAt: day.opensAt,
      closesAt: day.closesAt,
    },
    breaks: day.breaks.map((item) => ({
      startsAt: item.startsAt,
      endsAt: item.endsAt,
    })),
    occupied,
    ignoreId: parsed.data.ignoreId,
  });
}

export async function getBookableDates(input: {
  month: string;
  durationMinutes: number;
  ignoreId?: string;
}): Promise<string[]> {
  const match = /^(\d{4})-(\d{2})$/.exec(input.month);
  if (!match) return [];

  const year = Number(match[1]);
  const month = Number(match[2]);
  const lastDay = new Date(year, month, 0).getDate();
  const today = todayInFortaleza();
  const dates: string[] = [];

  for (let day = 1; day <= lastDay; day += 1) {
    const date = `${match[1]}-${match[2]}-${String(day).padStart(2, "0")}`;
    if (date < today) continue;

    const slots = await getSlots({
      date,
      durationMinutes: input.durationMinutes,
      ignoreId: input.ignoreId,
    });

    if (slots.length > 0) {
      dates.push(date);
    }
  }

  return dates;
}

async function loadOccupied(date: string, ignoreId?: string) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data } = await supabase.rpc("list_day_occupancy", {
    p_day: date,
    p_ignore_id: ignoreId ?? null,
  });

  return (data ?? []).map((row: { range_id: string | null; starts_at: string; ends_at: string }) => ({
    id: row.range_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));
}

const bookSchema = z.object({
  startsAt: z.string().min(16),
  serviceIds: z.array(z.string().uuid()).min(1),
  rescheduleId: z.string().uuid().optional(),
});

export async function confirmAppointment(input: {
  startsAt: string;
  serviceIds: string[];
  rescheduleId?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
  if (!hasSupabaseEnv()) {
    return {
      success: false,
      message: "O agendamento fica disponível quando o Supabase estiver configurado.",
    };
  }

  const parsed = bookSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Revise os dados do agendamento." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Entre na sua conta para confirmar." };
  }

  const result = parsed.data.rescheduleId
    ? await supabase.rpc("reschedule_appointment", {
        p_appointment_id: parsed.data.rescheduleId,
        p_starts_at: parsed.data.startsAt,
        p_service_ids: parsed.data.serviceIds,
      })
    : await supabase.rpc("book_appointment", {
        p_starts_at: parsed.data.startsAt,
        p_service_ids: parsed.data.serviceIds,
      });

  if (result.error) {
    return { success: false, message: result.error.message };
  }

  return {
    success: true,
    message: parsed.data.rescheduleId
      ? "Horário remarcado. O anterior foi liberado."
      : "Agendamento confirmado.",
    id: result.data as string,
  };
}
