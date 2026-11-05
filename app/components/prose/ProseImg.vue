<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    title?: string;
    width?: string | number;
    height?: string | number;
    size?: string;
  }>(),
  { alt: "", size: "normal" },
);
// Size the generated variants to the editorial format as well as the CSS box.
const targetWidth = computed(() => {
  const custom = Number.parseInt(String(props.width ?? ""), 10);
  if (props.width && /^\d+(px)?$/.test(String(props.width)) && custom > 0)
    return Math.min(custom, 1920);
  return props.size === "compact" ? 360 : props.size === "wide" ? 960 : 720;
});
const imageSizes = computed(() => `xs:100vw sm:${targetWidth.value}px`);
const imageStyle = computed(() =>
  props.width
    ? {
        width: /^\d+$/.test(String(props.width))
          ? `${props.width}px`
          : String(props.width),
        maxWidth: "100%",
      }
    : undefined,
);
</script>
<template>
  <OptimizedImage
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :title="title"
    :width="targetWidth"
    :sizes="imageSizes"
    :data-size="size"
    :style="imageStyle"
  />
</template>
<style>
.prose img[data-size="compact"] {
  width: 360px;
  max-width: 100%;
}
.prose img[data-size="normal"] {
  width: 720px;
  max-width: 100%;
}
.prose img[data-size="wide"] {
  width: 100%;
}
.prose img {
  margin-block: 1.5rem;
}
</style>
