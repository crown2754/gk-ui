# Alpine.js

Web Components work in plain HTML. Bind with Alpine as usual (host listeners are compatible with `gk-button` click guarding).

## Demo

<div x-data="{ count: 0 }">
  <p>Count: <span x-text="count"></span></p>
  <gk-button x-on:click="count = count + 1">Increment</gk-button>
</div>
