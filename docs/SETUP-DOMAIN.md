# Setup domain: kudostack.my.id

Catatan pemasangan produksi di **`kudostack.my.id`**. Setiap undangan mendapat alamatnya sendiri, misalnya `https://arini-andra.kudostack.my.id`.

Penjelasan teknis lengkap (cara kerja, nama yang dicadangkan, troubleshooting) ada di [`admin/docs/SUBDOMAIN.md`](../admin/docs/SUBDOMAIN.md). Dokumen itu memakai contoh umum `kudostack.com`; nilai sebenarnya ada di sini.

## Peta alamat

| Alamat | Isi | Container (Docker) |
| --- | --- | --- |
| `undangan.kudostack.my.id` | Panel admin | `admin` |
| `wedding1.kudostack.my.id` | Template kudo | `kudo` |
| `wedding2.kudostack.my.id` | Template kudo-2 | `kudo-2` |
| `wedding3.kudostack.my.id` | Template kudo-3 | `kudo-3` |
| `wedding4.kudostack.my.id` | Template kudo-4 | `kudo-4` |
| `wedding5.kudostack.my.id` | Template kudo-5 | `kudo-5` |
| `wedding6.kudostack.my.id` | Template kudo-6 | `kudo-6` |
| `wedding7.kudostack.my.id` | Template kudo-7 | `kudo-7` |
| `wedding8.kudostack.my.id` | Template kudo-8 | `kudo-8` |
| `wedding9.kudostack.my.id` | Template kudo-9 | `kudo-9` |
| `<slug>.kudostack.my.id` | Undangan (lewat gateway) | — (Cloudflare Worker) |

> **`undangan` dan `wedding1`–`wedding9` wajib dicadangkan.** Gateway menganggap setiap subdomain satu tingkat sebagai slug undangan, kecuali yang dicadangkan. Tanpa pencadangan, `wedding1.kudostack.my.id` akan dibaca sebagai undangan bernama "wedding1" dan admin/template tidak bisa dibuka. Daftar ini sudah diisi di [`gateway/wrangler.toml`](../gateway/wrangler.toml) dan dijaga tes gateway; isi juga di menu **Domain** admin (langkah 7) agar nama-nama itu tidak bisa dipakai sebagai slug.

---

## Arsitektur

```
Server sendiri (Docker)                          Cloudflare (sekali pasang)
───────────────────────                          ──────────────────────────
admin   ┐                                         DNS wildcard *.kudostack.my.id → Worker "kudo-gateway"
kudo    │  cloudflared (Tunnel, koneksi keluar)   Tunnel: undangan.kudostack.my.id → admin
…       ├────────────────────────────────────►            wedding1…9.kudostack.my.id → kudo…kudo-9
kudo-9  ┘
                                                  tamu buka arini-andra.kudostack.my.id
                                                    → Worker tanya Supabase: undangan ini pakai template apa?
                                                    → ambil halaman dari wedding8.kudostack.my.id/arini-andra
```

Hal penting:

- **Setiap template cukup dijalankan satu kali.** Semua undangan yang memakai template yang sama dilayani oleh container yang sama.
- **Subdomain undangan tidak dibuat satu per satu.** Cukup satu record DNS wildcard dan satu Worker. Begitu undangan dengan slug `arini-andra` diterbitkan di admin, alamat `arini-andra.kudostack.my.id` langsung aktif.
- **Gateway tetap di Cloudflare Worker**, hosting app di server sendiri lewat Cloudflare Tunnel. Detail Docker ada di [`SETUP-KudoStack.md`](SETUP-KudoStack.md).
- Tamu tidak pernah melihat alamat `wedding…`. Yang tampil selalu `slug.kudostack.my.id`.

## Yang sudah diatur di kode

- [`gateway/wrangler.toml`](../gateway/wrangler.toml):
  - `routes = [{ pattern = "*.kudostack.my.id/*", zone_name = "kudostack.my.id" }]`
  - `ROOT_DOMAIN = "kudostack.my.id"`
  - `RESERVED_SUBDOMAINS = "undangan,wedding1,…,wedding9"`
