-- Bloqueios do dono, sem cliente. Não podem cobrir um agendamento confirmado.

create table public.time_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint time_blocks_window check (ends_at > starts_at),
  constraint time_blocks_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  )
);

create index time_blocks_starts_at_idx on public.time_blocks (starts_at);

alter table public.time_blocks enable row level security;

create or replace function public.assert_block_not_over_appointment()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.appointments a
    where a.status = 'confirmed'
      and tstzrange(a.starts_at, a.ends_at, '[)')
        && tstzrange(new.starts_at, new.ends_at, '[)')
  ) then
    raise exception 'Horário ocupado. Cancele o agendamento antes de bloquear.';
  end if;

  return new;
end;
$$;

create trigger time_blocks_reject_occupied
  before insert or update on public.time_blocks
  for each row
  execute function public.assert_block_not_over_appointment();

create trigger appointments_reject_blocked
  before insert or update on public.appointments
  for each row
  execute function public.assert_appointment_not_blocked();
