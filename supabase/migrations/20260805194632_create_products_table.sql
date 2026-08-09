/*
# Create products table for eCommerce store (single-tenant, no auth)

1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null) - product name
  - `description` (text, not null) - product description
  - `price` (numeric, not null) - price in USD
  - `image_url` (text, not null) - product image URL
  - `category` (text, not null) - product category
  - `rating` (numeric, default 0) - average rating 0-5
  - `reviews_count` (integer, default 0) - number of reviews
  - `in_stock` (boolean, default true) - availability
  - `featured` (boolean, default false) - show on homepage
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `products`.
- Allow anon + authenticated CRUD because the data is intentionally public/shared (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);
