-- Create role enum
create type public.app_role as enum ('admin', 'user');

-- Create profiles table (separate from auth.users for additional user data)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create user_roles table for proper role management
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique(user_id, role)
);

-- Create products table
create table public.products (
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

-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  currency text not null default 'usd',
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default now()
);

-- Create order_items table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null,
  size text,
  color text
);

-- Create cart_items table
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  size text,
  color text,
  inserted_at timestamp with time zone default now(),
  unique(user_id, product_id, size, color)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;

-- Create security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- User roles policies
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);

create policy "Admins can manage all roles" on public.user_roles
  using (public.has_role(auth.uid(), 'admin'));

-- Products policies: readable by all, writable by admins
create policy "Products are readable by everyone" on public.products
  for select using (true);

create policy "Only admins can insert products" on public.products
  for insert with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update products" on public.products
  for update using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete products" on public.products
  for delete using (public.has_role(auth.uid(), 'admin'));

-- Orders: owner can select/insert; admins can select all
create policy "Users can view own orders" on public.orders
  for select using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users can insert own orders" on public.orders
  for insert with check (user_id = auth.uid());

create policy "Admins can update orders" on public.orders
  for update using (public.has_role(auth.uid(), 'admin'));

-- Order items: readable to order owners or admins, insert tied to own orders
create policy "Users can view order_items of own orders" on public.order_items
  for select using (
    exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(), 'admin')))
  );

create policy "Users can insert order_items for own orders" on public.order_items
  for insert with check (
    exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Cart items: owner only
create policy "Users manage own cart" on public.cart_items
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Create trigger function for updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add triggers for updated_at
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();