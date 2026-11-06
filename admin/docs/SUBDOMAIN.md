# Subdomain undangan dengan Cloudflare

Setiap undangan mendapat alamatnya sendiri:

```
https://cahya-wahyu.kudostack.com
https://arini-andra.kudostack.com
https://nayla-mike.kudostack.com
```

Subdomain **tidak perlu dibuat satu per satu**. Cukup satu record DNS wildcard dan satu Cloudflare Worker (*gateway*). Begitu undangan dibuat di admin dengan slug `arini-andra`, alamat `arini-andra.kudostack.com` langsung aktif.

## Yang diatur di admin

| Tempat | Fungsi |
| --- | --- |
| Menu **Domain** | Aktifkan subdomain, isi domain induk (`kudostack.com`), tambah nama yang dicadangkan, **uji gateway**, dan lihat alamat semua undangan |
| **Undangan baru** & tab **Pengaturan** undangan | Kolom **Subdomain** dengan akhiran `.kudostack.com` dan cek ketersediaan langsung saat mengetik |
| Menu **Panduan** | Halaman ini, beserta status konfigurasi |

Subdomain sebuah undangan **adalah slug-nya**. Mengubah subdomain di tab Pengaturan sama dengan mengubah slug.

## Cara kerja

```
tamu ─► arini-andra.kudostack.com
          │
          ▼
   Cloudflare Worker "kudo-gateway"   (rute *.kudostack.com/*)
          │ 1. ambil subdomain → slug "arini-andra"
          │ 2. tanya Supabase: undangan ini pakai template apa?
          │ 3. teruskan ke app template-nya
          ▼
   https://tpl-kudo5.kudostack.com/arini-andra   (app template kudo-5)
```

- Alamat undangan **tidak berubah saat templatenya diganti**. Tautan yang sudah dikirim ke tamu tetap berlaku.
- Tamu tidak pernah melihat alamat app template (`tpl-…`).
- Yang diteruskan gateway hanya halaman undangan (`/`), aset (`/_next/…`, `/images/…`, `/audio/…`), dan API buku tamu (`/api/ucapan`). Path lain mendapat 404.
- `?to=Nama` dan tautan pratinjau `?preview=…` ikut diteruskan.

## Nama yang dicadangkan

Nama-nama berikut **tidak bisa** dipakai sebagai slug, dan gateway meneruskannya apa adanya ke server aslinya:

| Nama | Keterangan |
| --- | --- |
| `www`, `admin`, `api`, `app`, `mail`, `gateway`, `static`, `cdn`, `assets`, `dev`, `staging` | Subdomain sistem bawaan |
| `tpl-…` (awalan) | Alamat app template, mis. `tpl-kudo3.kudostack.com` |
| "Nama yang dicadangkan" di menu **Domain** | Tambahan Anda sendiri, mis. `blog, promo`. Gateway membacanya dari database, jadi cukup diatur sekali di admin. |

Hanya satu tingkat subdomain yang didukung. `a.b.kudostack.com` tidak bisa dipakai, karena sertifikat SSL gratis Cloudflare hanya menanggung satu tingkat.

---

## Langkah pemasangan

### 1. Pindahkan domain ke Cloudflare
Tambahkan `kudostack.com` di dashboard Cloudflare, lalu ganti nameserver di registrar domain ke nameserver yang diberikan Cloudflare. Tunggu sampai statusnya **Active**.

### 2. Pasang app admin & template di subdomain sistem
Deploy setiap app (admin dan kelima template) ke hosting pilihan Anda, lalu buat record DNS-nya di Cloudflare → **DNS → Records**. Contoh:

| Tipe | Nama | Isi | Proxy |
| --- | --- | --- | --- |
| CNAME | `admin` | alamat hosting admin | Proxied (oranye) |
| CNAME | `tpl-kudo` | alamat hosting template kudo | Proxied |
| CNAME | `tpl-kudo2` | alamat hosting template kudo-2 | Proxied |
| CNAME | `tpl-kudo3` | … dan seterusnya untuk kudo-3, kudo-4, kudo-5 | Proxied |

Di **SSL/TLS → Overview**, pilih mode **Full (strict)**.

> Alamat template boleh juga memakai domain bawaan hosting (mis. `kudo3.vercel.app`). Yang penting, alamat itu yang diisikan sebagai "Alamat app template" di admin (langkah 7).

### 3. Jalankan migrasi database
Buka Supabase → **SQL Editor**, lalu jalankan berurutan:

1. `supabase/migrations/001_subdomain_gateway.sql`
2. `supabase/migrations/002_domain_settings.sql`

Migrasi ini membuat tabel `domain_settings` (pengaturan menu **Domain**) dan fungsi `resolve_invitation_host`. Fungsi itu hanya mengembalikan alamat app template untuk sebuah slug (tanpa isi undangan), atau tanda bahwa nama tersebut dicadangkan. Karena itu gateway cukup memakai **anon key**, bukan service role.

