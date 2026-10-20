export const TIME_ZONE = "America/Fortaleza";
const OFFSET = "-03:00";

export type ClockRange = {
  startsAt: string;
  endsAt: string;
};

export type DayHours = {
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
};

export type OccupiedRange = {
  id?: string | null;
  startsAt: string;
  endsAt: string;
};

export type AvailabilityInput = {
  date: string;
  durationMinutes: number;
  now: Date;
  hours: DayHours;
  breaks: ClockRange[];
  occupied: OccupiedRange[];
  ignoreId?: string;
};

function toMinutes(clock: string): number {
  const [hours, minutes] = clock.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function formatClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function zonedDate(date: string, totalMinutes: number): Date {
  return new Date(`${date}T${formatClock(totalMinutes)}:00${OFFSET}`);
}

export function weekdayFromDate(date: string): number {
  return zonedDate(date, 12 * 60).getUTCDay();
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && startB < endA;
}

export function listAvailableStarts(input: AvailabilityInput): string[] {
  const { hours, durationMinutes } = input;

  if (!hours.isOpen || !hours.opensAt || !hours.closesAt || durationMinutes <= 0) {
    return [];
  }

  const opensAt = toMinutes(hours.opensAt);
  const closesAt = toMinutes(hours.closesAt);

  if (closesAt <= opensAt || opensAt + durationMinutes > closesAt) {
    return [];
  }

  const breaks = input.breaks.map((item) => ({
    start: toMinutes(item.startsAt),
    end: toMinutes(item.endsAt),
  }));

  const occupied = input.occupied
    .filter((item) => item.id !== input.ignoreId)
    .map((item) => ({
      start: new Date(item.startsAt).getTime(),
      end: new Date(item.endsAt).getTime(),
    }));

  const starts: string[] = [];

  for (let cursor = opensAt; cursor + durationMinutes <= closesAt; cursor += 30) {
    const end = cursor + durationMinutes;
    const crossesBreak = breaks.some((item) =>
      rangesOverlap(cursor, end, item.start, item.end),
    );

    if (crossesBreak) {
      continue;
    }

    const startDate = zonedDate(input.date, cursor);
    const endDate = startDate.getTime() + durationMinutes * 60_000;

    if (startDate.getTime() < input.now.getTime()) {
      continue;
    }

    const collides = occupied.some((item) =>
      rangesOverlap(startDate.getTime(), endDate, item.start, item.end),
    );

    if (collides) {
      continue;
    }

    starts.push(formatClock(cursor));
  }

  return starts;
}

export function canChangeAppointment(startsAt: Date, now: Date): boolean {
  return now.getTime() <= startsAt.getTime() - 2 * 60 * 60 * 1000;
}

export function dateInFortaleza(value: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

type MonthSchedule = {
  weekday: number;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
  breaks: ClockRange[];
};

export function collectBookableDates(input: {
  month: string;
  today: string;
  durationMinutes: number;
  now: Date;
  hours: MonthSchedule[];
  occupied: OccupiedRange[];
  ignoreId?: string;
}): string[] {
  const match = /^(\d{4})-(\d{2})$/.exec(input.month);
  if (!match || input.durationMinutes <= 0) return [];

  const year = Number(match[1]);
  const month = Number(match[2]);
  const lastDay = new Date(year, month, 0).getDate();
  const spans = input.occupied.flatMap((item) => {
    const start = new Date(item.startsAt);
    const end = new Date(item.endsAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
    return [{ item, startDay: dateInFortaleza(start), endDay: dateInFortaleza(end) }];
  });
  const dates: string[] = [];

  for (let day = 1; day <= lastDay; day += 1) {
    const date = `${match[1]}-${match[2]}-${String(day).padStart(2, "0")}`;
    if (date < input.today) continue;

    const schedule = input.hours.find((item) => item.weekday === weekdayFromDate(date));
    if (!schedule) continue;

    const slots = listAvailableStarts({
      date,
      durationMinutes: input.durationMinutes,
      now: input.now,
      hours: schedule,
      breaks: schedule.breaks,
      occupied: spans
        .filter((span) => span.startDay <= date && span.endDay >= date)
        .map((span) => span.item),
      ignoreId: input.ignoreId,
    });

    if (slots.length > 0) dates.push(date);
  }

  return dates;
}
