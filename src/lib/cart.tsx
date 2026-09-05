import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from './supabase';

type CartContextValue = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'flakiesals_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add: CartContextValue['add'] = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const remove: CartContextValue['remove'] = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const setQuantity: CartContextValue['setQuantity'] = (productId, quantity) => {
    if (quantity <= 0) {
      remove(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce(
    (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, add, remove, setQuantity, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
