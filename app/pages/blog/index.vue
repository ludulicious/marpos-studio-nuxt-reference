<script setup lang="ts">
const data = await useReferenceContent();
const page = computed(() =>
  data.value?.pages.find((item) => item.slug === "blog"),
);
const search = ref("");
const posts = computed(
  () =>
    data.value?.posts.filter((post) =>
      `${post.title} ${post.description} ${(post.tags ?? []).join(" ")}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    ) ?? [],
);
usePageMeta(() => page.value);
</script>
<template>
  <div v-if="page">
    <PageIntro :page="page" label="User manual" />
    <div class="collection-search">
      <label for="chapter-search"
        >Find a chapter<input
          id="chapter-search"
          v-model="search"
          type="search"
          placeholder="Images, preview, publishing…"
      /></label>
      <p role="status">{{ posts.length }} chapters</p>
    </div>
    <PostList :posts="posts" />
    <p v-if="!posts.length" role="status">
      No chapters match your search. Try a different word.
    </p>
  </div>
</template>
