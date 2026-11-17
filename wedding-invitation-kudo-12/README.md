# Undangan Template 12: Ronce Melati (Pawiwahan Jawa)

Template undangan pernikahan **adat Jawa**: pendopo joglo saat senja dengan gunung, pohon kelapa, dan semak bunga; panel nama berbentuk gunungan wayang; untaian ronce melati; batik kawung dan parang. Tampil sebagai satu kolom undangan 460px di atas kain batik. Isinya diatur dari panel admin (`../admin`).

Desain asal: [`undangan-jawa.html`](undangan-jawa.html) (purwarupa statis). Template ini memindahkannya ke Next.js dengan data dari admin, buku tamu sungguhan, dan tanpa animasi berulang.

**Palet warna** (diambil dari ilustrasi wayang Rama & Shinta):
- **Espresso** (`#22160D`, turunan sogan sampai `#7A5A3E`): garis, latar gelap, teks.
- **Antique gold** (`#CEAC59`, `#A8873A` … `#E9D6A0`): bingkai, ornamen, prada.
- **Ivory** (`#FAF6F0`, cream `#F4ECE2`): kertas undangan.
- **Blush** (`#F4B8C8`) dan **deep rose** (`#D95B82`): aksen "&", pemisah, bunga, langit senja. Teks kecil merah muda memakai `#A8385E` agar terbaca.

**Tipografi:** Cinzel (judul kapital), Cormorant Garamond (isi), Pinyon Script (nama), Poppins (label & formulir), Noto Sans Javanese (aksara Jawa), Amiri (ayat).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3012 → contoh; /<slug>?untuk=... → undangan sungguhan
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-12`
- Alamat: `https://wedding12.kudostack.my.id`

## Bagian

| Bagian | Isi |
| --- | --- |
| **Sampul** | Gunungan emas, "Sugeng Rawuh" beraksara Jawa, nama pengantin, nama tamu. Adegan pendopo sudah terlihat di bawahnya. |
| **Adegan pembuka** | Saat dibuka: kamera mundur, daun & bunga menyibak ke samping, panel gunungan bernama pengantin muncul, ronce melati turun, hujan melati sekali. |
| **Salam** | "Nyuwun Pangestu", pengantar undangan, ayat dalam kotak kutipan. Salam *Assalamu'alaikum* hanya tampil bila ayat Arab diisi. |
| **Sang Mempelai** | Foto dalam lengkung bertepi prada berhias melati, nama, gelar, orang tua, alamat, Instagram. |
| **Save The Date** | Peribahasa Jawa, foto sampul, hitung mundur, simpan ke kalender (.ics). |
| **Rangkaian Acara** | Kartu lengkung per acara: tanggal, jam (atau "s.d. selesai"), tempat, catatan, tombol peta & kalender. |
| **Prosesi Adat** | Siraman, Midodareni, Panggih, Sungkeman. Teks tetap dari template (tidak diatur di admin). |
| **Galeri** | Carousel geser dengan titik penanda; satu foto tampil sendiri di tengah. Judul dari admin ("Judul galeri"). Ketuk untuk memperbesar. |
| **Lampahing Tresna** | Kisah cinta sebagai garis waktu. |
| **Tanda Kasih** | Kartu rekening/e-wallet dan alamat kado, dengan tombol salin. |
| **Konfirmasi Kehadiran** | Formulir RSVP, rekap hadir/tidak/ragu, daftar ucapan. |
| **Matur Sembah Nuwun** | Pesan penutup, tanda tangan, ilustrasi joglo. |

Semua gerak diputar sekali dan dimatikan bila pengunjung memilih *prefers-reduced-motion*.
