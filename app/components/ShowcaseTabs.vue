<script setup lang="ts">
import { postPath } from "~/utils/content";
const data = await useReferenceContent();
const selected = ref(0);
const buttons = ref<HTMLButtonElement[]>([]);
const tabs = computed(() => [
  {
    id: "stories",
    label: "Stories & pages",
    count: data.value?.posts.length ?? 0,
  },
  {
    id: "media",
    label: "Photos & video",
    count: data.value?.media.length ?? 0,
  },
  {
    id: "connections",
    label: "Connected content",
    count:
      (data.value?.authors.length ?? 0) + (data.value?.categories.length ?? 0),
  },
]);
const featured = computed(
  () => data.value?.posts.filter((post) => post.featured).slice(0, 3) ?? [],
);
const sampleMedia = computed(() =>
  [
    "light-through-the-trees",
    "the-bright-meeting-room",
    "publishing-with-blocks",
  ].flatMap(
    (slug) => data.value?.media.filter((item) => item.slug === slug) ?? [],
  ),
);
function keydown(event: KeyboardEvent, index: number) {
  const next =
    event.key === "ArrowRight"
      ? (index + 1) % 3
      : event.key === "ArrowLeft"
        ? (index + 2) % 3
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? 2
            : null;
  if (next === null) return;
  event.preventDefault();
  selected.value = next;
  buttons.value[next]?.focus();
}
</script>
<template>
  <div v-if="data" class="content-showcase">
    <div
      class="showcase-tabs"
      role="tablist"
      aria-label="Explore content types"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.id}`"
        :key="tab.id"
        ref="buttons"
        type="button"
        role="tab"
        :aria-controls="`panel-${tab.id}`"
        :aria-selected="selected === index"
        :tabindex="selected === index ? 0 : -1"
        @click="selected = index"
        @keydown="keydown($event, index)"
      >
        {{ tab.label }}<span>{{ tab.count }}</span>
      </button>
    </div>
    <section
      id="panel-stories"
      class="showcase-panel"
      role="tabpanel"
      aria-labelledby="tab-stories"
      tabindex="0"
      :hidden="selected !== 0"
    >
      <div class="panel-description">
        <h3>A little guidance. A lot of possibility.</h3>
        <NuxtLink class="inline-link" to="/blog/">All chapters →</NuxtLink>
      </div>
      <div class="story-cards">
        <article v-for="post in featured" :key="post.slug" class="story-card">
          <NuxtLink
            v-if="post.hero"
            class="story-image"
            :to="postPath(post)"
            tabindex="-1"
            aria-hidden="true"
            ><OptimizedImage
              :src="post.hero.src"
              alt=""
              :width="640"
              sizes="xs:100vw sm:45vw lg:360px"
            /><span
              >Chapter {{ String(post.chapter ?? "—").padStart(2, "0") }}</span
            ></NuxtLink
          >
          <div class="story-card-copy">
            <p class="meta">User manual · {{ post.readingMinutes }} min read</p>
            <h3>
              <NuxtLink :to="postPath(post)">{{ post.title }}</NuxtLink>
            </h3>
            <p>{{ post.description }}</p>
            <template
              v-for="author in data.authors.filter(
                (item) => item.slug === post.author,
              )"
              :key="author.slug"
              ><NuxtLink class="story-author" :to="`/team/#${author.slug}`"
                ><AuthorAvatar :author="author" :size="28" /><span>{{
                  author.name
                }}</span></NuxtLink
              ></template
            ><NuxtLink
              class="story-read"
              :to="postPath(post)"
              :aria-label="`Read ${post.title}`"
              >Read the chapter ↗</NuxtLink
            >
          </div>
        </article>
      </div>
    </section>
    <section
      id="panel-media"
      class="showcase-panel"
      role="tabpanel"
      aria-labelledby="tab-media"
      tabindex="0"
      :hidden="selected !== 1"
    >
      <div class="panel-description">
        <h3>A home for every image and idea.</h3>
        <NuxtLink class="inline-link" to="/library/"
          >Open the library →</NuxtLink
        >
      </div>
      <div class="story-cards">
        <article
          v-for="item in sampleMedia"
          :key="item.slug"
          class="story-card"
        >
          <NuxtLink class="story-image" :to="`/library/${item.slug}/`"
            ><OptimizedImage
              :src="item.previewSrc"
              :alt="item.alt"
              :width="640"
              sizes="xs:100vw sm:45vw lg:360px"
            /><span>{{
              item.kind === "video" ? "▶ Video lesson" : item.category
            }}</span></NuxtLink
          >
          <div class="story-card-copy">
            <p class="meta">
              {{ item.kind === "video" ? "CMS tutorial" : "Photography" }} ·
              {{ item.license }}
            </p>
            <h3>
              <NuxtLink :to="`/library/${item.slug}/`">{{
                item.title
              }}</NuxtLink>
            </h3>
            <p>
              By {{ item.creator }}. Source details and credits travel with
              every asset.
            </p>
            <NuxtLink class="story-read" :to="`/library/${item.slug}/`"
              >Explore the asset ↗</NuxtLink
            >
          </div>
        </article>
      </div>
    </section>
    <section
      id="panel-connections"
      class="showcase-panel"
      role="tabpanel"
      aria-labelledby="tab-connections"
      tabindex="0"
      :hidden="selected !== 2"
    >
      <div class="panel-description">
        <h3>Write once. Bring it all together.</h3>
        <NuxtLink class="inline-link" to="/topics/">Explore topics →</NuxtLink>
      </div>
      <div class="connections-grid">
        <div class="connection-authors">
          <h4>The people behind the stories</h4>
          <NuxtLink
            v-for="author in data.authors"
            :key="author.slug"
            class="connection-author"
            :to="`/team/#${author.slug}`"
            ><AuthorAvatar :author="author" :size="44" /><span
              ><strong>{{ author.name }}</strong
              ><small>{{ author.role }}</small></span
            ><span aria-hidden="true">↗</span></NuxtLink
          >
          <p>
            Shared profiles keep every byline connected. Update a name in Studio
            and it changes wherever it appears.
          </p>
        </div>
        <div class="connection-topics">
          <h4>Stories with something in common</h4>
          <NuxtLink
            v-for="category in data.categories"
            :key="category.slug"
            :to="`/topics/#${category.slug}`"
            ><span
              ><strong>{{ category.title }}</strong
              ><small>{{ category.description }}</small></span
            ><span class="topic-count"
              >{{
                data.posts.filter((post) =>
                  post.categories.includes(category.slug),
                ).length
              }}<span class="sr-only"> chapters</span></span
            ></NuxtLink
          >
        </div>
      </div>
    </section>
    <div class="showcase-caption">
      <span class="live-dot" aria-hidden="true" /> Real collections, rendered by
      Nuxt Content. Ready to edit in Marpos Studio.
    </div>
  </div>
</template>
