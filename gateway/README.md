# KudoStack Gateway

Cloudflare Worker yang memberi setiap undangan subdomain sendiri: `{slug}.kudostack.com` → app template yang dipakai undangan itu.

Panduan pemasangan lengkap ada di [`../admin/docs/SUBDOMAIN.md`](../admin/docs/SUBDOMAIN.md) (juga di menu **Panduan** panel admin).

```bash
npm install
npm test          # unit test routing, resolver & handler
npm run dev       # lokal: http://cahya-wahyu.localhost:8787 (butuh .dev.vars)
npm run deploy    # ke Cloudflare (atur secret dulu)
```

- `src/routing.ts`: aturan host & path, fungsi murni. `DEFAULT_RESERVED` dan `RESERVED_PREFIX` harus sama dengan `admin/src/lib/slug.ts`; tes `admin/tests/gateway-sync.test.ts` menjaganya.
- `src/resolve.ts`: slug → alamat template lewat RPC Supabase `resolve_invitation_host` (anon key), di-cache 60 detik.
- `src/handler.ts`: meneruskan permintaan dan IP tamu yang ditandatangani (`GATEWAY_SECRET`).
