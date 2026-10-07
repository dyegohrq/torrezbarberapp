-- Agendamentos confirmados não se sobrepõem. O snapshot do serviço preserva o histórico.

create or replace function public.assign_appointment_ends_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.ends_at := new.starts_at + make_interval(mins => new.duration_minutes);
  return new;
end;
$$;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  duration_minutes integer not null,
  price_cents integer not null,
  status public.appointment_status not null default 'confirmed',
  rescheduled_from_id uuid references public.appointments (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint appointments_duration_grid check (duration_minutes > 0 and duration_minutes % 30 = 0),
  constraint appointments_price_nonnegative check (price_cents >= 0),
  constraint appointments_end_after_start check (ends_at > starts_at),
  constraint appointments_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status = 'confirmed')
);

create trigger appointments_00_assign_ends_at
  before insert or update of starts_at, duration_minutes
  on public.appointments
  for each row
  execute function public.assign_appointment_ends_at();

create index appointments_client_id_idx on public.appointments (client_id);
create index appointments_starts_at_idx on public.appointments (starts_at);
create index appointments_status_starts_idx on public.appointments (status, starts_at);

create table public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  service_id uuid references public.services (id) on delete restrict,
  service_name text not null,
  price_cents integer not null,
  duration_minutes integer not null,
  position smallint not null default 0,
  constraint appointment_services_price_nonnegative check (price_cents >= 0),
  constraint appointment_services_duration_positive check (duration_minutes > 0)
);

create index appointment_services_appointment_id_idx
  on public.appointment_services (appointment_id);

create index appointment_services_service_id_idx
  on public.appointment_services (service_id);

alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;

create or replace function public.assert_appointment_not_blocked()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status = 'confirmed' and exists (
    select 1
    from public.time_blocks b
    where tstzrange(b.starts_at, b.ends_at, '[)')
      && tstzrange(new.starts_at, new.ends_at, '[)')
  ) then
    raise exception 'Esse horário está bloqueado.';
  end if;

  return new;
end;
$$;
