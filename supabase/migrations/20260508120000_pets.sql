-- Pets (animais), multi-tenant; tutor obrigatório na mesma clínica

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  tutor_id uuid not null references public.tutors (id) on delete restrict,
  name text not null,
  species text not null,
  breed text,
  sex text,
  date_of_birth date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pets_name_not_blank check (length(trim(name)) > 0),
  constraint pets_species_not_blank check (length(trim(species)) > 0)
);

create index pets_clinic_id_idx on public.pets (clinic_id);
create index pets_tutor_id_idx on public.pets (tutor_id);
create index pets_clinic_created_idx on public.pets (clinic_id, created_at desc);

comment on table public.pets is 'Animal da clínica; tutor e clinic_id devem coincidir.';

create or replace function public.pets_tutor_matches_clinic()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.tutors t
    where t.id = new.tutor_id
      and t.clinic_id = new.clinic_id
  ) then
    raise exception 'Tutor não pertence a esta clínica';
  end if;
  return new;
end;
$$;

create trigger pets_tutor_clinic_check
  before insert or update on public.pets
  for each row execute procedure public.pets_tutor_matches_clinic();

create trigger pets_set_updated_at
  before update on public.pets
  for each row execute procedure public.set_updated_at();

-- Mesmas regras de papel que tutores (admin/receção gerem; vet só lê)
alter table public.pets enable row level security;

create policy pets_select_same_clinic
  on public.pets
  for select
  to authenticated
  using (clinic_id = public.current_profile_clinic_id());

create policy pets_insert_staff
  on public.pets
  for insert
  to authenticated
  with check (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

create policy pets_update_staff
  on public.pets
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

create policy pets_delete_staff
  on public.pets
  for delete
  to authenticated
  using (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

grant select, insert, update, delete on public.pets to authenticated;
