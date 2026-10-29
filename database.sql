create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  category_id uuid references categories(id) on delete set null,
  amount numeric(14,2) not null check (amount > 0),
  note text,
  transaction_date date not null default current_date,
  created_at timestamptz default now()
);

create index on transactions (user_id, transaction_date desc);

alter table categories enable row level security;
alter table transactions enable row level security;

create policy "own categories" on categories
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own transactions" on transactions
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);