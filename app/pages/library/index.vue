<script setup lang="ts">
const data = await useReferenceContent();
const search = ref("");
const route = useRoute();
const router = useRouter();
const category = computed({
  get: () =>
    typeof route.query.category === "string" ? route.query.category : "",
  set: (value: string) => {
    void router.replace({
      query: { ...route.query, category: value || undefined },
    });
  },
});
const categories = computed(() => [
  ...new Set(data.value?.media.flatMap((item) => item.categories) ?? []),
]);
const media = computed(
  () =>
    data.value?.media.filter(
      (item) =>
        (!category.value || item.categories.includes(category.value)) &&
        `${item.title} ${item.kind} ${item.categories.join(" ")} ${item.alt} ${item.creator}`
          .toLowerCase()
          .includes(search.value.toLowerCase()),
    ) ?? [],
);
usePageMeta(() => ({
  title: "The media library",
  description:
    "A collection of CC0 photography and practical CMS video lessons, ready to explore in the Marpos Studio reference.",
}));
</script>
<template>
  <div v-if="data">
    <div class="page-intro">
      <p class="breadcrumb">
        <NuxtLink to="/">Showcase</NuxtLink> / Media library
      </p>
      <h1>Good stories need<br />good images.</h1>
      <p class="lead">
        {{ data.media.filter((item) => item.kind === "photo").length }} real
        photographs.
        {{ data.media.filter((item) => item.kind === "video").length }}
        practical video lessons.<br />A small collection for learning, making,
        and publishing.
      </p>
    </div>
    <div class="library-note">
      <p>
        <strong>Made to be used.</strong> The sample photos are local files
        released under
        <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>.
        Every asset has its source, credit, and license. Videos are embedded
        from official WordPress learning resources with attribution.
      </p>
      <NuxtLink to="/blog/manage-your-media-library/"
        >How to use this library ↗</NuxtLink
      >
    </div>
    <div class="collection-search">
      <label for="media-search"
        >Search the library<input
          id="media-search"
          v-model="search"
          type="search"
          placeholder="Images, videos, or creators…" /></label
      ><label for="media-category"
        >Category<select id="media-category" v-model="category">
          <option value="">All categories</option>
          <option v-for="value in categories" :key="value" :value="value">
            {{ value }}
          </option>
        </select></label
      >
      <p role="status">{{ media.length }} assets</p>
    </div>
    <div class="media-grid">
      <article
        v-for="item in media"
        :key="`${item.kind}-${item.slug}`"
        class="media-card"
      >
        <NuxtLink class="media-preview" :to="`/library/${item.slug}/`"
          ><OptimizedImage
            :src="item.previewSrc"
            :alt="item.alt"
            :width="640"
            sizes="xs:100vw sm:45vw lg:360px"
          /><span v-if="item.kind === 'video'" class="video-badge"
            >▶ {{ item.duration ?? "Video" }}</span
          ></NuxtLink
        >
        <p class="meta">{{ item.category }} · {{ item.license }}</p>
        <h2>
          <NuxtLink :to="`/library/${item.slug}/`">{{ item.title }}</NuxtLink>
        </h2>
        <p class="media-credit">By {{ item.creator }}</p>
      </article>
    </div>
    <p v-if="!media.length" role="status">
      No assets match these filters. Try a different search or category.
    </p>
    <p class="source-note">
      Photography from the
      <a href="https://wordpress.org/photos/">WordPress Photo Directory</a>.
      Open an asset for its original source and reuse details.
    </p>
  </div>
</template>
