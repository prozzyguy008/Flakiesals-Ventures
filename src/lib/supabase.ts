import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  image: string;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string;
  total: number;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export const CATEGORIES = [
  'Kitchen & Cookware',
  'Kitchen Tools & Accessories',
  'Food Storage',
  'Dining & Tableware',
  'Home & Household',
  'Cleaning & Laundry',
  'Home Organization',
  'Water Bottles & Flasks',
  'Back-to-School Essentials',
  'Gifts & Souvenirs',
  'New Arrivals',
  'Best Sellers',
  'Special Offers',
] as const;

export function formatNaira(amount: number | null): string {
  if (amount == null) return 'Price on request';
  return '₦' + amount.toLocaleString('en-NG');
}
