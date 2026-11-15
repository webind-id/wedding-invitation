# Undangan Template 10: Rustic Bohemian

Template undangan pernikahan bertema **Rustic Bohemian**: perpaduan estetika alami pedesaan bohemian (daun palem kering, rumput pampas, dedaunan eukaliptus, tekstur kertas katun buatan tangan, dan stempel cap lilin/wax seal) dengan tipografi editorial anggun Libre Baskerville dan handwritten script (Alex Brush). Didesain khusus dan sangat cocok untuk konsep **Outdoor dan Garden Wedding**. Isinya diatur dari panel admin (`../admin`).

**Palet Warna:**
- **Terracotta** (`#C86D51`, `#98442B`): Warna tanah liat / batu bata hangat sebagai aksen utama.
- **Olive** (`#6B7A5C`, `#414E36`): Hijau sage / dedaunan botani alami garden wedding.
- **Cream & Linen** (`#FAF6F0`, `#F4EEE5`, `#E5DDD0`): Latar kertas katun bertekstur lembut dan earthy.
- **Earth Ink** (`#2B231D`): Tinta espresso hangat untuk kenyamanan membaca optimal.

**Tipografi:**
- **Serif Utama:** Libre Baskerville (elegan, formal, klasik).
- **Handwritten Script:** Alex Brush (romantis, luwes, kaligrafi tangan).
- **Body & Sans:** Plus Jakarta Sans (bersih, mudah dibaca di mobile).
- **Ayat Suci:** Amiri (khat Arab presisi).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3010 → contoh; /<slug>?untuk=... → undangan sungguhan
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-10`
- Alamat: `https://wedding10.kudostack.my.id`

## Fitur & Pengalaman Pengguna

| Adegan / Fitur | Interaktivitas, Nuansa & Desain Rustic Bohemian |
| --- | --- |
| **Rustic Cover (3D Gatefold)** | Kartu lipat 3D lengkung bohemian (*boho arch gatefold*) dengan sensor kemiringan kursor (*3D dynamic tilt*), sepasang daun gerbang terakota yang berputar membuka 158° di ruang 3D, segel cap lilin monogram timbul di lapisan `translateZ`, serta paralaks botanikal 3D di latar belakang. |
| **Audio / BGM Player** | Pemutar musik melayang dengan piringan bernuansa terracotta & olive yang berputar lembut saat lagu diputar, dilengkapi kontrol jeda/putar otomatis. |
| **Floating Nav** | Menu navigasi pil melayang di bagian bawah untuk memudahkan tamu berpindah antarbagian (Awal, Mempelai, Acara, Galeri, Kado, Ucapan). |
| **Hero** | Judul megah pasangan pengantin berhuruf Libre Baskerville + Alex Brush, tanggal dan lokasi outdoor garden, foto centerpiece dalam lengkungan bohemian, serta kotak hitung mundur (*countdown timer*) bergaya kartu kertas earthy. |
| **Ayat Suci & Pengantar** | Surah Ar-Rum: 21 dalam khat Arab Amiri dan terjemahan puitis di atas kartu kertas katun bertekstur, dihiasi stempel cap lilin zaitun dan pembatas botani. |
| **Mempelai** | Profil pengantin pria dan wanita dalam bingkai lengkung bohemian bersanding dengan ornamen palem kering dan daun zaitun, lengkap dengan nama orang tua serta tautan Instagram. |
| **Kisah Kasih** | Lini masa perjalanan cinta dengan sulur tanaman vertikal, foto kenangan polaroid bertepian kasar, dan kartu cerita berhiaskan aksen botani. |
| **Rangkaian Acara** | Jadwal Akad & Resepsi bergaya kartu stasioneri taman, dilengkapi jam, zona waktu (WIB/WITA/WIT), petunjuk suasana garden wedding, tombol tautan Google Maps, dan tombol simpan kalender (.ICS). |
| **Galeri Foto** | Bento grid foto berbingkai kertas lembut dengan modal lightbox interaktif (perbesaran layar penuh, tombol geser kanan/kiri, dan navigasi keyboard). |
| **Tanda Kasih** | Amplop digital bank & e-wallet bertekstur kertas katun dengan tombol salin instan nomor rekening, serta informasi pengiriman kado fisik lengkap dengan tombol salin alamat. |
| **RSVP & Ucapan** | Formulir konfirmasi kehadiran tamu (Hadir / Berhalangan / Belum Pasti) dan dinding doa restu tamu dengan waktu relatif serta status kehadiran. |
| **Penutup** | Foto penutup dalam lengkung bohemian, untaian rasa terima kasih yang hangat, tanda tangan kaligrafi pasangan, dan cap lilin monogram. |

**Kelebihan Desain:**
- Elemen botani diwujudkan dalam SVG murni yang sangat tajam dan responsif di semua perangkat.
- Menggunakan CSS grid & flex modern yang ringan, cepat dimuat di jaringan seluler tanpa lag.
- Mendukung *prefers-reduced-motion* untuk kenyamanan aksesibilitas.
