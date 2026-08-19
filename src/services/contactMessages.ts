import type { ContactMessage } from '../types';
import { supabase } from '../lib/supabase';

const HOME_SCHEMA = 'isahomeDB';

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function fromRow(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    message: row.message,
    date: row.created_at,
    read: row.read,
  };
}

export async function fetchContactMessages() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('contact_messages')
    .select('id, name, email, phone, message, read, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => fromRow(row as ContactMessageRow));
}

export async function createContactMessage(message: ContactMessageInput) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('contact_messages')
    .insert({
      name: message.name.trim(),
      email: message.email.trim(),
      phone: message.phone.trim() || null,
      message: message.message.trim(),
      read: false,
    })
    .select('id, name, email, phone, message, read, created_at')
    .single<ContactMessageRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function markContactMessageRead(id: string) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id)
    .select('id, name, email, phone, message, read, created_at')
    .single<ContactMessageRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteContactMessage(id: string) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { error } = await supabase
    .schema(HOME_SCHEMA)
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
