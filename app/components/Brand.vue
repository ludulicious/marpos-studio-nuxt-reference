<script setup lang="ts">
defineProps<{ footer?: boolean }>();
</script>
<template>
  <NuxtLink
    class="brand"
    :class="{ 'brand-footer': footer }"
    to="/"
    aria-label="Marpos Studio home"
    ><img src="/favicon.svg" width="44" height="44" alt="" /><span
      >marpos<span class="brand-studio">studio</span></span
    ></NuxtLink
  >
</template>
