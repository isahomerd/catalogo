import type { SiteContact } from '../types';
import { supabase } from '../lib/supabase';

const HOME_SCHEMA = 'isahomeDB';

interface SiteContactRow {
  id: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}

function fromRow(row: SiteContactRow): SiteContact {
  return {
    phone: row.phone,
    email: row.email,
    address: row.address,
    hours: row.hours,
  };
}

function toRow(contact: SiteContact): SiteContactRow {
  return {
    id: 'main',
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    hours: contact.hours,
  };
}

export async function fetchSiteContact() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('site_contact')
    .select('id, phone, email, address, hours')
    .eq('id', 'main')
    .single<SiteContactRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function saveSiteContact(contact: SiteContact) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('site_contact')
    .update(toRow(contact))
    .eq('id', 'main')
    .select('id, phone, email, address, hours')
    .single<SiteContactRow>();

  if (error) throw error;
  return fromRow(data);
}
