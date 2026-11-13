# Self-hosting KudoStack dengan Docker

Panduan memasang **admin + 8 template** di server sendiri memakai Docker, dengan domain `kudostack.my.id`. Ini adalah langkah 2 dari [`SETUP-DOMAIN.md`](SETUP-DOMAIN.md); langkah Cloudflare, Supabase, gateway, dan menu Domain di admin ada di sana.

| Alamat | Container |
| --- | --- |
| `undangan.kudostack.my.id` (admin) | `admin` |
| `wedding1.kudostack.my.id` … `wedding8.kudostack.my.id` | `kudo` … `kudo-8` |
| `<slug>.kudostack.my.id` (undangan) | — dilayani Cloudflare Worker |

---

## Arsitektur

```
Tamu ──► arini-andra.kudostack.my.id ──► Cloudflare Worker "kudo-gateway" (tetap di Cloudflare)
                                          │ tanya Supabase: undangan ini pakai template apa?
                                          ▼
                              https://wedding8.kudostack.my.id/arini-andra
                                          │
Admin ──► undangan.kudostack.my.id ───────┤  Cloudflare Tunnel (koneksi keluar dari server)
                                          ▼
                    ┌──────────────── Server kamu (Docker) ────────────────┐
                    │ cloudflared ──► admin:3000, kudo:3000 … kudo-8:3000  │
                    │ (tidak ada port yang dibuka ke internet)             │
                    └──────────────────────────────────────────────────────┘
```

**Gateway tetap di Cloudflare Worker.** Alasannya:

- Worker menangani **wildcard** `*.kudostack.my.id` dan SSL-nya di edge, gratis. Di server sendiri, ini butuh reverse proxy + sertifikat wildcard (DNS challenge) + kode routing ke Supabase.
- Gateway hanya butuh alamat template yang bisa dijangkau dari internet. Alamat itu tidak harus di Vercel; `wedding1…8.kudostack.my.id` lewat Tunnel juga bisa.
- `undangan` dan `wedding1`–`wedding8` sudah dicadangkan di `gateway/wrangler.toml` (`RESERVED_SUBDOMAINS`), sehingga gateway meneruskannya apa adanya dan tidak menganggapnya slug undangan. Isi daftar yang sama di menu **Domain** admin.

**Cloudflare Tunnel** (`cloudflared`) membuat koneksi keluar dari server ke Cloudflare, jadi server tidak perlu IP publik, port 80/443 terbuka, atau Nginx/Certbot. Container app tidak membuka port ke luar; hanya `cloudflared` yang bisa menjangkaunya.

## Kebutuhan server

- Linux 64-bit (x86_64), Docker Engine 24+ dengan plugin Compose v2.
- RAM minimal **2 GB** (9 app Node.js ±120–200 MB per app saat jalan; tiap container dibatasi 512 MB). Saat **build**, siapkan 4 GB atau tambahkan swap, atau build image di mesin lain (lihat bagian *Build di mesin lain*).
- Disk ±5 GB untuk image.
- Akses internet keluar (build mengunduh paket npm & Google Fonts).

## File yang dipakai

| File | Isi |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | Satu Dockerfile multi-stage untuk semua app (`--build-arg APP=<folder>`), hasil `next build` mode `standalone`, berjalan sebagai user non-root. |
| [`docker-compose.yml`](../docker-compose.yml) | 9 app + `cloudflared`. `TEMPLATE_CODE` sudah diisi per layanan. |
| [`docker.env.example`](../docker.env.example) | Contoh `.env`, berisi semua rahasia di satu tempat. |
| [`.dockerignore`](../.dockerignore) | Memastikan `node_modules`, `.next`, dan file `.env*` lokal tidak ikut masuk image. |

Rahasia **tidak** dimasukkan ke image. Semuanya dibaca dari `.env` saat container berjalan.

---

## Checklist pemasangan

### 1. Siapkan server
```bash
# contoh Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # logout/login sekali
git clone <repo> kudostack && cd kudostack
```

### 2. Buat Cloudflare Tunnel
Dashboard Cloudflare → **Zero Trust → Networks → Tunnels → Create a tunnel** → pilih **Cloudflared** → beri nama `kudostack` → pilih lingkungan **Docker**.
- [ ] Salin **token** (string panjang setelah `--token`). Simpan untuk langkah 3.

Lalu tab **Public Hostname** → tambahkan satu per baris:

| Subdomain | Domain | Service |
| --- | --- | --- |
| `undangan` | `kudostack.my.id` | `http://admin:3000` |
| `wedding1` | `kudostack.my.id` | `http://kudo:3000` |
| `wedding2` | `kudostack.my.id` | `http://kudo-2:3000` |
| `wedding3` | `kudostack.my.id` | `http://kudo-3:3000` |
| `wedding4` | `kudostack.my.id` | `http://kudo-4:3000` |
| `wedding5` | `kudostack.my.id` | `http://kudo-5:3000` |
| `wedding6` | `kudostack.my.id` | `http://kudo-6:3000` |
| `wedding7` | `kudostack.my.id` | `http://kudo-7:3000` |
| `wedding8` | `kudostack.my.id` | `http://kudo-8:3000` |

- [ ] Cloudflare otomatis membuat record DNS `CNAME → <id>.cfargotunnel.com` (Proxied) untuk tiap hostname. Record spesifik ini mengalahkan wildcard `*`, jadi undangan tetap ke Worker.
- [ ] Jika sudah ada record lain bernama `undangan` atau `wedding…` (mis. sisa Vercel `cname.vercel-dns.com`), **hapus dulu** sebelum menambah hostname-nya.

