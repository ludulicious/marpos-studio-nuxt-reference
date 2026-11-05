import { siteUrl } from "~~/shared/utils/site-path";

export function usePageMeta(
  page: () =>
    | { title?: string; description?: string; hero?: { src: string } }
    | undefined,
) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const origin = config.public.siteUrl;
  const publicPath = useSitePath();
  const absoluteUrl = (path: string) =>
    siteUrl(path, origin, config.app.baseURL);
  useSeoMeta({
    title: () =>
      route.path === "/"
        ? `${page()?.title ?? "Nuxt Content reference app"} · Marpos Studio`
        : `${page()?.title ?? "Marpos Studio"} · Nuxt Content reference app`,
    description: () => page()?.description,
    ogTitle: () => page()?.title,
    ogDescription: () => page()?.description,
    ogImage: () =>
      absoluteUrl(
        page()?.hero?.src ?? "/images/library/the-bright-meeting-room.jpg",
      ),
    ogUrl: () => absoluteUrl(route.path),
    ogType: "website",
    twitterCard: "summary_large_image",
  });
  useHead({
    link: [
      { rel: "canonical", href: () => absoluteUrl(route.path) },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Marpos Studio manual",
        href: publicPath("/rss.xml"),
      },
      { rel: "sitemap", href: publicPath("/sitemap.xml") },
    ],
  });
}
