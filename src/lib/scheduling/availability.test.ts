import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canChangeAppointment,
  listAvailableStarts,
  type AvailabilityInput,
  type DayHours,
} from "./availability.ts";
// O teste roda no Node com type stripping. O tsconfig ignora este arquivo.

const openDay: DayHours = {
  isOpen: true,
  opensAt: "09:00",
  closesAt: "18:00",
};

const base: AvailabilityInput = {
  date: "2026-10-06",
  durationMinutes: 60,
  now: new Date("2026-10-06T08:00:00-03:00"),
  hours: openDay,
  breaks: [],
  occupied: [],
};

describe("listAvailableStarts", () => {
  it("esconde os blocos cobertos por um atendimento de 60 min às 09:00", () => {
    const starts = listAvailableStarts({
      ...base,
      occupied: [
        {
          id: "apt-1",
          startsAt: "2026-10-06T09:00:00-03:00",
          endsAt: "2026-10-06T10:00:00-03:00",
        },
      ],
    });

    assert.equal(starts.includes("09:00"), false);
    assert.equal(starts.includes("09:30"), false);
    assert.equal(starts.includes("10:00"), true);
  });

  it("não oferece início cuja duração atravessa a pausa", () => {
    const starts = listAvailableStarts({
      ...base,
      breaks: [{ startsAt: "12:00", endsAt: "13:00" }],
    });

    assert.equal(starts.includes("11:00"), true);
    assert.equal(starts.includes("11:30"), false);
    assert.equal(starts.includes("12:00"), false);
    assert.equal(starts.includes("12:30"), false);
    assert.equal(starts.includes("13:00"), true);
  });

  it("omite horários cobertos por bloqueio do dono", () => {
    const starts = listAvailableStarts({
      ...base,
      occupied: [
        {
          id: "block-1",
          startsAt: "2026-10-06T15:00:00-03:00",
          endsAt: "2026-10-06T16:00:00-03:00",
        },
      ],
    });

    assert.equal(starts.includes("14:30"), false);
    assert.equal(starts.includes("15:00"), false);
    assert.equal(starts.includes("15:30"), false);
    assert.equal(starts.includes("16:00"), true);
  });

  it("no mesmo dia, esconde inícios anteriores ao horário atual", () => {
    const starts = listAvailableStarts({
      ...base,
      now: new Date("2026-10-06T14:00:00-03:00"),
    });

    assert.equal(starts.includes("13:30"), false);
    assert.equal(starts[0], "14:00");
  });

  it("dia fechado não tem horários", () => {
    const starts = listAvailableStarts({
      ...base,
      hours: { isOpen: false, opensAt: null, closesAt: null },
    });

    assert.deepEqual(starts, []);
  });

  it("duração que não cabe no expediente devolve lista vazia", () => {
    const starts = listAvailableStarts({
      ...base,
      durationMinutes: 600,
    });

    assert.deepEqual(starts, []);
  });

  it("na remarcação, ignora a própria reserva", () => {
    const starts = listAvailableStarts({
      ...base,
      ignoreId: "apt-1",
      occupied: [
        {
          id: "apt-1",
          startsAt: "2026-10-06T09:00:00-03:00",
          endsAt: "2026-10-06T10:00:00-03:00",
        },
      ],
    });

    assert.equal(starts.includes("09:00"), true);
    assert.equal(starts.includes("09:30"), true);
  });
});

describe("canChangeAppointment", () => {
  it("permite cancelar exatamente 2 horas antes e impede 1h59", () => {
    const startsAt = new Date("2026-10-06T16:00:00-03:00");

    assert.equal(
      canChangeAppointment(startsAt, new Date("2026-10-06T14:00:00-03:00")),
      true,
    );
    assert.equal(
      canChangeAppointment(startsAt, new Date("2026-10-06T14:01:00-03:00")),
      false,
    );
  });
});
