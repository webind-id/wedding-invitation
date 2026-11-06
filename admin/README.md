# Kudo Admin

Panel admin untuk mengelola **banyak template** undangan dan **banyak undangan** sekaligus. Satu template bisa dipakai oleh banyak undangan, dan satu undangan bisa berpindah template tanpa mengisi ulang data.

```
admin/                      ← app ini: template, undangan, konten, tamu, RSVP, upload media
wedding-invitation-kudo/    ← template "kudo"  → https://kudo.domain.com/<slug>?to=Nama
wedding-invitation-…/       ← template berikutnya, pola yang sama
            │
            └──► satu Supabase: templates · invitations · guestbook · invitees · admin_users
                                storage bucket: invitation-media
```

## Fitur

- **Template**: daftarkan template yang sudah di-deploy (kode, nama, domain, gambar pratinjau, aktif/nonaktif). Kartu template menampilkan jumlah undangan yang memakainya. Template yang masih dipakai tidak bisa dihapus.
- **Undangan**: buat dari template mana pun (mulai dari konten contoh), lalu cari dan filter berdasarkan template, status, judul, atau slug.
- **Editor konten**:
  - Isi data mempelai, acara (zona waktu WIB/WITA/WIT), foto & musik, teks, kisah, galeri, dan hadiah.
  - Foto dan MP3 diunggah langsung ke Supabase Storage. Isi file dicek, tidak hanya tipe MIME-nya.
  - Validasi per field, simpan dengan Ctrl+S, dan peringatan bila meninggalkan halaman saat ada perubahan yang belum tersimpan.
- **Tamu & kirim**:
  - Daftar tamu per undangan, impor/ekspor CSV, dan template pesan per undangan.
  - Kirim lewat WhatsApp atau DM Instagram, lalu tandai sudah terkirim.
- **RSVP & ucapan**: rekap kehadiran (termasuk jumlah orang), daftar ucapan, hapus ucapan (moderasi), dan ekspor CSV.
- **Pengaturan**:
  - Ganti judul, slug, atau template.
  - Terbitkan atau tarik ke draft.
  - Duplikat undangan untuk pasangan berikutnya.
  - Hapus undangan dengan konfirmasi slug.
- **Pratinjau draft**: tautan bertanda tangan (berlaku 24 jam) sehingga draft bisa dilihat sebelum terbit.

## Setup

1. **Database**: jalankan [`supabase/schema.sql`](supabase/schema.sql) di Supabase → SQL Editor. Ini juga membuat bucket `invitation-media`. Untuk database lama, jalankan file di [`supabase/migrations/`](supabase/migrations/) secara berurutan.
2. **Env**: `cp .env.local.example .env.local`, lalu isi:
   - `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`, sama untuk semua app.
   - `SESSION_SECRET`, minimal 32 karakter.
   - `PREVIEW_SECRET`, minimal 32 karakter, dan **nilainya harus sama** di semua template.
3. **Akun**: `npm install`, lalu `npm run admin:user -- admin password-panjang-anda`.
4. **Jalankan**: `npm run dev` lalu buka http://localhost:3001.
5. **Daftarkan template** di menu *Template*:
   - Contoh: kode `kudo`, alamat `https://kudo.domain-anda.com`. Untuk lokal, pakai `http://localhost:3000`.
   - Kode harus sama dengan `TEMPLATE_CODE` di `.env.local` app template tersebut.

## Subdomain per undangan (Cloudflare)

Setiap undangan bisa punya alamat sendiri, mis. `cahya-wahyu.kudostack.com`, lewat Cloudflare Worker di folder [`../gateway`](../gateway/).

- Menu **Domain**: aktifkan subdomain, isi domain induk, kelola nama yang dicadangkan, uji gateway, dan lihat alamat semua undangan.
- Kolom **Subdomain** di form undangan memeriksa ketersediaan saat mengetik.
- Panduan pemasangan Cloudflare: [`docs/SUBDOMAIN.md`](docs/SUBDOMAIN.md), juga di menu **Panduan**.

## Menambah template baru

1. Buat project Next.js baru di folder saudara, misalnya `../wedding-invitation-kudo-2/`.
2. Buat folder `src/shared/`, lalu jalankan `npm run shared:sync` dari admin. Perintah ini menyalin kontrak konten, token pratinjau, dan konten contoh.
3. Render halaman `/[slug]` dari data `invitations` (lihat `wedding-invitation-kudo/src/lib/invitation.ts`). Gunakan `TEMPLATE_CODE` dan `PREVIEW_SECRET` yang sama.
4. Deploy, lalu daftarkan di menu *Template*.

`npm run shared:sync -- --check` gagal (exit 1) bila ada salinan yang sudah berbeda, jadi bisa dipasang di CI.

## Perintah

```bash
npm run dev            # http://localhost:3001
npm run build
npm test               # vitest
npm run test:coverage
npm run typecheck
npm run admin:user -- <username> <password>
npm run shared:sync    # salin src/shared/* ke semua template
```

## Keamanan

- Semua tabel memakai RLS **tanpa policy**. Browser tidak pernah mengakses database langsung, semua lewat server dengan service role.
- Sesi berupa cookie `HttpOnly`, `SameSite=Strict`, ditandatangani HMAC, berlaku 8 jam.
  - Middleware memeriksa tanda tangannya.
  - Setiap halaman dan server action juga memeriksa bahwa akun masih ada dan **password belum diganti**. Mengganti password otomatis membatalkan sesi lama.
- Login: hash scrypt, waktu respons seragam untuk username yang tidak dikenal, dan rate limit per IP maupun per username.
- Server action Next.js sudah memeriksa Origin (CSRF). Semua input divalidasi dengan zod di server.
- Upload hanya menerima JPG/PNG/WebP ≤ 5 MB dan MP3 ≤ 10 MB, dan magic bytes-nya diverifikasi.
- Pencarian membuang sintaks filter PostgREST agar tidak bisa menyuntik filter. Ekspor CSV menetralkan formula.
