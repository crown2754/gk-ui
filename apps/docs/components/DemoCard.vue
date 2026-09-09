<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { useData } from "vitepress";

const props = withDefaults(
  defineProps<{
    title: string;
    code?: string;
    language?: string;
  }>(),
  {
    language: "html",
  },
);

const slots = useSlots();
const { lang } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));

const open = ref(false);
const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;

const hasCode = computed(() => Boolean(props.code?.trim()) || Boolean(slots.code));

const labels = computed(() =>
  isZh.value
    ? {
        show: "顯示程式碼",
        hide: "隱藏程式碼",
        copy: "複製",
        copied: "已複製",
      }
    : {
        show: "Show code",
        hide: "Hide code",
        copy: "Copy",
        copied: "Copied",
      },
);

async function copyCode() {
  const text = props.code?.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section class="gk-demo-card">
    <header class="gk-demo-card__header">
      <h3 class="gk-demo-card__title">{{ title }}</h3>
      <div v-if="$slots.description" class="gk-demo-card__desc">
        <slot name="description" />
      </div>
    </header>

    <div class="gk-demo-card__body">
      <slot />
    </div>

    <div v-if="hasCode" class="gk-demo-card__toolbar">
      <button
        type="button"
        class="gk-demo-card__btn"
        :aria-expanded="open"
        @click="open = !open"
      >
        {{ open ? labels.hide : labels.show }}
      </button>
      <button
        v-if="code"
        type="button"
        class="gk-demo-card__btn"
        @click="copyCode"
      >
        {{ copied ? labels.copied : labels.copy }}
      </button>
    </div>

    <div v-show="open" class="gk-demo-card__code">
      <div v-if="code" :class="`language-${language}`">
        <pre class="gk-demo-card__pre"><code>{{ code.trim() }}</code></pre>
      </div>
      <slot v-else name="code" />
    </div>
  </section>
</template>

<style scoped>
.gk-demo-card {
  margin: 1.25rem 0 1.75rem;
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: 8px;
  background: var(--gk-color-surface-elevated, #fff);
  overflow: hidden;
}

.gk-demo-card__header {
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
}

.gk-demo-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gk-color-text, rgb(31, 34, 37));
}

.gk-demo-card__desc {
  margin: 0.4rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
}

.gk-demo-card__desc :deep(code) {
  padding: 0.1em 0.35em;
  border-radius: 3px;
  background: var(--gk-color-code-bg, rgb(244, 244, 248));
  font-size: 0.85em;
  color: var(--gk-color-text, rgb(31, 34, 37));
}

.gk-demo-card__desc :deep(p) {
  margin: 0;
}

.gk-demo-card__body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 1.25rem;
}

.gk-demo-card__toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-top: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  background: var(--gk-demo-toolbar-bg, rgb(250, 250, 252));
}

.gk-demo-card__btn {
  appearance: none;
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: 6px;
  background: var(--gk-color-surface-elevated, #fff);
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.2;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
}

.gk-demo-card__btn:hover:not(:disabled) {
  color: var(--gk-color-text, rgb(31, 34, 37));
  border-color: var(--gk-color-text-muted, rgb(180, 184, 190));
}

.gk-demo-card__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.gk-demo-card__code {
  border-top: 1px solid var(--gk-color-divider, rgb(239, 239, 245));
  background: var(--gk-demo-code-bg, rgb(246, 246, 248));
}

.gk-demo-card__pre {
  margin: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--gk-color-text, rgb(31, 34, 37));
}

.gk-demo-card__pre code {
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  white-space: pre;
}
</style>
