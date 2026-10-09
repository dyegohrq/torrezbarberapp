"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  addBreak,
  addPortfolio,
  removeBreak,
  removePortfolio,
  saveBusiness,
  saveHours,
  replaceServiceImage,
  saveProduct,
  saveService,
} from "@/app/painel/(admin)/_actions/content";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { HoursItem, PortfolioItem, ProductItem, ServiceItem } from "@/lib/content/types";
import { formatMoney, weekdayLabel } from "@/lib/format";
import { businessSchema, serviceSchema } from "@/lib/validators";

type Catalog = {
  business: {
    address: string;
    whatsapp: string;
    instagram_url: string;
    map_embed_url: string;
  };
  hours: HoursItem[];
  services: ServiceItem[];
  products: ProductItem[];
  portfolio: PortfolioItem[];
};

export function ContentManager({ catalog }: { catalog: Catalog }) {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl text-white">Conteúdo</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          O que você salvar aqui passa a valer no site e na agenda. Durações marcadas como provisórias ainda usam 30 minutos até você confirmar.
        </p>
        {message ? <p className="mt-3 text-sm text-[#C5A059]">{message}</p> : null}
      </header>
      <BusinessForm business={catalog.business} onMessage={setMessage} />
      <HoursForm hours={catalog.hours} onMessage={setMessage} />
      <ServicesForm services={catalog.services} onMessage={setMessage} />
      <ProductsForm products={catalog.products} onMessage={setMessage} />
      <PortfolioForm items={catalog.portfolio} onMessage={setMessage} />
    </div>
  );
}

function BusinessForm({
  business,
  onMessage,
}: {
  business: Catalog["business"];
  onMessage: (value: string) => void;
}) {
  const form = useForm<z.input<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      address: business.address,
      whatsapp: business.whatsapp,
      instagramUrl: business.instagram_url,
      mapEmbedUrl: business.map_embed_url,
    },
  });

  return (
    <section className="border border-[#262626] p-5">
      <h2 className="text-lg text-white">Contato</h2>
      <form
        className="mt-4 grid gap-3"
        onSubmit={form.handleSubmit(async (values) => {
          const result = await saveBusiness(values);
          onMessage(result.message);
        })}
      >
        <Label>Endereço</Label>
        <Input {...form.register("address")} />
        <Label>WhatsApp</Label>
        <Input {...form.register("whatsapp")} />
        <Label>Instagram</Label>
        <Input {...form.register("instagramUrl")} />
        <Label>Mapa</Label>
        <Input {...form.register("mapEmbedUrl")} />
        <button className="bg-[#C5A059] py-2 text-sm font-bold text-[#0D0D0D] uppercase" type="submit">
          Salvar contato
        </button>
      </form>
    </section>
  );
}

function HoursForm({ hours, onMessage }: { hours: HoursItem[]; onMessage: (value: string) => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg text-white">Funcionamento</h2>
      {hours.map((day) => (
        <form
          key={day.weekday}
          className="grid gap-2 border border-[#262626] p-4 md:grid-cols-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const result = await saveHours({
              weekday: day.weekday,
              isOpen: form.get("isOpen") === "on",
              opensAt: String(form.get("opensAt") || ""),
              closesAt: String(form.get("closesAt") || ""),
            });
            onMessage(result.message);
          }}
        >
          <p className="text-white md:col-span-5">{weekdayLabel(day.weekday)}</p>
          <label className="text-sm text-[#9CA3AF]">
            <input type="checkbox" name="isOpen" defaultChecked={day.isOpen} /> Aberto
          </label>
          <Input type="time" name="opensAt" defaultValue={day.opensAt ?? ""} />
          <Input type="time" name="closesAt" defaultValue={day.closesAt ?? ""} />
          <button className="border border-[#C5A059] text-sm text-[#C5A059]" type="submit">
            Salvar dia
          </button>
          <div className="md:col-span-5 text-sm text-[#9CA3AF]">
            {day.breaks.map((item) => (
              <button
                key={item.id}
                type="button"
                className="mr-3"
                onClick={async () => onMessage((await removeBreak(item.id)).message)}
              >
                Pausa {item.startsAt}–{item.endsAt} · remover
              </button>
            ))}
          </div>
        </form>
      ))}
      <form
        className="grid gap-2 border border-[#262626] p-4 md:grid-cols-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const result = await addBreak({
            weekday: Number(form.get("weekday")),
            startsAt: String(form.get("startsAt")),
            endsAt: String(form.get("endsAt")),
          });
          onMessage(result.message);
          if (result.success) event.currentTarget.reset();
        }}
      >
        <select name="weekday" className="border border-[#262626] bg-[#1C1C1C] px-3 py-2 text-white">
          {hours.map((day) => (
            <option key={day.weekday} value={day.weekday}>
              {weekdayLabel(day.weekday)}
            </option>
          ))}
        </select>
        <Input type="time" name="startsAt" required />
        <Input type="time" name="endsAt" required />
        <button className="bg-[#C5A059] text-sm font-bold text-[#0D0D0D] uppercase" type="submit">
          Adicionar pausa
        </button>
      </form>
    </section>
  );
}

