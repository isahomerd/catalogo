create table if not exists "isahomeDB".site_contact (
  id text primary key default 'main',
  phone text not null,
  email text not null,
  address text not null,
  hours text not null,
  updated_at timestamptz not null default now(),
  constraint site_contact_singleton check (id = 'main')
);

drop trigger if exists set_site_contact_updated_at on "isahomeDB".site_contact;
create trigger set_site_contact_updated_at
before update on "isahomeDB".site_contact
for each row execute function "isahomeDB".set_updated_at();

alter table "isahomeDB".site_contact enable row level security;

insert into "isahomeDB".site_contact (
  id,
  phone,
  email,
  address,
  hours
) values (
  'main',
  '+34 600 123 456',
  'hola@isahome.com',
  'Calle Mayor 24, Madrid',
  'Lun-Vie: 10:00-20:00'
) on conflict (id) do nothing;

grant select on "isahomeDB".site_contact to anon, authenticated;
grant update on "isahomeDB".site_contact to anon, authenticated;
grant insert, delete on "isahomeDB".site_contact to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'site_contact'
      and policyname = 'Public can read site contact'
  ) then
    create policy "Public can read site contact"
    on "isahomeDB".site_contact
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'site_contact'
      and policyname = 'Temporary public admin can update site contact'
  ) then
    create policy "Temporary public admin can update site contact"
    on "isahomeDB".site_contact
    for update
    to anon
    using (id = 'main')
    with check (id = 'main');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'site_contact'
      and policyname = 'Authenticated users can manage site contact'
  ) then
    create policy "Authenticated users can manage site contact"
    on "isahomeDB".site_contact
    for all
    to authenticated
    using (true)
    with check (true);
  end if;
end $$;
