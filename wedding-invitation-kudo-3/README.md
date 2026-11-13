# Template Undangan — Kudo 3 "Chiaroscuro"

Undangan pernikahan bergaya **sinematik & moody**:
- **Foto jadi pusat perhatian.** Satu panggung foto tetap di belakang layar berganti perlahan setiap kali bab berganti, dengan pencahayaan dramatis, lapisan gelap hangat, dan transisi lambat.
- **Palet:** charcoal, hitam, cokelat tua, dan krem.
- **Font:** Instrument Serif + Manrope.
- **Cocok untuk:** video pernikahan (*wedding film*), resepsi malam, dan visual yang dramatis.

Isi undangan dikelola di app **[admin](../admin/)**. Template ini hanya menampilkannya.

```
https://kudo3.domain-anda.com/                     → demo (konten contoh)
https://kudo3.domain-anda.com/Cahya-Wahyu?untuk=budi-k7q2   → undangan "Cahya-Wahyu"
```

## Cara kerjanya

- **Urutan judul pembuka.** Layar dimulai hitam, foto sampul muncul perlahan dari gelap di antara pita letterbox, lalu baris-baris teks hadir satu per satu. Saat "Buka undangan" ditekan, pita menutup layar, lalu undangan memudar masuk dari hitam dan musik mulai.
- **Panggung foto.** Setiap bagian adalah sebuah *scene* yang membawa fotonya sendiri. Saat scene melintasi tengah layar, panggung berganti ke foto itu dengan *crossfade* 2,4 detik dan efek Ken Burns. Di atas foto ada lapisan gelap, rona cokelat, vinyet, cahaya hangat yang bergerak pelan, dan butiran film.
- **Gaya subtitle.** Teks diletakkan di sepertiga bawah layar seperti subtitle film, dan setiap bagian diberi nomor bab Romawi.

| Bab | Isi |
| --- | --- |
| I Pembuka | Nama besar + sapaan untuk tamu, lalu ayat & pengantar |
| II Mempelai | Satu scene penuh per mempelai; fotonya menjadi panggung |
| III Waktu | Tanggal besar bergaya outline, hitung mundur, kalender |
| IV Acara | Panel kaca cokelat + peta bernuansa sepia gelap |
| V Kisah | Satu scene per bab kisah, foto panggung berganti setiap bab |
| VI Galeri | Slideshow dissolve + Ken Burns, thumbnail, jeda, layar penuh. Autoplay hanya saat terlihat. |
| VII Hadiah | Rekening & alamat kado di panel kaca |
| VIII Ucapan | RSVP & ucapan di atas latar charcoal solid (mudah dibaca) |
| IX Penutup | Layar memudar ke hitam mengikuti guliran |

**Navigasi:**
- Garis progres gulir di atas layar.
- Indikator "Bab III · Waktu" di pojok bawah; ketuk untuk membuka menu daftar bab layar penuh.
- Tombol musik dengan batang ekualizer.

**Foto:** setiap scene mengambil dari kumpulan semua foto di konten (galeri, sampul, poster, mempelai) secara bergiliran, jadi **makin banyak foto galeri, makin bervariasi panggungnya**. Foto berpencahayaan dramatis (golden hour, lampu malam) paling cocok untuk template ini.

**Gerak minimal:** bila perangkat meminta gerak minimal, animasi dimatikan, urutan judul langsung tampil, dan slideshow tidak berjalan otomatis.

## Setup

1. Siapkan database & admin dulu (lihat [admin/README.md](../admin/README.md)).
2. `npm install`, lalu `cp .env.local.example .env.local` dan isi:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: sama dengan admin
   - `TEMPLATE_CODE=kudo-3`
   - `PREVIEW_SECRET`: sama persis dengan admin
3. Di admin, menu *Template*, daftarkan kode `kudo-3` dengan alamat app ini (lokal: `http://localhost:3003`).
4. `npm run dev`, lalu buka http://localhost:3003.

`src/shared/` adalah salinan dari `admin/src/shared/`. Jangan diedit di sini; ubah di admin lalu jalankan `npm run shared:sync`.

## Perintah

```bash
npm run dev        # http://localhost:3003
npm run build
npm test
npm run typecheck
```
