import { fallbackContent } from "@/lib/content/fallback";
import type {
  AppointmentDetail,
  HoursItem,
  PortfolioItem,
  ProductItem,
  Profile,
  PublicContent,
  ServiceItem,
} from "@/lib/content/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function clock(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 5);
}

export async function getPublicContent(): Promise<PublicContent> {
  if (!hasSupabaseEnv()) {
    return fallbackContent;
  }

  try {
    const supabase = await createClient();
    const [businessResult, hoursResult, breaksResult, servicesResult, productsResult, portfolioResult] =
      await Promise.all([
        supabase.from("business_profile").select("*").eq("id", 1).maybeSingle(),
        supabase.from("operating_hours").select("*").order("weekday"),
        supabase.from("operating_breaks").select("*").order("starts_at"),
        supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("portfolio_items")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      ]);

    if (businessResult.error || !businessResult.data) {
      return fallbackContent;
    }

    const hours: HoursItem[] = (hoursResult.data ?? []).map((row) => ({
      weekday: row.weekday,
      isOpen: row.is_open,
      opensAt: clock(row.opens_at),
      closesAt: clock(row.closes_at),
      breaks: (breaksResult.data ?? [])
        .filter((item) => item.weekday === row.weekday)
        .map((item) => ({
          id: item.id,
          weekday: item.weekday,
          startsAt: clock(item.starts_at) ?? "",
          endsAt: clock(item.ends_at) ?? "",
        })),
    }));

    return {
      business: {
        address: businessResult.data.address,
        whatsapp: businessResult.data.whatsapp,
        instagramUrl: businessResult.data.instagram_url,
        mapEmbedUrl: businessResult.data.map_embed_url,
      },
      hours,
      services: (servicesResult.data ?? []).map(mapService),
      products: (productsResult.data ?? []).map(mapProduct),
      portfolio: (portfolioResult.data ?? []).map(mapPortfolio),
    };
  } catch {
    return fallbackContent;
  }
}

export async function getSessionProfile(): Promise<Profile | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    role: data.role,
    fullName: data.full_name,
    phone: data.phone,
    email: data.email,
  };
}

export async function getFutureAppointment(
  clientId: string,
): Promise<AppointmentDetail | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("id, starts_at, duration_minutes, price_cents, status, appointment_services(*)")
    .eq("client_id", clientId)
    .eq("status", "confirmed")
    .gt("starts_at", new Date().toISOString())
    .order("starts_at")
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return mapAppointment(data);
}

function mapService(row: {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  duration_is_provisional: boolean;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
}): ServiceItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    durationMinutes: row.duration_minutes,
    durationIsProvisional: row.duration_is_provisional,
    imagePath: row.image_path,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

function mapProduct(row: {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
}): ProductItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    imagePath: row.image_path,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

function mapPortfolio(row: {
  id: string;
  image_path: string;
  caption: string | null;
  is_active: boolean;
  sort_order: number;
}): PortfolioItem {
  return {
    id: row.id,
    imagePath: row.image_path,
    caption: row.caption,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export function mapAppointment(row: {
  id: string;
  starts_at: string;
  duration_minutes: number;
  price_cents: number;
  status: "confirmed" | "cancelled" | "rescheduled";
  appointment_services:
    | {
        service_id: string | null;
        service_name: string;
        price_cents: number;
        duration_minutes: number;
        position?: number;
      }[]
    | null;
  profiles?: { full_name: string; phone: string; email: string } | null;
}): AppointmentDetail {
  const services = [...(row.appointment_services ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );

  return {
    id: row.id,
    startsAt: row.starts_at,
    durationMinutes: row.duration_minutes,
    priceCents: row.price_cents,
    status: row.status,
    services: services.map((item) => ({
      serviceId: item.service_id,
      serviceName: item.service_name,
      priceCents: item.price_cents,
      durationMinutes: item.duration_minutes,
    })),
    client: row.profiles
      ? {
          fullName: row.profiles.full_name,
          phone: row.profiles.phone,
          email: row.profiles.email,
        }
      : undefined,
  };
}
