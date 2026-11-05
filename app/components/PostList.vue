<script setup lang="ts">
import type { BlogCollectionItem } from "@nuxt/content";
import { postPath } from "~/utils/content";
defineProps<{ posts: BlogCollectionItem[] }>();
</script>
<template>
  <ol class="lesson-list">
    <li v-for="post in posts" :key="post.slug">
      <span
        class="chapter-number"
        :aria-label="`Chapter ${post.chapter ?? ''}`"
        >{{ post.chapter ? String(post.chapter).padStart(2, "0") : "—" }}</span
      >
      <div>
        <p class="meta">
          {{ post.readingMinutes }} min read<span v-if="post.videos?.length">
            · Includes video</span
          ><span v-if="post.status === 'draft'"> · Draft preview</span>
        </p>
        <h2>
          <NuxtLink :to="postPath(post)">{{ post.title }}</NuxtLink>
        </h2>
        <p>{{ post.description }}</p>
      </div>
      <NuxtLink
        v-if="post.hero"
        class="lesson-image"
        :to="postPath(post)"
        tabindex="-1"
        aria-hidden="true"
        ><OptimizedImage :src="post.hero.src" alt="" :width="480" sizes="160px"
      /></NuxtLink>
    </li>
  </ol>
</template>
