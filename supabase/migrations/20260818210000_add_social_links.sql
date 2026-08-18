alter table "isahomeDB".site_contact
add column if not exists facebook_url text not null default '',
add column if not exists instagram_url text not null default '';
