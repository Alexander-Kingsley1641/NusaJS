# NusaJS

⚠️ Pre-Alpha — API dan struktur dapat berubah sewaktu-waktu.

NusaJS adalah framework JavaScript berbahasa Indonesia untuk aplikasi web dan bot Discord.
Tujuannya sederhana: alur kerja yang ringan, runtime kecil, dan compiler yang mudah dipahami.

## Fitur

- JSI: format file yang tetap kompatibel dengan JavaScript ESM.
- Runtime Web minimal: `elemen`, `mount`, `state`, dan `event`.
- Runtime Discord ringan tanpa ketergantungan eksternal.
- Dev server sederhana + build/preview statis.
- Template proyek untuk web dan discord.

## Memulai

```bash
npm install
npm run dev
```

## Paket

- `packages/nusajs` (CLI + compiler)
- `packages/nusajs-dom` (runtime web)
- `packages/nusajs-discord` (runtime discord)

## CLI

```bash
# Jalankan dev server
node ./bin/nusajs.js dev

# Build proyek web
node ./bin/nusajs.js build

# Preview hasil build
node ./bin/nusajs.js preview

# Jalankan bot discord (mode simulasi)
node ./bin/nusajs.js bot
```

## Template

```bash
# Buat proyek baru
node ./bin/nusajs.js create web ./my-web
node ./bin/nusajs.js create discord ./my-bot
```

## Lisensi

MIT
