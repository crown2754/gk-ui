# Tokens

Load once in your app:

```js
import "@gk-ui/tokens/tokens.css";
```

Override any `--gk-*` variable on `:root` or a parent:

```css
:root {
  --gk-color-brand: #084c3a;
}
```

Components read these variables inside Shadow DOM (with fallbacks).
