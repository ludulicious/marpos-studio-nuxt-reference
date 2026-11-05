import { chapterOrder, mediaAsset } from "~/utils/content";
export async function useReferenceContent() {
  const nuxtApp = useNuxtApp();
  const { data, error } = await useAsyncData("reference-content", async () => {
    const [posts, pages, authors, categories, photos, videos] =
      await Promise.all([
        queryCollection("blog").all(),
        queryCollection("pages").all(),
        queryCollection("authors").all(),
        queryCollection("categories").order("order", "ASC").all(),
        queryCollection("photos").all(),
        queryCollection("videos").all(),
      ]);
    const allMedia = [
      ...photos.map((item) => mediaAsset(item, "photo")),
      ...videos.map((item) => mediaAsset(item, "video")),
    ].sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
    );
    return {
      posts: posts
        .filter((post) => import.meta.dev || post.status === "published")
        .sort(chapterOrder),
      pages,
      authors,
      categories,
      allMedia,
      media: allMedia.filter((item) => item.visible),
    };
  });
  if (error.value)
    throw createError({
      statusCode: 500,
      statusMessage: "Content could not be loaded",
      cause: error.value,
    });
  const content = data.value;
  if (import.meta.server && content) {
    nuxtApp.runWithContext(() =>
      prerenderRoutes([
        ...content.pages.map((page) => page.path),
        ...content.posts.map((post) => `/blog/${post.slug}/`),
        ...content.media.map((item) => `/library/${item.slug}/`),
      ]),
    );
  }
  return data;
}
