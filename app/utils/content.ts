import type {
  BlogCollectionItem,
  PhotosCollectionItem,
  VideosCollectionItem,
} from "@nuxt/content";
export const chapterOrder = (a: BlogCollectionItem, b: BlogCollectionItem) =>
  (a.chapter ?? 99) - (b.chapter ?? 99) || a.title.localeCompare(b.title);
export const postPath = (post: { slug: string }) => `/blog/${post.slug}/`;
export function mediaAsset(
  entry: PhotosCollectionItem | VideosCollectionItem,
  kind: "photo" | "video",
) {
  const youtubeId = "youtubeId" in entry ? entry.youtubeId : undefined;
  return {
    ...entry,
    kind,
    youtubeId,
    categories: entry.categories ?? [],
    src:
      entry.image?.src ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    alt: entry.image?.alt || entry.title,
    previewSrc:
      ("thumbnail" in entry ? entry.thumbnail?.src : undefined) ??
      entry.image?.src ??
      `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    category:
      entry.categories?.[0] ?? (kind === "video" ? "CMS tutorials" : "Photos"),
    creator: entry.credit || entry.creator || "Credit not recorded",
    width: entry.width ?? 1024,
    height: entry.height ?? 768,
    license: entry.license ?? "Rights not recorded",
    changes: entry.changes ?? "No modification details recorded.",
  };
}
export type MediaAsset = ReturnType<typeof mediaAsset>;
