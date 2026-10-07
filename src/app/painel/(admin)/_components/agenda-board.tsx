"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  cancelByOwner,
  createBlock,
  markNotificationRead,
  removeBlock,
} from "@/app/painel/(admin)/_actions/agenda";
import type { AppointmentDetail, HoursItem, OwnerNotification, TimeBlock } from "@/lib/content/types";
import { formatAppointmentStamp, formatMoney, formatPhone } from "@/lib/format";
import { formatClock, zonedDate } from "@/lib/scheduling/availability";

export function AgendaBoard({
  date,
  hours,
  appointments,
  blocks,
  notifications,
}: {
  date: string;
  hours: HoursItem;
  appointments: AppointmentDetail[];
  blocks: TimeBlock[];
  notifications: OwnerNotification[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<AppointmentDetail | null>(null);
  const [message, setMessage] = useState("");
  const [blockStart, setBlockStart] = useState("09:00");
  const [blockEnd, setBlockEnd] = useState("10:00");
  const unread = notifications.filter((item) => !item.readAt).length;
  const slots = buildSlots(hours);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-white">Agenda</h1>
            <p className="mt-2 text-sm text-[#9CA3AF]">O dono cancela ou bloqueia. Não há remarcação pelo cliente nesta tela.</p>
          </div>
          <form action="/painel">
            <input
              type="date"
              name="dia"
              defaultValue={date}
              className="border border-[#262626] bg-[#1C1C1C] px-3 py-2 text-white"
              onChange={(event) => router.push(`/painel?dia=${event.target.value}`)}
            />
          </form>
        </div>
        <WeekStrip date={date} />
        {!hours.isOpen ? (
          <p className="mt-8 text-[#9CA3AF]">Este dia está fechado.</p>
        ) : (
          <ul className="mt-6 divide-y divide-[#262626] border border-[#262626]">
            {slots.map((slot) => {
              const start = zonedDate(date, slot);
              const end = start.getTime() + 30 * 60_000;
              const appointment = appointments.find((item) => covers(item.startsAt, item.durationMinutes, start.getTime(), end));
              const block = blocks.find((item) => overlaps(item.startsAt, item.endsAt, start.getTime(), end));
              const tone = appointment ? "bg-[#C5A059]/20" : block ? "bg-[#2A2A2A]" : "";

              return (
                <li key={slot}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between px-4 py-3 text-left ${tone}`}
                    onClick={() => setSelected(appointment ?? null)}
                  >
                    <span className="tabular-nums text-white">{formatClock(slot)}</span>
                    <span className="text-sm text-[#9CA3AF]">
                      {appointment
                        ? appointment.client?.fullName ?? "Ocupado"
                        : block
                          ? "Bloqueado"
                          : "Livre"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="space-y-6">
        <div className="border border-[#262626] bg-[#141414] p-4">
          <h2 className="text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase">
            Avisos {unread > 0 ? `(${unread})` : ""}
          </h2>
          <ul className="mt-3 space-y-3">
            {notifications.length === 0 ? <li className="text-sm text-[#9CA3AF]">Nenhum aviso.</li> : null}
            {notifications.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`text-left text-sm ${item.readAt ? "text-[#9CA3AF]" : "text-white"}`}
                  onClick={() => markNotificationRead(item.id)}
                >
                  {item.body}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <div className="border border-[#262626] bg-[#1C1C1C] p-4">
            <h2 className="text-lg text-white">{selected.client?.fullName}</h2>
            <p className="mt-2 text-sm">{formatPhone(selected.client?.phone ?? "")}</p>
            <p className="text-sm">{selected.client?.email}</p>
            <p className="mt-3 text-sm text-[#9CA3AF]">
              {selected.services.map((service) => service.serviceName).join(", ")}
            </p>
            <p className="text-sm">{selected.durationMinutes} min</p>
            <p className="font-bold text-[#C5A059]">{formatMoney(selected.priceCents)}</p>
            <p className="mt-2 text-xs text-[#9CA3AF]">{formatAppointmentStamp(selected.startsAt)}</p>
            <button
              type="button"
              className="mt-4 w-full border border-[#ffb4ab] py-2 text-sm text-[#ffb4ab]"
              onClick={async () => {
                const result = await cancelByOwner(selected.id);
                setMessage(result.message);
                if (result.success) {
                  setSelected(null);
                  router.refresh();
                }
              }}
            >
              Cancelar agendamento
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#9CA3AF]">Abra um horário ocupado para ver nome, telefone, e-mail, duração e valor.</p>
        )}

        <form
          className="space-y-3 border border-[#262626] p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const [startHour, startMinute] = blockStart.split(":").map(Number);
            const [endHour, endMinute] = blockEnd.split(":").map(Number);
            const result = await createBlock(
              zonedDate(date, startHour * 60 + startMinute).toISOString(),
              zonedDate(date, endHour * 60 + endMinute).toISOString(),
            );
            setMessage(result.message);
            if (result.success) router.refresh();
          }}
        >
          <h2 className="text-sm font-bold tracking-[0.08em] text-white uppercase">Bloquear faixa</h2>
          <input type="time" value={blockStart} onChange={(event) => setBlockStart(event.target.value)} className="w-full border border-[#262626] bg-[#1C1C1C] px-3 py-2" />
          <input type="time" value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} className="w-full border border-[#262626] bg-[#1C1C1C] px-3 py-2" />
          <button type="submit" className="w-full bg-[#C5A059] py-2 text-sm font-bold text-[#0D0D0D] uppercase">
            Bloquear
          </button>
        </form>

        <ul className="space-y-2">
          {blocks.map((block) => (
            <li key={block.id} className="flex items-center justify-between text-sm">
              <span>
                {formatAppointmentStamp(block.startsAt)} – {formatAppointmentStamp(block.endsAt)}
              </span>
              <button
                type="button"
                className="text-[#C5A059]"
                onClick={async () => {
                  const result = await removeBlock(block.id);
                  setMessage(result.message);
                  if (result.success) router.refresh();
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
        {message ? <p className="text-sm text-[#E5E5E5]">{message}</p> : null}
      </aside>
    </div>
  );
}

function WeekStrip({ date }: { date: string }) {
  const weekday = new Date(`${date}T12:00:00-03:00`).getUTCDay();
  const days = Array.from({ length: 7 }, (_, index) => addDays(date, index - weekday));

  return (
    <div className="mt-6 flex gap-2 overflow-x-auto">
      {days.map((day) => (
        <a
          key={day}
          href={`/painel?dia=${day}`}
          className={`px-3 py-2 text-sm ${day === date ? "bg-[#C5A059] text-[#0D0D0D]" : "border border-[#262626] text-white"}`}
        >
          {day.slice(8)}
        </a>
      ))}
    </div>
  );
}

function addDays(date: string, amount: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + amount)).toISOString().slice(0, 10);
}

function buildSlots(hours: HoursItem) {
  if (!hours.isOpen || !hours.opensAt || !hours.closesAt) return [];
  const [openHour, openMinute] = hours.opensAt.split(":").map(Number);
  const [closeHour, closeMinute] = hours.closesAt.split(":").map(Number);
  const slots: number[] = [];
  for (let cursor = openHour * 60 + openMinute; cursor < closeHour * 60 + closeMinute; cursor += 30) {
    slots.push(cursor);
  }
  return slots;
}

function covers(startsAt: string, durationMinutes: number, slotStart: number, slotEnd: number) {
  const start = new Date(startsAt).getTime();
  const end = start + durationMinutes * 60_000;
  return start < slotEnd && slotStart < end;
}

function overlaps(startsAt: string, endsAt: string, slotStart: number, slotEnd: number) {
  return new Date(startsAt).getTime() < slotEnd && slotStart < new Date(endsAt).getTime();
}
