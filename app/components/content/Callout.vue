<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    tone?: "info" | "success" | "warning";
    compact?: boolean;
  }>(),
  { tone: "info", compact: false },
);
</script>
<template>
  <aside class="workflow-note" :class="{ compact }" :data-tone="tone">
    <h2>{{ title }}</h2>
    <slot />
  </aside>
</template>
<style>
.workflow-note {
  margin-block: 2rem;
  padding: 1.5rem;
  border-inline-start: 4px solid var(--color-accent);
}
.workflow-note[data-tone="success"] {
  border-color: #187348 !important;
  background: #edf8f0 !important;
}
.workflow-note[data-tone="warning"] {
  border-color: #996400 !important;
  background: #fff7df !important;
}
.workflow-note.compact {
  padding: 0.75rem 1rem;
}
.workflow-note h2 {
  margin-top: 0;
  font-size: 1.4rem;
}
</style>
