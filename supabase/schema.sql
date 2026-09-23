-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- RLS is enabled with no policies: only the Express server (service role key) can read/write.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  time text,
  location text,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  topic text not null default 'General Inquiry',
  message text not null,
  is_prayer boolean not null default false,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table events enable row level security;
alter table stories enable row level security;
alter table messages enable row level security;

insert into events (title, event_date, time, location, details) values
  ('Rise Up Youth Conference', '2026-11-08', '9:00 AM', 'City Convention Hall', '3 days'),
  ('Nations Missions Outreach', '2026-12-02', null, 'International', '10 days'),
  ('New Year Prayer & Fasting', '2027-01-18', null, 'Online & In-Person', '1 week');

insert into stories (name, quote) values
  ('Maria', 'I came looking for community. I found Christ, purpose, and people who believed in me.'),
  ('Josh', 'The missions trip broke my heart for the nations. I found my purpose serving far from home.'),
  ('Aliyah', 'I struggled with who I was for years. Here I found my identity in Christ, not in what people said.');
