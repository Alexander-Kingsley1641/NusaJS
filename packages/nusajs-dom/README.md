# nusajs-dom

⚠️ Pre-Alpha

Runtime DOM ringan untuk NusaJS.

## Pemakaian Singkat

```js
import { elemen, mount, state } from "nusajs-dom";

const counter = state(0);
const app = elemen("button", { onClick: () => counter.set(counter.get() + 1) }, "Klik");
mount(() => app, "#app");
```

## Lisensi

MIT
