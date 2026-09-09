# 設計權杖（Tokens）

在應用程式中載入一次即可：

```js
import "@gk-ui/tokens/tokens.css";
```

在 `:root` 或父層覆寫任何 `--gk-*` 變數：

```css
:root {
  --gk-color-brand: #084c3a;
}
```

元件會在 Shadow DOM 內讀取這些變數（並提供後備值）。
