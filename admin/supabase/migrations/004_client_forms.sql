-- ============================================================
--  Migrasi 004 — formulir klien
--  Jalankan sekali di Supabase → SQL Editor, SETELAH migrasi 003.
--  (Sudah termasuk di schema.sql baru.) Aman dijalankan ulang.
--
--  Admin membuat tautan rahasia per undangan: https://undangan.<domain>/isi/<token>.
--  Pasangan mengisi datanya sendiri (draf bisa disimpan berkali-kali), lalu mengirim.
--  Kiriman TIDAK langsung mengubah undangan — admin meninjau lalu menekan "Impor".
--  Hanya diakses aplikasi admin (service role); RLS aktif tanpa policy.
-- ============================================================

create table if not exists public.client_forms (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  -- 32 karakter base64url (192 bit) — rahasia di tautan; unik.
  token         text not null unique check (token ~ '^[A-Za-z0-9_-]{32}$'),
  status        text not null default 'open' check (status in ('open', 'submitted', 'imported')),
  expires_at    timestamptz not null,
  revoked_at    timestamptz,
  -- Isian konten undangan dari klien (bentuk sama dengan invitations.content).
  draft         jsonb,
  -- Daftar tamu yang diketik klien: [{ name, contact, inviter }].
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