> Database yang dibuat dari `schema.sql` terbaru sudah berisi keduanya.

### 4. Buat rahasia gateway
Buat satu nilai acak yang akan dipakai bersama oleh gateway dan semua template:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Isikan nilai yang **sama persis** sebagai `GATEWAY_SECRET` di `.env.local` (atau env hosting) **kelima app template**, lalu deploy ulang.

> **Ini penting.** Lewat gateway, semua tamu terlihat datang dari IP Cloudflare. Tanpa `GATEWAY_SECRET`, batas kiriman ucapan (4× per 10 menit per IP) akan berlaku untuk **semua tamu sekaligus**. Dengan `GATEWAY_SECRET`, gateway meneruskan IP asli tamu, dan template hanya memercayainya bila rahasianya cocok.

### 5. Deploy gateway (Cloudflare Worker)
Dari folder `gateway/`:

```bash
npm install
npx wrangler login
npx wrangler secret put SUPABASE_URL        # https://xxxx.supabase.co
npx wrangler secret put SUPABASE_ANON_KEY   # Supabase → Project Settings → API → anon public
npx wrangler secret put GATEWAY_SECRET      # nilai dari langkah 4
npm run deploy
```

Periksa `wrangler.toml` sebelum deploy:
- `ROOT_DOMAIN = "kudostack.com"`
- `routes = [{ pattern = "*.kudostack.com/*", zone_name = "kudostack.com" }]`
- `ROOT_DOMAIN` harus **sama** dengan domain induk di menu **Domain**. Tombol *Uji gateway* akan memberi tahu bila berbeda.

### 6. Buat record DNS wildcard
Cloudflare → **DNS → Records → Add record**:

| Tipe | Nama | Isi | Proxy |
| --- | --- | --- | --- |
| AAAA | `*` | `100::` | **Proxied (oranye)** |

`100::` adalah alamat "kosong" yang memang dianjurkan Cloudflare untuk hostname yang seluruhnya dilayani Worker. Proxy **wajib** aktif agar Worker berjalan. Sertifikat SSL gratis Cloudflare (Universal SSL) otomatis menanggung `*.kudostack.com`.

Record yang lebih spesifik (mis. `admin`, `tpl-kudo3`) tetap diutamakan oleh DNS. Permintaannya memang melewati Worker, tapi Worker meneruskannya tanpa diubah.

### 7. Atur admin
1. Buka menu **Domain**.
2. Nyalakan **Subdomain per undangan**, pilih protokol `https`, dan isi domain induk `kudostack.com`.
3. Opsional: isi **Nama yang dicadangkan** untuk subdomain lain milik Anda (mis. `blog`).
4. Klik **Simpan pengaturan**, lalu **Uji sekarang**. Keempat pemeriksaan harus hijau.
5. Buka menu **Template** dan ubah "Alamat app template" setiap template ke alamat `tpl-…`-nya (mis. `https://tpl-kudo3.kudostack.com`).

Tidak perlu restart. Semua tautan di admin langsung memakai subdomain: tombol *Buka undangan*, *Pratinjau*, tautan kirim WhatsApp/Instagram, ekspor CSV, dan daftar alamat di menu Domain.

### 8. Uji
1. Buat undangan dengan slug `uji-coba`, lalu terbitkan.
2. Buka `https://uji-coba.kudostack.com`. Undangan harus tampil.
3. Buka `https://uji-coba.kudostack.com/?to=Budi`. Nama tamu harus muncul.
4. Kirim satu ucapan dari halaman undangan. Ucapan harus muncul di tab **RSVP & ucapan** di admin.
5. Buka `https://tidak-ada-123.kudostack.com`. Harus tampil "Undangan tidak ditemukan".
6. Buka `https://admin.kudostack.com`. Halaman login admin harus tetap tampil.

---

## Ringkasan variabel lingkungan

| App | Variabel | Nilai |
| --- | --- | --- |
| admin | — | Tidak ada env tambahan; semuanya di menu **Domain** |
| gateway (`wrangler.toml`) | `ROOT_DOMAIN` | `kudostack.com` (sama dengan menu Domain) |
| gateway (`wrangler.toml`) | `RESERVED_SUBDOMAINS` | opsional; nama dari menu Domain sudah terbaca otomatis |
| gateway (secret) | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | dari Supabase → API |
| gateway (secret) | `GATEWAY_SECRET` | rahasia bersama (langkah 4) |
| setiap template | `GATEWAY_SECRET` | **sama** dengan gateway |

## Hal yang perlu diketahui

