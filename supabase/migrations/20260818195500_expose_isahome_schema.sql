grant usage on schema "isahomeDB" to anon, authenticated;

grant select on all tables in schema "isahomeDB" to anon, authenticated;
grant insert, update, delete on all tables in schema "isahomeDB" to authenticated;

alter default privileges in schema "isahomeDB"
grant select on tables to anon, authenticated;

alter default privileges in schema "isahomeDB"
grant insert, update, delete on tables to authenticated;

alter role authenticator set pgrst.db_schemas = 'public,storage,graphql_public,isahomeDB';
notify pgrst, 'reload config';
