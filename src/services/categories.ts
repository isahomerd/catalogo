import type { ProductCategory } from '../types';
import { supabase } from '../lib/supabase';

const HOME_SCHEMA = 'isahomeDB';

interface CategoryRow {
  id: string;
  name: string;
  sort_order: number;
}

function fromRow(row: CategoryRow): ProductCategory {
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

export async function fetchCategories() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('categories')
    .select('id, name, sort_order')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map((row) => fromRow(row as CategoryRow));
}

export async function saveCategory(category: { id?: string; name: string; sortOrder: number }) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const payload = {
    name: category.name.trim(),
    sort_order: category.sortOrder,
  };

  const query = category.id
    ? supabase.schema(HOME_SCHEMA).from('categories').update(payload).eq('id', category.id)
    : supabase.schema(HOME_SCHEMA).from('categories').insert(payload);

  const { data, error } = await query
    .select('id, name, sort_order')
    .single<CategoryRow>();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteCategory(categoryId: string) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { error } = await supabase
    .schema(HOME_SCHEMA)
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) throw error;
}
