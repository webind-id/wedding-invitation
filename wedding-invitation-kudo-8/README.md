# Undangan kudo-8: Tapak Puncak

Template undangan pernikahan bergaya **film sinematik** dengan tema anak gunung. Kisah pasangan diceritakan sebagai pendakian melintasi enam gunung di Jawa Tengah dan Jawa Timur: **Prau, Sindoro, Sumbing, Merbabu, Lawu, dan Slamet**. Semua latar memakai foto gunung asli dengan color grade film, letterbox, dan butiran film. Isinya diatur dari panel admin (`../admin`).

**Warna:** hitam film, putih seluloid, aksen amber cahaya fajar. **Huruf:** Cormorant Garamond untuk judul dan teks (kapital renggang seperti kredit film), JetBrains Mono untuk koordinat, ketinggian, dan timecode.

## Menjalankan

```bash
cp .env.local.example .env.local   # isi Supabase, PREVIEW_SECRET, GATEWAY_SECRET (sama dengan admin)
npm install
npm run dev     # http://localhost:3008 → contoh; /<slug>?to=Nama%20Tamu&k=… → undangan sungguhan (salin tautan tamu dari admin → Tamu)
```

Daftarkan di admin lewat menu **Template**:
- Kode: `kudo-8`.
- Alamat: `https://wedding8.kudostack.my.id` (lihat docs/SETUP-DOMAIN.md).

## Adegan

| Adegan | Gunung | Isi & gerak |
| --- | --- | --- |
| **SC 01 · Opening: The Journey Begins** | Prau | Sindoro & Sumbing di atas lautan awan. Koordinat, "Every Journey Has Its Destination.", nama tamu. Letterbox membuka dari layar hitam; foto bergeser mengikuti kursor. Saat diketuk, letterbox menutup ke hitam. |
| **SC 02 · Title** | Sindoro | Pendaki memandang Sindoro saat fajar; nama pasangan muncul seperti kredit pembuka. |
| **SC 03 · Intertitle** | — | Layar hitam berisi ayat dan pengantar ("Doa sebelum melangkah"). |
| **SC 04 · The Cast** | Sumbing | "Starring": mempelai sebagai pemeran (Sindoro & Sumbing, gunung kembar). |
| **SC 05 · Our Story: The Trail** | Merbabu | Tiap bab kisah = satu pos dari Basecamp Selo ke Kenteng Songo. Latar berganti per pos; HUD altimeter mencatat ketinggian seiring scroll. |
| **SC 06 · The Destination: Wedding Day** | Lawu | Hitung mundur bergaya timecode, papan informasi basecamp berisi akad & resepsi. |
| **SC 07 · Dokumentasi** | — | Galeri sebagai pita film 35 mm yang digeser ke samping. |
| **SC 08 · Final Chapter: Titip Logistik** | Slamet | Hadiah digital (kartu yang dibalik) dan alamat kirim kado. |
| **SC 09 · Buku Registrasi** | — | RSVP dan pesan dari para tamu. |
| **SC 10 · See You at the Summit** | Bima Sakti | Penutup di bawah langit malam, lalu end credits: pasangan, keluarga, lokasi, dan kredit foto. |

**Catatan teknis:**
- Tidak ada animasi berulang atau berkedip. Semua gerak dipicu scroll, kursor, atau ketukan, dan mati sepenuhnya dengan *reduce motion*.
- Ketinggian & koordinat gunung adalah angka yang lazim dipakai pendaki (pembulatan), bukan data survei.

## Kredit foto

Foto dari Wikimedia Commons, berlisensi **CC BY-SA 4.0**. Kredit ini wajib dan sudah tampil otomatis di end credits undangan (`src/lib/scenes.ts` → `photoCredits()`).

| Berkas | Gunung | Fotografer | Sumber |
| --- | --- | --- | --- |
| `prau-wide.webp` | Prau | Van Monlak | [Beautiful Sunrise at Mt. Prau](https://commons.wikimedia.org/wiki/File:Beautiful_Sunrise_at_Mt._Prau.jpg) |
| `sindoro.webp` | Sindoro | Endah both | [Gunung Sindoro dari puncak Gunung Sumbing](https://commons.wikimedia.org/wiki/File:Gunung_Sindoro_dari_puncak_Gunung_Sumbing.jpg) |
| `sumbing.webp` | Sumbing | Muhammad Rinandar | [Mount Sumbing, Central Java](https://commons.wikimedia.org/wiki/File:Mount_Sumbing,_Central_Java.jpg) |
| `merbabu-trail.webp` | Merbabu | Daryant.id | [Jalan Sabana 2 Selo TNGM](https://commons.wikimedia.org/wiki/File:Jalan_Sabana_2_Selo_TNGM.jpg) |
| `merbabu-sabana.webp` | Merbabu | LiburanBoongan | [Sabana 1 Merbabu](https://commons.wikimedia.org/wiki/File:Sabana_1_Merbabu.jpg) |
| `merbabu-wide.webp` | Merbabu | Daryant.id | [Sabana 3](https://commons.wikimedia.org/wiki/File:Sabana_3.jpg) |
| `merbabu-sunrise.webp` | Merbabu | Ryanf123 | [View sunrise dari puncak sabana satu Gunung Merbabu](https://commons.wikimedia.org/wiki/File:View_sunrise_dari_puncak_sabana_satu_Gunung_Merbabu.jpg) |
| `lawu.webp` | Lawu | Hendrojkson | [Pendaki menikmati Sunrise di Puncak Gunung Lawu](https://commons.wikimedia.org/wiki/File:Pendaki_menikmati_Sunrise_di_Puncak_Gunung_Lawu.jpg) |
| `slamet.webp` | Slamet | Farhan Journey | [Puncak Gunung Slamet](https://commons.wikimedia.org/wiki/File:Puncak_Gunung_Slamet_-_Farhan_Journey.jpg) |
| `night.webp` | Bima Sakti | RahmadHimawan Photography | [Alaksi bimasakti di atas gunung pedesaan](https://commons.wikimedia.org/wiki/File:Alaksi_bimasakti_di_atas_gunung_pedesaan.jpg) |

`prau.webp` dan `merbabu.webp` (versi potret untuk ponsel) disediakan pemilik template. Pastikan lisensinya sebelum dipakai di produksi.
