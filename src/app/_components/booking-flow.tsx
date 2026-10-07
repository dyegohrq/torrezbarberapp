"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { confirmAppointment, getBookableDates, getSlots } from "@/app/agendar/_actions/booking";
import type { AppointmentDetail, HoursItem, Profile, ServiceItem } from "@/lib/content/types";
import { formatDateLabel, formatMoney, formatPhone, weekdayLabel } from "@/lib/format";
import { zonedDate } from "@/lib/scheduling/availability";

type BookingFlowProps = {
  services: ServiceItem[];
  hours: HoursItem[];
  profile: Profile | null;
  futureAppointment: AppointmentDetail | null;
  rescheduleFrom?: AppointmentDetail | null;
  onClose?: () => void;
};

export function BookingFlow({
  services,
  hours,
  profile,
  futureAppointment,
  rescheduleFrom,
  onClose,
}: BookingFlowProps) {
  const blockedByFuture = Boolean(futureAppointment && !rescheduleFrom);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>(
    rescheduleFrom?.services.map((item) => item.serviceId).filter((id): id is string => Boolean(id)) ??
      [],
  );
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [openDates, setOpenDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const chosen = services.filter((service) => selected.includes(service.id));
  const duration = chosen.reduce((sum, service) => sum + service.durationMinutes, 0);
  const total = chosen.reduce((sum, service) => sum + service.priceCents, 0);
  const hoursNote = hours
    .map((day) =>
      day.isOpen
        ? `${weekdayLabel(day.weekday)} ${day.opensAt}–${day.closesAt}`
        : `${weekdayLabel(day.weekday)} fechado`,
    )
    .join(" · ");

  useEffect(() => {
    if (step !== 2 || duration <= 0) return;

    let active = true;
    setLoading(true);
    getBookableDates({
      month,
      durationMinutes: duration,
      ignoreId: rescheduleFrom?.id,
    }).then((dates) => {
      if (!active) return;
      setOpenDates(dates);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [step, month, duration, rescheduleFrom?.id]);

  useEffect(() => {
    if (step !== 3 || !date) return;

    let active = true;
    setLoading(true);
    getSlots({
      date,
      durationMinutes: duration,
      ignoreId: rescheduleFrom?.id,
    }).then((nextSlots) => {
      if (!active) return;
      setSlots(nextSlots);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [step, date, duration, rescheduleFrom?.id]);

  const calendar = useMemo(() => buildCalendar(month), [month]);

  async function handleConfirm() {
    if (!date || !time) return;
    setLoading(true);
    setMessage("");
    const [hoursPart, minutesPart] = time.split(":").map(Number);
    const startsAt = zonedDate(date, hoursPart * 60 + minutesPart).toISOString();
    const result = await confirmAppointment({
      startsAt,
      serviceIds: selected,
      rescheduleId: rescheduleFrom?.id,
    });
    setLoading(false);
    setMessage(result.message);
    if (result.success) setDone(true);
  }

  return (
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[8px] border border-[#333] bg-[#141414] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-[#262626] px-5 py-4">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">
          Agendamento — etapa {Math.min(step, 5)} de 5
        </p>
        {onClose ? (
          <button type="button" aria-label="Fechar" onClick={onClose}>
            <X className="text-white" />
          </button>
        ) : null}
      </div>

      <div className="overflow-y-auto px-5 py-6 md:px-8">
        {blockedByFuture ? (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-white">Você já tem um horário</h2>
            <p className="text-sm text-[#9CA3AF]">
              Só é possível um agendamento futuro por vez. Cancele ou remarque o atual para escolher outro.
            </p>
            <Link href="/minha-agenda" className="inline-block text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase">
              Ver meu agendamento
            </Link>
          </div>
        ) : done ? (
          <div className="space-y-3">
            <h2 className="font-display text-3xl text-white">Horário reservado</h2>
            <p className="text-[#E5E5E5]">{message}</p>
            <p className="text-sm text-[#9CA3AF]">
              {chosen.map((service) => service.name).join(", ")} · {formatDateLabel(date)} às {time}
            </p>
            <Link href="/minha-agenda" className="inline-block text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase">
              Ver comprovante
            </Link>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <StepServices services={services} selected={selected} onToggle={toggle} />
            ) : null}
            {step === 2 ? (
              <StepDate
                calendar={calendar}
                month={month}
                openDates={openDates}
                date={date}
                loading={loading}
                hoursNote={hoursNote}
                onMonth={setMonth}
                onDate={(value) => {
                  setDate(value);
                  setTime("");
                }}
              />
            ) : null}
            {step === 3 ? (
              <StepTime slots={slots} time={time} loading={loading} onTime={setTime} />
            ) : null}
            {step === 4 ? (
              profile ? (
                <StepProfile profile={profile} />
              ) : (
                <p className="text-sm text-[#9CA3AF]">
                  Entre na sua conta para confirmar. Sem o Supabase configurado, a reserva não é gravada.
                </p>
              )
            ) : null}
            {step === 5 && profile ? (
              <StepReview
                services={chosen}
                date={date}
                time={time}
                profile={profile}
                total={total}
                duration={duration}
              />
            ) : null}
            {step === 5 && !profile ? (
              <p className="text-sm text-[#9CA3AF]">A confirmação grava o horário na agenda depois do login.</p>
            ) : null}
            {message ? <p className="mt-4 text-sm text-[#ffb4ab]">{message}</p> : null}
          </>
        )}
      </div>

      {!blockedByFuture && !done ? (
        <div className="flex flex-col gap-3 border-t border-[#262626] px-5 py-4 md:px-8">
          <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
            <span>{chosen.length} serviço(s)</span>
            <span className="font-bold text-[#C5A059] tabular-nums">{formatMoney(total)}</span>
          </div>
          {step < 5 ? (
            <button
              type="button"
              disabled={!canContinue(step, selected, date, time)}
              onClick={() => setStep((current) => current + 1)}
              className="bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37] disabled:opacity-40"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !profile}
              onClick={handleConfirm}
              className="bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37] disabled:opacity-40"
            >
              {loading ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          )}
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="border border-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase"
            >
              ← Voltar
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }
}

function canContinue(step: number, selected: string[], date: string, time: string) {
  if (step === 1) return selected.length > 0;
  if (step === 2) return Boolean(date);
  if (step === 3) return Boolean(time);
  return true;
}

function StepServices({
  services,
  selected,
  onToggle,
}: {
  services: ServiceItem[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">Escolha seu serviço</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">Você pode marcar mais de um. Duração e valor são a soma.</p>
      <ul className="mt-6 divide-y divide-[#262626]">
        {services.map((service) => {
          const active = selected.includes(service.id);
          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => onToggle(service.id)}
                className={`flex w-full items-center justify-between py-4 text-left ${active ? "text-[#C5A059]" : "text-white"}`}
              >
                <span>
                  <span className="block font-semibold">{service.name}</span>
                  <span className="text-sm text-[#9CA3AF]">{service.durationMinutes} min</span>
                </span>
                <span className="font-bold text-[#C5A059] tabular-nums">{formatMoney(service.priceCents)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StepDate({
  calendar,
  month,
  openDates,
  date,
  loading,
  hoursNote,
  onMonth,
  onDate,
}: {
  calendar: Array<{ date: string; label: number; inMonth: boolean }>;
  month: string;
  openDates: string[];
  date: string;
  loading: boolean;
  hoursNote: string;
  onMonth: (value: string) => void;
  onDate: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">Escolha a data</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">{loading ? "Calculando dias..." : "Dias sem horário ficam esmaecidos."}</p>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" className="text-[#C5A059]" onClick={() => onMonth(shiftMonth(month, -1))}>
          ←
        </button>
        <p className="text-sm font-semibold text-white uppercase">{month}</p>
        <button type="button" className="text-[#C5A059]" onClick={() => onMonth(shiftMonth(month, 1))}>
          →
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {calendar.map((cell) => {
          const available = openDates.includes(cell.date);
          return (
            <button
              key={cell.date}
              type="button"
              disabled={!available}
              onClick={() => onDate(cell.date)}
              className={`h-10 text-sm ${
                date === cell.date
                  ? "bg-[#C5A059] text-[#0D0D0D]"
                  : available
                    ? "border border-[#262626] text-white"
                    : "text-[#4E4639]"
              }`}
            >
              {cell.inMonth ? cell.label : ""}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[#9CA3AF]">{hoursNote}</p>
    </div>
  );
}

function StepTime({
  slots,
  time,
  loading,
  onTime,
}: {
  slots: string[];
  time: string;
  loading: boolean;
  onTime: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">Escolha o horário</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">Um barbeiro. A grade é de 30 minutos e só mostra inícios que cabem.</p>
      {loading ? <p className="mt-6 text-sm text-[#9CA3AF]">Carregando horários...</p> : null}
      {!loading && slots.length === 0 ? (
        <p className="mt-6 text-sm text-[#9CA3AF]">Não há horário livre nesse dia para a duração escolhida.</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTime(slot)}
              className={`py-3 text-sm font-semibold tabular-nums ${
                time === slot ? "bg-[#C5A059] text-[#0D0D0D]" : "border border-[#262626] text-white"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StepProfile({ profile }: { profile: Profile }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">Seus dados</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">Usamos a conta que está logada. Nada é enviado ao WhatsApp.</p>
      <dl className="mt-6 space-y-3 text-sm">
        <Row label="Nome" value={profile.fullName} />
        <Row label="Telefone" value={formatPhone(profile.phone)} />
        <Row label="E-mail" value={profile.email} />
      </dl>
    </div>
  );
}

function StepReview({
  services,
  date,
  time,
  profile,
  total,
  duration,
}: {
  services: ServiceItem[];
  date: string;
  time: string;
  profile: Profile;
  total: number;
  duration: number;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white">Confira seu agendamento</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <Row label="Serviços" value={services.map((service) => service.name).join(", ")} />
        <Row label="Data" value={formatDateLabel(date)} />
        <Row label="Horário" value={time} />
        <Row label="Duração" value={`${duration} min`} />
        <Row label="Cliente" value={profile.fullName} />
        <Row label="Telefone" value={formatPhone(profile.phone)} />
        <div className="flex justify-between border-t border-[#262626] pt-3">
          <dt className="text-[#9CA3AF]">Valor</dt>
          <dd className="font-bold text-[#C5A059] tabular-nums">{formatMoney(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#262626] pb-3">
      <dt className="text-[#9CA3AF]">{label}</dt>
      <dd className="text-right text-white">{value}</dd>
    </div>
  );
}

function buildCalendar(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const startPad = first.getUTCDay();
  const days = new Date(year, monthNumber, 0).getDate();
  const cells: Array<{ date: string; label: number; inMonth: boolean }> = [];

  for (let index = 0; index < startPad; index += 1) {
    cells.push({ date: `pad-${index}`, label: 0, inMonth: false });
  }

  for (let day = 1; day <= days; day += 1) {
    cells.push({
      date: `${month}-${String(day).padStart(2, "0")}`,
      label: day,
      inMonth: true,
    });
  }

  return cells;
}

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
