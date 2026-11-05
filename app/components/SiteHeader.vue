<script setup lang="ts">
const open = ref(false);
const toggle = useTemplateRef("toggle");
const links = [
  { to: "/blog/", label: "User manual" },
  { to: "/library/", label: "Media library" },
  { to: "/topics/", label: "Topics" },
  { to: "/team/", label: "Contributors" },
  { to: "/about/", label: "About" },
];
function close() {
  open.value = false;
  toggle.value?.focus();
}
watch(
  () => useRoute().path,
  () => {
    open.value = false;
  },
);
</script>
<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header
    class="site-header navigation-ready"
    :class="{ 'is-open': open }"
    @keydown.esc="close"
  >
    <Brand />
    <button
      ref="toggle"
      class="nav-toggle"
      type="button"
      :aria-expanded="open"
      aria-controls="site-navigation"
      @click="open = !open"
    >
      Menu
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 6h14" />
        <path d="M3 14h14" />
      </svg>
    </button>
    <div id="site-navigation" class="site-navigation">
      <nav aria-label="Main navigation">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          active-class="active"
          @click="open = false"
          >{{ link.label }}</NuxtLink
        >
      </nav>
      <NuxtLink class="header-cta" to="/#explore">Explore the demo ↗</NuxtLink>
    </div>
  </header>
</template>
