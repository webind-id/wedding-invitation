-- Izinkan impor daftar tamu yang baru memiliki nama.
-- Kontak dan saluran dapat dilengkapi kemudian sebelum pesan dikirim.

alter table public.invitees
  alter column contact drop not null,
  alter column channel drop not null;

alter table public.invitees
  alter column contact set default '';

alter table public.invitees
  drop constraint if exists invitees_contact_check,
  drop constraint if exists invitees_check;

alter table public.invitees
  add constraint invitees_contact_check check (
    (coalesce(contact, '') = '' and channel is null)
    or (channel = 'whatsapp' and contact ~ '^62[0-9]{8,13}$')
    or (channel = 'instagram' and contact ~ '^[a-z0-9._]{1,30}$')
  );
