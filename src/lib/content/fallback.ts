import type { PublicContent } from "@/lib/content/types";

const portfolio = [
  "526660229_17889242625320871_4951918369539212855_n.jpg",
  "527354271_17889265161320871_9137992026199074595_n.jpg",
  "527460036_17889264147320871_8928402516085010713_n.jpg",
  "526080698_17889264210320871_6183512317881581939_n.jpg",
  "528420407_17889264855320871_7557830021651442984_n.jpg",
  "528688606_17889269445320871_3144948534439826670_n.jpg",
  "607175373_17905943316320871_7279703034885040267_n.jpg",
  "607004780_17905944243320871_3655800776882443394_n.jpg",
  "659487586_17920218279320871_2896460830267043599_n.jpg",
  "758678133_1991622151487613_1984763216633580277_n.jpg",
  "776686614_17941826631320871_2629951312887637253_n.jpg",
  "776748211_17941827273320871_3226467576721111061_n.jpg",
  "778504757_17941826130320871_3054180259716916706_n.jpg",
  "790024862_17944318488320871_5258514801060568550_n.jpg",
  "491459756_4066234033655606_5572985092179548343_n.jpg",
];

const services: Array<[string, string, number]> = [
  ["Corte Degradê", "Corte masculino com degradê.", 2000],
  ["Corte Social", "Corte social masculino.", 1700],
  ["Barba", "Acabamento de barba.", 1500],
  ["Cavanhaque", "Acabamento de cavanhaque.", 1000],
  ["Infantil", "Corte infantil.", 2000],
  ["Pigmentação + Corte", "Pigmentação com corte.", 3500],
  ["Luzes + Corte", "Luzes com corte.", 7000],
  ["Nevou + Corte", "Nevou com corte.", 9000],
  ["Perfil / Pezinho", "Perfil e pezinho.", 1000],
  ["Freestyle", "Detalhe freestyle.", 500],
];

export const fallbackContent: PublicContent = {
  business: {
    address: "Rua José de Oliveira Batista, 116 — Valentina, João Pessoa — PB",
    whatsapp: "5583987850386",
    instagramUrl: "https://www.instagram.com/torrezbarber/",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rua+Jos%C3%A9+de+Oliveira+Batista,+116,+Valentina,+Jo%C3%A3o+Pessoa&z=16&output=embed",
  },
  hours: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
    weekday,
    isOpen: weekday !== 1,
    opensAt: weekday === 1 ? null : "09:00",
    closesAt: weekday === 1 ? null : "18:00",
    breaks: [],
  })),
  services: services.map(([name, description, priceCents], index) => ({
    id: `seed-service-${index + 1}`,
    name,
    description,
    priceCents,
    durationMinutes: 30,
    durationIsProvisional: true,
    imagePath: null,
    isActive: true,
    sortOrder: index + 1,
  })),
  products: [],
  portfolio: portfolio.map((file, index) => ({
    id: `seed-portfolio-${index + 1}`,
    imagePath: `/image/${file}`,
    caption: null,
    isActive: true,
    sortOrder: index + 1,
  })),
};
