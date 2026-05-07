-- Consultas (agendamentos), multi-tenant; pet obrigatório na mesma clínica

create type public.consulta_status as enum (
  'agendada',
  'em_atendimento',
  'concluida',
  'cancelada'
);

create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete restrict,
  scheduled_at timestamptz not null,
  status public.consulta_status not null default 'agendada',
  professional_id uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index consultas_clinic_scheduled_idx
  on public.consultas (clinic_id, scheduled_at);

create index consultas_pet_scheduled_idx
  on public.consultas (pet_id, scheduled_at desc);

comment on table public.consultas is 'Consulta agendada; pet e clinic_id devem coincidir.';

create or replace function public.consultas_validate_refs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.pets p
    where p.id = new.pet_id
      and p.clinic_id = new.clinic_id
  ) then
    raise exception 'Pet não pertence a esta clínica';
  end if;

  if new.professional_id is not null then
    if not exists (
      select 1 from public.profiles pr
      where pr.id = new.professional_id
        and pr.clinic_id = new.clinic_id
    ) then
      raise exception 'Profissional não pertence a esta clínica';
    end if;
  end if;

  return new;
end;
$$;

create trigger consultas_validate_refs_trigger
  before insert or update on public.consultas
  for each row execute procedure public.consultas_validate_refs();

create trigger consultas_set_updated_at
  before update on public.consultas
  for each row execute procedure public.set_updated_at();

-- Mesmas regras de escrita que pets/tutores (admin/receção); todos leem na clínica
alter table public.consultas enable row level security;

create policy consultas_select_same_clinic
  on public.consultas
  for select
  to authenticated
  using (clinic_id = public.current_profile_clinic_id());

create policy consultas_insert_staff
  on public.consultas
  for insert
  to authenticated
  with check (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

create policy consultas_update_staff
  on public.consultas
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

create policy consultas_delete_staff
  on public.consultas
  for delete
  to authenticated
  using (
    clinic_id = public.current_profile_clinic_id()
    and public.user_can_manage_tutors()
  );

grant select, insert, update, delete on public.consultas to authenticated;
