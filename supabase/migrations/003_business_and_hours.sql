-- Contato público, expediente e pausas. weekday 0 = domingo … 6 = sábado.

create table public.business_profile (
  id integer primary key default 1,
  address text not null,
  whatsapp text not null,
  instagram_url text not null,
  map_embed_url text not null,
  constraint business_profile_singleton check (id = 1),
  constraint business_profile_address_not_blank check (length(trim(address)) > 0),
  constraint business_profile_whatsapp_not_blank check (length(trim(whatsapp)) > 0)
);

create table public.operating_hours (
  weekday smallint primary key,
  is_open boolean not null default false,
  opens_at time,
  closes_at time,
  constraint operating_hours_weekday_range check (weekday between 0 and 6),
  constraint operating_hours_window check (
    is_open = false
    or (
      opens_at is not null
      and closes_at is not null
      and closes_at > opens_at
    )
  )
);

create table public.operating_breaks (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null references public.operating_hours (weekday) on delete cascade,
  starts_at time not null,
  ends_at time not null,
  constraint operating_breaks_window check (ends_at > starts_at)
);

create index operating_breaks_weekday_idx on public.operating_breaks (weekday);

alter table public.business_profile enable row level security;
alter table public.operating_hours enable row level security;
alter table public.operating_breaks enable row level security;

create or replace function public.validate_operating_break()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_open boolean;
  v_opens time;
  v_closes time;
begin
  select is_open, opens_at, closes_at
    into v_open, v_opens, v_closes
  from public.operating_hours
  where weekday = new.weekday;

  if not coalesce(v_open, false) then
    raise exception 'Não é possível criar pausa em um dia fechado.';
  end if;

  if new.starts_at < v_opens or new.ends_at > v_closes then
    raise exception 'A pausa precisa ficar dentro do expediente.';
  end if;

  return new;
end;
$$;

create trigger operating_breaks_validate
  before insert or update on public.operating_breaks
  for each row
  execute function public.validate_operating_break();

create or replace function public.validate_operating_hours_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.operating_breaks b
    where b.weekday = new.weekday
      and (
        new.is_open = false
        or b.starts_at < new.opens_at
        or b.ends_at > new.closes_at
      )
  ) then
    raise exception 'Existe uma pausa fora do novo expediente. Ajuste a pausa antes.';
  end if;

  return new;
end;
$$;

create trigger operating_hours_validate_breaks
  before update on public.operating_hours
  for each row
  execute function public.validate_operating_hours_change();
