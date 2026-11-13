# Template Undangan — Kudo 4 "Luxury Editorial"

Undangan pernikahan bergaya **majalah pernikahan kelas atas**: tipografi serif, whitespace lebar, foto pasangan berukuran besar, dan komposisi asimetris. Palet ivory, champagne, hitam, dan emas redup. Font Newsreader (serif editorial dengan optical size) + Hanken Grotesk. Cocok untuk pernikahan premium, venue mewah, dan fotografi editorial.

Isi undangan dikelola di app **[admin](../admin/)**. Template ini hanya menampilkannya.

```
https://kudo4.domain-anda.com/                     → demo (konten contoh)
https://kudo4.domain-anda.com/Cahya-Wahyu?untuk=budi-k7q2   → undangan "Cahya-Wahyu"
```

## Undangan sebagai satu edisi majalah

| Halaman | Isi |
| --- | --- |
| Sampul | Masthead nama pasangan selebar halaman yang menimpa foto sampul, nomor edisi, *cover lines* ke rubrik di dalam, "Diterbitkan khusus untuk {tamu}", dan tombol "Buka edisi". |
| Daftar isi & Surat pengantar | Daftar rubrik bernomor halaman, surat pembuka dengan drop cap, ayat sebagai *pull quote*, ditutup "Dengan cinta". |
| Profil mempelai | Dua komposisi asimetris yang saling berlawanan: foto besar, nama serif raksasa, keluarga. |
| Agenda | Tanggal raksasa, hitung mundur dalam satu baris, daftar acara bergaris rambut, peta monokrom hangat. |
| Kisah utama | Artikel dua kolom (desktop) dengan drop cap, subjudul tahun, *pull quote*, dan foto berketerangan "Gbr. 04". |
| Portofolio | Foto besar dalam grid 12 kolom yang asimetris dan bergeser, dengan nomor gambar. Bisa dibuka layar penuh. |
| Registri hadiah | Rekening & alamat kado bergaya tabel majalah. |
| Surat pembaca | RSVP yang ditulis seperti surat, dengan ucapan tamu sebagai kolom surat. |
| Kolofon | Sampul belakang: foto, pesan penutup, dan kredit penerbitan edisi. |

**Header berjalan:** setelah sampul dibuka, header tipis selalu menampilkan nama rubrik dan **nomor halaman** yang sedang dibaca ("hal. 16"), plus pengatur musik.

**Gerak:** foto "terbuka" dari bawah lalu zoom halus ke ukuran asli, dan teks naik pelan. Tidak ada animasi berulang atau kedip. Semua animasi mati bila perangkat meminta gerak minimal.

**Foto:** setiap halaman mengambil dari kumpulan semua foto di konten (galeri, sampul, poster, mempelai). Foto potret beresolusi tinggi dengan latar bersih paling cocok untuk gaya editorial ini.

## Setup

1. Siapkan database & admin dulu (lihat [admin/README.md](../admin/README.md)).
2. `npm install`, lalu `cp .env.local.example .env.local` dan isi:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: sama dengan admin
   - `TEMPLATE_CODE=kudo-4`
   - `PREVIEW_SECRET`: sama persis dengan admin
3. Di admin, menu *Template*, daftarkan kode `kudo-4` dengan alamat app ini (lokal: `http://localhost:3004`).
4. `npm run dev`, lalu buka http://localhost:3004.

`src/shared/` adalah salinan dari `admin/src/shared/`. Jangan diedit di sini; ubah di admin lalu jalankan `npm run shared:sync`.

## Perintah

```bash
npm run dev        # http://localhost:3004
npm run build
npm test
npm run typecheck
```
