-- Extensões e enums usados pelo restante das migrations, nesta ordem.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('client', 'owner');
  end if;

  if not exists (select 1 from pg_type where typname = 'appointment_status') then
    create type public.appointment_status as enum ('confirmed', 'cancelled', 'rescheduled');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type public.notification_type as enum (
      'booked',
      'cancelled_by_client',
      'rescheduled'
    );
  end if;
end $$;
