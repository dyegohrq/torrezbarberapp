import { formatMoney, whatsappDigits } from "@/lib/format";

const CONTACT_TEXT =
  "Olá! Gostaria de tirar uma dúvida sobre a Torrezbarber.";

export function contactWhatsAppUrl(whatsapp: string): string {
  return `https://wa.me/${whatsappDigits(whatsapp)}?text=${encodeURIComponent(CONTACT_TEXT)}`;
}

export function productWhatsAppUrl(input: {
  whatsapp: string;
  productName: string;
  priceCents: number;
  clientName: string;
  email: string;
  phone: string;
}): string {
  const message = [
    "Olá! Gostaria de pedir um produto na Torrezbarber.",
    "",
    `Produto: ${input.productName}`,
    `Preço: ${formatMoney(input.priceCents)}`,
    `Cliente: ${input.clientName}`,
    `E-mail: ${input.email}`,
    `Telefone: ${input.phone}`,
  ].join("\n");

  return `https://wa.me/${whatsappDigits(input.whatsapp)}?text=${encodeURIComponent(message)}`;
}
