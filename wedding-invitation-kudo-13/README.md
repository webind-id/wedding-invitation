# Undangan Template 13: Gerbang Rembulan (Klenteng)

Template undangan pernikahan **bertema Tionghoa / klenteng**: senja merah di depan klenteng dengan gunung karst, awan xiangyun, bambu, dan pohon mei; panel nama berbentuk gerbang rembulan (月门); lampion merah; pola koin kuno dan meander (回纹); aksara 囍 dan 百年好合. Tampil sebagai satu kolom undangan 460px. Isinya diatur dari panel admin (`../admin`).

Desain asal: [`undangan-klenteng.html`](undangan-klenteng.html) (purwarupa statis). Template ini memindahkannya ke Next.js dengan data dari admin, buku tamu sungguhan, musik guzheng bawaan, dan tanpa animasi berulang.

**Palet warna:** merah imperial (`#2A0505` … `#C2302A`), emas (`#A9842F` … `#EDD9A0`), krem & gading (`#F8EBD6`, `#FDF7EE`), tinta (`#6E2A1E`, `#9A5A44`), giok (`#2F5D50`), bunga mei (`#F7C4C9`).

**Tipografi:** Cinzel (judul kapital), Cormorant Garamond (isi), Pinyon Script (nama), Poppins (label & formulir), Noto Serif SC (subset aksara Han), Amiri (ayat Arab bila diisi).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3013 → contoh; /<slug>?untuk=... → undangan sungguhan
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-13`
- Alamat: `https://wedding13.kudostack.my.id`

## Bagian

| Bagian | Isi |
| --- | --- |
| **Sampul** | Lencana 囍, 百年好合, nama pengantin, nama tamu. Klenteng sudah terlihat di bawahnya. |
| **Adegan pembuka** | Saat dibuka: kamera mundur, pohon mei & semak menyibak, gerbang rembulan bernama pengantin muncul, lampion turun, kelopak mei jatuh sekali. |
| **Salam** | "Dengan Sukacita", pengantar undangan. Kotak kutipan memakai ayat/kutipan dari admin; bila kosong, kutipan Shijing 执子之手，与子偕老. |
| **Kedua Mempelai** | Foto dalam bingkai rembulan berhias ranting mei, nama, gelar, orang tua, alamat, Instagram. |
| **Save The Date** | 缘分 (yuánfèn), foto sampul, hitung mundur, simpan ke kalender, klenteng di antara pohon mei. |
| **Rangkaian Acara** | Kartu per acara dengan lampion: tanggal, jam (atau "s.d. selesai"), tempat, catatan, peta & kalender. |
| **Tradisi Pernikahan** | Sangjit, Chio Thau, Penjemputan Pengantin, Tea Pai — teks tetap template (bukan "Prosesi adat" dari admin). |
| **Galeri** | Carousel geser; satu foto tampil sendiri di tengah. Judul dari admin. |
| **Kisah Kami** | Kisah cinta sebagai garis waktu. |
| **Angpao Digital** | Amplop merah berlencana 福 untuk rekening/e-wallet & alamat kado. |
| **Konfirmasi Kehadiran** | RSVP, rekap hadir/tidak/ragu, ucapan. |
| **Terima Kasih** | 谢谢, pesan penutup, klenteng di antara bambu & pohon mei. |

Musik bawaan: guzheng pentatonik (`public/audio/guzheng.mp3`, dirender dari komposisi di desain asal). Admin bisa menggantinya dengan lagu sendiri atau mematikannya.

Semua gerak diputar sekali dan dimatikan bila pengunjung memilih *prefers-reduced-motion*.
