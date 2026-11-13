-- ============================================================
--  KudoStack Undangan — skema database bersama
--  Dipakai oleh admin/ DAN semua template (wedding-invitation-kudo, …).
--  Jalankan sekali di Supabase Dashboard → SQL Editor.
--
--  Semua tabel memakai RLS TANPA policy: kunci anon tidak bisa
--  membaca/menulis apa pun. Akses hanya lewat server dengan
--  SUPABASE_SERVICE_ROLE_KEY (tidak pernah dikirim ke browser).
--
--  Catatan: bila Anda sempat menjalankan schema.sql lama dari template
--  kudo (tabel guestbook/invitees tanpa invitation_id), hapus dulu:
--    drop view if exists public.guestbook_summary;
--    drop table if exists public.guestbook, public.invitees, public.panel_admins;
-- ============================================================

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── Template (desain) ───────────────────────────────────────
create table if not exists public.templates (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(code) between 2 and 40),
  name           text not null check (char_length(name) between 1 and 80),
  description    text not null default '' check (char_length(description) <= 300),
  base_url       text not null check (base_url ~ '^https?://[^/]+$'),
  preview_image  text not null default '' check (char_length(preview_image) <= 500),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.templates enable row level security;
drop trigger if exists templates_touch on public.templates;
create trigger templates_touch before update on public.templates
  for each row execute function public.touch_updated_at();

-- ── Undangan: satu pasangan, memakai satu template ──────────
create table if not exists public.invitations (
  id                uuid primary key default gen_random_uuid(),
  template_id       uuid not null references public.templates (id) on delete restrict,
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  title             text not null check (char_length(title) between 1 and 120),
  content           jsonb not null,
  status            text not null default 'draft' check (status in ('draft', 'published')),
  message_template  text not null default '' check (char_length(message_template) <= 2000),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists invitations_template_idx on public.invitations (template_id);
create index if not exists invitations_updated_idx on public.invitations (updated_at desc);
alter table public.invitations enable row level security;
drop trigger if exists invitations_touch on public.invitations;
create trigger invitations_touch before update on public.invitations
  for each row execute function public.touch_updated_at();

-- ── Buku tamu: RSVP + ucapan, per undangan ──────────────────
create table if not exists public.guestbook (
  id             uuid primary key default gen_random_uuid(),
  invitation_id  uuid not null references public.invitations (id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 80),
  attendance     text not null check (attendance in ('hadir', 'tidak_hadir', 'ragu')),
  party_size     smallint not null default 1 check (party_size between 1 and 5),
  message        text check (message is null or char_length(message) <= 500),
  created_at     timestamptz not null default now()
);
create index if not exists guestbook_invitation_idx on public.guestbook (invitation_id, created_at desc);
alter table public.guestbook enable row level security;

-- Rekap per undangan dihitung di database (tidak terkena batas 1000 baris API).
-- security_invoker: view tunduk pada RLS tabel, jadi tetap tertutup bagi anon.
create or replace view public.guestbook_summary
with (security_invoker = true) as
select
  invitation_id,
  count(*) filter (where attendance = 'hadir')::int                     as hadir,
  count(*) filter (where attendance = 'tidak_hadir')::int               as tidak_hadir,
  count(*) filter (where attendance = 'ragu')::int                      as ragu,
  coalesce(sum(party_size) filter (where attendance = 'hadir'), 0)::int as heads
from public.guestbook
group by invitation_id;

-- ── Daftar penerima undangan, per undangan ──────────────────
create table if not exists public.invitees (
  id             uuid primary key default gen_random_uuid(),
  invitation_id  uuid not null references public.invitations (id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 120),
  contact        text not null,
  channel        text not null check (channel in ('whatsapp', 'instagram')),
  inviter        text check (inviter is null or char_length(inviter) <= 120),
  is_sent        boolean not null default false,
  sent_at        timestamptz,
  -- Kode tautan tamu (?untuk=…), dibuat trigger di bawah. Lihat migrations/003_invitee_code.sql.
  code           text not null,
  created_at     timestamptz not null default now(),
  unique (invitation_id, channel, contact),
  constraint invitees_code_format check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(code) between 3 and 64),
  check (
    (channel = 'whatsapp' and contact ~ '^62[0-9]{8,13}$')
    or (channel = 'instagram' and contact ~ '^[a-z0-9._]{1,30}$')
  )
);
create index if not exists invitees_invitation_idx on public.invitees (invitation_id, created_at);
create unique index if not exists invitees_code_idx on public.invitees (invitation_id, code);
alter table public.invitees enable row level security;

