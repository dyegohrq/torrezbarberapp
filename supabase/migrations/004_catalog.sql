-- Serviços, produtos e portfólio. Preço em centavos. Duração do serviço em múltiplos de 30.

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  duration_minutes integer not null,
  duration_is_provisional boolean not null default true,
  image_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint services_name_not_blank check (length(trim(name)) > 0),
  constraint services_price_nonnegative check (price_cents >= 0),
  constraint services_duration_grid check (duration_minutes > 0 and duration_minutes % 30 = 0)
);

create index services_active_sort_idx on public.services (is_active, sort_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  image_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint products_name_not_blank check (length(trim(name)) > 0),
  constraint products_price_nonnegative check (price_cents >= 0)
);

create index products_active_sort_idx on public.products (is_active, sort_order);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint portfolio_items_image_not_blank check (length(trim(image_path)) > 0)
);

create index portfolio_items_active_sort_idx on public.portfolio_items (is_active, sort_order);

alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.portfolio_items enable row level security;
