grant select, insert, update, delete on "isahomeDB".contact_messages to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'contact_messages'
      and policyname = 'Public can create contact messages'
  ) then
    create policy "Public can create contact messages"
    on "isahomeDB".contact_messages
    for insert
    to anon
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'contact_messages'
      and policyname = 'Temporary public admin can read contact messages'
  ) then
    create policy "Temporary public admin can read contact messages"
    on "isahomeDB".contact_messages
    for select
    to anon
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'contact_messages'
      and policyname = 'Temporary public admin can update contact messages'
  ) then
    create policy "Temporary public admin can update contact messages"
    on "isahomeDB".contact_messages
    for update
    to anon
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'contact_messages'
      and policyname = 'Temporary public admin can delete contact messages'
  ) then
    create policy "Temporary public admin can delete contact messages"
    on "isahomeDB".contact_messages
    for delete
    to anon
    using (true);
  end if;
end $$;
