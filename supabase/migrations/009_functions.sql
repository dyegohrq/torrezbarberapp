-- Escritas da agenda. O cliente não recebe WhatsApp; o dono recebe notificação no painel.

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
end;
$$;

revoke all on function private.assert_slot_available(timestamptz, integer, uuid) from public, anon, authenticated;

create or replace function private.lock_client_profile(p_uid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform 1 from public.profiles where id = p_uid for update;

  if not found then
    raise exception 'Conta não encontrada.';
  end if;
end;
$$;

revoke all on function private.lock_client_profile(uuid) from public, anon, authenticated;

create or replace function private.sum_active_services(p_service_ids uuid[])
returns table (duration_minutes integer, price_cents integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected integer;
  v_count integer;
  v_duration integer;
  v_price integer;
begin
  if p_service_ids is null or cardinality(p_service_ids) = 0 then
    raise exception 'Selecione ao menos um serviço.';
  end if;

  if cardinality(p_service_ids) <> (
    select count(distinct requested)
    from unnest(p_service_ids) as requested
  ) then
    raise exception 'Serviço repetido na seleção.';
  end if;

  select count(*)
    into v_expected
  from unnest(p_service_ids) as requested;

  select count(*), coalesce(sum(s.duration_minutes), 0), coalesce(sum(s.price_cents), 0)
    into v_count, v_duration, v_price
  from public.services s
  where s.id in (select unnest(p_service_ids))
    and s.is_active = true;

  if v_count <> v_expected then
    raise exception 'Um ou mais serviços não estão disponíveis.';
  end if;

  return query select v_duration, v_price;
end;
$$;

revoke all on function private.sum_active_services(uuid[]) from public, anon, authenticated;

create or replace function private.insert_confirmed_appointment(
  p_client_id uuid,
  p_starts_at timestamptz,
  p_service_ids uuid[],
  p_duration integer,
  p_price integer,
  p_rescheduled_from uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.appointments (
    client_id,
    starts_at,
    duration_minutes,
    price_cents,
    status,
    rescheduled_from_id
  )
  values (
    p_client_id,
    p_starts_at,
    p_duration,
    p_price,
    'confirmed',
    p_rescheduled_from
  )
  returning id into v_id;

  insert into public.appointment_services (
    appointment_id,
    service_id,
    service_name,
    price_cents,
    duration_minutes,
    position
  )
  select
    v_id,
    s.id,
    s.name,
    s.price_cents,
    s.duration_minutes,
    requested.ordinality::smallint
  from unnest(p_service_ids) with ordinality as requested (id, ordinality)
  join public.services s on s.id = requested.id;

  return v_id;
end;
$$;

revoke all on function private.insert_confirmed_appointment(uuid, timestamptz, uuid[], integer, integer, uuid)
  from public, anon, authenticated;

create or replace function public.book_appointment(
  p_starts_at timestamptz,
  p_service_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_duration integer;
  v_price integer;
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'É preciso estar autenticado para agendar.';
  end if;

  perform private.lock_client_profile(v_uid);

  if exists (
    select 1
    from public.appointments a
    where a.client_id = v_uid
      and a.status = 'confirmed'
      and a.starts_at > now()
  ) then
    raise exception 'Você já tem um agendamento futuro. Cancele ou remarque o atual.';
  end if;

  select totals.duration_minutes, totals.price_cents
    into v_duration, v_price
  from private.sum_active_services(p_service_ids) as totals;

  perform private.assert_slot_available(p_starts_at, v_duration, null);

  v_id := private.insert_confirmed_appointment(
    v_uid,
    p_starts_at,
    p_service_ids,
    v_duration,
    v_price,
    null
  );

  insert into public.owner_notifications (type, appointment_id, body)
  select
    'booked',
    v_id,
    'Novo agendamento: '
      || p.full_name
      || ' em '
      || to_char(p_starts_at at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI')
  from public.profiles p
  where p.id = v_uid;

  return v_id;
end;
$$;

create or replace function public.cancel_appointment_by_client(p_appointment_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_status public.appointment_status;
  v_starts timestamptz;
  v_client uuid;
begin
  if v_uid is null then
    raise exception 'É preciso estar autenticado.';
  end if;

  perform private.lock_client_profile(v_uid);

  select status, starts_at, client_id
    into v_status, v_starts, v_client
  from public.appointments
  where id = p_appointment_id
  for update;

  if not found or v_client is distinct from v_uid then
    raise exception 'Agendamento não encontrado.';
  end if;

  if v_status = 'cancelled' then
    return p_appointment_id;
  end if;

  if v_status <> 'confirmed' then
    raise exception 'Esse agendamento não pode ser cancelado.';
  end if;

  if now() > v_starts - interval '2 hours' then
    raise exception 'Cancelamento e remarcação só são permitidos até 2 horas antes do horário.';
  end if;

  update public.appointments
  set status = 'cancelled'
  where id = p_appointment_id;

  insert into public.owner_notifications (type, appointment_id, body)
  select
    'cancelled_by_client',
    p_appointment_id,
    'Cancelamento: '
      || p.full_name
      || ' desmarcou '
      || to_char(v_starts at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI')
  from public.profiles p
  where p.id = v_uid;

  return p_appointment_id;
end;
$$;

create or replace function public.reschedule_appointment(
  p_appointment_id uuid,
  p_starts_at timestamptz,
  p_service_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_status public.appointment_status;
  v_starts timestamptz;
  v_client uuid;
  v_duration integer;
  v_price integer;
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'É preciso estar autenticado.';
  end if;

  perform private.lock_client_profile(v_uid);

  select status, starts_at, client_id
    into v_status, v_starts, v_client
  from public.appointments
  where id = p_appointment_id
  for update;

  if not found or v_client is distinct from v_uid then
    raise exception 'Agendamento não encontrado.';
  end if;

  if v_status <> 'confirmed' then
    raise exception 'Esse agendamento não pode ser remarcado.';
  end if;

  if now() > v_starts - interval '2 hours' then
    raise exception 'Cancelamento e remarcação só são permitidos até 2 horas antes do horário.';
  end if;

  if exists (
    select 1
    from public.appointments a
    where a.client_id = v_uid
      and a.status = 'confirmed'
      and a.starts_at > now()
      and a.id <> p_appointment_id
  ) then
    raise exception 'Você já tem um agendamento futuro. Cancele ou remarque o atual.';
  end if;

  select totals.duration_minutes, totals.price_cents
    into v_duration, v_price
  from private.sum_active_services(p_service_ids) as totals;

  perform private.assert_slot_available(p_starts_at, v_duration, p_appointment_id);

  update public.appointments
  set status = 'rescheduled'
  where id = p_appointment_id;

  v_id := private.insert_confirmed_appointment(
    v_uid,
    p_starts_at,
    p_service_ids,
    v_duration,
    v_price,
    p_appointment_id
  );

  insert into public.owner_notifications (type, appointment_id, body)
  select
    'rescheduled',
    v_id,
    'Remarcação: '
      || p.full_name
      || ' mudou para '
      || to_char(p_starts_at at time zone 'America/Fortaleza', 'DD/MM/YYYY HH24:MI')
  from public.profiles p
  where p.id = v_uid;

  return v_id;
end;
$$;

create or replace function public.cancel_appointment_by_owner(p_appointment_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status public.appointment_status;
begin
  if not public.is_owner() then
    raise exception 'Acesso restrito ao dono.';
  end if;

  select status
    into v_status
  from public.appointments
  where id = p_appointment_id
  for update;

  if not found then
    raise exception 'Agendamento não encontrado.';
  end if;

  if v_status = 'cancelled' then
    return p_appointment_id;
  end if;

  if v_status <> 'confirmed' then
    raise exception 'Esse agendamento não pode ser cancelado.';
  end if;

  update public.appointments
  set status = 'cancelled'
  where id = p_appointment_id;

  return p_appointment_id;
end;
$$;

create or replace function public.create_time_block(
  p_starts_at timestamptz,
  p_ends_at timestamptz
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

  insert into public.time_blocks (starts_at, ends_at)
  values (p_starts_at, p_ends_at)
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.delete_time_block(p_block_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Acesso restrito ao dono.';
  end if;

  delete from public.time_blocks
  where id = p_block_id;

  if not found then
    raise exception 'Bloqueio não encontrado.';
  end if;

  return p_block_id;
end;
$$;

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
    and (b.ends_at at time zone 'America/Fortaleza')::date >= p_day;
$$;

revoke all on function public.list_day_occupancy(date, uuid) from public;
grant execute on function public.list_day_occupancy(date, uuid) to anon, authenticated;

revoke all on function public.book_appointment(timestamptz, uuid[]) from public, anon;
revoke all on function public.cancel_appointment_by_client(uuid) from public, anon;
revoke all on function public.reschedule_appointment(uuid, timestamptz, uuid[]) from public, anon;
revoke all on function public.cancel_appointment_by_owner(uuid) from public, anon;
revoke all on function public.create_time_block(timestamptz, timestamptz) from public, anon;
revoke all on function public.delete_time_block(uuid) from public, anon;

grant execute on function public.book_appointment(timestamptz, uuid[]) to authenticated;
grant execute on function public.cancel_appointment_by_client(uuid) to authenticated;
grant execute on function public.reschedule_appointment(uuid, timestamptz, uuid[]) to authenticated;
grant execute on function public.cancel_appointment_by_owner(uuid) to authenticated;
grant execute on function public.create_time_block(timestamptz, timestamptz) to authenticated;
grant execute on function public.delete_time_block(uuid) to authenticated;
