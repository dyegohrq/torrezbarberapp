-- A pausa usa o tipo time. tsrange só existe para timestamp, então a confirmação falhava.

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
