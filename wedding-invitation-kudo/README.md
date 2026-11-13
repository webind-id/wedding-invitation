# Template Undangan — Kudo

Template undangan pernikahan bergaya **botanical letterpress**: kertas linen, hijau hutan, aksen terakota, tipografi Fraunces + Plus Jakarta Sans.

Template ini hanya **menampilkan** undangan. Isi undangan, daftar tamu, pengiriman WhatsApp/Instagram, dan rekap RSVP dikelola di app **[admin](../admin/)**. Satu template ini bisa dipakai oleh banyak undangan:

```
https://kudo.domain-anda.com/                     → demo (konten contoh)
https://kudo.domain-anda.com/Cahya-Wahyu?to=Budi&k=…   → undangan "Cahya-Wahyu" untuk tamu Budi
```

## Fitur tampilan

- Sampul amplop dengan segel lilin dan nama tamu dari tautan bertanda tangan (`?to=…&k=…`)
- Poster tipografi + hitung mundur di layar lebar, dock navigasi di HP
- Ayat, profil mempelai, linimasa kisah, galeri masonry + lightbox
- Kartu acara bergaya tiket, peta, Google Calendar dan file `.ics`
- Rekening/e-wallet dan alamat kirim kado dengan tombol salin
- Buku tamu: RSVP, jumlah tamu, ucapan, rekap kehadiran
- Musik latar, pratinjau draft (banner "belum terbit"), halaman 404

## Setup

1. Siapkan database & admin lebih dulu (lihat [admin/README.md](../admin/README.md)).
2. `npm install`, lalu `cp .env.local.example .env.local` dan isi:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: sama dengan admin
   - `TEMPLATE_CODE=kudo`: sama dengan kode template yang didaftarkan di admin
   - `PREVIEW_SECRET`: sama dengan admin
3. `npm run dev` lalu buka http://localhost:3000 (demo) atau `/<slug>` untuk undangan dari admin.

Tanpa `.env.local`, halaman demo tetap tampil. Hanya `/<slug>` yang menampilkan 404.

## Foto & musik

Unggah foto dan musik lewat editor di admin; file disimpan di Supabase Storage. File di `public/images/` hanya dipakai oleh konten contoh (demo). Gambar yang belum ada otomatis diganti placeholder bermonogram.

## Kode bersama

`src/shared/` adalah **salinan** dari `admin/src/shared/` (kontrak konten, token pratinjau, konten contoh). Jangan diedit di sini; ubah di admin lalu jalankan `npm run shared:sync` dari folder admin.

## Perintah

```bash
npm run dev
npm run build
npm test
npm run typecheck
```

## Keamanan

- Kunci service role hanya di server. Browser tidak pernah mengakses database langsung.
- Hanya undangan *published* milik `TEMPLATE_CODE` ini yang tampil. Draft hanya bisa dibuka dengan token pratinjau bertanda tangan yang berlaku 24 jam.
- Buku tamu:
  - Validasi di klien dan server, ditambah CHECK di database.
  - Honeypot anti-bot dan rate limit 4×/10 menit per IP.
  - Hanya undangan terbit yang menerima ucapan.
