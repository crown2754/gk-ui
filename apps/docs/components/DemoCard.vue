<script setup lang="ts">
defineProps<{
  title: string;
}>();
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
</style>
