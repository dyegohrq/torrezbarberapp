"use server";

import { z } from "zod";
import { getPublicContent } from "@/app/_data-access/get-public-content";
import {
  collectBookableDates,
  listAvailableStarts,
  type OccupiedRange,
  weekdayFromDate,
} from "@/lib/scheduling/availability";
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
  if (!match || !Number.isInteger(input.durationMinutes) || input.durationMinutes <= 0) {
    return [];
  }

  const content = await getPublicContent();
  const today = todayInFortaleza();
  const lastDay = new Date(Number(match[1]), Number(match[2]), 0).getDate();
  const monthStart = `${match[1]}-${match[2]}-01`;
  const monthEnd = `${match[1]}-${match[2]}-${String(lastDay).padStart(2, "0")}`;
  const from = monthStart < today ? today : monthStart;
  if (from > monthEnd) return [];

  const occupied = await loadOccupiedRange(from, monthEnd, input.ignoreId);

  return collectBookableDates({
    month: input.month,
    today,
    durationMinutes: input.durationMinutes,
    now: new Date(),
    hours: content.hours,
    occupied,
    ignoreId: input.ignoreId,
  });
}

type OccupancyRow = {
  range_id: string | null;
  starts_at: string;
  ends_at: string;
};

function mapOccupancy(rows: OccupancyRow[] | null): OccupiedRange[] {
  return (rows ?? []).map((row) => ({
    id: row.range_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));
}

function eachDate(from: string, to: string) {
  const dates: string[] = [];
  const cursor = new Date(`${from}T12:00:00-03:00`);
  const end = new Date(`${to}T12:00:00-03:00`);

  while (cursor.getTime() <= end.getTime()) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    const day = String(cursor.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

async function loadOccupied(date: string, ignoreId?: string) {
  const ranges = await loadOccupiedRange(date, date, ignoreId);
  return ranges;
}

async function loadOccupiedRange(from: string, to: string, ignoreId?: string) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const period = await supabase.rpc("list_period_occupancy", {
    p_from: from,
    p_to: to,
    p_ignore_id: ignoreId ?? null,
  });

  if (!period.error) {
    return mapOccupancy(period.data as OccupancyRow[] | null);
  }

  const missingFunction =
    period.error.code === "PGRST202" || period.error.message.includes("list_period_occupancy");

  if (!missingFunction) return [];

  const days = await Promise.all(
    eachDate(from, to).map(async (date) => {
      const { data } = await supabase.rpc("list_day_occupancy", {
        p_day: date,
        p_ignore_id: ignoreId ?? null,
      });
      return mapOccupancy(data as OccupancyRow[] | null);
    }),
  );

  return days.flat();
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
