# Dokumentasi

## Struktur Proyek

```
src/
  index.jsi
  components/
public/
  index.html
  logo.svg
```

## Format JSI

JSI adalah JavaScript ESM biasa yang bisa diberi directive `@` untuk anotasi.
Compiler akan menghapus directive dan menjaga output tetap valid.

## CLI

- `nusajs dev` menjalankan server pengembangan.
- `nusajs build` menghasilkan build statis.
- `nusajs preview` menampilkan hasil build.
- `nusajs bot` menjalankan bot discord (simulasi).
