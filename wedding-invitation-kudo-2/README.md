# Template Undangan — Kudo 2 "Noir Premiere"

Undangan pernikahan bergaya **pemutaran perdana film**: hitam pekat, emas sampanye, tipografi Bodoni Moda + Jost, dan banyak paduan foto. Isi undangan dikelola di app **[admin](../admin/)**. Template ini hanya menampilkannya, dan satu template bisa dipakai banyak undangan.

```
https://kudo2.domain-anda.com/                     → demo (konten contoh)
https://kudo2.domain-anda.com/Cahya-Wahyu?to=Budi   → undangan "Cahya-Wahyu"
```

## Alur tampilan

| Bagian | Isi |
| --- | --- |
| Tiket | Tiket bioskop di bawah sorot proyektor. Tombol "Sobek tiket" memecah tiket jadi dua lalu membuka undangan (dan musik). |
| Poster | Kolase 3 foto berbingkai emas, judul Bodoni raksasa, dan *billing block* nama orang tua. |
| Prolog | Ayat & pengantar di antara pita letterbox. |
| 01 Pemeran utama | Potret mempelai, bertingkat di desktop. |
| Segera tayang | Hitung mundur di atas foto latar, plus Google Calendar dan `.ics`. |
| 02 Jadwal tayang | Satu baris per acara (jam besar, tempat, tombol arah) dan peta bertema gelap. |
| 03 Adegan | Setiap bab kisah dipasangkan dengan foto layar lebar 2.39:1, bergantian kiri–kanan. |
| 04 Cuplikan | Roll film bergulir (berhenti saat disentuh) + mosaik bento + lightbox. |
| 05 Tanda kasih | Kartu rekening hitam bergaris emas dan alamat kirim kado. |
| 06 Ulasan & RSVP | Form RSVP, rekap kehadiran, dan ucapan sebagai kutipan. |
| Kredit penutup | Kredit bergulir ala akhir film, lalu "— Tamat —". |

Tata letaknya **lebar penuh dan responsif**, bukan kolom HP di tengah layar.

**Kombinasi foto.** Template ini memadukan semua foto yang ada di konten: galeri, sampul, poster, dan foto mempelai. Foto adegan, kolase, dan latar mengambil dari kumpulan itu secara bergiliran, jadi makin banyak foto galeri, makin bervariasi tampilannya. Foto yang kosong otomatis diganti panel gelap bermonogram emas.

## Setup

1. Siapkan database & admin dulu (lihat [admin/README.md](../admin/README.md)).
2. `npm install`, lalu `cp .env.local.example .env.local` dan isi:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: sama dengan admin
   - `TEMPLATE_CODE=kudo-2`
   - `PREVIEW_SECRET`: sama persis dengan admin
3. Di admin, menu *Template*, daftarkan kode `kudo-2` dengan alamat app ini (lokal: `http://localhost:3002`).
4. `npm run dev`, lalu buka http://localhost:3002.

`src/shared/` adalah salinan dari `admin/src/shared/`. Jangan diedit di sini; ubah di admin lalu jalankan `npm run shared:sync`.

## Perintah

```bash
npm run dev        # http://localhost:3002
npm run build
npm test
npm run typecheck
```
