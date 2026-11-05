<script setup lang="ts">
const route = useRoute();
const home = computed(() => route.path === "/");
</script>
<template>
  <SiteHeader />
  <main id="main" :class="{ 'home-main': home }"><NuxtPage /></main>
  <SiteFooter />
</template>
