import type { Metadata } from "next";
import { HomePage } from "@/app/_components/home-page";
import { getFutureAppointment, getPublicContent, getSessionProfile } from "@/app/_data-access/get-public-content";

export const metadata: Metadata = {
  title: "Torrezbarber | Barbearia no Valentina, João Pessoa",
  description:
    "Serviços, preços, portfólio e agendamento da Torrezbarber. Rua José de Oliveira Batista, 116 — Valentina, João Pessoa — PB.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const query = await searchParams;
  const [content, profile] = await Promise.all([getPublicContent(), getSessionProfile()]);
  const futureAppointment = profile ? await getFutureAppointment(profile.id) : null;

  return (
    <HomePage
      content={content}
      profile={profile}
      futureAppointment={futureAppointment}
      pedidoId={query.pedido}
    />
  );
}
