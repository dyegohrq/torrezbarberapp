-- Conteúdo confirmado. Duração de 30 min é provisória. Sem sobrancelha e sem produtos inventados.

insert into public.business_profile (id, address, whatsapp, instagram_url, map_embed_url)
values (
  1,
  'Rua José de Oliveira Batista, 116 — Valentina, João Pessoa — PB',
  '5583987850386',
  'https://www.instagram.com/torrezbarber/',
  'https://maps.google.com/maps?q=Rua+Jos%C3%A9+de+Oliveira+Batista,+116,+Valentina,+Jo%C3%A3o+Pessoa&z=16&output=embed'
);

insert into public.operating_hours (weekday, is_open, opens_at, closes_at)
values
  (0, true, '09:00', '18:00'),
  (1, false, null, null),
  (2, true, '09:00', '18:00'),
  (3, true, '09:00', '18:00'),
  (4, true, '09:00', '18:00'),
  (5, true, '09:00', '18:00'),
  (6, true, '09:00', '18:00');

insert into public.services (
  name,
  description,
  price_cents,
  duration_minutes,
  duration_is_provisional,
  is_active,
  sort_order
)
values
  ('Corte Degradê', 'Corte masculino com degradê.', 2000, 30, true, true, 1),
  ('Corte Social', 'Corte social masculino.', 1700, 30, true, true, 2),
  ('Barba', 'Acabamento de barba.', 1500, 30, true, true, 3),
  ('Cavanhaque', 'Acabamento de cavanhaque.', 1000, 30, true, true, 4),
  ('Infantil', 'Corte infantil.', 2000, 30, true, true, 5),
  ('Pigmentação + Corte', 'Pigmentação com corte.', 3500, 30, true, true, 6),
  ('Luzes + Corte', 'Luzes com corte.', 7000, 30, true, true, 7),
  ('Nevou + Corte', 'Nevou com corte.', 9000, 30, true, true, 8),
  ('Perfil / Pezinho', 'Perfil e pezinho.', 1000, 30, true, true, 9),
  ('Freestyle', 'Detalhe freestyle.', 500, 30, true, true, 10);
