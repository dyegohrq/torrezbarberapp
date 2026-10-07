export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  durationIsProvisional: boolean;
  imagePath: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductItem = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  imagePath: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type PortfolioItem = {
  id: string;
  imagePath: string;
  caption: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type BreakItem = {
  id: string;
  weekday: number;
  startsAt: string;
  endsAt: string;
};

export type HoursItem = {
  weekday: number;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
  breaks: BreakItem[];
};

export type BusinessProfile = {
  address: string;
  whatsapp: string;
  instagramUrl: string;
  mapEmbedUrl: string;
};

export type PublicContent = {
  business: BusinessProfile;
  hours: HoursItem[];
  services: ServiceItem[];
  products: ProductItem[];
  portfolio: PortfolioItem[];
};

export type Profile = {
  id: string;
  role: "client" | "owner";
  fullName: string;
  phone: string;
  email: string;
};

export type AppointmentService = {
  serviceId: string | null;
  serviceName: string;
  priceCents: number;
  durationMinutes: number;
};

export type AppointmentDetail = {
  id: string;
  startsAt: string;
  durationMinutes: number;
  priceCents: number;
  status: "confirmed" | "cancelled" | "rescheduled";
  services: AppointmentService[];
  client?: {
    fullName: string;
    phone: string;
    email: string;
  };
};

export type TimeBlock = {
  id: string;
  startsAt: string;
  endsAt: string;
};

export type OwnerNotification = {
  id: string;
  type: "booked" | "cancelled_by_client" | "rescheduled";
  body: string;
  readAt: string | null;
  createdAt: string;
};
