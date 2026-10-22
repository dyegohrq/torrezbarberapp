import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bookingConfirmationText } from "./booking-notice.ts";

describe("bookingConfirmationText", () => {
  it("monta a confirmação com os dados do horário", () => {
    const text = bookingConfirmationText({
      rescheduled: false,
      clientName: "Ana Souza",
      clientPhone: "(83) 99999-8888",
      services: "Corte, Barba",
      dateLabel: "quarta-feira, 22 de outubro",
      time: "14:00",
      price: "R$ 35,00",
    });

    assert.match(text, /^Olá! Acabei de confirmar um horário na Torrezbarber\./);
    assert.match(text, /Cliente: Ana Souza/);
    assert.match(text, /Telefone: \(83\) 99999-8888/);
    assert.match(text, /Serviços: Corte, Barba/);
    assert.match(text, /Data: quarta-feira, 22 de outubro/);
    assert.match(text, /Horário: 14:00/);
    assert.match(text, /Valor: R\$ 35,00/);
  });

  it("avisa que o horário foi remarcado", () => {
    const text = bookingConfirmationText({
      rescheduled: true,
      clientName: "Ana Souza",
      clientPhone: "(83) 99999-8888",
      services: "Corte",
      dateLabel: "quinta-feira, 23 de outubro",
      time: "15:00",
      price: "R$ 20,00",
    });

    assert.match(text, /^Olá! Acabei de remarcar um horário na Torrezbarber\./);
  });
});
