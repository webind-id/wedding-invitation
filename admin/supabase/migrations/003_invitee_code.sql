-- ============================================================
--  Migrasi 003 — kode tautan tamu yang rapi
--  Jalankan sekali di Supabase → SQL Editor, SETELAH migrasi 002.
--  (Sudah termasuk di schema.sql baru.) Aman dijalankan ulang.
--
--  Setiap tamu mendapat kode unik per undangan, mis. "pak-budi-keluarga-k7q2",
--  sehingga tautannya cukup:  https://wahyu-cahya.kudostack.my.id/?untuk=pak-budi-keluarga-k7q2
--  Template mencari nama tamu dari kode ini. Akhiran acak 4 karakter mencegah
--  tautan tamu lain ditebak dari namanya. Kode TIDAK berubah bila nama diedit,
--  jadi tautan yang sudah dikirim tetap berlaku (dan menampilkan nama terbaru).
-- ============================================================

-- "Pak Budi & Keluarga" → "pak-budi-keluarga" (maks. 40 karakter; kosong → "tamu").
create or replace function public.invitee_code_base(p_name text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(trim(both '-' from left(regexp_replace(lower(coalesce(p_name, '')), '[^a-z0-9]+', '-', 'g'), 40)), ''),
    'tamu'
  );
$$;

-- Akhiran acak tanpa huruf/angka yang mirip (l/1, o/0, i).
create or replace function public.invitee_code_suffix(p_len int default 4)
returns text
language sql
volatile
as $$
  select string_agg(substr('abcdefghjkmnpqrstuvwxyz23456789', 1 + floor(random() * 31)::int, 1), '')
  from generate_series(1, greatest(p_len, 1));
$$;

-- Kode unik dalam satu undangan (akhiran makin panjang bila sering bentrok).
create or replace function public.invitee_new_code(p_invitation_id uuid, p_name text)
returns text
language plpgsql
volatile
as $$
declare
  candidate text;
  attempt int := 0;
begin
  loop
    candidate := public.invitee_code_base(p_name) || '-' || public.invitee_code_suffix(4 + attempt / 5);
    exit when not exists (
      select 1 from public.invitees where invitation_id = p_invitation_id and code = candidate
    );
    attempt := attempt + 1;
  end loop;
  return candidate;
end;
$$;

alter table public.invitees add column if not exists code text;

-- Isi kode untuk tamu yang sudah ada (satu per satu, agar pengecekan unik melihat yang baru).
do $$
declare
  r record;
begin
  for r in select id, invitation_id, name from public.invitees where code is null loop
    update public.invitees set code = public.invitee_new_code(r.invitation_id, r.name) where id = r.id;
  end loop;
end;
$$;

-- Tamu baru: kode dibuat otomatis bila tidak diisi aplikasi.
create or replace function public.invitees_set_code()
returns trigger
language plpgsql
as $$
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

alter table public.invitees alter column code set not null;
alter table public.invitees drop constraint if exists invitees_code_format;
alter table public.invitees add constraint invitees_code_format
  check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(code) between 3 and 64);
create unique index if not exists invitees_code_idx on public.invitees (invitation_id, code);
