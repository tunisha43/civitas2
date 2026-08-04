-- 
-- MY ENGINEERING APP
-- Supabase Database Schema Script
-- Run this script in your Supabase SQL Editor to establish tables, triggers, policies, and row-level security (RLS).
-- 

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CREATE USER ROLES ENUM
create type user_role as enum (
  'Customer',
  'Professional',
  'Student',
  'Material Seller',
  'Manufacturer',
  'Equipment Owner',
  'Skilled Labour',
  'Company',
  'Administrator',
  'Super Administrator'
);

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone_number text not null,
  role user_role not null default 'Customer',
  is_verified boolean not null default false,
  onboarded boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 2. PERMISSIONS TABLE
create table public.permissions (
  id uuid default uuid_generate_v4() primary key,
  role user_role not null,
  permission_name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (role, permission_name)
);

-- Enable RLS on Permissions
alter table public.permissions enable row level security;

-- 3. USER PREFERENCES TABLE
create table public.user_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  theme text not null default 'light',
  email_notifications boolean not null default true,
  sms_notifications boolean not null default true,
  marketing_emails boolean not null default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on User Preferences
alter table public.user_preferences enable row level security;

-- 4. AUDIT LOGS TABLE
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  action text not null,
  ip_address text,
  user_agent text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Audit Logs
alter table public.audit_logs enable row level security;

-- ROW LEVEL SECURITY POLICIES --

-- Profiles Policies
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Admins can view all profiles" 
  on public.profiles for select 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('Administrator', 'Super Administrator')
    )
  );

-- User Preferences Policies
create policy "Users can view their own preferences" 
  on public.user_preferences for select 
  using (auth.uid() = user_id);

create policy "Users can update their own preferences" 
  on public.user_preferences for update 
  using (auth.uid() = user_id);

-- Permissions Policies
create policy "Anyone can read permissions" 
  on public.permissions for select 
  to authenticated 
  using (true);

-- Audit Logs Policies
create policy "Users can view their own audit logs" 
  on public.audit_logs for select 
  using (auth.uid() = user_id);

create policy "Admins can view all audit logs" 
  on public.audit_logs for select 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('Administrator', 'Super Administrator')
    )
  );

-- AUTOMATIC PROFILE CREATION TRIGGER --
-- When a user signs up using Supabase Auth, automatically insert a record into profiles & preferences
-- as well as their specific role profile extension table.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role_val user_role;
  user_name text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'full_name', 'Anonymous User');
  user_role_val := coalesce((new.raw_user_meta_data->>'role')::user_role, 'Customer'::user_role);

  -- Safely extract user metadata fields passed from signup
  insert into public.profiles (id, full_name, email, phone_number, role, is_verified, onboarded)
  values (
    new.id,
    user_name,
    new.email,
    coalesce(new.raw_user_meta_data->>'phone_number', ''),
    user_role_val,
    false,
    false
  );

  insert into public.user_preferences (user_id, theme, email_notifications, sms_notifications, marketing_emails)
  values (
    new.id,
    'light',
    true,
    true,
    false
  );

  -- Insert empty template records for role-specific extension tables
  case user_role_val
    when 'Customer' then
      insert into public.customer_profiles (id, preferred_project_types, shipping_address)
      values (new.id, array[]::text[], '');
    when 'Professional' then
      insert into public.professional_profiles (id, specialty, license_number, institution, years_of_experience, hourly_rate)
      values (new.id, 'Structural Engineer', '', 'COREN Certified', 0, 0.00);
    when 'Student' then
      insert into public.student_profiles (id, institution_name, course_of_study, matric_number, graduation_year)
      values (new.id, '', '', '', extract(year from now())::int + 4);
    when 'Material Seller' then
      insert into public.material_seller_profiles (id, store_name, rc_number, warehouse_address, category)
      values (new.id, user_name || ' Materials', '', '', 'General Supply');
    when 'Manufacturer' then
      insert into public.manufacturer_profiles (id, factory_location, rc_number, standards_certificates)
      values (new.id, '', '', array[]::text[]);
    when 'Equipment Owner' then
      insert into public.equipment_owner_profiles (id, fleet_size, insurance_policy, has_verification)
      values (new.id, 0, '', false);
    when 'Skilled Labour' then
      insert into public.skilled_labour_profiles (id, trade_type, years_of_experience, daily_rate, primary_location)
      values (new.id, 'Artisan', 0, 0.00, '');
    when 'Company' then
      insert into public.company_profiles (id, company_name, rc_number, tin, website)
      values (new.id, user_name || ' Ltd', '', '', '');
    when 'Administrator' then
      insert into public.admin_profiles (id, department, access_level)
      values (new.id, 'Ecosystem Administration', 1);
    when 'Super Administrator' then
      insert into public.super_admin_profiles (id, department, override_capabilities)
      values (new.id, 'Executive Administration', array['all_permissions']);
    else
      null;
  end case;

  return new;
