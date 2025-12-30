# Runtime Web

Runtime web menyediakan fungsi DOM yang ringan:

- `elemen(tag, props, ...children)` membuat elemen DOM.
- `mount(component, target)` menempelkan komponen ke halaman.
- `state(initial)` menyimpan state sederhana.
- `on(target, event, handler)` mengikat event.

Contoh:

```js
import { elemen } from "/@nusajs/runtime/web/elemen.js";

const node = elemen("h1", null, "Halo NusaJS");
```
