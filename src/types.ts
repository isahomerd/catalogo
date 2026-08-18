export type Category =
  | 'Cocina'
  | 'Comedor'
  | 'Sala'
  | 'Dormitorio'
  | 'Baño'
  | 'Decoración';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  colors: string[];
  images: string[];
  stock: number;
  sales: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface HomeContent {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  imageUrl: string;
  imageAlt: string;
}
