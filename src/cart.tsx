import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem, Product } from './types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity: number, color: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedColor === color
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedColor === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedColor === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
