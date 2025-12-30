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
npm install nusajs nusajs-discord nusajs-dom
npm run dev
```

## Paket

- `packages/nusajs` (CLI + compiler)
- `packages/nusajs-dom` (runtime web)
- `packages/nusajs-discord` (runtime discord)

## CLI

```bash
# Jalankan dev server
npm run dev

# Build proyek web
npm run build

# Preview hasil build
npm run preview

# Jalankan bot discord (mode simulasi)
npm run bot
```

## Template

```bash
# Buat proyek baru
npm create web ./my-web
npm create discord ./my-bot
```

## Lisensi

MIT
