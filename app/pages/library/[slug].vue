<script setup lang="ts">
const route = useRoute();
const sitePath = useSitePath();
const data = await useReferenceContent();
const item = computed(() =>
  data.value?.media.find((asset) => asset.slug === route.params.slug),
);
if (!item.value)
  throw createError({ statusCode: 404, statusMessage: "Asset not found" });
const copyLabel = ref("Copy image path");
async function copyPath() {
  try {
    await navigator.clipboard.writeText(item.value!.src);
    copyLabel.value = "Path copied ✓";
  } catch {
    copyLabel.value = "Copy unavailable — select the path below";
  }
}
usePageMeta(() =>
  item.value
    ? {
        title: item.value.title,
        description: item.value.description ?? item.value.alt,
        hero: { src: item.value.src },
      }
    : undefined,
);
</script>
<template>
  <div v-if="item">
    <p class="breadcrumb">
      <NuxtLink to="/library/">← Media library</NuxtLink>
    </p>
    <h1>{{ item.title }}</h1>
    <p class="lead">
      {{ item.category }} ·
      {{ item.kind === "photo" ? "Photograph" : "Video lesson" }}
    </p>
    <div class="asset-layout">
      <div>
        <VideoLesson
          v-if="item.kind === 'video'"
          :video="item"
        /><OptimizedImage
          v-else
          class="asset-full"
          :src="item.src"
          :alt="item.alt"
          :width="item.width"
          :height="item.height"
          sizes="xs:100vw md:60vw lg:760px"
          loading="eager"
        />
      </div>
      <aside class="asset-details">
        <h2>About this asset</h2>
        <dl>
          <dt>Creator</dt>
          <dd>
            <a v-if="item.creatorUrl" :href="item.creatorUrl">{{
              item.creator
            }}</a
            ><template v-else>{{ item.creator }}</template>
          </dd>
          <dt>License</dt>
          <dd>
            <a v-if="item.licenseUrl" :href="item.licenseUrl">{{
              item.license
            }}</a
            ><template v-else>{{ item.license }}</template>
          </dd>
          <dt>Source dimensions</dt>
          <dd>
            {{
              item.kind === "photo"
                ? `${item.width} × ${item.height}`
                : "Responsive video"
            }}
          </dd>
          <dt>Image description</dt>
          <dd>{{ item.alt }}</dd>
          <dt>Changes</dt>
          <dd>{{ item.changes }}</dd>
        </dl>
        <p v-if="item.sourceUrl">
          <a :href="item.sourceUrl">View original source ↗</a>
        </p>
        <template v-if="item.kind === 'photo'"
          ><a class="button" :href="sitePath(item.src)" download
            >Download photo ↓</a
          ><button
            type="button"
            class="text-button"
            aria-live="polite"
            @click="copyPath"
          >
            {{ copyLabel }}
          </button>
          <p class="meta">
            Local file: <code>{{ item.src }}</code>
          </p></template
        >
        <p v-if="item.lesson">
          <NuxtLink :to="`/blog/${item.lesson}/`"
            >Read the related manual chapter →</NuxtLink
          >
        </p>
      </aside>
    </div>
  </div>
</template>
