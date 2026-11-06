-- ============================================================
--  Migrasi 001 — dukungan subdomain per undangan (gateway Cloudflare)
--  Jalankan sekali di Supabase → SQL Editor bila database Anda dibuat
--  dari schema.sql versi sebelumnya. (Sudah termasuk di schema.sql baru.)
-- ============================================================

-- Gateway (Cloudflare Worker) perlu tahu: subdomain "cahya-wahyu" → template
-- mana? Fungsi ini HANYA mengembalikan alamat app template, tidak ada isi
-- undangan, sehingga Worker cukup memakai anon key (bukan service role).
-- Draft ikut dikembalikan agar tautan pratinjau admin bisa lewat gateway;
-- template sendiri tetap menolak draft tanpa token pratinjau yang valid.
create or replace function public.resolve_invitation_host(p_slug text)
returns table (base_url text, template_code text)
language sql
stable
security definer
set search_path = public
as $$
  select t.base_url, t.code
  from public.invitations i
  join public.templates t on t.id = i.template_id
  where i.slug = lower(p_slug)
  limit 1;
$$;

revoke all on function public.resolve_invitation_host(text) from public;
grant execute on function public.resolve_invitation_host(text) to anon, service_role;
