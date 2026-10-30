-- Catálogo de la tienda + registro de pruebas virtuales.

create table if not exists public.store_categories (
  slug text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null references public.store_categories(slug) on update cascade,
  gender text not null default 'unisex' check (gender in ('hombre', 'mujer', 'unisex')),
  price integer not null check (price >= 0), -- en pesos COP, sin decimales
  image_url text not null,
  -- true: se envía la foto como referencia a Decart; false: prueba solo con texto
  use_reference_image boolean not null default true,
  -- descripción en inglés de la prenda, usada para construir el prompt de lucy-vton
  garment_description text,
  -- prompt completo opcional; si existe, reemplaza al generado por categoría
  tryon_prompt text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists store_products_category_idx on public.store_products (category) where active;

create table if not exists public.store_tryon_events (
  id bigint generated always as identity primary key,
  product_slug text,
  decart_session_id text,
  event text not null check (event in ('try', 'end')),
  seconds integer,
  user_agent text,
  user_id uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists store_tryon_events_product_idx on public.store_tryon_events (product_slug, created_at desc);

-- RLS: catálogo de solo lectura pública; eventos solo inserción (nadie los lee con anon).
alter table public.store_categories enable row level security;
alter table public.store_products enable row level security;
alter table public.store_tryon_events enable row level security;

drop policy if exists "categorias publicas" on public.store_categories;
create policy "categorias publicas" on public.store_categories for select to anon, authenticated using (true);

drop policy if exists "productos activos publicos" on public.store_products;
create policy "productos activos publicos" on public.store_products for select to anon, authenticated using (active);

drop policy if exists "registrar pruebas" on public.store_tryon_events;
create policy "registrar pruebas" on public.store_tryon_events for insert to anon, authenticated
  with check (event in ('try', 'end') and (user_id is null or user_id = auth.uid()));

grant select on public.store_categories, public.store_products to anon, authenticated;
grant insert on public.store_tryon_events to anon, authenticated;
