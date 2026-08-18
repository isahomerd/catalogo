create table if not exists "isahomeDB".categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_categories_updated_at on "isahomeDB".categories;
create trigger set_categories_updated_at
before update on "isahomeDB".categories
for each row execute function "isahomeDB".set_updated_at();

alter table "isahomeDB".categories enable row level security;

insert into "isahomeDB".categories (name, sort_order) values
  ('Cocina', 10),
  ('Comedor', 20),
  ('Sala', 30),
  ('Dormitorio', 40),
  ('Baño', 50),
  ('Decoración', 60)
on conflict (name) do nothing;

grant select on "isahomeDB".categories to anon, authenticated;
grant insert, update, delete on "isahomeDB".categories to anon, authenticated;
grant insert, update, delete on "isahomeDB".products to anon;
grant insert, update, delete on "isahomeDB".product_images to anon;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'categories'
      and policyname = 'Public can read categories'
  ) then
    create policy "Public can read categories"
    on "isahomeDB".categories
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'categories'
      and policyname = 'Temporary public admin can manage categories'
  ) then
    create policy "Temporary public admin can manage categories"
    on "isahomeDB".categories
    for all
    to anon
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'products'
      and policyname = 'Temporary public admin can manage products'
  ) then
    create policy "Temporary public admin can manage products"
    on "isahomeDB".products
    for all
    to anon
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'product_images'
      and policyname = 'Temporary public admin can manage product images'
  ) then
    create policy "Temporary public admin can manage product images"
    on "isahomeDB".product_images
    for all
    to anon
    using (true)
    with check (true);
  end if;
end $$;