- Tes di [`gateway/tests/routing.test.ts`](../gateway/tests/routing.test.ts) memastikan:
  - `arini-andra.kudostack.my.id` → undangan `arini-andra`
  - `undangan.`, `wedding1.`–`wedding9.` (dibaca langsung dari `wrangler.toml`), `admin.`, `tpl-…`, `a.b.kudostack.my.id`, dan domain `.my.id` lain → diteruskan apa adanya

Domain induk dan nama cadangan juga diatur dari menu **Domain** di admin (tersimpan di database).

---

## Checklist pemasangan

### 1. Cloudflare: tambahkan domain
- [ ] Dashboard Cloudflare → **Add a site** → `kudostack.my.id` → paket **Free**.
- [ ] Ganti nameserver di panel registrar domain `.my.id` ke 2 nameserver yang diberikan Cloudflare.
- [ ] Tunggu sampai status domain **Active**. Biasanya beberapa menit, tapi bisa sampai 24 jam.
- [ ] **SSL/TLS → Overview** → pilih **Full (strict)**.

### 2. Server: jalankan admin & template
Ikuti [`SETUP-KudoStack.md`](SETUP-KudoStack.md) (Docker + Cloudflare Tunnel). Hasil akhirnya:
- [ ] `docker compose ps` → semua container *healthy*.
- [ ] Public hostname tunnel sudah dibuat: `undangan` → `http://admin:3000`, `wedding1` … `wedding9` → `http://kudo:3000` … `http://kudo-9:3000`.

### 3. Supabase: jalankan migrasi
Buka Supabase → **SQL Editor**, lalu jalankan berurutan:
- [ ] `admin/supabase/migrations/001_subdomain_gateway.sql`
- [ ] `admin/supabase/migrations/002_domain_settings.sql`
- [ ] `admin/supabase/migrations/003_invitee_code.sql` (kode tautan tamu `?untuk=…`)
- [ ] `admin/supabase/migrations/004_client_forms.sql` (formulir klien `/isi/…`)

Lewati langkah ini kalau database dibuat dari `schema.sql` terbaru.

### 4. Buat GATEWAY_SECRET
```bash
openssl rand -base64 32
```
- [ ] Isi sebagai `GATEWAY_SECRET` di `.env` server (dipakai kedelapan template sekaligus), lalu `docker compose up -d`.
- [ ] Simpan nilainya untuk langkah 5. **Jangan commit nilai ini ke repo.**

Tanpa secret ini, semua tamu terlihat datang dari IP Cloudflare, sehingga batas kiriman ucapan (4× per 10 menit) berlaku untuk semua tamu sekaligus.

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
- [ ] Deploy berhasil dan Worker `kudo-gateway` muncul di dashboard Cloudflare.

### 6. Cloudflare DNS: wildcard undangan
**DNS → Records → Add record**:

| Tipe | Nama | Isi | Proxy |
| --- | --- | --- | --- |
| AAAA | `*` | `100::` | **Proxied (oranye)**, wajib agar Worker berjalan |

- [ ] Record wildcard `*` sudah dibuat.
- [ ] Record `undangan` dan `wedding1`–`wedding9` sudah ada (dibuat otomatis oleh Tunnel di langkah 2, tipe CNAME → `….cfargotunnel.com`, Proxied). Record spesifik ini mengalahkan wildcard.

### 7. Admin panel
Buka `https://undangan.kudostack.my.id` lalu login.
- [ ] Menu **Domain**:
  - Nyalakan **Subdomain per undangan**, protokol `https`, domain induk `kudostack.my.id`.
  - **Nama yang dicadangkan (tambahan)**: `undangan, wedding1, wedding2, wedding3, wedding4, wedding5, wedding6, wedding7, wedding8, wedding9`
  - Klik **Simpan pengaturan**, lalu **Uji sekarang**. Semua pemeriksaan harus hijau.
- [ ] Menu **Template**: isi "Alamat app template" setiap template:

