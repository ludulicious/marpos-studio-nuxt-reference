<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    alt: string;
    width?: string | number;
    height?: string | number;
    sizes?: string;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
  }>(),
  { width: 960, loading: "lazy", sizes: "xs:100vw sm:90vw md:720px lg:960px" },
);
</script>
<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    :fetchpriority="fetchpriority"
    format="webp"
    :quality="75"
    densities="1 2"
    decoding="async"
  />
</template>