end;
$$ language plpgsql security definer;

-- 5. ROLE PROFILE EXTENSION TABLES --

-- Customer Profiles
create table public.customer_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  preferred_project_types text[],
  shipping_address text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.customer_profiles enable row level security;

-- Professional Profiles
create table public.professional_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  specialty text not null,
  license_number text,
  institution text,
  years_of_experience integer default 0 not null,
  hourly_rate numeric(12,2) default 0.00 not null,
  portfolio_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.professional_profiles enable row level security;

-- Student Profiles
create table public.student_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  institution_name text,
  course_of_study text,
  matric_number text,
  graduation_year integer,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.student_profiles enable row level security;

-- Material Seller Profiles
create table public.material_seller_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  store_name text not null,
  rc_number text,
  warehouse_address text,
  category text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.material_seller_profiles enable row level security;

-- Manufacturer Profiles
create table public.manufacturer_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  factory_location text,
  rc_number text,
  standards_certificates text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.manufacturer_profiles enable row level security;

-- Equipment Owner Profiles
create table public.equipment_owner_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  fleet_size integer default 0 not null,
  insurance_policy text,
  has_verification boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.equipment_owner_profiles enable row level security;

-- Skilled Labour Profiles
create table public.skilled_labour_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  trade_type text not null,
  years_of_experience integer default 0 not null,
  daily_rate numeric(12,2) default 0.00 not null,
  primary_location text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.skilled_labour_profiles enable row level security;

-- Company Profiles
create table public.company_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  company_name text not null,
  rc_number text,
  tin text,
  website text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.company_profiles enable row level security;

-- Admin Profiles
create table public.admin_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  department text not null,
  access_level integer default 1 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.admin_profiles enable row level security;

-- Super Admin Profiles
create table public.super_admin_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  department text not null,
  override_capabilities text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.super_admin_profiles enable row level security;


-- 6. MESSAGING & CONVERSATIONS TABLES --

create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.conversations enable row level security;

create table public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);
alter table public.conversation_participants enable row level security;

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.messages enable row level security;


-- 7. NOTIFICATIONS TABLE --

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  type text not null, -- 'account_activity' | 'message' | 'project_update' | 'payment'
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.notifications enable row level security;


-- INDEXES FOR ALL RELATIONSHIPS --
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_conversation_participants_user_id on public.conversation_participants(user_id);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_is_read on public.notifications(is_read);


-- RLS POLICIES FOR ALL NEW TABLES --

-- Extension Profiles Policies
create policy "Users can view any role profile" on public.customer_profiles for select using (true);
create policy "Users can update their own customer profile" on public.customer_profiles for update using (auth.uid() = id);

create policy "Users can view any professional profile" on public.professional_profiles for select using (true);
create policy "Users can update their own professional profile" on public.professional_profiles for update using (auth.uid() = id);

create policy "Users can view any student profile" on public.student_profiles for select using (true);
create policy "Users can update their own student profile" on public.student_profiles for update using (auth.uid() = id);

create policy "Users can view any material seller profile" on public.material_seller_profiles for select using (true);
create policy "Users can update their own material seller profile" on public.material_seller_profiles for update using (auth.uid() = id);

create policy "Users can view any manufacturer profile" on public.manufacturer_profiles for select using (true);
create policy "Users can update their own manufacturer profile" on public.manufacturer_profiles for update using (auth.uid() = id);

create policy "Users can view any equipment owner profile" on public.equipment_owner_profiles for select using (true);
create policy "Users can update their own equipment owner profile" on public.equipment_owner_profiles for update using (auth.uid() = id);

create policy "Users can view any skilled labour profile" on public.skilled_labour_profiles for select using (true);
create policy "Users can update their own skilled labour profile" on public.skilled_labour_profiles for update using (auth.uid() = id);

create policy "Users can view any company profile" on public.company_profiles for select using (true);
create policy "Users can update their own company profile" on public.company_profiles for update using (auth.uid() = id);

create policy "Admins can view any admin profile" on public.admin_profiles for select using (true);
create policy "Admins can update their own admin profile" on public.admin_profiles for update using (auth.uid() = id);

create policy "Super Admins can view any super admin profile" on public.super_admin_profiles for select using (true);
create policy "Super Admins can update their own super admin profile" on public.super_admin_profiles for update using (auth.uid() = id);

