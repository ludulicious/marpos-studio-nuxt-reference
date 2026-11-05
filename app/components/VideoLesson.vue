<script setup lang="ts">
import type { MediaAsset } from "~/utils/content";
defineProps<{ video: MediaAsset }>();
const playing = ref(false);
</script>
<template>
  <figure class="video-lesson">
    <div class="video-stage">
      <iframe
        v-if="playing"
        :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`"
        :title="video.title"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      /><template v-else
        ><OptimizedImage
          :src="video.previewSrc"
          :alt="video.alt"
          :width="960"
          :height="540"
          sizes="xs:100vw md:60vw lg:760px"
        /><button type="button" class="video-play" @click="playing = true">
          ▶ Play {{ video.title }}
        </button></template
      >
    </div>
    <figcaption>
      <strong>{{ video.title }}</strong>
      <p>{{ video.description }}</p>
      <p>
        By {{ video.creator
        }}<span v-if="video.sourceUrl">
          · <a :href="video.sourceUrl">Original lesson ↗</a></span
        >
      </p>
      <p v-if="!playing" class="meta">Playing loads video from YouTube.</p>
    </figcaption>
  </figure>
</template>
