<script setup lang="ts">
import { ref } from "vue";

const variant = ref<"primary" | "secondary" | "ghost" | "danger">("primary");
const size = ref<"sm" | "md" | "lg">("md");
const loading = ref(false);
const disabled = ref(false);
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 28rem;">
    <label>
      Variant
      <select v-model="variant">
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
        <option value="ghost">ghost</option>
        <option value="danger">danger</option>
      </select>
    </label>
    <label>
      Size
      <select v-model="size">
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
      </select>
    </label>
    <label><input v-model="loading" type="checkbox" /> loading</label>
    <label><input v-model="disabled" type="checkbox" /> disabled</label>

    <gk-button :variant="variant" :size="size" :loading="loading" :disabled="disabled">
      Button
    </gk-button>
  </div>
</template>
