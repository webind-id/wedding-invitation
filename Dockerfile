# syntax=docker/dockerfile:1.7
#
# Satu Dockerfile untuk admin & semua template (masing-masing app Next.js mandiri).
# Pilih app lewat build arg APP = nama foldernya:
#
#   docker build --build-arg APP=admin -t kudo-admin .
#   docker build --build-arg APP=wedding-invitation-kudo-8 -t kudo-8 .
#
# Biasanya tidak perlu dipanggil manual — lihat docker-compose.yml & docs/SETUP-KudoStack.md.
# Rahasia TIDAK dimasukkan ke image: semua env dibaca saat container berjalan.

ARG NODE_IMAGE=node:22.12-alpine3.20

# ── 1. Dependensi ───────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS deps
ARG APP
WORKDIR /app
COPY ${APP}/package.json ${APP}/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ── 2. Build ────────────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS build
ARG APP
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY ${APP}/ ./
# next.config.mjs memakai output: "standalone" → .next/standalone berisi server + dependensi minimal.
RUN npm run build && mkdir -p public

# ── 3. Runtime ──────────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
# Sehat bila server menjawab tanpa error 5xx (admin mengalihkan ke /masuk → tetap sehat).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