function ServicesForm({
  services,
  onMessage,
}: {
  services: ServiceItem[];
  onMessage: (value: string) => void;
}) {
  const form = useForm<z.input<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: "", description: "", price: 0, durationMinutes: 30, isActive: true },
  });

  return (
    <section>
      <h2 className="text-lg text-white">Serviços</h2>
      <ul className="mt-4 space-y-3">
        {services.map((service) => (
          <li key={service.id} className="border border-[#262626] p-4 text-sm">
            <div className="flex gap-4">
              <div className="flex shrink-0 flex-col gap-2">
                <div className="h-24 w-36 bg-[#131313]">
                  {service.imagePath ? (
                    <img src={service.imagePath} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <ServiceImageButton service={service} onMessage={onMessage} />
              </div>
              <p className="text-white">
                {service.name} · {formatMoney(service.priceCents)} · {service.durationMinutes} min
                {service.durationIsProvisional ? " · duração provisória" : ""}
                {service.isActive ? "" : " · inativo"}
              </p>
            </div>
            <ServiceEditor service={service} onMessage={onMessage} />
          </li>
        ))}
      </ul>
      <form
        className="mt-4 grid gap-3 border border-[#262626] p-4"
        onSubmit={form.handleSubmit(async (_values, event) => {
          const formElement = event?.currentTarget;
          if (!(formElement instanceof HTMLFormElement)) return;
          const result = await saveService(new FormData(formElement));
          onMessage(result.message ?? "");
          if (result.success) form.reset();
        })}
      >
        <h3 className="text-white">Novo serviço</h3>
        <Input placeholder="Nome" {...form.register("name")} />
        <Textarea placeholder="Descrição" {...form.register("description")} />
        <Input type="number" step="0.01" {...form.register("price")} />
        <Input type="number" step="30" {...form.register("durationMinutes")} />
        <label className="text-sm text-[#9CA3AF]">
          Imagem
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block text-sm" />
        </label>
        <label className="text-sm text-[#9CA3AF]">
          <input type="checkbox" {...form.register("isActive")} /> Ativo
        </label>
        {form.formState.errors.durationMinutes ? (
          <p className="text-sm text-[#ffb4ab]">{form.formState.errors.durationMinutes.message}</p>
        ) : null}
        <button className="bg-[#C5A059] py-2 text-sm font-bold text-[#0D0D0D] uppercase" type="submit">
          Criar serviço
        </button>
      </form>
    </section>
  );
}

function ServiceEditor({
  service,
  onMessage,
}: {
  service: ServiceItem;
  onMessage: (value: string) => void;
}) {
  const router = useRouter();

  return (
    <form
      className="mt-3 grid gap-2 md:grid-cols-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const result = await saveService(new FormData(event.currentTarget));
        onMessage(result.message ?? "");
        if (result.success) router.refresh();
      }}
    >
      <input type="hidden" name="id" value={service.id} />
      <input type="hidden" name="currentImage" value={service.imagePath ?? ""} />
      <Input name="name" defaultValue={service.name} />
      <Input name="price" type="number" step="0.01" defaultValue={(service.priceCents / 100).toFixed(2)} />
      <Input name="durationMinutes" type="number" step="30" defaultValue={service.durationMinutes} />
      <label className="text-[#9CA3AF]">
        <input type="checkbox" name="isActive" defaultChecked={service.isActive} /> Ativo
      </label>
      <Input name="description" defaultValue={service.description ?? ""} className="md:col-span-3" />
      <button className="border border-[#C5A059] text-[#C5A059]" type="submit">Salvar</button>
    </form>
  );
}

