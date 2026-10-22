export function bookingConfirmationText(input: {
  rescheduled: boolean;
  clientName: string;
  clientPhone: string;
  services: string;
  dateLabel: string;
  time: string;
  price: string;
}): string {
  const intro = input.rescheduled
    ? "Olá! Acabei de remarcar um horário na Torrezbarber."
    : "Olá! Acabei de confirmar um horário na Torrezbarber.";

  return [
    intro,
    "",
    `Cliente: ${input.clientName}`,
    `Telefone: ${input.clientPhone}`,
    `Serviços: ${input.services}`,
    `Data: ${input.dateLabel}`,
    `Horário: ${input.time}`,
    `Valor: ${input.price}`,
  ].join("\n");
}
