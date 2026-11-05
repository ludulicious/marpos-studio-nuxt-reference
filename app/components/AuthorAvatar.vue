<script setup lang="ts">
withDefaults(
  defineProps<{
    author: { name: string; avatar?: { src: string; alt: string } };
    size?: number;
  }>(),
  { size: 40 },
);
</script>
<template>
  <NuxtImg
    v-if="author.avatar"
    class="author-avatar"
    :src="author.avatar.src"
    :alt="author.avatar.alt"
    :width="size"
    :height="size"
    loading="lazy"
    format="webp"
    :quality="75"
    densities="1 2"
    fit="cover"
    decoding="async"
  /><span
    v-else
    class="author-avatar avatar-initials"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
    >{{
      author.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
    }}</span
  >
</template>
<style>
.author-avatar {
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  aspect-ratio: 1;
}
.avatar-initials {
  display: inline-grid;
  place-items: center;
  background: var(--color-accent-soft);
  color: var(--color-accent);
}
</style>
