# Undangan kudo-9: Teratai Senja

Template undangan pernikahan bertema kolam teratai saat senja: membuka kartu lipat 3D bersegel lilin, wisteria yang menjuntai, teratai dan dahlia 3D, dan parallax di setiap adegan. Saudara dari kudo-6 (Immersive Romance), dengan bunga, palet warna, dan tata letak foto yang berbeda. Isinya diatur dari panel admin (`../admin`).

**Warna:** kabut lilac (mist), lavender, plum, sage, aprikot, dan ink. **Huruf:** Bodoni Moda untuk judul, Jost untuk teks, dan Pinyon Script khusus untuk nama.

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3009 → contoh; /<slug>?to=Nama%20Tamu&k=… → undangan sungguhan (salin tautan tamu dari admin → Tamu)
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-9`.
- Alamat: `https://wedding9.kudostack.my.id` (lihat docs/SETUP-DOMAIN.md).

## Pengalaman

| Adegan | Interaksi, gerak & tata letak foto |
| --- | --- |
| **Kartu lipat** | Kartu gatefold plum bergambar teratai, segel lilin di lipatan, wisteria di atas dan kolam teratai di bawah. Kartu dan taman condong mengikuti kursor. Saat segel diketuk: segel pecah, kedua daun kartu berputar membuka ke samping (sisi dalamnya lilac), kartu nama mendekat ke kamera. Musik mulai diputar. |
| **Hero** | **Triptych 3D**: foto utama di bingkai kapsul tegak dengan cincin tipis yang melayang di depannya, diapit dua foto bulat yang condong ke tengah di kedalaman berbeda. Wisteria menjuntai dan berayun mengikuti scroll, teratai mengapung di bawah. |
| **Ayat** | Tirai wisteria di atas, kolam kecil dengan riak air dan teratai di bawah. |
| **Mempelai** | **Potret bulat seperti bulan**, bersilang (foto–nama, lalu nama–foto). Dua cincin tipis dan teratai melayang di depan foto (translateZ), terasa saat condong mengikuti kursor. |
| **Kisah** | **Zig-zag**: tiap bab punya foto berbingkai kelopak di satu sisi dan teks editorial (tahun bergaris luar) di sisi lain, di kedalaman berlawanan. Dahlia kecil berputar di antara bab. |
| **Acara** | Hitung mundur dalam ubin bulat. Kartu acara dengan kolom tanggal plum berbalik menghadap pengunjung, dengan tombol peta, Google Calendar, dan unduh `.ics`. |
| **Galeri** | **Bento**: bentuk ubin mengikuti bentuk foto di admin (tinggi → kapsul, lebar → pil, persegi → besar/kecil). Ketuk untuk memperbesar; geser dengan tombol atau panah keyboard. |
| **Amplop digital** | Tiap rekening berupa amplop kecil yang dibalik saat diketuk untuk memperlihatkan nomor dan tombol salin. |
| **RSVP** | Konfirmasi kehadiran dan buku ucapan. |
| **Penutup** | Foto bulat di atas kolam. Teratai besar di depannya **mekar mengikuti scroll**, daun teratai dan dahlia berkumpul dari kedua sisi, wisteria turun dari atas. |

**Catatan teknis:**
- Objek 3D dibuat dengan CSS 3D dan SVG, **bukan WebGL**. Undangan biasanya dibuka di ponsel dari WhatsApp, jadi ini menjaga halaman tetap ringan.
- Di ponsel, parallax tetap aktif dengan amplitudo setengah.
- Dengan *reduce motion*, semua gerak dimatikan dan kartu terbuka dengan fade sederhana.
- Tidak ada animasi berulang atau berkedip.
