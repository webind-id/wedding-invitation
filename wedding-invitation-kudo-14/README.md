# Undangan Template 14: Taman Asmara (Pawiwahan Jawa)

Template undangan pernikahan **adat Jawa** yang dibuka oleh sebuah taman. Pohon tumbuh dari tanah dan bunga bermekaran. Wayang **Rama & Shinta** menyambut tamu, lalu membuka seperti daun gerbang. Di baliknya tampak **joglo** di kaki **gunung**, dan **kupu-kupu** beterbangan sambil mengepakkan sayap. Tampil sebagai satu kolom undangan 460px di atas kain batik marun. Isinya diatur dari panel admin (`../admin`).

**Palet warna** (diambil dari aset ilustrasi):
- **Marun** (`#2B0A14` … `#9A4A5E`): sayap kupu-kupu, atap joglo, dedaunan. Dipakai untuk teks, latar gelap, dan tombol.
- **Antique gold** (`#CEAC59`, `#A8873A` … `#E9D6A0`): bingkai, ornamen, prada.
- **Ivory** (`#FAF6F0`): kertas undangan dan latar gunung.
- **Blush** (`#F4B8C8`) dan **deep rose** (`#D95B82`): aksen "&" dan kelopak. Teks kecil merah muda memakai `#A8385E` agar terbaca.

**Tipografi:** Cinzel (judul kapital), Cormorant Garamond (isi), Pinyon Script (nama), Poppins (label & formulir), Noto Sans Javanese (aksara Jawa), Amiri (ayat).

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3014 → contoh; /<slug>?untuk=... → undangan sungguhan
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-14`
- Alamat: `https://wedding14.kudostack.my.id`

## Adegan pembuka

| Babak | Yang terjadi |
| --- | --- |
| **Sampul** (sebelum dibuka) | Gerbang lengkung berbingkai prada di atas kertas gading berpola kawung. Isinya gunungan sebagai mahkota, aksara Jawa "Sugeng Rawuh", nama pengantin, nama tamu, dan tombol **Buka Undangan**. Di latar ada gunung samar, di pojok bawah rangkaian bunga & dedaunan, dan dua kupu-kupu terbang. |
| **Taman tumbuh** (begitu dibuka) | Pohon & semak tumbuh dari tanah dan bunga mekar, rimbun dan rapat ke tengah sehingga menutupi joglo. Rama & Shinta naik di depannya, berdampingan, lalu menyembah menyambut tamu, dengan "Sugeng Rawuh" di langit. Kupu-kupu berdatangan. |
| **Gerbang terbuka** (±4 detik kemudian) | Rama & Shinta berputar seperti daun gerbang dan bergeser ke tepi. Taman menyibak, joglo dan gunung terlihat utuh, lalu gunungan dan nama pengantin tampil. Wayang bisa diketuk untuk berputar. |

## Bagian: "Lakon ing Taman"

Setiap bagian adalah satu **babak** lakon wayang yang dipentaskan di taman pembuka. Judulnya rata kiri dengan nama babak pedalangan, kupu-kupu kecil, dan sulur emas yang tergambar saat digulir. Bentuk khasnya **daun**: tombol dan kartu memiliki dua sudut membulat dan dua sudut runcing. Foto dibingkai **gerbang lengkung** bergaris prada. Rumpun dedaunan menjuntai menyambung antarbagian, dan bagian gelap tampil sebagai **taman malam**.

| Babak | Bagian | Isi |
| --- | --- | --- |
| **Pambuka** | Salam | "Nyuwun Pangestu", pengantar undangan, dan ayat di dalam gerbang terang dengan bunga di kedua kakinya. Salam *Assalamu'alaikum* hanya tampil bila ayat Arab diisi. |
| **Jejer** | Sang Mempelai | Zig-zag: foto dalam gerbang dengan kupu-kupu hinggap di puncaknya, biodata di sisi lain, dan Shinta/Rama samar di belakangnya. |
| **Pangeling** | Save The Date | Tanggal besar bergaya majalah di samping foto, hitung mundur dalam empat jendela gerbang, simpan ke kalender (.ics). |
| **Adicara** | Rangkaian Acara | Kartu berbentuk daun: kolom tanggal, jam (atau "s.d. selesai"), tempat, catatan, petunjuk arah & kalender. |
| **Upacara** | Prosesi Adat | Jalan setapak dengan batu pijakan bernomor. Diisi dari admin. |
| **Kenangan** | Galeri | Carousel foto berbingkai gerbang; satu foto tampil sendiri. Ketuk untuk memperbesar. |
| **Lampahan** | Lampahing Tresna | Kisah cinta di sepanjang sulur emas yang tumbuh saat digulir. |
| **Tanda Katresnan** | Tanda Kasih | Rekening dan alamat kado sebagai surat berbentuk daun berperangko kupu-kupu, dengan tombol salin. |
| **Pangestu** | Konfirmasi Kehadiran | Formulir RSVP, rekap hadir/tidak/ragu, daftar ucapan. |
| **Tancep Kayon** | Matur Sembah Nuwun | Pesan penutup, nama pengantin, foto, dan gunungan yang "ditancapkan" di atas jendela berisi gunung, joglo di atas tanah, dan kupu-kupu, tanda lakon usai. |

## Gerak

Hampir semua gerak diputar sekali. Ada dua pengecualian atas permintaan pemilik produk: **tanaman bergoyang pelan** dan **kupu-kupu terbang sambil mengepakkan sayap**. Keduanya hanya berjalan saat bagiannya terlihat di layar. Bila pengunjung memilih *prefers-reduced-motion*, semua gerak dimatikan: adegan langsung tampil utuh dan kupu-kupu diam hinggap.
