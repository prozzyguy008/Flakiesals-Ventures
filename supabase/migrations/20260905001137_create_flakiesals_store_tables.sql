/*
# Create FLAKIESALS store tables

1. New Tables
- `store_products`: the editable product catalog, including name, category, price, local image path, description, and stock.
- `store_orders`: customer checkout records with contact details, total, and payment status.
- `store_order_items`: the product lines belonging to each order.

2. Security
- Row-level security is enabled on every table.
- This is a single-store, no-sign-in storefront, so the public catalog and checkout records are available to the anon and authenticated app roles.
- Four separate CRUD policies are provided per table.

3. Important Notes
- Stock is a catalog value and should be updated by the store team after bank-transfer confirmation.
- Product image paths are local public paths and are not stored as external URLs.
*/

CREATE TABLE IF NOT EXISTS store_products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer,
  image text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  notes text NOT NULL DEFAULT '',
  total integer NOT NULL,
  payment_status text NOT NULL DEFAULT 'awaiting_transfer',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON store_products;
CREATE POLICY "Public can view products" ON store_products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can add products" ON store_products;
CREATE POLICY "Public can add products" ON store_products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can edit products" ON store_products;
CREATE POLICY "Public can edit products" ON store_products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can remove products" ON store_products;
CREATE POLICY "Public can remove products" ON store_products FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view orders" ON store_orders;
CREATE POLICY "Public can view orders" ON store_orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can add orders" ON store_orders;
CREATE POLICY "Public can add orders" ON store_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can edit orders" ON store_orders;
CREATE POLICY "Public can edit orders" ON store_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can remove orders" ON store_orders;
CREATE POLICY "Public can remove orders" ON store_orders FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view order items" ON store_order_items;
CREATE POLICY "Public can view order items" ON store_order_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can add order items" ON store_order_items;
CREATE POLICY "Public can add order items" ON store_order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can edit order items" ON store_order_items;
CREATE POLICY "Public can edit order items" ON store_order_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can remove order items" ON store_order_items;
CREATE POLICY "Public can remove order items" ON store_order_items FOR DELETE TO anon, authenticated USING (true);