function ServiceImageButton({
  service,
  onMessage,
}: {
  service: ServiceItem;
  onMessage: (value: string) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const data = new FormData();
    data.set("id", service.id);
    data.set("image", file);
    setIsUploading(true);
    const result = await replaceServiceImage(data);
    setIsUploading(false);
    onMessage(result.message ?? "");
    if (result.success) router.refresh();
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="border border-[#C5A059] px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-[#C5A059] uppercase disabled:opacity-60"
      >
        {isUploading ? "Enviando" : service.imagePath ? "Alterar imagem" : "Adicionar imagem"}
      </button>
    </>
  );
}

function ProductsForm({
  products,
  onMessage,
}: {
  products: ProductItem[];
  onMessage: (value: string) => void;
}) {
  const router = useRouter();

  return (
    <section>
      <h2 className="text-lg text-white">Produtos</h2>
      <ul className="mt-4 space-y-4">
        {products.map((product) => (
          <li key={product.id}>
            <form
              className="grid gap-2 border border-[#262626] p-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const result = await saveProduct(new FormData(event.currentTarget));
                onMessage(result.message ?? "");
                if (result.success) router.refresh();
              }}
            >
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="currentImage" value={product.imagePath ?? ""} />
              <Input name="name" defaultValue={product.name} />
              <Input name="description" defaultValue={product.description ?? ""} />
              <Input name="price" type="number" step="0.01" defaultValue={(product.priceCents / 100).toFixed(2)} />
              <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
              <label className="text-sm text-[#9CA3AF]">
                <input type="checkbox" name="isActive" defaultChecked={product.isActive} /> Ativo
              </label>
              <button className="border border-[#C5A059] py-2 text-[#C5A059]" type="submit">Salvar produto</button>
            </form>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 grid gap-2 border border-[#262626] p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await saveProduct(new FormData(event.currentTarget));
          onMessage(result.message ?? "");
          if (result.success) {
            event.currentTarget.reset();
            router.refresh();
          }
        }}
      >
        <h3 className="text-white">Novo produto</h3>
        <Input name="name" placeholder="Nome" required />
        <Input name="description" placeholder="Descrição" />
        <Input name="price" type="number" step="0.01" defaultValue="0" />
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
        <label className="text-sm text-[#9CA3AF]">
          <input type="checkbox" name="isActive" defaultChecked /> Ativo
        </label>
        <button className="bg-[#C5A059] py-2 text-sm font-bold text-[#0D0D0D] uppercase" type="submit">
          Criar produto
        </button>
      </form>
    </section>
  );
}

function PortfolioForm({
  items,
  onMessage,
}: {
  items: PortfolioItem[];
  onMessage: (value: string) => void;
}) {
  const router = useRouter();

  return (
    <section>
      <h2 className="text-lg text-white">Portfólio</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item) => (
          <figure key={item.id} className="border border-[#262626]">
            <img src={item.imagePath} alt={item.caption ?? ""} className="aspect-square w-full object-cover" />
            <button
              type="button"
              className="w-full py-2 text-sm text-[#ffb4ab]"
              onClick={async () => {
                const result = await removePortfolio(item.id);
                onMessage(result.message ?? "");
                if (result.success) router.refresh();
              }}
            >
              Remover
            </button>
          </figure>
        ))}
      </div>
      <form
        className="mt-4 grid gap-2 border border-[#262626] p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await addPortfolio(new FormData(event.currentTarget));
          onMessage(result.message ?? "");
          if (result.success) {
            event.currentTarget.reset();
            router.refresh();
          }
        }}
      >
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="text-sm" />
        <Input name="caption" placeholder="Legenda opcional" />
        <button className="bg-[#C5A059] py-2 text-sm font-bold text-[#0D0D0D] uppercase" type="submit">
          Publicar foto
        </button>
      </form>
    </section>
  );
}
