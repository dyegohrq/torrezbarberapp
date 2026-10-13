-- Bloqueio do mesmo horário em todos os dias. O bloqueio de uma data continua em time_blocks.

create table public.daily_time_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at time not null,
  ends_at time not null,
  created_at timestamptz not null default now(),
  constraint daily_time_blocks_window check (ends_at > starts_at)
);

alter table public.daily_time_blocks enable row level security;

create policy daily_time_blocks_select_public on public.daily_time_blocks
  for select
  to anon, authenticated
  using (true);

create or replace function public.assert_daily_block_available()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.daily_time_blocks d
    where d.id is distinct from new.id
      and new.starts_at < d.ends_at
      and d.starts_at < new.ends_at
  ) then
    raise exception 'Já existe um bloqueio diário nesse horário.';
  end if;

  if exists (
    select 1
    from public.appointments a
    where a.status = 'confirmed'
      and a.ends_at > now()
      and (a.starts_at at time zone 'America/Fortaleza')::time < new.ends_at
      and new.starts_at < (a.ends_at at time zone 'America/Fortaleza')::time
  ) then
    raise exception 'Horário ocupado. Cancele o agendamento antes de bloquear.';
  end if;

  return new;
end;
$$;

create trigger daily_time_blocks_reject_occupied
  before insert or update on public.daily_time_blocks
  for each row
  execute function public.assert_daily_block_available();

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

  if new.status = 'confirmed' and exists (
    select 1
    from public.daily_time_blocks d
    where (new.starts_at at time zone 'America/Fortaleza')::time < d.ends_at
      and d.starts_at < (new.ends_at at time zone 'America/Fortaleza')::time
  ) then
    raise exception 'Esse horário está bloqueado.';
  end if;

  return new;
end;
$$;

create or replace function private.assert_slot_available(
  p_starts_at timestamptz,
  p_duration integer,
  p_ignore_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_local timestamp;
  v_dow integer;
  v_start time;
  v_end timestamp;
  v_end_time time;
  v_open boolean;
  v_opens time;
  v_closes time;
begin
  if p_duration is null or p_duration <= 0 or p_duration % 30 <> 0 then
    raise exception 'Duração inválida.';
  end if;

  if p_starts_at < now() then
    raise exception 'Não é possível agendar um horário que já passou.';
  end if;

  v_local := p_starts_at at time zone 'America/Fortaleza';

  if date_trunc('minute', v_local) <> v_local
    or extract(minute from v_local)::integer not in (0, 30) then
    raise exception 'O horário precisa cair na grade de 30 minutos.';
  end if;

  v_dow := extract(dow from v_local)::integer;
  v_start := v_local::time;
  v_end := v_local + make_interval(mins => p_duration);

  if v_end::date <> v_local::date then
    raise exception 'O atendimento precisa terminar dentro do expediente do dia.';
  end if;

  v_end_time := v_end::time;

  select h.is_open, h.opens_at, h.closes_at
    into v_open, v_opens, v_closes
  from public.operating_hours h
  where h.weekday = v_dow;

  if not coalesce(v_open, false) then
    raise exception 'A barbearia está fechada nesse dia.';
  end if;

  if v_start < v_opens or v_end_time > v_closes then
    raise exception 'O horário não cabe no expediente.';
  end if;

  if exists (
    select 1
    from public.operating_breaks b
    where b.weekday = v_dow
      and v_start < b.ends_at
      and b.starts_at < v_end_time
  ) then
    raise exception 'O horário atravessa uma pausa.';
  end if;

  if exists (
    select 1
    from public.appointments a
    where a.status = 'confirmed'
      and (p_ignore_id is null or a.id <> p_ignore_id)
      and tstzrange(a.starts_at, a.ends_at, '[)')
        && tstzrange(p_starts_at, p_starts_at + make_interval(mins => p_duration), '[)')
  ) then
    raise exception 'Esse horário não está mais disponível.';
  end if;

  if exists (
    select 1
    from public.time_blocks b
    where tstzrange(b.starts_at, b.ends_at, '[)')
      && tstzrange(p_starts_at, p_starts_at + make_interval(mins => p_duration), '[)')
  ) then
    raise exception 'Esse horário está bloqueado.';
  end if;

  if exists (
    select 1
    from public.daily_time_blocks d
    where v_start < d.ends_at
      and d.starts_at < v_end_time
  ) then
    raise exception 'Esse horário está bloqueado.';
  end if;
end;
$$;

revoke all on function private.assert_slot_available(timestamptz, integer, uuid) from public, anon, authenticated;

create or replace function public.list_day_occupancy(
  p_day date,
  p_ignore_id uuid default null
)
returns table (
  range_id uuid,
  starts_at timestamptz,
  ends_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when a.client_id = (select auth.uid()) or (select public.is_owner()) then a.id
      else null
    end,
    a.starts_at,
    a.ends_at
  from public.appointments a
  where a.status = 'confirmed'
    and (p_ignore_id is null or a.id <> p_ignore_id)
    and (a.starts_at at time zone 'America/Fortaleza')::date <= p_day
    and (a.ends_at at time zone 'America/Fortaleza')::date >= p_day
  union all
  select
    b.id,
    b.starts_at,
    b.ends_at
  from public.time_blocks b
  where (b.starts_at at time zone 'America/Fortaleza')::date <= p_day
    and (b.ends_at at time zone 'America/Fortaleza')::date >= p_day
  union all
  select
    d.id,
    (p_day + d.starts_at) at time zone 'America/Fortaleza',
    (p_day + d.ends_at) at time zone 'America/Fortaleza'
  from public.daily_time_blocks d;
$$;

create or replace function public.create_daily_time_block(
  p_starts_at time,
  p_ends_at time
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_owner() then
    raise exception 'Acesso restrito ao dono.';
  end if;

  if p_ends_at <= p_starts_at then
    raise exception 'O fim do bloqueio precisa ser depois do início.';
  end if;

  insert into public.daily_time_blocks (starts_at, ends_at)
  values (p_starts_at, p_ends_at)
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.delete_daily_time_block(p_block_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Acesso restrito ao dono.';
  end if;

  delete from public.daily_time_blocks
  where id = p_block_id;

  if not found then
    raise exception 'Bloqueio não encontrado.';
  end if;

  return p_block_id;
end;
$$;

revoke all on function public.create_daily_time_block(time, time) from public, anon;
revoke all on function public.delete_daily_time_block(uuid) from public, anon;

grant execute on function public.create_daily_time_block(time, time) to authenticated;
grant execute on function public.delete_daily_time_block(uuid) to authenticated;
