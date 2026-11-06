-- ============================================================
--  Migrasi 002 — pengaturan domain dari admin (menu "Domain")
--  Jalankan sekali di Supabase → SQL Editor, SETELAH migrasi 001.
--  (Sudah termasuk di schema.sql baru.)
-- ============================================================

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
