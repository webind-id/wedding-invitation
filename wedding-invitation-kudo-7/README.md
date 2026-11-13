# Undangan kudo-7: Keraton Sogan

Template undangan pernikahan bernuansa Jawa. Tamu berdiri di depan **rumah joglo** pada malam hari, dengan pintu **gebyok** berukir yang diapit dua **gunungan wayang**. Saat pintu dibuka, tamu masuk ke dalam pendopo. Isinya diatur dari panel admin (`../admin`).

**Warna:** gading, sogan (cokelat batik), prada (emas matte), dan malam. Bata dan nila hanya dipakai pada sunggingan gunungan. **Huruf:** Marcellus untuk judul dan label, EB Garamond untuk teks dan nama (italic).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3007 → contoh; /<slug>?untuk=<kode-tamu> → undangan sungguhan (salin tautan tamu dari admin → Tamu)
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-7`.
- Alamat: `https://wedding7.kudostack.my.id` (lihat docs/SETUP-DOMAIN.md).

## Pengalaman

| Adegan | Interaksi & gerak |
| --- | --- |
| **Pembuka (joglo)** | Fasad joglo (atap tiga susun, saka, umpak) dengan pintu gebyok tertutup dan nama tamu. Saat dimuat, dua gunungan diputar masuk sekali, seperti dalang membuka pertunjukan. Rumah condong mengikuti kursor. Saat diketuk: gunungan berputar menyingkir, kedua daun pintu mengayun ke dalam, cahaya pendopo menguat, lalu kamera maju menembus pintu. Musik mulai diputar. |
| **Hero** | Foto dalam bingkai berbentuk gunungan, ronce melati menjuntai dari atas, dan dua gunungan 3D berputar pelan mengikuti scroll. |
| **Pambuka** | Ayat di depan bayangan gunungan raksasa, seperti di kelir. |
| **Mempelai** | Potret dalam bingkai gapura bertingkat (penganten putri / kakung). Gunungan kecil di tengah berputar penuh mengikuti scroll. |
| **Lelakon** | Satu gunungan besar menempel di samping dan diputar perlahan seiring cerita dibaca. |
| **Adicara** | Latar malam bermotif truntum. Hitung mundur, lalu kartu acara beratap joglo yang berbalik menghadap pengunjung. |
| **Galeri** | Foto berbingkai prada di lapisan kedalaman berbeda. Ketuk untuk memperbesar. |
| **Tanda kasih** | Amplop sogan yang dibalik saat diketuk untuk memperlihatkan nomor dan tombol salin. |
| **RSVP** | Konfirmasi kehadiran dan buku ucapan, diapit ronce melati. |
| **Panutup** | *Tancep kayon*: dua gunungan datang dari kedua sisi dan ditancapkan mengapit foto, lalu "Matur nuwun" dan nama pasangan. |

**Catatan teknis:**
- Semua objek 3D (gunungan, pintu, rumah) dibuat dengan CSS 3D dan SVG, **bukan WebGL**, dan tidak memuat file model. Gunungan terdiri dari muka depan, lima lapisan tepi, dan muka belakang, sehingga tampak tebal saat diputar.
- Motif batik: kawung (latar terang), truntum (latar malam; motif yang dikenakan orang tua mempelai), dan parang (pita pemisah).
- Dengan *reduce motion*, semua gerak dimatikan dan pembuka hilang dengan fade sederhana.
- Tidak ada animasi berulang atau berkedip.
