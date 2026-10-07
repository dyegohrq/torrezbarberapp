-- Avisos visíveis só no painel do dono. Sem SMS, e-mail ou WhatsApp.

create table public.owner_notifications (
  id uuid primary key default gen_random_uuid(),
  type public.notification_type not null,
  appointment_id uuid references public.appointments (id) on delete set null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint owner_notifications_body_not_blank check (length(trim(body)) > 0)
);

create index owner_notifications_created_at_idx
  on public.owner_notifications (created_at desc);

create index owner_notifications_unread_idx
  on public.owner_notifications (created_at desc)
  where read_at is null;

alter table public.owner_notifications enable row level security;
