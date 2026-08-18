import type { HomeContent } from '../types';
import { supabase } from '../lib/supabase';

const HOME_SCHEMA = 'isahomeDB';
const HOME_BUCKET = 'isahome';
const HOME_IMAGE_PREFIX = 'ISAHOME';

interface HomeContentRow {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta_label: string;
  image_url: string;
  image_alt: string;
}

function fromRow(row: HomeContentRow): HomeContent {
  return {
    eyebrow: row.eyebrow,
    title: row.title,
    description: row.description,
    ctaLabel: row.cta_label,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
  };
}

function toRow(content: HomeContent): HomeContentRow {
  return {
    id: 'home',
    eyebrow: content.eyebrow,
    title: content.title,
    description: content.description,
    cta_label: content.ctaLabel,
    image_url: content.imageUrl,
    image_alt: content.imageAlt,
  };
}

export async function fetchHomeContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('home_content')
    .select('id, eyebrow, title, description, cta_label, image_url, image_alt')
    .eq('id', 'home')
    .single<HomeContentRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function saveHomeContent(content: HomeContent) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('home_content')
    .update(toRow(content))
    .eq('id', 'home')
    .select('id, eyebrow, title, description, cta_label, image_url, image_alt')
    .single<HomeContentRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function uploadHomeImage(file: File) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const path = `${HOME_IMAGE_PREFIX}/home-${Date.now()}-${safeName || 'imagen'}.${extension}`;

  const { error } = await supabase.storage
    .from(HOME_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(HOME_BUCKET).getPublicUrl(path);
  return {
    path,
    publicUrl: data.publicUrl,
  };
}
