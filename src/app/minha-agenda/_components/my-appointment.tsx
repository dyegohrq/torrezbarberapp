"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOwnAppointment } from "@/app/minha-agenda/_actions/cancel";
import type { AppointmentDetail } from "@/lib/content/types";
import { formatAppointmentStamp, formatMoney, formatPhone } from "@/lib/format";
import { canChangeAppointment } from "@/lib/scheduling/availability";

export function MyAppointment({ appointment }: { appointment: AppointmentDetail | null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  if (!appointment) {
    return (
      <div className="border border-[#262626] bg-[#1C1C1C] p-6">
        <p className="text-[#E5E5E5]">Você não tem agendamento futuro.</p>
        <Link href="/agendar" className="mt-4 inline-block text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase">
          Agendar
        </Link>
      </div>
    );
  }

  const allowed = canChangeAppointment(new Date(appointment.startsAt), new Date());

  return (
    <article className="border border-[#262626] bg-[#1C1C1C] p-6">
      <h2 className="font-display text-3xl text-white">{formatAppointmentStamp(appointment.startsAt)}</h2>
      <p className="mt-3 text-[#E5E5E5]">{appointment.services.map((item) => item.serviceName).join(", ")}</p>
      <p className="mt-1 text-sm text-[#9CA3AF]">{appointment.durationMinutes} min</p>
      <p className="mt-1 font-bold text-[#C5A059]">{formatMoney(appointment.priceCents)}</p>
      {allowed ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="border border-[#ffb4ab] px-4 py-2 text-sm text-[#ffb4ab]"
            onClick={async () => {
              if (!window.confirm("Cancelar este horário? A vaga libera na hora.")) return;
              const result = await cancelOwnAppointment(appointment.id);
              setMessage(result.message);
              if (result.success) router.refresh();
            }}
          >
            Cancelar
          </button>
          <Link href={`/agendar?remarcar=${appointment.id}`} className="border border-[#C5A059] px-4 py-2 text-center text-sm text-[#C5A059]">
            Remarcar
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#9CA3AF]">
          Falta menos de 2 horas. Não é mais possível cancelar ou remarcar por aqui.
        </p>
      )}
      {message ? <p className="mt-4 text-sm text-white">{message}</p> : null}
      <p className="mt-6 text-xs text-[#9CA3AF]">Telefone da conta: {formatPhone(appointment.client?.phone ?? "")}</p>
    </article>
  );
}
