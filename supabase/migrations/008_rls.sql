-- Acesso: conteúdo público para quem visita; agenda e dados pessoais só para o dono ou o próprio cliente.

create schema if not exists private;

revoke all on schema private from public;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'owner'
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to anon, authenticated;

create policy profiles_select_self on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_owner()));

create policy profiles_update_self on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = 'client');

create policy business_profile_select_public on public.business_profile
  for select
  to anon, authenticated
  using (true);

create policy business_profile_write_owner on public.business_profile
  for update
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy operating_hours_select_public on public.operating_hours
  for select
  to anon, authenticated
  using (true);

create policy operating_hours_write_owner on public.operating_hours
  for all
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy operating_breaks_select_public on public.operating_breaks
  for select
  to anon, authenticated
  using (true);

create policy operating_breaks_write_owner on public.operating_breaks
  for all
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy services_select_visible on public.services
  for select
  to anon, authenticated
  using (is_active = true or (select public.is_owner()));

create policy services_write_owner on public.services
  for all
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy products_select_visible on public.products
  for select
  to anon, authenticated
  using (is_active = true or (select public.is_owner()));

create policy products_write_owner on public.products
  for all
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy portfolio_select_visible on public.portfolio_items
  for select
  to anon, authenticated
  using (is_active = true or (select public.is_owner()));

create policy portfolio_write_owner on public.portfolio_items
  for all
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy appointments_select_own_or_owner on public.appointments
  for select
  to authenticated
  using (client_id = (select auth.uid()) or (select public.is_owner()));

create policy appointment_services_select_own_or_owner on public.appointment_services
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.appointments a
      where a.id = appointment_id
        and (a.client_id = (select auth.uid()) or (select public.is_owner()))
    )
  );

create policy time_blocks_select_public on public.time_blocks
  for select
  to anon, authenticated
  using (true);

create policy notifications_select_owner on public.owner_notifications
  for select
  to authenticated
  using ((select public.is_owner()));

create policy notifications_update_owner on public.owner_notifications
  for update
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));
