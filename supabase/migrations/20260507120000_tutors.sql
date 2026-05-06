-- Tutores (responsáveis pelos pets), multi-tenant por clinic_id

create table public.tutors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  document_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tutors_full_name_not_blank check (length(trim(full_name)) > 0),
  constraint tutors_phone_not_blank check (length(trim(phone)) > 0)
);

create index tutors_clinic_id_idx on public.tutors (clinic_id);
create index tutors_clinic_created_idx on public.tutors (clinic_id, created_at desc);

comment on table public.tutors is 'Tutor/responsável pelo pet; isolado por clinic_id.';

create trigger tutors_set_updated_at
  before update on public.tutors
  for each row execute procedure public.set_updated_at();

-- Admin e receção podem criar/editar/apagar; veterinário só lê (PRD)
create or replace function public.user_can_manage_tutors()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'reception')
  );
$$;

revoke all on function public.user_can_manage_tutors() from public;
grant execute on function public.user_can_manage_tutors() to authenticated;

alter table public.tutors enable row level security;

create policy tutors_select_same_clinic
  on public.tutors
  for select
  to authenticated
  using (clinic_id = public.current_profile_clinic_id());

create policy tutors_insert_staff
  on public.tutors
  for insert
  to authenticated
  with check (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

create policy tutors_update_staff
  on public.tutors
  for update
  to authenticated
  using (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  )
  with check (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

create policy tutors_delete_staff
  on public.tutors
  for delete
  to authenticated
  using (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

grant select, insert, update, delete on public.tutors to authenticated;