### 3. Isi `.env`
```bash
cp docker.env.example .env
nano .env
```
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: dari Supabase → Project Settings → API.
- [ ] `SESSION_SECRET`, `PREVIEW_SECRET`, `GATEWAY_SECRET`: nilai acak min. 32 karakter (`openssl rand -base64 32`).
  - Pindah dari Vercel? Pakai **nilai lama** agar sesi admin, tautan pratinjau, dan gateway tetap jalan.
  - `GATEWAY_SECRET` **harus sama** dengan secret di Worker (`npx wrangler secret put GATEWAY_SECRET`).
- [ ] `CLOUDFLARE_TUNNEL_TOKEN`: token dari langkah 2.
- [ ] `chmod 600 .env`

### 4. Build & jalankan
```bash
docker compose up -d --build     # build pertama ±10–20 menit
docker compose ps                # semua "healthy" setelah ±1 menit
docker compose logs -f cloudflared   # harus ada "Registered tunnel connection"
```

### 5. Admin panel
- [ ] Buka `https://undangan.kudostack.my.id` → login.
- [ ] Menu **Domain**: domain induk `kudostack.my.id`, dan **Nama yang dicadangkan (tambahan)** `undangan, wedding1, wedding2, wedding3, wedding4, wedding5, wedding6, wedding7, wedding8` → Simpan.
- [ ] Menu **Template**: isi "Alamat app template": kudo → `https://wedding1.kudostack.my.id`, kudo-2 → `https://wedding2.kudostack.my.id`, … kudo-8 → `https://wedding8.kudostack.my.id`.
- [ ] Menu **Domain** → **Uji sekarang**. Semua pemeriksaan harus hijau.

### 6. Uji
- [ ] `https://wedding8.kudostack.my.id` → demo template tampil.
- [ ] Buat undangan slug `uji-coba` → terbitkan → tab **Tamu**: tambahkan "Budi" → buka tautan yang disalin (`…/?to=Budi&k=…`) → nama tamu tampil.
- [ ] Ubah nama di tautan itu atau hapus `&k=…` → tampil sapaan umum (nama hanya muncul dari tautan admin).
- [ ] Kirim satu ucapan → muncul di admin (tab **RSVP & ucapan**).
- [ ] Coba buka `http://<IP-server>:3000` dari luar → **harus gagal** (tidak ada port terbuka).

---

## Operasional

| Kebutuhan | Perintah |
| --- | --- |
| Update setelah `git pull` | `docker compose up -d --build` |
| Update satu app saja | `docker compose up -d --build kudo-8` |
| Lihat log | `docker compose logs -f --tail=100 admin` |
| Restart semua | `docker compose restart` |
| Hentikan | `docker compose down` |
| Bersihkan image lama | `docker image prune -f` |

**Menambah template baru** (mis. kudo-9): buat folder app-nya dengan `output: "standalone"` di `next.config.mjs` → tambahkan layanan `kudo-9` di `docker-compose.yml` (salin blok `kudo-8`, ganti `APP` & `TEMPLATE_CODE`) → tambah public hostname `wedding9` → `http://kudo-9:3000` di tunnel → tambahkan `wedding9` ke `RESERVED_SUBDOMAINS` di `gateway/wrangler.toml` (lalu `npm run deploy`) **dan** ke nama cadangan di menu **Domain** → isi `https://wedding9.kudostack.my.id` di menu **Template**.

**Data**: semua data (undangan, ucapan, foto unggahan) ada di **Supabase**, bukan di server. Container bisa dihapus dan dibangun ulang kapan saja tanpa kehilangan data. Yang perlu dicadangkan di server hanya `.env`.

### Build di mesin lain (server kecil)
Jika RAM server < 4 GB, build di laptop/CI lalu kirim image-nya:
```bash
# di mesin build (x86_64 — atau tambahkan --platform linux/amd64)
docker compose build
docker save $(docker compose config --images | grep -v cloudflared) | gzip > kudostack-images.tar.gz
# di server
gunzip -c kudostack-images.tar.gz | docker load
docker compose up -d --no-build
```

---

## Masalah yang mungkin muncul

| Gejala | Kemungkinan penyebab |
| --- | --- |
| `required variable … is missing` saat `docker compose up` | Ada isian kosong di `.env`. |
| Build gagal di `next/font` (`Cannot read properties of null`) | Unduhan Google Fonts gagal sesaat. Ulangi build. |
| Build berhenti tiba-tiba / `Killed` | RAM habis saat build. Tambah swap atau build di mesin lain. |
| `undangan.kudostack.my.id` → error 1033 / 502 | `cloudflared` belum terhubung (cek log) atau Service hostname salah ketik (`http://admin:3000`, bukan `https`). |
| Undangan "Sedang ada gangguan" (502) | Alamat template di menu **Template** salah, atau container template tidak *healthy* (`docker compose ps`). |
| Tamu sering ditolak "Terlalu banyak kiriman" | `GATEWAY_SECRET` di `.env` berbeda dengan secret di Worker. |
| Login admin: setelah masuk kembali ke halaman login | Dibuka lewat `http://` (cookie sesi bersifat `secure`). Selalu lewat `https://undangan.kudostack.my.id`. |
| `undangan.` / `wedding…` menampilkan "Undangan tidak ditemukan" | Nama itu belum dicadangkan di `RESERVED_SUBDOMAINS` gateway atau menu **Domain**. |
