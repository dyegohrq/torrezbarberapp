-- Imagens de portfólio, produtos e serviços. Leitura pública; envio só do dono.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy media_public_read on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy media_owner_insert on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media' and (select public.is_owner()));

create policy media_owner_update on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and (select public.is_owner()))
  with check (bucket_id = 'media' and (select public.is_owner()));

create policy media_owner_delete on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and (select public.is_owner()));
