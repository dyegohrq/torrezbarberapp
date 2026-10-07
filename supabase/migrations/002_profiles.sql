-- Perfil do cliente e do dono. O papel owner nunca nasce no cadastro público.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now(),
  constraint profiles_full_name_not_blank check (length(trim(full_name)) > 0),
  constraint profiles_phone_not_blank check (length(trim(phone)) > 0),
  constraint profiles_email_not_blank check (length(trim(email)) > 0),
  constraint profiles_phone_unique unique (phone),
  constraint profiles_email_unique unique (email)
);

create unique index profiles_single_owner_idx
  on public.profiles ((1))
  where role = 'owner';

create index profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'INSERT'
    and new.role is distinct from 'client'
    and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'Não é permitido criar conta com papel administrativo.';
  end if;

  if tg_op = 'UPDATE'
    and new.role is distinct from old.role
    and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'Não é permitido alterar o papel da conta.';
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before insert or update on public.profiles
  for each row
  execute function public.prevent_role_change();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone, email)
  values (
    new.id,
    'client',
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    trim(coalesce(new.raw_user_meta_data ->> 'phone', '')),
    trim(coalesce(new.email, ''))
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
