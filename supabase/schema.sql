-- Supabase schema for Kiddie Boutique

create table if not exists public.users (
  id uuid primary key default auth.uid(),
  email text unique,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  category text,
  age_group text,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  featured boolean default false,
  image_url text,
  images text[] default '{}',
  sizes text[] default '{}',
  colors text[] default '{}',
  stock integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  currency text not null default 'usd',
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  size text,
  color text,
  inserted_at timestamp with time zone default now(),
  unique(user_id, product_id, size, color)
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.cart_items enable row level security;

-- Users table policies
create policy if not exists "Users are viewable by owner" on public.users
  for select using (auth.uid() = id);

create policy if not exists "Users can insert self" on public.users
  for insert with check (auth.uid() = id);

create policy if not exists "Users can update self" on public.users
  for update using (auth.uid() = id);

-- Products policies: readable by all, writable by admins
create policy if not exists "Products are readable by everyone" on public.products
  for select using (true);

-- Create an admin role helper function
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select coalesce((select is_admin from public.users where id = uid), false);
$$;

create policy if not exists "Only admins can insert products" on public.products
  for insert with check (public.is_admin(auth.uid()));

create policy if not exists "Only admins can update products" on public.products
  for update using (public.is_admin(auth.uid()));

create policy if not exists "Only admins can delete products" on public.products
  for delete using (public.is_admin(auth.uid()));

-- Orders: owner can select/insert; admins can select all
create policy if not exists "Users can view own orders" on public.orders
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "Users can insert own orders" on public.orders
  for insert with check (user_id = auth.uid());

-- Cart items: owner only
create policy if not exists "Users manage own cart" on public.cart_items
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Triggers to maintain updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();


