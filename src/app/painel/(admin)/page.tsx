import { AgendaBoard } from "@/app/painel/(admin)/_components/agenda-board";
import { getAgendaDay } from "@/app/painel/(admin)/_data-access/get-admin";
import { todayInFortaleza } from "@/lib/format";

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>;
}) {
  const query = await searchParams;
  const date = query.dia && /^\d{4}-\d{2}-\d{2}$/.test(query.dia) ? query.dia : todayInFortaleza();
  const agenda = await getAgendaDay(date);

  return (
    <AgendaBoard
      date={date}
      hours={agenda.hours}
      appointments={agenda.appointments}
      blocks={agenda.blocks}
      notifications={agenda.notifications}
    />
  );
}
