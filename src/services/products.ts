import type { Product } from '../types';
import { supabase } from '../lib/supabase';

const HOME_SCHEMA = 'isahomeDB';
const PRODUCT_BUCKET = 'isahome';
const PRODUCT_IMAGE_PREFIX = 'ISAHOME/products';
const FALLBACK_PRODUCT_IMAGE =
  'https://images.pexels.com/photos/6996077/pexels-photo-6996077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

interface ProductImageRow {
  public_url: string;
  sort_order: number;
}

interface ProductRow {
  id: string;
  name: string;
  category: Product['category'];
  price: number | string;
  description: string;
  colors: string[];
  stock: number;
  sales: number;
  featured: boolean;
  product_images?: ProductImageRow[];
}

export type ProductInput = Omit<Product, 'id'> & {
  id?: string;
};

function fromRow(row: ProductRow): Product {
  const images = [...(row.product_images || [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.public_url);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    colors: row.colors?.length ? row.colors : ['#936639'],
    images: images.length ? images : [FALLBACK_PRODUCT_IMAGE],
    stock: row.stock,
    sales: row.sales,
    featured: row.featured,
  };
}

function toProductRow(product: ProductInput) {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    colors: product.colors,
    stock: product.stock,
    sales: product.sales,
    featured: Boolean(product.featured),
  };
}

export async function fetchProducts() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .schema(HOME_SCHEMA)
    .from('products')
    .select(
      'id, name, category, price, description, colors, stock, sales, featured, product_images(public_url, sort_order)'
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => fromRow(row as ProductRow));
}

export async function saveProduct(product: ProductInput) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const query = product.id
    ? supabase
        .schema(HOME_SCHEMA)
        .from('products')
        .update(toProductRow(product))
        .eq('id', product.id)
    : supabase.schema(HOME_SCHEMA).from('products').insert(toProductRow(product));

  const { data, error } = await query
    .select('id, name, category, price, description, colors, stock, sales, featured')
    .single<ProductRow>();

  if (error) throw error;

  await replaceProductImages(data.id, product.images);
  return fetchProduct(data.id);
}

export async function deleteProduct(productId: string) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const { error } = await supabase
    .schema(HOME_SCHEMA)
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
}

export async function uploadProductImage(file: File) {
  if (!supabase) throw new Error('Supabase no esta configurado.');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const path = `${PRODUCT_IMAGE_PREFIX}/product-${Date.now()}-${safeName || 'imagen'}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return {
    path,
    publicUrl: data.publicUrl,
  };
}

async function fetchProduct(productId: string) {
  const { data, error } = await supabase!
    .schema(HOME_SCHEMA)
    .from('products')
    .select(
      'id, name, category, price, description, colors, stock, sales, featured, product_images(public_url, sort_order)'
    )
    .eq('id', productId)
    .single<ProductRow>();

  if (error) throw error;
  return fromRow(data);
}

async function replaceProductImages(productId: string, images: string[]) {
  const normalizedImages = images.filter(Boolean);

  const { error: deleteError } = await supabase!
    .schema(HOME_SCHEMA)
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (deleteError) throw deleteError;
  if (normalizedImages.length === 0) return;

  const { error: insertError } = await supabase!
    .schema(HOME_SCHEMA)
    .from('product_images')
    .insert(
      normalizedImages.map((image, index) => ({
        product_id: productId,
        public_url: image,
        alt: '',
        sort_order: index,
      }))
    );

  if (insertError) throw insertError;
}
