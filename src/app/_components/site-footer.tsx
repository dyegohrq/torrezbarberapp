import { contactWhatsAppUrl } from "@/lib/whatsapp";
import type { BusinessProfile, HoursItem } from "@/lib/content/types";
import { weekdayLabel } from "@/lib/format";

export function SiteFooter({
  business,
  hours,
}: {
  business: BusinessProfile;
  hours: HoursItem[];
}) {
  return (
    <footer className="border-t border-[#262626] bg-[#0D0D0D]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-4 md:px-8 lg:px-12">
        <div>
          <img src="/image/TB_logo_fundo_removido.png" alt="Torrez Barber" className="mb-4 h-10 w-auto " />
          <p className="text-sm text-[#9CA3AF]">Barbearia no Valentina, João Pessoa — PB.</p>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">
            Navegação
          </p>
          <ul className="space-y-2 text-sm text-white">
            <li><a href="/#servicos">Serviços</a></li>
            <li><a href="/#galeria">Galeria</a></li>
            <li><a href="/#localizacao">Localização</a></li>
            <li><a href="/agendar">Agendamento</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">
            Contato
          </p>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <a href={contactWhatsAppUrl(business.whatsapp)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={business.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>{business.address}</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">
            Funcionamento
          </p>
          <ul className="space-y-1 text-sm text-[#9CA3AF]">
            {hours.map((day) => (
              <li key={day.weekday}>
                {weekdayLabel(day.weekday)}:{" "}
                {day.isOpen ? `${day.opensAt}–${day.closesAt}` : "fechado"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-[#262626] py-4 text-center text-xs text-[#9CA3AF]">
        Torrezbarber · Valentina, João Pessoa
      </p>
    </footer>
  );
}
