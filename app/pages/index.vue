<script setup lang="ts">
const sitePath = useSitePath();
const data = await useReferenceContent();
const page = computed(() =>
  data.value?.pages.find((item) => item.slug === "home"),
);
const selectedMedia = computed(() =>
  [
    "reflections-at-the-stepwell",
    "look-up",
    "where-land-meets-water",
    "the-bright-meeting-room",
  ].flatMap(
    (slug) => data.value?.media.filter((item) => item.slug === slug) ?? [],
  ),
);
usePageMeta(() => page.value);
</script>
<template>
  <div v-if="page && data" class="home-sections">
    <section class="showcase-hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="integration-label">
          <span class="sparkle" aria-hidden="true">✳</span> Nuxt Content
          <span class="integration-plus">+</span> Marpos Studio
        </p>
        <h1 id="hero-title">{{ page.title }}</h1>
        <p class="hero-description">{{ page.description }}</p>
        <div class="hero-actions">
          <a class="button button-cyan" href="#explore">See what’s possible ↗</a
          ><NuxtLink
            v-if="page.callToAction"
            class="hero-text-link"
            :to="page.callToAction.href"
            >{{ page.callToAction.label }} →</NuxtLink
          >
        </div>
        <p class="hero-footnote">
          <span aria-hidden="true" /> A real website. Ready to explore.
        </p>
      </div>
      <div class="hero-canvas">
        <svg
          class="canvas-spark"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M50 2C50 34 34 50 2 50c32 0 48 16 48 48 0-32 16-48 48-48C66 50 50 34 50 2Z"
            fill="currentColor"
          />
        </svg>
        <figure v-if="page.hero" class="canvas-photo canvas-photo-main">
          <OptimizedImage
            :src="page.hero.src"
            :alt="page.hero.alt"
            :width="900"
            sizes="xs:65vw sm:360px"
            loading="eager"
            fetchpriority="high"
          />
          <figcaption>
            A little room for big ideas. <span aria-hidden="true">↗</span>
          </figcaption>
        </figure>
        <NuxtLink
          v-if="selectedMedia[0]"
          class="canvas-photo canvas-photo-detail"
          :to="`/library/${selectedMedia[0].slug}/`"
          ><OptimizedImage
            :src="selectedMedia[0].src"
            :alt="selectedMedia[0].alt"
            :width="480"
            sizes="xs:43vw sm:240px"
            loading="eager"
          /><span>{{ selectedMedia[0].title }} ↗</span></NuxtLink
        >
        <div class="canvas-note">
          <span class="canvas-note-icon" aria-hidden="true">✓</span>
          <div>
            <strong>Creativity, meet content.</strong
            ><span>Beautiful on the outside.<br />Editable on the inside.</span>
          </div>
        </div>
        <span class="canvas-caption">A few things you can make your own</span>
      </div>
      <div class="hero-foundations">
        <span>ϟ Built for the web with Nuxt Content</span
        ><span>✎ Made for people with Studio</span
        ><span>⌘ Your content. Your code.</span>
      </div>
    </section>
    <section
      id="explore"
      class="showcase-section"
      aria-labelledby="explore-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">This is a working showcase</p>
          <h2 id="explore-title">More than a pretty page.</h2>
        </div>
        <p>
          Stories to tell. Collections to explore. Everything you see is built
          from real, editable content.
        </p>
      </div>
      <ShowcaseTabs />
    </section>
    <section
      class="home-gallery showcase-section"
      aria-labelledby="gallery-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">The media library</p>
          <h2 id="gallery-title">Good content deserves<br />a great canvas.</h2>
        </div>
        <div class="section-heading-aside">
          <p>
            From a quiet landscape to a moment of inspiration. Responsive
            images, ready to find their place.
          </p>
          <NuxtLink class="inline-link" to="/library/"
            >Explore all {{ data.media.length }} assets ↗</NuxtLink
          >
        </div>
      </div>
      <div class="showcase-gallery">
        <NuxtLink
          v-for="(item, index) in selectedMedia"
          :key="item.slug"
          class="gallery-item"
          :class="`gallery-item-${index + 1}`"
          :to="`/library/${item.slug}/`"
          ><OptimizedImage
            :src="item.src"
            :alt="item.alt"
            :width="item.width"
            :height="item.height"
            :sizes="
              index === 0
                ? 'xs:100vw sm:50vw lg:500px'
                : 'xs:100vw sm:50vw lg:360px'
            "
          /><span class="gallery-caption"
            ><span
              ><small>{{ item.category }}</small
              ><strong>{{ item.title }}</strong></span
            ><span class="gallery-arrow" aria-hidden="true">↗</span></span
          ></NuxtLink
        >
      </div>
      <p class="gallery-credit">
        Real photography. Open possibilities.
        <NuxtLink to="/library/"
          >Sources and CC0 credits in the library.</NuxtLink
        >
      </p>
    </section>
    <section class="workflow-banner" aria-labelledby="workflow-title">
      <div class="workflow-intro">
        <p class="eyebrow">A natural publishing workflow</p>
        <h2 id="workflow-title">From “what if”<br />to out in the world.</h2>
        <NuxtLink class="button button-cyan" to="/blog/"
          >Find your starting point →</NuxtLink
        >
      </div>
      <ol class="workflow-steps">
        <li>
          <span>01</span>
          <div>
            <h3>Make it yours.</h3>
            <p>
              Write a story, choose a photo, or update a detail in Marpos
              Studio.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <h3>See the whole picture.</h3>
            <p>
              Preview your changes in the actual Nuxt site, with everything in
              context.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <h3>Publish with confidence.</h3>
            <p>
              Review your work, then use your project’s publishing workflow when
              it’s ready.
            </p>
          </div>
        </li>
      </ol>
    </section>
    <div class="closing-note">
      <img
        :src="sitePath('/favicon.svg')"
        alt=""
        width="36"
        height="36"
      /><ContentRenderer :value="page" />
    </div>
  </div>
</template>
<style>
.home-sections {
  display: contents;
}
</style>
