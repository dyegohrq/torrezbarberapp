import { mapAppointment } from "@/app/_data-access/get-public-content";
import type {
  AppointmentDetail,
  HoursItem,
  OwnerNotification,
  PortfolioItem,
  ProductItem,
  ServiceItem,
  TimeBlock,
} from "@/lib/content/types";
import { createClient } from "@/lib/supabase/server";

function clock(value: string | null): string | null {
  return value ? value.slice(0, 5) : null;
}

export async function getAgendaDay(date: string) {
  const supabase = await createClient();
  const start = new Date(`${date}T00:00:00-03:00`).toISOString();
  const end = new Date(`${date}T23:59:59-03:00`).toISOString();
  const weekday = new Date(`${date}T12:00:00-03:00`).getUTCDay();

  const [hoursResult, breaksResult, appointmentsResult, blocksResult, notificationsResult] =
    await Promise.all([
      supabase.from("operating_hours").select("*").eq("weekday", weekday).maybeSingle(),
      supabase.from("operating_breaks").select("*").eq("weekday", weekday),
      supabase
        .from("appointments")
        .select("*, appointment_services(*), profiles(full_name, phone, email)")
        .eq("status", "confirmed")
        .lt("starts_at", end)
        .gt("starts_at", start),
      supabase.from("time_blocks").select("*").lt("starts_at", end).gt("ends_at", start),
      supabase
        .from("owner_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

  const hours: HoursItem = {
    weekday,
    isOpen: hoursResult.data?.is_open ?? false,
    opensAt: clock(hoursResult.data?.opens_at ?? null),
    closesAt: clock(hoursResult.data?.closes_at ?? null),
    breaks: (breaksResult.data ?? []).map((item) => ({
      id: item.id,
      weekday: item.weekday,
      startsAt: clock(item.starts_at) ?? "",
      endsAt: clock(item.ends_at) ?? "",
    })),
  };

  const appointments: AppointmentDetail[] = (appointmentsResult.data ?? []).map((row) =>
    mapAppointment({
      ...row,
      profiles: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
    }),
  );

  const blocks: TimeBlock[] = (blocksResult.data ?? []).map((row) => ({
    id: row.id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));

  const notifications: OwnerNotification[] = (notificationsResult.data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    body: row.body,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));

  return { hours, appointments, blocks, notifications };
}

export async function getAdminCatalog() {
  const supabase = await createClient();
  const [business, hours, breaks, services, products, portfolio] = await Promise.all([
    supabase.from("business_profile").select("*").eq("id", 1).single(),
    supabase.from("operating_hours").select("*").order("weekday"),
    supabase.from("operating_breaks").select("*").order("weekday"),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
    supabase.from("portfolio_items").select("*").order("sort_order"),
  ]);

  return {
    business: business.data,
    hours: (hours.data ?? []).map((row) => ({
      weekday: row.weekday as number,
      isOpen: row.is_open as boolean,
      opensAt: clock(row.opens_at),
      closesAt: clock(row.closes_at),
      breaks: (breaks.data ?? [])
        .filter((item) => item.weekday === row.weekday)
        .map((item) => ({
          id: item.id as string,
          weekday: item.weekday as number,
          startsAt: clock(item.starts_at) ?? "",
          endsAt: clock(item.ends_at) ?? "",
        })),
    })) satisfies HoursItem[],
    services: (services.data ?? []).map(mapService),
    products: (products.data ?? []).map(mapProduct),
    portfolio: (portfolio.data ?? []).map(mapPortfolio),
  };
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