| Kode template | Alamat app template |
| --- | --- |
| `kudo` | `https://wedding1.kudostack.my.id` |
| `kudo-2` | `https://wedding2.kudostack.my.id` |
| `kudo-3` | `https://wedding3.kudostack.my.id` |
| `kudo-4` | `https://wedding4.kudostack.my.id` |
| `kudo-5` | `https://wedding5.kudostack.my.id` |
| `kudo-6` | `https://wedding6.kudostack.my.id` |
| `kudo-7` | `https://wedding7.kudostack.my.id` |
| `kudo-8` | `https://wedding8.kudostack.my.id` |
| `kudo-9` | `https://wedding9.kudostack.my.id` |

### 8. Uji
- [ ] `https://wedding8.kudostack.my.id` → halaman demo template tampil (bukan "Undangan tidak ditemukan").
- [ ] Buat undangan dengan slug `uji-coba`, lalu terbitkan.
- [ ] `https://uji-coba.kudostack.my.id` → undangan tampil.
- [ ] Tab **Tamu**: tambahkan tamu "Pak Budi & Keluarga", lalu salin tautannya (berbentuk `https://uji-coba.kudostack.my.id/?untuk=pak-budi-keluarga-k7q2`) → nama tamu muncul persis seperti di admin.
- [ ] Ubah kodenya (mis. `?untuk=pak-andi-k7q2`) → yang tampil sapaan umum, bukan nama.
- [ ] Kirim satu ucapan → ucapan muncul di tab **RSVP & ucapan** di admin.
- [ ] `https://tidak-ada-123.kudostack.my.id` → tampil "Undangan tidak ditemukan".
- [ ] Coba buat undangan dengan slug `wedding1` atau `undangan` → admin menolak (nama dicadangkan).

---

## Masalah yang mungkin muncul

| Gejala | Kemungkinan penyebab |
| --- | --- |
| `undangan.` atau `wedding…` menampilkan "Undangan tidak ditemukan" | Nama itu belum dicadangkan. Cek `RESERVED_SUBDOMAINS` di `wrangler.toml` (lalu `npm run deploy`) dan menu **Domain**. |
| "Sedang ada gangguan" (502) | Alamat template di menu **Template** salah, atau container template tidak *healthy* (`docker compose ps`). |
| "Sedang ada gangguan" (503) | Secret `SUPABASE_URL` / `SUPABASE_ANON_KEY` di gateway belum diatur atau salah. |
| *Uji gateway*: "Domain cocok" merah | `ROOT_DOMAIN` di `wrangler.toml` berbeda dengan menu **Domain**. Samakan, lalu `npm run deploy`. |
| `undangan.kudostack.my.id` error 1033 / 502 | Connector `cloudflared` lama belum terhubung (cek `docker logs <nama-container-cloudflared>`), atau Service hostname salah ketik (`http://admin:3000`, bukan `https`). |
| Tamu sering ditolak "Terlalu banyak kiriman" | `GATEWAY_SECRET` di `.env` server kosong, kurang dari 32 karakter, atau berbeda dengan secret di Worker. |
| Nama tamu tidak muncul | Tautan tidak berasal dari tab **Tamu**, tamu sudah dihapus dari daftar, atau migrasi `003_invitee_code.sql` belum dijalankan (tab **Tamu** menampilkan peringatan). Untuk tautan format lama `?to=…&k=…`: `PREVIEW_SECRET` berbeda antara admin dan template. |

Tabel lengkap ada di [`admin/docs/SUBDOMAIN.md`](../admin/docs/SUBDOMAIN.md#mengatasi-masalah).

---

## Alternatif: hosting di Vercel

Admin dan template juga bisa di-deploy ke Vercel (satu project per folder, atur **Root Directory** ke nama foldernya) sebagai pengganti langkah 2. Bedanya:

- Tambahkan domain `undangan.kudostack.my.id` dan `wedding1…9.kudostack.my.id` di **Settings → Domains** masing-masing project, lalu buat record DNS `CNAME → cname.vercel-dns.com` dengan **DNS only (abu-abu)** agar SSL Vercel bisa terbit.
- `GATEWAY_SECRET`, `PREVIEW_SECRET`, dan variabel lain diisi di **Settings → Environment Variables** setiap project (nilainya sama dengan `docker.env.example`), lalu redeploy.
- Nama cadangan (langkah 7) tetap wajib.
