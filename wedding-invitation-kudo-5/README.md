# Template Undangan — Kudo 5 "Old Money"

Undangan pernikahan bergaya **vintage aristokrat**, terinspirasi undangan klasik dan stationery antik:
- **Elemen visual:** tekstur kertas, bingkai cetak bergaris ganda, sudut filigri, lambang monogram berkarangan laurel, dan foto bernuansa film lama.
- **Palet:** antique white, burgundy, hijau botol, dan cokelat tinta.
- **Font:** IM Fell English (huruf cetak antik) + EB Garamond.
- **Cocok untuk:** ballroom klasik, *heritage venue*, dan pernikahan formal.

Isi undangan dikelola di app **[admin](../admin/)**. Template ini hanya menampilkannya.

## Rangkaian kartu

| Bagian | Isi |
| --- | --- |
| Sampul | Kartu bercetak di atas meja beralas hijau botol, ditutup **lembar vellum** tembus pandang berisi nama tamu. "Buka undangan" mengangkat vellum, lalu undangan terbuka dan musik mulai. |
| Kartu undangan resmi | Lambang monogram; "Bapak & Ibu … bersama Bapak & Ibu … dengan hormat mengundang {tamu}"; nama mempelai; **tanggal & jam ditulis dengan kata-kata** ("Sabtu, dua belas Juni, dua ribu dua puluh tujuh — pukul delapan pagi"); lalu ayat. |
| Kedua mempelai | Potret **kameo oval** bercincin ganda, berdampingan. |
| Simpan tanggalnya | **Kalender bulan** bercetak dengan tanggal acara **dilingkari tinta burgundy** (digoreskan sekali), hitung mundur dalam kata ("Dua ratus dua puluh lima hari lagi"), tombol kalender. |
| Susunan acara | Kartu program resepsi di atas hijau botol, dengan peta sebagai "pelat" bernuansa sepia. |
| Album kenangan | Bab kisah dengan foto **berpenjepit sudut** yang sedikit miring seperti ditempel tangan, lalu halaman galeri yang bisa diperbesar. |
| Hadiah | Rekening & alamat kado sebagai kartu bercetak kecil. |
| R.S.V.P. | **Kartu balasan** bergaris titik-titik: "Dengan senang hati akan hadir / Dengan menyesal berhalangan hadir", dengan tenggat balasan otomatis (14 hari sebelum acara). Buku tamu ditampilkan seperti buku besar bergaris. |
| Penutup | Di atas burgundy: foto, pesan, tanda tangan "beserta Keluarga Besar …", dan lambang. |

**Gerak:** tenang dan tanpa animasi berulang. Hanya vellum yang terangkat, teks yang muncul pelan sekali, dan lingkaran tinta yang digoreskan sekali. Semua animasi mati bila perangkat meminta gerak minimal.

**Foto:** diberi nuansa film lama (sepia lembut, butiran, vinyet) secara otomatis. Foto *candid* bercahaya hangat paling cocok.

## Setup

1. Siapkan database & admin dulu (lihat [admin/README.md](../admin/README.md)).
2. `npm install`, lalu `cp .env.local.example .env.local` dan isi:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: sama dengan admin
   - `TEMPLATE_CODE=kudo-5`
   - `PREVIEW_SECRET`: sama persis dengan admin
3. Di admin, menu *Template*, daftarkan kode `kudo-5` dengan alamat app ini (lokal: `http://localhost:3005`).
4. `npm run dev`, lalu buka http://localhost:3005.

`src/shared/` adalah salinan dari `admin/src/shared/`. Jangan diedit di sini; ubah di admin lalu jalankan `npm run shared:sync`.

## Perintah

```bash
npm run dev        # http://localhost:3005
npm run build
npm test
npm run typecheck
```
