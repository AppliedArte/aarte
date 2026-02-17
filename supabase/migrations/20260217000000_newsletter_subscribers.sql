-- Fantasy VC Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  source text default 'website',
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  is_active boolean default true,
  tags text[] default '{}'
);

-- Indexes
create index if not exists idx_newsletter_active on public.newsletter_subscribers (is_active) where is_active = true;
create index if not exists idx_newsletter_email on public.newsletter_subscribers (email);

-- Row Level Security
alter table public.newsletter_subscribers enable row level security;

-- Public can subscribe (insert only)
create policy "Allow public signup" on public.newsletter_subscribers
  for insert to anon
  with check (true);

-- Service role has full access (for sending newsletters)
create policy "Service role full access" on public.newsletter_subscribers
  for all to service_role
  using (true);
