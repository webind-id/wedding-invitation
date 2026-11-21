-- ============================================================
--  Migrasi 007 — file daftar tamu dari formulir klien
--  Jalankan sekali di Supabase → SQL Editor, SETELAH migrasi 004.
--  (Sudah termasuk di schema.sql baru.) Aman dijalankan ulang.
--
--  Klien bisa mengunggah daftar tamunya sebagai file Excel (.xlsx/.xls) atau CSV.
--  File disimpan APA ADANYA (tidak dibaca/dikoreksi) di bucket PRIVAT client-files,
--  karena berisi nama & nomor HP orang. Admin mengunduhnya lewat signed URL.
-- ============================================================

-- { path, name, size, mime, uploaded_at } file terakhir yang diunggah klien; null = belum ada.
alter table public.client_forms add column if not exists guest_file jsonb;
alter table public.client_forms drop constraint if exists client_forms_guest_file_check;
alter table public.client_forms
  add constraint client_forms_guest_file_check check (guest_file is null or jsonb_typeof(guest_file) = 'object');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-files', 'client-files', false, 5242880,
  array['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
)
on conflict (id) do nothing;
