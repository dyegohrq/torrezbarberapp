create or replace function public.list_period_occupancy(
  p_from date,
  p_to date,
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
  with bounds as (
    select p_from as day_from, p_to as day_to
    where p_from <= p_to
      and (p_to - p_from) <= 62
  ),
  viewer as (
    select auth.uid() as uid, public.is_owner() as is_owner
  )
  select
    case
      when a.client_id = viewer.uid or viewer.is_owner then a.id
      else null
    end,
    a.starts_at,
    a.ends_at
  from bounds
  cross join viewer
  join public.appointments a
    on a.status = 'confirmed'
   and (p_ignore_id is null or a.id <> p_ignore_id)
   and (a.starts_at at time zone 'America/Fortaleza')::date <= bounds.day_to
   and (a.ends_at at time zone 'America/Fortaleza')::date >= bounds.day_from
  union all
  select
    b.id,
    b.starts_at,
    b.ends_at
  from bounds
  join public.time_blocks b
    on (b.starts_at at time zone 'America/Fortaleza')::date <= bounds.day_to
   and (b.ends_at at time zone 'America/Fortaleza')::date >= bounds.day_from
  union all
  select
    d.id,
    ((gs.day)::date + d.starts_at) at time zone 'America/Fortaleza',
    ((gs.day)::date + d.ends_at) at time zone 'America/Fortaleza'
  from bounds
  cross join generate_series(bounds.day_from, bounds.day_to, interval '1 day') as gs(day)
  cross join public.daily_time_blocks d;
$$;

revoke all on function public.list_period_occupancy(date, date, uuid) from public;
grant execute on function public.list_period_occupancy(date, date, uuid) to anon, authenticated;
