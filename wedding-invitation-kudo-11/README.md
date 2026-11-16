# Undangan Template 11: Lampion Malam (3D Sky Lantern)

Template undangan pernikahan bertema **lampion 3D**: langit malam indigo berbintang dengan bulan purnama, dipenuhi lampion kertas yang terbang dan berputar pelan di ruang 3D. Semua lampion dibuat dengan CSS 3D murni (tanpa WebGL), jadi tetap ringan di ponsel. Isinya diatur dari panel admin (`../admin`).

**Palet Warna:**
- **Night** (`#0B1026`, `#05081A`, `#121A3A`): langit malam indigo.
- **Ember** (`#F5A524`): cahaya amber lampion, aksen utama.
- **Vermilion** (`#D9482B`): lampion merah.
- **Gold** (`#E7C27A`, `#F4DDAA`): garis, label, dan bingkai.
- **Moon** (`#FDF3DC`): teks utama secerah cahaya bulan.

**Tipografi:** Cormorant Garamond (judul), Pinyon Script (aksen kaligrafi), Jost (isi), Amiri (ayat).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3011 → contoh; /<slug>?untuk=... → undangan sungguhan
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-11`
- Alamat: `https://wedding11.kudostack.my.id`

## Fitur

| Bagian | Isi & interaksi |
| --- | --- |
| **Sampul** | Lampion monogram 3D besar yang condong mengikuti kursor, puluhan lampion terbang di latar. Tombol "Nyalakan Lampion": api membesar, cahaya hangat memenuhi layar, lampion terbang ke langit, lalu undangan terbuka. |
| **Hero** | Nama pasangan, tanggal & lokasi, foto dalam bingkai lampion yang digantung seutas tali, hitung mundur berbentuk lampion. |
| **Ayat & Pengantar** | Kartu kaca malam dengan lampion 3D di puncaknya. |
| **Mempelai** | Kartu profil dengan lampion tergantung, foto berbingkai lampion, nama orang tua, alamat, Instagram. |
| **Kisah Kasih** | Lini masa berupa tali panjang dengan satu lampion 3D di tiap babak. |
| **Acara** | Kolom tanggal berbentuk kertas lampion menyala, jam & zona waktu, tombol peta dan simpan ke kalender (.ics). |
| **Galeri** | Bento grid dengan pendar amber saat disentuh, lightbox dengan navigasi keyboard. |
| **Tanda Kasih** | Rekening bank/e-wallet dan alamat kado, dengan tombol salin. |
| **RSVP & Ucapan** | Formulir kehadiran dan dinding doa tamu. |
| **Penutup** | Ucapan terima kasih dan tombol **"Terbangkan Lampion Harapan"**: tiap ketukan menerbangkan satu lampion ke atas halaman. |

Semua animasi lampion & bintang dimatikan bila pengunjung memilih *prefers-reduced-motion*.
