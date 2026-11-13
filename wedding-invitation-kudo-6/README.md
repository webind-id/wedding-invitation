# Undangan kudo-6: Immersive Romance

Template undangan pernikahan yang terasa seperti memasuki dunia romantis digital: membuka amplop 3D, menemukan bunga sculptural, membaca kisah pasangan, lalu tiba di detail acara dan galeri. Isinya diatur dari panel admin (`../admin`).

**Warna:** ivory, pearl, champagne, soft pink, dusty rose, dan ink. **Huruf:** Cormorant Garamond untuk judul, Manrope untuk teks, dan Allura khusus untuk nama.

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3006 → contoh; /<slug>?untuk=<kode-tamu> → undangan sungguhan (salin tautan tamu dari admin → Tamu)
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-6`.
- Alamat: `https://wedding6.kudostack.my.id` (lihat docs/SETUP-DOMAIN.md).

## Pengalaman

| Adegan | Interaksi & gerak |
| --- | --- |
| **Amplop** | Amplop 3D bersegel lilin dengan nama tamu. Amplop dan bunga di sekitarnya condong mengikuti kursor. Saat segel diketuk: segel pecah, tutup amplop berputar membuka (bagian dalamnya pink), kartu terangkat keluar, lalu mendekat ke kamera. Musik mulai diputar. |
| **Hero** | Foto dalam bingkai arch dan nama dalam huruf script, di tiga lapisan kedalaman (foto lambat, nama sedang, bunga cepat dan berputar). |
| **Ayat** | Pita satin terbentang mengikuti scroll. |
| **Mempelai** | Dua potret di kedalaman berlawanan. Kartu nama melayang di depan foto dan condong mengikuti kursor. |
| **Kisah** | Satu bunga besar menempel di samping dan **mekar perlahan** seiring cerita dibaca. |
| **Acara** | Hitung mundur. Kartu acara berbalik menghadap pengunjung, dengan tombol peta, Google Calendar, dan unduh `.ics`. |
| **Galeri** | Foto-foto di lapisan kedalaman berbeda. Ketuk untuk memperbesar; geser dengan tombol atau panah keyboard. |
| **Amplop digital** | Tiap rekening berupa amplop kecil yang dibalik saat diketuk untuk memperlihatkan nomor dan tombol salin. |
| **RSVP** | Konfirmasi kehadiran dan buku ucapan. |
| **Penutup** | Bunga berkumpul dari kedua sisi mengelilingi foto, lalu nama pasangan. |

**Catatan teknis:**
- Objek 3D dibuat dengan CSS 3D dan SVG, **bukan WebGL**. Undangan biasanya dibuka di ponsel dari WhatsApp, jadi ini menjaga halaman tetap ringan.
- Di ponsel, parallax tetap aktif dengan amplitudo setengah.
- Dengan *reduce motion*, semua gerak dimatikan dan amplop terbuka dengan fade sederhana.
- Tidak ada animasi berulang atau berkedip.
