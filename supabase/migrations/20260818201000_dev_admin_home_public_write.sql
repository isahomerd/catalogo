grant update on "isahomeDB".home_content to anon;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'isahomeDB'
      and tablename = 'home_content'
      and policyname = 'Temporary public admin can update home content'
  ) then
    create policy "Temporary public admin can update home content"
    on "isahomeDB".home_content
    for update
    to anon
    using (id = 'home')
    with check (id = 'home');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Temporary public admin can upload Isa Home images'
  ) then
    create policy "Temporary public admin can upload Isa Home images"
    on storage.objects
    for insert
    to anon
    with check (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Temporary public admin can update Isa Home images'
  ) then
    create policy "Temporary public admin can update Isa Home images"
    on storage.objects
    for update
    to anon
    using (bucket_id = 'isahome' and name like 'ISAHOME/%')
    with check (bucket_id = 'isahome' and name like 'ISAHOME/%');
  end if;
end $$;
