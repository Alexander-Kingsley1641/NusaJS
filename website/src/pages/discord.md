# Runtime Discord

Runtime discord adalah simulasi ringan berbasis EventEmitter.
Tujuannya untuk menjaga struktur bot tetap konsisten sebelum integrasi ke API asli.

Struktur standar:

```
src/
  bot.jsi
  commands/
  events/
```

Contoh command:

```js
export const name = "ping";
export async function execute() {
  return "Pong!";
}
```
