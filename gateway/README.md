# KudoStack Gateway

Cloudflare Worker yang memberi setiap undangan subdomain sendiri: `{slug}.kudostack.com` → app template yang dipakai undangan itu.

Panduan pemasangan lengkap ada di [`../admin/docs/SUBDOMAIN.md`](../admin/docs/SUBDOMAIN.md) (juga di menu **Panduan** panel admin).

```bash
npm install
npm test          # unit test routing, resolver & handler
npm run dev       # lokal: http://cahya-wahyu.localhost:8787 (butuh .dev.vars)
npm run deploy    # ke Cloudflare (atur secret dulu)
npm run build:server
npm start         # server Node (atur environment variable produksi dulu)
```

- `src/routing.ts`: aturan host & path, fungsi murni. `DEFAULT_RESERVED` dan `RESERVED_PREFIX` harus sama dengan `admin/src/lib/slug.ts`; tes `admin/tests/gateway-sync.test.ts` menjaganya.
- `src/resolve.ts`: slug → alamat template lewat RPC Supabase `resolve_invitation_host` (anon key), di-cache 60 detik.
- `src/handler.ts`: meneruskan permintaan dan IP tamu yang ditandatangani (`GATEWAY_SECRET`).

## Deploy ke server

Server Node mendengarkan pada `PORT` (default `8787`). Arahkan wildcard DNS dan
reverse proxy HTTPS ke port tersebut. Karena server tidak bisa melakukan
passthrough berdasarkan DNS seperti Worker, host sistem harus diberi origin
internal melalui `ORIGIN_ROUTES`, misalnya:

```env
ROOT_DOMAIN=kudostack.my.id
ORIGIN_ROUTES={"admin":"http://admin:3000","ews":"http://ews:3000","router":"http://router:3000"}
```

`admin.kudostack.my.id`, `ews.kudostack.my.id`, dan `router.kudostack.my.id`
adalah host reserved, sehingga
tidak pernah dicari sebagai undangan. Request-nya diteruskan ke origin pada
`ORIGIN_ROUTES`; jangan isi origin dengan alamat publik gateway karena akan loop.
