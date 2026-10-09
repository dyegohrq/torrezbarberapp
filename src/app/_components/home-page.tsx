"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { BookingFlow } from "@/app/_components/booking-flow";
import type { AppointmentDetail, ProductItem, Profile, PublicContent } from "@/lib/content/types";
import { formatMoney, formatPhone } from "@/lib/format";
import { contactWhatsAppUrl, productWhatsAppUrl } from "@/lib/whatsapp";

export function HomePage({
  content,
  profile,
  futureAppointment,
  pedidoId,
}: {
  content: PublicContent;
  profile: Profile | null;
  futureAppointment: AppointmentDetail | null;
  pedidoId?: string;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const contact = contactWhatsAppUrl(content.business.whatsapp);
  const orderedProduct = content.products.find((product) => product.id === pedidoId);

  return (
    <div id="inicio" className="bg-[#0D0D0D] text-[#E5E5E5]">
      <SiteHeader
        profile={profile}
        overlay
        onSchedule={profile ? () => setBookingOpen(true) : undefined}
      />
      <Hero onSchedule={() => (profile ? setBookingOpen(true) : undefined)} loggedIn={Boolean(profile)} />
      <Benefits />
      <Services services={content.services} />
      <Products
        products={content.products}
        profile={profile}
        whatsapp={content.business.whatsapp}
        orderedProduct={orderedProduct}
      />
      <Gallery items={content.portfolio} />
      <Why />
      <Who />
      <How onSchedule={() => (profile ? setBookingOpen(true) : undefined)} loggedIn={Boolean(profile)} />
      <Location content={content} contact={contact} />
      <SiteFooter business={content.business} hours={content.hours} />
      <a
        href={contact}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp de dúvidas"
        className="fixed right-4 bottom-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A059] text-[#0D0D0D] shadow-[0_8px_24px_rgba(197,160,89,0.25)]"
      >
        <MessageCircle />
      </a>
      {bookingOpen && profile ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <BookingFlow
            services={content.services}
            hours={content.hours}
            profile={profile}
            futureAppointment={futureAppointment}
            onClose={() => setBookingOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

function Hero({ onSchedule, loggedIn }: { onSchedule: () => void; loggedIn: boolean }) {
  return (
    <section id="hero" className="relative min-h-[80vh] bg-[#131313]">
      <img
        src="/image/torrezbarber_1440x800.png"
        alt="Fachada da Torrez Barber"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />
      <img
        src="/image/torrezbarber-mobile.png"
        alt="Fachada da Torrez Barber"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/20" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-300 flex-col justify-center px-5 py-16 md:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Valentina · João Pessoa</p>
        <h1 className="font-display mt-3 max-w-xl text-[34px] leading-10.5 text-white md:text-[56px] md:leading-16">
          Barbearia em João Pessoa para um corte que <span className="text-[#C5A059] italic">combina</span> com seu estilo
        </h1>
        <p className="mt-4 max-w-lg text-[#E5E5E5]">
          Um barbeiro, horário marcado e o trabalho à vista. Agende pelo site.
        </p>
        {loggedIn ? (
          <button
            type="button"
            onClick={onSchedule}
            className="mt-8 w-fit bg-[#C5A059] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37]"
          >
            Agendar
          </button>
        ) : (
          <Link
            href="/entrar?next=/agendar"
            className="mt-8 w-fit bg-[#C5A059] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37]"
          >
            Agendar
          </Link>
        )}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    "Atendimento com horário marcado",
    "Cortes masculinos",
    "Barba e cabelo",
    "Valentina, João Pessoa",
  ];
  const track = [...items, ...items];

  return (
    <section className="overflow-hidden border-y border-[#262626] bg-[#141414]" aria-label="Diferenciais">
      <div className="benefits-marquee flex w-max py-5">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="px-8 text-[11px] font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase"
            aria-hidden={index >= items.length}
          >
            {item}
            <span className="ml-8 text-[#C5A059]" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Services({ services }: { services: PublicContent["services"] }) {
  return (
    <section id="servicos" className="mx-auto max-w-300 scroll-mt-16 px-5 py-16 md:px-8 lg:px-12">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">O que fazemos</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h2 className="font-display text-[32px] text-white">Nosso serviço</h2>
      </div>
      {services.length === 0 ? (
        <p className="mt-8 text-[#9CA3AF]">Nenhum serviço ativo no momento.</p>
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="w-60 shrink-0 border border-[#262626] bg-[#1C1C1C] transition hover:-translate-y-1 hover:border-[#C5A059]/45"
            >
              <div className="h-40 bg-[#131313]">
                {service.imagePath ? (
                  <img src={service.imagePath} alt={service.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                {service.description ? (
                  <p className="mt-1 text-sm text-[#9CA3AF]">{service.description}</p>
                ) : null}
                <p className="mt-3 text-lg font-bold text-[#C5A059] tabular-nums">
                  {formatMoney(service.priceCents)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Products({
  products,
  profile,
  whatsapp,
  orderedProduct,
}: {
  products: ProductItem[];
  profile: Profile | null;
  whatsapp: string;
  orderedProduct?: ProductItem;
}) {
  const profileReady = Boolean(profile?.fullName && profile.email && profile.phone);

  useEffect(() => {
    if (!orderedProduct || !profile || !profileReady) return;
    const url = productWhatsAppUrl({
      whatsapp,
      productName: orderedProduct.name,
      priceCents: orderedProduct.priceCents,
      clientName: profile.fullName,
      email: profile.email,
      phone: formatPhone(profile.phone),
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }, [orderedProduct, profile, profileReady, whatsapp]);

  return (
    <section id="produtos" className="scroll-mt-16 bg-[#131313] py-16">
      <div className="mx-auto max-w-300 px-5 md:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Na cadeira</p>
        <h2 className="font-display mt-2 text-[32px] text-white">Veja nossos produtos</h2>
        {products.length === 0 ? (
          <p className="mt-8 text-[#9CA3AF]">O catálogo ainda não tem produtos. O dono publica por aqui.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="border border-[#262626] bg-[#1C1C1C]">
                <div className="h-48 bg-[#0D0D0D]">
                  {product.imagePath ? (
                    <img src={product.imagePath} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  {product.description ? (
                    <p className="mt-1 text-sm text-[#9CA3AF]">{product.description}</p>
                  ) : null}
                  <p className="mt-3 font-bold text-[#C5A059] tabular-nums">{formatMoney(product.priceCents)}</p>
                  <ProductAction product={product} profile={profile} whatsapp={whatsapp} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductAction({
  product,
  profile,
  whatsapp,
}: {
  product: ProductItem;
  profile: Profile | null;
  whatsapp: string;
}) {
  if (!profile) {
    return (
      <Link
        href={`/entrar?pedido=${product.id}&next=/`}
        className="mt-4 inline-block border border-[#C5A059] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-[#C5A059] uppercase"
      >
        Pedir via WhatsApp
      </Link>
    );
  }

  if (!profile.fullName || !profile.email || !profile.phone) {
    return (
      <Link href="/minha-agenda" className="mt-4 inline-block text-sm text-[#C5A059]">
        Complete nome, e-mail e telefone para pedir
      </Link>
    );
  }

  const href = productWhatsAppUrl({
    whatsapp,
    productName: product.name,
    priceCents: product.priceCents,
    clientName: profile.fullName,
    email: profile.email,
    phone: formatPhone(profile.phone),
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-4 inline-block border border-[#C5A059] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-[#C5A059] uppercase"
    >
      Pedir via WhatsApp
    </a>
  );
}

function Why() {
  const items = [
    ["01", "Horário marcado", "Você escolhe serviço, data e horário no site. A reserva entra na agenda na hora."],
    ["02", "Um barbeiro", "A cadeira é de um profissional. O horário que aparece está livre de verdade."],
    ["03", "No Valentina", "Rua José de Oliveira Batista, 116, João Pessoa — PB."],
  ];

  return (
    <section className="mx-auto max-w-300 px-5 py-16 md:px-8 lg:px-12">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Proposição</p>
      <h2 className="font-display mt-2 max-w-md text-[32px] text-white">Por que cortar na Torrez Barber?</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map(([number, title, text]) => (
          <article key={number} className="border border-[#262626] bg-[#1C1C1C] p-5">
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059]">{number}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Who() {
  return (
    <section id="quem-somos" className="scroll-mt-16 bg-[#141414] py-16">
      <div className="mx-auto max-w-300 px-5 md:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Quem somos</p>
        <h2 className="font-display mt-2 text-[32px] text-white">Torrez Barber</h2>
        <p className="mt-4 max-w-2xl text-[#E5E5E5]">
          Barbearia de um barbeiro no bairro Valentina, em João Pessoa. O site reúne serviços, preços, trabalhos e a agenda.
        </p>
      </div>
    </section>
  );
}

function How({ onSchedule, loggedIn }: { onSchedule: () => void; loggedIn: boolean }) {
  const steps = [
    ["Passo 1", "Escolha o serviço", "Um ou mais serviços. O tempo e o valor somam."],
    ["Passo 2", "Escolha data e horário", "Só aparecem inícios em que o atendimento cabe."],
    ["Passo 3", "Confirme no site", "A reserva é automática. Não precisa confirmar pelo WhatsApp."],
  ];

  return (
    <section className="mx-auto max-w-300 px-5 py-16 md:px-8 lg:px-12">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Como funciona</p>
      <h2 className="font-display mt-2 text-[32px] text-white">Vamos cortar?</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map(([eyebrow, title, text]) => (
          <article key={eyebrow} className="border border-[#262626] bg-[#1C1C1C] p-5">
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">{eyebrow}</p>
            <h3 className="mt-3 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">{text}</p>
          </article>
        ))}
      </div>
      {loggedIn ? (
        <button
          type="button"
          onClick={onSchedule}
          className="mt-8 bg-[#C5A059] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase"
        >
          Agendar
        </button>
      ) : (
        <Link
          href="/entrar?next=/agendar"
          className="mt-8 inline-block bg-[#C5A059] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase"
        >
          Agendar
        </Link>
      )}
    </section>
  );
}

function Location({ content, contact }: { content: PublicContent; contact: string }) {
  return (
    <section id="localizacao" className="scroll-mt-16 bg-[#131313] py-16">
      <div className="mx-auto grid max-w-300 gap-8 px-5 md:grid-cols-2 md:px-8 lg:px-12">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Localização</p>
          <h2 className="font-display mt-2 text-[32px] text-white">
            Estamos no <span className="text-[#C5A059] italic">Valentina.</span>
          </h2>
          <p className="mt-4 text-[#E5E5E5]">{content.business.address}</p>
          <p className="mt-2 text-sm text-[#9CA3AF]">WhatsApp {formatPhone(content.business.whatsapp)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={contact} target="_blank" rel="noreferrer" className="border border-[#C5A059] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-[#C5A059] uppercase">
              WhatsApp
            </a>
            <a href={content.business.instagramUrl} target="_blank" rel="noreferrer" className="border border-[#262626] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-white uppercase">
              Instagram
            </a>
          </div>
        </div>
        <iframe
          title="Mapa da Torrezbarber"
          src={content.business.mapEmbedUrl}
          className="min-h-72 w-full border border-[#262626] bg-[#1C1C1C]"
          loading="lazy"
        />
      </div>
    </section>
  );
}

export function Gallery({ items }: { items: PublicContent["portfolio"] }) {
  return (
    <section id="galeria" className="scroll-mt-16 bg-[#0D0D0D] py-16">
      <div className="mx-auto max-w-300 px-5 md:px-8 lg:px-12">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Trabalhos</p>
        <h2 className="font-display mt-2 text-[32px] text-white">Galeria</h2>
        {items.length === 0 ? (
          <p className="mt-8 text-[#9CA3AF]">A galeria ainda não tem fotos.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <figure key={item.id} className="aspect-square overflow-hidden border border-[#262626] bg-[#1C1C1C]">
                <img src={item.imagePath} alt={item.caption ?? "Trabalho da Torrezbarber"} className="h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