-- Conversations Policies
create policy "Users can view conversations they participate in" 
  on public.conversations for select 
  using (exists (
    select 1 from public.conversation_participants 
    where conversation_id = id and user_id = auth.uid()
  ));

create policy "Users can view conversation participation records" 
  on public.conversation_participants for select 
  using (user_id = auth.uid());

create policy "Users can join conversation participation records"
  on public.conversation_participants for insert
  with check (user_id = auth.uid());

-- Messages Policies
create policy "Users can view messages in conversations they are part of" 
  on public.messages for select 
  using (exists (
    select 1 from public.conversation_participants 
    where conversation_id = messages.conversation_id and user_id = auth.uid()
  ));

create policy "Users can send messages to conversations they are part of" 
  on public.messages for insert 
  with check (
    sender_id = auth.uid() and 
    exists (
      select 1 from public.conversation_participants 
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

create policy "Users can update is_read for messages sent to them" 
  on public.messages for update 
  using (exists (
    select 1 from public.conversation_participants 
    where conversation_id = messages.conversation_id and user_id = auth.uid()
  ));

-- Notifications Policies
create policy "Users can view their own notifications" 
  on public.notifications for select 
  using (auth.uid() = user_id);

create policy "Users can update their own notifications" 
  on public.notifications for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications" 
  on public.notifications for delete 
  using (auth.uid() = user_id);


-- TRIGGER FOR USERS ATTACHMENT --
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA FOR PERMISSIONS
insert into public.permissions (role, permission_name, description) values
  ('Customer', 'browse_marketplace', 'Browse materials and equipment'),
  ('Customer', 'hire_professionals', 'Post job details and hire professionals'),
  ('Professional', 'list_services', 'Create and maintain professional profiles'),
  ('Professional', 'apply_tenders', 'View and apply to engineering tenders'),
  ('Student', 'access_learning', 'Access student hub, learning, and study tools'),
  ('Student', 'access_jobs', 'Apply to student internships and graduate jobs'),
  ('Material Seller', 'sell_materials', 'List and sell materials in the marketplace'),
  ('Manufacturer', 'list_manufactured_goods', 'List bulk factory goods for developers'),
  ('Equipment Owner', 'rent_equipment', 'List heavy equipment for daily/weekly lease'),
  ('Skilled Labour', 'list_skills', 'Register for artisan and construction site labour'),
  ('Company', 'post_jobs', 'Post corporate job roles and full tenders'),
  ('Administrator', 'manage_users', 'Verify professional credentials and moderate the ecosystem')
on conflict (role, permission_name) do nothing;


-- ============================================================================
-- 20. Professional Profiles, Portfolios, Services & Company Profiles
-- ============================================================================

create table public.professional_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  bio text,
  cover_photo_url text,
  headline text,
  experience_years integer not null default 0,
  education_json jsonb default '[]'::jsonb,
  skills_json jsonb default '[]'::jsonb,
  services_json jsonb default '[]'::jsonb,
  availability text not null default 'Available Now',
  response_time text not null default 'Within 2 hours',
  rate_per_day numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.professional_profiles enable row level security;

create policy "Anyone can read professional profiles" 
  on public.professional_profiles for select 
  using (true);

create policy "Professionals can update their own profile" 
  on public.professional_profiles for update 
  using (auth.uid() = user_id);

create policy "Professionals can insert their own profile" 
  on public.professional_profiles for insert 
  with check (auth.uid() = user_id);


create table public.portfolio_projects (
  id uuid default uuid_generate_v4() primary key,
  professional_id text,
  company_id text,
  name text not null,
  description text,
  location text,
  type text,
  year integer,
  value numeric,
  photos_json jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_projects enable row level security;

create policy "Anyone can read portfolio projects" 
  on public.portfolio_projects for select 
  using (true);

create policy "Users can manage their own portfolio projects" 
  on public.portfolio_projects for all 
  using (true);


create table public.professional_services (
  id uuid default uuid_generate_v4() primary key,
  professional_id text not null,
  name text not null,
  description text,
  price_from numeric not null default 0,
  duration_estimate text,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.professional_services enable row level security;

create policy "Anyone can read professional services" 
  on public.professional_services for select 
  using (true);

create policy "Professionals can manage their services" 
  on public.professional_services for all 
  using (true);


create table public.company_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  description text,
  mission text,
  logo_url text,
  cover_url text,
  team_json jsonb default '[]'::jsonb,
  services_json jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.company_profiles enable row level security;

create policy "Anyone can read company profiles" 
  on public.company_profiles for select 
  using (true);

create policy "Companies can manage their company profiles" 
  on public.company_profiles for all 
  using (auth.uid() = user_id);

