<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";

const { lang } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));

const variant = ref<
  "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "ghost"
>("primary");
const size = ref<"sm" | "md" | "lg">("md");
const loading = ref(false);
const disabled = ref(false);

const labels = computed(() =>
  isZh.value
    ? {
        variant: "類型",
        size: "尺寸",
        loading: "載入中",
        disabled: "停用",
        button: "按鈕",
      }
    : {
        variant: "Variant",
        size: "Size",
        loading: "loading",
        disabled: "disabled",
        button: "Button",
      },
);
</script>

<template>
  <div class="gk-playground">
    <div class="gk-playground__controls">
      <label>
        {{ labels.variant }}
        <select v-model="variant">
          <option value="secondary">secondary</option>
          <option value="primary">primary</option>
          <option value="info">info</option>
          <option value="success">success</option>
          <option value="warning">warning</option>
          <option value="danger">danger</option>
          <option value="ghost">ghost</option>
        </select>
      </label>
      <label>
        {{ labels.size }}
        <select v-model="size">
          <option value="sm">sm</option>
          <option value="md">md</option>
          <option value="lg">lg</option>
        </select>
      </label>
      <label class="gk-playground__check"
        ><input v-model="loading" type="checkbox" /> {{ labels.loading }}</label
      >
      <label class="gk-playground__check"
        ><input v-model="disabled" type="checkbox" /> {{ labels.disabled }}</label
      >
    </div>
    <gk-button :variant="variant" :size="size" :loading="loading" :disabled="disabled">
      {{ labels.button }}
    </gk-button>
  </div>
</template>

<style scoped>
.gk-playground {
  display: grid;
  gap: 1rem;
  width: 100%;
}

.gk-playground__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: end;
}

.gk-playground__controls label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
}

.gk-playground__controls select {
  min-width: 8rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--gk-color-border, rgb(224, 224, 230));
  border-radius: 4px;
  background: var(--gk-playground-control-bg, #fff);
  color: var(--gk-playground-control-fg, rgb(31, 34, 37));
  color-scheme: var(--gk-playground-color-scheme, light);
}

.gk-playground__controls select option {
  background: var(--gk-playground-control-bg, #fff);
  color: var(--gk-playground-control-fg, rgb(31, 34, 37));
}

.gk-playground__check {
  display: flex !important;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.35rem;
  color: var(--gk-color-text-muted, rgb(118, 124, 130));
}
</style>
