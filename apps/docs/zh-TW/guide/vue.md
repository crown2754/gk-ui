# Vue

告訴 Vue：`gk-*` 標籤是自訂元素：

```ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("gk-");
app.mount("#app");
```

本文件站已在 VitePress 設定中啟用 `isCustomElement`。

## 示範

<gk-button variant="primary" size="lg">Vue + gk-button</gk-button>