- **Mengganti template atau nama yang dicadangkan** berlaku di gateway paling lama **±60 detik**, karena gateway menyimpan hasil pencarian sebentar. Undangan baru yang sebelumnya dibuka saat belum ada juga bisa butuh ±20 detik untuk muncul.
- **Mengganti slug mengubah alamat.** Tautan lama yang sudah dikirim akan menampilkan "tidak ditemukan".
- **Draft** tetap tertutup. Gateway meneruskan permintaannya, tetapi template hanya menampilkannya dengan token pratinjau yang valid.
- **Domain milik klien** (mis. `cahyadanwahyu.com`) belum didukung. Fitur ini bisa ditambahkan di atas gateway yang sama.

## Mengatasi masalah

| Gejala | Kemungkinan penyebab |
| --- | --- |
| *Uji gateway*: "Tidak bisa menghubungi…" | Record wildcard `*` belum dibuat, proxy-nya mati (abu-abu), atau domain induk salah ketik |
| *Uji gateway*: "bukan gateway Kudo" | Ada server yang menjawab, tapi Worker belum di-deploy atau rutenya bukan `*.kudostack.com/*` |
| *Uji gateway*: "Domain cocok" merah | `ROOT_DOMAIN` di `wrangler.toml` berbeda dengan menu Domain — samakan lalu `npm run deploy` |
| Kolom Subdomain: "Dicadangkan untuk sistem" | Nama itu bawaan (www, admin, …), berawalan `tpl-`, atau ada di daftar menu Domain |
| Semua subdomain "tidak ditemukan" | Undangan belum ada/slug salah · migrasi langkah 3 belum dijalankan · "Alamat app template" di admin salah |
| "Sedang ada gangguan" (503) | Secret `SUPABASE_URL`/`SUPABASE_ANON_KEY` di gateway belum diatur atau salah |
| "Sedang ada gangguan" (502) | App template tidak bisa dijangkau dari gateway — cek alamat template & deploy-nya |
| Subdomain tidak merespons sama sekali / error DNS | Record wildcard `*` belum dibuat atau proxy-nya mati (abu-abu) · rute Worker belum terpasang |
| Tamu sering ditolak "Terlalu banyak kiriman" | `GATEWAY_SECRET` di template kosong, kurang dari 32 karakter, atau berbeda dengan gateway |
| Halaman tampil tanpa gaya/gambar | Path aset baru belum diizinkan gateway — lihat `ASSET_PREFIXES` di `gateway/src/routing.ts` |
| Uji lokal sangat lambat (±20 detik) | Kebiasaan `wrangler dev` di Windows — lihat bagian Pengembangan lokal |
| `admin.kudostack.com` ikut menampilkan "tidak ditemukan" | Nama `admin` hilang dari daftar cadangan — jangan ubah `DEFAULT_RESERVED` tanpa menyamakan admin |

## Pengembangan lokal

Gateway bisa diuji di komputer sendiri tanpa DNS sungguhan, karena `*.localhost` otomatis mengarah ke komputer Anda.

1. Jalankan satu template, mis. kudo-5: `npm run dev` (port 3005), dengan `GATEWAY_SECRET` diisi.
2. Di `gateway/`, salin `.dev.vars.example` menjadi `.dev.vars`, lalu isi:
   ```
   ROOT_DOMAIN=localhost
   STATIC_ROUTES={"cahya-wahyu":"http://localhost:3005"}
   GATEWAY_SECRET=<sama dengan template>
   ```
   Hapus `STATIC_ROUTES` dan isi `SUPABASE_URL`/`SUPABASE_ANON_KEY` bila ingin memakai database sungguhan.
3. `npm run dev` (memakai lingkungan `dev` tanpa `routes`, sehingga nama host tidak ditulis ulang), lalu buka `http://cahya-wahyu.localhost:8787`.
4. Agar tautan di admin ikut mengarah ke sana, buka menu **Domain**: protokol `http`, domain induk `localhost:8787`.

> **Windows:** `wrangler dev` di Windows bisa butuh ±20 detik per permintaan. Ini terjadi di proxy lokal wrangler, bukan di gateway; Worker yang sudah di-deploy ke Cloudflare menjawab dalam milidetik. Bila mengganggu, jalankan `wrangler dev` dari WSL.

## Keamanan

- Gateway hanya memegang **anon key**, dan fungsi database yang dipanggilnya hanya mengembalikan alamat app template.
- Header `x-kudo-*` dari pengunjung selalu dibuang. Template hanya memercayai IP yang diteruskan bila `GATEWAY_SECRET` cocok, dan perbandingannya dilakukan dalam waktu konstan.
- Endpoint `/_kudo/health` (dipakai *Uji gateway*) hanya memberi tahu domain gateway, status database, dan apakah `GATEWAY_SECRET` terisi — tidak pernah nilainya.
- Path selain halaman, aset, dan API buku tamu ditolak di gateway, jadi tidak ada cara membuka undangan lain dari subdomain yang salah.
