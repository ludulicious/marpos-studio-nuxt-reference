<script setup lang="ts">
import { postPath } from "~/utils/content";
const route = useRoute();
const data = await useReferenceContent();
const slug = computed(() =>
  Array.isArray(route.params.slug)
    ? route.params.slug.filter(Boolean).join("/")
    : route.params.slug,
);
const page = computed(() =>
  data.value?.pages.find(
    (item) =>
      item.path.replace(/\/$/, "") === route.path.replace(/\/$/, "") ||
      item.slug === slug.value,
  ),
);
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
usePageMeta(() => page.value);
</script>
<template>
  <div v-if="page && data">
    <PageIntro :page="page" /><OptimizedImage
      v-if="page.hero"
      class="directory-hero"
      :src="page.hero.src"
      :alt="page.hero.alt"
      :width="1200"
    />
    <div v-if="page.slug === 'topics'" class="directory-grid">
      <section
        v-for="category in data.categories"
        :id="category.slug"
        :key="category.slug"
        class="directory-card"
      >
        <p class="directory-label">
          {{
            data.posts.filter((post) => post.categories.includes(category.slug))
              .length
          }}
          chapters
        </p>
        <h2>{{ category.title }}</h2>
        <p>{{ category.description }}</p>
        <ul>
          <li
            v-for="post in data.posts.filter((post) =>
              post.categories.includes(category.slug),
            )"
            :key="post.slug"
          >
            <NuxtLink :to="postPath(post)"
              >{{ post.title }}<span aria-hidden="true">↗</span></NuxtLink
            >
          </li>
        </ul>
      </section>
    </div>
    <div v-if="page.slug === 'team'" class="directory-grid contributor-grid">
      <section
        v-for="author in data.authors"
        :id="author.slug"
        :key="author.slug"
        class="directory-card"
      >
        <AuthorAvatar class="profile-avatar" :author="author" :size="88" />
        <h2>{{ author.name }}</h2>
        <p class="directory-label">{{ author.role }}</p>
        <p>{{ author.bio }}</p>
        <p v-if="author.website"><a :href="author.website">Website ↗</a></p>
        <h3>From this contributor</h3>
        <ul>
          <li
            v-for="post in data.posts.filter(
              (post) => post.author === author.slug,
            )"
            :key="post.slug"
          >
            <NuxtLink :to="postPath(post)"
              >{{ post.title }}<span aria-hidden="true">↗</span></NuxtLink
            >
          </li>
        </ul>
      </section>
    </div>
    <p v-if="page.callToAction">
      <NuxtLink class="inline-link" :to="page.callToAction.href"
        >{{ page.callToAction.label }} →</NuxtLink
      >
    </p>
  </div>
</template>
<style>
.directory-hero {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  margin-block: 2rem;
}
</style>
