create extension if not exists pgcrypto with schema extensions;

create schema if not exists "isahomeDB";

create table if not exists "isahomeDB".home_content (
  id text primary key default 'home',
  eyebrow text not null,
  title text not null,
  description text not null,
  cta_label text not null,
  image_url text not null,
  image_alt text not null,
  updated_at timestamptz not null default now(),
  constraint home_content_singleton check (id = 'home')
);

create table if not exists "isahomeDB".products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  description text not null default 'Sin descripcion',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  sales integer not null default 0 check (sales >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists "isahomeDB".product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references "isahomeDB".products(id) on delete cascade,
  storage_path text,
  public_url text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists "isahomeDB".contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function "isahomeDB".set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_home_content_updated_at on "isahomeDB".home_content;
create trigger set_home_content_updated_at
before update on "isahomeDB".home_content
for each row execute function "isahomeDB".set_updated_at();

drop trigger if exists set_products_updated_at on "isahomeDB".products;
create trigger set_products_updated_at
before update on "isahomeDB".products
for each row execute function "isahomeDB".set_updated_at();

alter table "isahomeDB".home_content enable row level security;
alter table "isahomeDB".products enable row level security;
alter table "isahomeDB".product_images enable row level security;
alter table "isahomeDB".contact_messages enable row level security;

insert into "isahomeDB".home_content (
  id,
  eyebrow,
  title,
  description,
  cta_label,
  image_url,
  image_alt
) values (
  'home',
  'Articulos para el Hogar',
  'La calidez que tu hogar merece',
  'Piezas seleccionadas a mano, materiales nobles y diseno atemporal. Descubre la coleccion Isa Home.',
  'Ver Catalogo',
  'https://images.pexels.com/photos/27515145/pexels-photo-27515145.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600',
  'Sala de estar elegante'
) on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'home_content'
      and policyname = 'Public can read home content'
  ) then
    create policy "Public can read home content"
    on "isahomeDB".home_content
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'products'
      and policyname = 'Public can read products'
  ) then
    create policy "Public can read products"
    on "isahomeDB".products
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'product_images'
      and policyname = 'Public can read product images'
  ) then
    create policy "Public can read product images"
    on "isahomeDB".product_images
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'contact_messages'
      and policyname = 'Authenticated users can manage contact messages'
  ) then
    create policy "Authenticated users can manage contact messages"
    on "isahomeDB".contact_messages
    for all
    to authenticated
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'home_content'
      and policyname = 'Authenticated users can manage home content'
  ) then
    create policy "Authenticated users can manage home content"
    on "isahomeDB".home_content
    for all
    to authenticated
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'products'
      and policyname = 'Authenticated users can manage products'
  ) then
    create policy "Authenticated users can manage products"
    on "isahomeDB".products
    for all
    to authenticated
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'product_images'
      and policyname = 'Authenticated users can manage product images'
  ) then
    create policy "Authenticated users can manage product images"
    on "isahomeDB".product_images
    for all
    to authenticated
    using (true)
    with check (true);
  end if;
end $$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'isahome',
  'isahome',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read Isa Home images'
  ) then
    create policy "Public can read Isa Home images"
    on storage.objects
    for select
    using (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload Isa Home images'
  ) then
    create policy "Authenticated users can upload Isa Home images"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can update Isa Home images'
  ) then
    create policy "Authenticated users can update Isa Home images"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'isahome' and name like 'ISAHOME/%')
    with check (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete Isa Home images'
  ) then
    create policy "Authenticated users can delete Isa Home images"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;
end $$;
