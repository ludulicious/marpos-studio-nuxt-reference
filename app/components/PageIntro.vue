<script setup lang="ts">
import type { PagesCollectionItem } from "@nuxt/content";
defineProps<{ page: PagesCollectionItem; label?: string }>();
</script>
<template>
  <div class="page-intro">
    <p class="breadcrumb">
      <NuxtLink to="/">Showcase</NuxtLink> / {{ label ?? page.title }}
    </p>
    <h1>{{ page.title }}</h1>
    <p class="lead">{{ page.description }}</p>
    <ContentRenderer :value="page" />
  </div>
</template>
