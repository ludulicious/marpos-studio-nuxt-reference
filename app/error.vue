<script setup lang="ts">
import type { NuxtError } from "#app";
defineProps<{ error: NuxtError }>();
</script>
<template>
  <SiteHeader />
  <main>
    <p class="eyebrow">{{ error.statusCode }}</p>
    <h1>
      {{
        error.statusCode === 404
          ? "This page could not be found."
          : "Something went wrong."
      }}
    </h1>
    <p>Return to the showcase to keep exploring.</p>
    <button class="button" @click="clearError({ redirect: '/' })">
      Back to the showcase →
    </button>
  </main>
  <SiteFooter />
</template>