-- "Pak Budi & Keluarga" → "pak-budi-keluarga" (maks. 40 karakter; kosong → "tamu").
create or replace function public.invitee_code_base(p_name text)
returns text language sql immutable as $$
  select coalesce(
    nullif(trim(both '-' from left(regexp_replace(lower(coalesce(p_name, '')), '[^a-z0-9]+', '-', 'g'), 40)), ''),
    'tamu'
  );
$$;

-- Akhiran acak tanpa huruf/angka yang mirip (l/1, o/0, i).
create or replace function public.invitee_code_suffix(p_len int default 4)
returns text language sql volatile as $$
  select string_agg(substr('abcdefghjkmnpqrstuvwxyz23456789', 1 + floor(random() * 31)::int, 1), '')
  from generate_series(1, greatest(p_len, 1));
$$;

-- Kode unik dalam satu undangan, mis. "pak-budi-keluarga-k7q2".
create or replace function public.invitee_new_code(p_invitation_id uuid, p_name text)
returns text language plpgsql volatile as $$
declare
  candidate text;
  attempt int := 0;
begin
  loop
    candidate := public.invitee_code_base(p_name) || '-' || public.invitee_code_suffix(4 + attempt / 5);
    exit when not exists (select 1 from public.invitees where invitation_id = p_invitation_id and code = candidate);
    attempt := attempt + 1;
  end loop;
  return candidate;
end;
$$;

create or replace function public.invitees_set_code()
returns trigger language plpgsql as $$
begin
  if new.code is null then
    new.code := public.invitee_new_code(new.invitation_id, new.name);
  end if;
  return new;
end;
$$;

drop trigger if exists invitees_set_code on public.invitees;
create trigger invitees_set_code
  before insert on public.invitees
  for each row execute function public.invitees_set_code();

-- ── Akun admin ──────────────────────────────────────────────
-- Isi lewat: npm run admin:user -- <username> <password>
create table if not exists public.admin_users (
  id             uuid primary key default gen_random_uuid(),
  username       text not null unique check (char_length(username) between 3 and 40),
  password_hash  text not null,
  created_at     timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- ── Formulir klien (tautan /isi/<token>) ────────────────────
-- Lihat migrations/004_client_forms.sql. Kiriman ditinjau admin sebelum diimpor.
create table if not exists public.client_forms (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  token         text not null unique check (token ~ '^[A-Za-z0-9_-]{32}$'),
  status        text not null default 'open' check (status in ('open', 'submitted', 'imported')),
  expires_at    timestamptz not null,
  revoked_at    timestamptz,
  draft         jsonb,
  guests        jsonb not null default '[]'::jsonb,
  submitted_at  timestamptz,
  imported_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (pg_column_size(draft) <= 400000),
  check (jsonb_typeof(guests) = 'array')
);
create index if not exists client_forms_invitation_idx on public.client_forms (invitation_id, created_at desc);
alter table public.client_forms enable row level security;

-- ── Storage: foto & musik undangan (publik untuk dibaca) ────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-media', 'invitation-media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg']
)
on conflict (id) do nothing;

-- ── Domain & gateway subdomain ──────────────────────────────
-- (Juga tersedia terpisah di supabase/migrations/001 & 002.)
-- Satu baris saja (id = 1): domain induk undangan & nama yang dicadangkan.
-- Dibaca admin (service role) dan — lewat fungsi di bawah — oleh gateway.
create table if not exists public.domain_settings (
  id           smallint primary key default 1 check (id = 1),
  enabled      boolean not null default false,
  scheme       text not null default 'https' check (scheme in ('https', 'http')),
  root_domain  text not null default '' check (char_length(root_domain) <= 253),
  reserved     text[] not null default '{}',
  updated_at   timestamptz not null default now()
);
alter table public.domain_settings enable row level security;
insert into public.domain_settings (id) values (1) on conflict (id) do nothing;

-- Gateway: subdomain → alamat app template. Nama yang dicadangkan di admin
-- dikembalikan sebagai reserved = true agar gateway meneruskannya ke origin
-- DNS-nya sendiri (mis. blog.kudostack.com). Tidak ada isi undangan di sini,
-- jadi Worker cukup memakai anon key.
drop function if exists public.resolve_invitation_host(text);
create function public.resolve_invitation_host(p_slug text)
returns table (base_url text, template_code text, reserved boolean)
language sql
stable
security definer
set search_path = public
as $$
  select null::text, null::text, true
  from public.domain_settings s
  where s.id = 1 and lower(p_slug) = any (s.reserved)
  union all
  select t.base_url, t.code, false
  from public.invitations i
  join public.templates t on t.id = i.template_id
  where i.slug = lower(p_slug)
  order by 3 desc  -- nama yang dicadangkan selalu menang
  limit 1;
$$;

revoke all on function public.resolve_invitation_host(text) from public;
grant execute on function public.resolve_invitation_host(text) to anon, service_role;
