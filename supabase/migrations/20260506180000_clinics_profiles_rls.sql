-- ViverPets — base multi-tenant (clínica + perfil) + RLS mínimo
-- Aplicar no Supabase: SQL Editor ou `supabase db push` (CLI).

-- ---------------------------------------------------------------------------
-- 1. Tabelas
-- ---------------------------------------------------------------------------

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  logo_url text,
  primary_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinics_name_not_blank check (length(trim(name)) > 0)
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  clinic_id uuid not null references public.clinics (id) on delete restrict,
  role text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_valid check (role in ('admin', 'reception', 'vet'))
);

create index profiles_clinic_id_idx on public.profiles (clinic_id);

comment on table public.clinics is 'Tenant (clínica). Dados isolados por clinic_id.';
comment on table public.profiles is 'Utilizador da clínica; id = auth.users.id.';

-- ---------------------------------------------------------------------------
-- 2. updated_at simples
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger clinics_set_updated_at
  before update on public.clinics
  for each row execute procedure public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Bootstrap: primeira clínica + perfil admin (bypass RLS via SECURITY DEFINER)
-- ---------------------------------------------------------------------------

create or replace function public.bootstrap_clinic_and_profile(
  p_clinic_name text,
  p_full_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clinic_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Profile already exists for this user';
  end if;

  if p_clinic_name is null or length(trim(p_clinic_name)) = 0 then
    raise exception 'Clinic name is required';
  end if;

  insert into public.clinics (name)
  values (trim(p_clinic_name))
  returning id into v_clinic_id;

  insert into public.profiles (id, clinic_id, role, full_name)
  values (auth.uid(), v_clinic_id, 'admin', nullif(trim(p_full_name), ''));

  return v_clinic_id;
end;
$$;

revoke all on function public.bootstrap_clinic_and_profile (text, text) from public;
grant execute on function public.bootstrap_clinic_and_profile (text, text) to authenticated;

-- Helpers para RLS sem subconsulta recursiva a public.profiles nas policies
create or replace function public.current_profile_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.user_is_admin_of_clinic(p_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and clinic_id = p_clinic_id
      and role = 'admin'
  );
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$;

revoke all on function public.current_profile_clinic_id() from public;
grant execute on function public.current_profile_clinic_id() to authenticated;

revoke all on function public.user_is_admin_of_clinic(uuid) from public;
grant execute on function public.user_is_admin_of_clinic(uuid) to authenticated;

revoke all on function public.current_profile_role() from public;
grant execute on function public.current_profile_role() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------

alter table public.clinics enable row level security;
alter table public.profiles enable row level security;

-- Clínicas: só quem já tem perfil naquela clínica
create policy clinics_select_member
  on public.clinics
  for select
  to authenticated
  using (id = public.current_profile_clinic_id());

create policy clinics_update_admin
  on public.clinics
  for update
  to authenticated
  using (public.user_is_admin_of_clinic(id))
  with check (public.user_is_admin_of_clinic(id));

-- Perfis: vê colegas da mesma clínica; edita só o próprio (MVP)
create policy profiles_select_same_clinic
  on public.profiles
  for select
  to authenticated
  using (clinic_id = public.current_profile_clinic_id());

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and clinic_id = public.current_profile_clinic_id()
    and role = public.current_profile_role()
  );

-- Sem INSERT direto em clinics/profiles pelo client; usar bootstrap_clinic_and_profile ou fluxo futuro (convites).

-- ---------------------------------------------------------------------------
-- 5. Permissões Data API (PostgREST) — authenticated
-- ---------------------------------------------------------------------------

grant select, update on public.clinics to authenticated;
grant select, update on public.profiles to authenticated;
