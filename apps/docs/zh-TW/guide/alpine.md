# Alpine.js

Web Components 可直接用在一般 HTML。照常使用 Alpine 綁定（宿主上的事件監聽與 `gk-button` 的點擊防護相容）。

## 示範

<div x-data="{ count: 0 }">
  <p>計數：<span x-text="count"></span></p>
  <gk-button x-on:click="count = count + 1">加一</gk-button>
</div>
