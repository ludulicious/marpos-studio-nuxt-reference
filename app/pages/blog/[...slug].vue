<script setup lang="ts">
import { postPath } from "~/utils/content";
const route = useRoute();
const data = await useReferenceContent();
const slug = computed(() =>
  Array.isArray(route.params.slug)
    ? route.params.slug.filter(Boolean).join("/")
    : route.params.slug,
);
const post = computed(() =>
  data.value?.posts.find((item) => item.slug === slug.value),
);
if (!post.value)
  throw createError({ statusCode: 404, statusMessage: "Chapter not found" });
const index = computed(
  () =>
    data.value?.posts.findIndex((item) => item.slug === post.value?.slug) ?? -1,
);
const previous = computed(() => data.value?.posts[index.value - 1]);
const next = computed(() => data.value?.posts[index.value + 1]);
const author = computed(() =>
  data.value?.authors.find((item) => item.slug === post.value?.author),
);
const related = computed(
  () =>
    data.value?.posts.filter((item) =>
      post.value?.relatedPosts?.includes(item.slug),
    ) ?? [],
);
const videos = computed(
  () =>
    data.value?.allMedia.filter(
      (item) =>
        item.kind === "video" && post.value?.videos?.includes(item.slug),
    ) ?? [],
);
const headings = computed(() => post.value?.body.toc?.links ?? []);
const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
usePageMeta(() => post.value);
</script>
<template>
  <div v-if="post && data" class="manual-layout">
    <aside class="manual-sidebar">
      <NuxtLink class="manual-back" to="/blog/">← All chapters</NuxtLink>
      <nav aria-label="Manual chapters">
        <NuxtLink
          v-for="chapter in data.posts"
          :key="chapter.slug"
          :aria-current="chapter.slug === post.slug ? 'page' : undefined"
          :to="postPath(chapter)"
          ><span>{{ String(chapter.chapter ?? "—").padStart(2, "0") }}</span
          >{{ chapter.title }}</NuxtLink
        >
      </nav>
      <div v-if="headings.length" class="on-this-page">
        <strong>On this page</strong
        ><a
          v-for="heading in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          >{{ heading.text }}</a
        >
      </div>
    </aside>
    <div class="manual-content">
      <article>
        <p class="meta">User manual · Chapter {{ post.chapter ?? "—" }}</p>
        <p v-if="post.status === 'draft'" role="status">
          Draft preview · This story is excluded from production.
        </p>
        <h1>{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <div class="article-byline">
          <NuxtLink
            v-if="author"
            class="byline-author"
            :to="`/team/#${author.slug}`"
            ><AuthorAvatar :author="author" :size="40" /><span>{{
              author.name
            }}</span></NuxtLink
          ><span class="byline-details"
            ><time :datetime="post.pubDate">{{
              formatDate(post.pubDate)
            }}</time>
            · {{ post.readingMinutes }} min read</span
          >
        </div>
        <p v-if="post.updatedDate">
          Updated
          <time :datetime="post.updatedDate">{{
            formatDate(post.updatedDate)
          }}</time>
        </p>
        <p>
          <NuxtLink
            v-for="category in data.categories.filter((item) =>
              post?.categories.includes(item.slug),
            )"
            :key="category.slug"
            class="topic"
            :to="`/topics/#${category.slug}`"
            >{{ category.title }}
          </NuxtLink>
        </p>
        <OptimizedImage
          v-if="post.hero"
          class="article-hero"
          :src="post.hero.src"
          :alt="post.hero.alt"
          :width="960"
          loading="eager"
        /><ContentRenderer class="prose" :value="post" />
        <section v-if="videos.length" class="lesson-videos">
          <h2>Watch &amp; learn</h2>
          <VideoLesson
            v-for="video in videos"
            :key="video.slug"
            :video="video"
          />
        </section>
        <p v-if="post.tags?.length">Filed under: {{ post.tags?.join(", ") }}</p>
      </article>
      <nav class="chapter-pagination" aria-label="Chapter navigation">
        <NuxtLink v-if="previous" :to="postPath(previous)"
          >← Previous<span>{{ previous.title }}</span></NuxtLink
        ><NuxtLink v-if="next" :to="postPath(next)"
          >Next chapter →<span>{{ next.title }}</span></NuxtLink
        >
      </nav>
      <section v-if="related.length">
        <h2>Keep reading</h2>
        <PostList :posts="related" />
      </section>
    </div>
  </div>
</template>
<style>
.article-hero {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  margin-block: 2rem;
}
.topic {
  display: inline-block;
  margin-right: 1em;
}
</style>
