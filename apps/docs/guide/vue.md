# Vue

Tell Vue that `gk-*` tags are custom elements:

```ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("gk-");
app.mount("#app");
```

This docs site already sets `isCustomElement` in VitePress config.

## Demo

<gk-button variant="primary" size="lg">Vue + gk-button</gk-button>
