export function usePageMeta(
  page: () =>
    | { title?: string; description?: string; hero?: { src: string } }
    | undefined,
) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;
  useSeoMeta({
    title: () =>
      route.path === "/"
        ? `${page()?.title ?? "Nuxt Content reference app"} · Marpos Studio`
        : `${page()?.title ?? "Marpos Studio"} · Nuxt Content reference app`,
    description: () => page()?.description,
    ogTitle: () => page()?.title,
    ogDescription: () => page()?.description,
    ogImage: () =>
      new URL(
        page()?.hero?.src ?? "/images/library/the-bright-meeting-room.jpg",
        siteUrl,
      ).href,
    ogUrl: () => new URL(route.path, siteUrl).href,
    ogType: "website",
    twitterCard: "summary_large_image",
  });
  useHead({
    link: [
      { rel: "canonical", href: () => new URL(route.path, siteUrl).href },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Marpos Studio manual",
        href: "/rss.xml",
      },
      { rel: "sitemap", href: "/sitemap.xml" },
    ],
  });
}
