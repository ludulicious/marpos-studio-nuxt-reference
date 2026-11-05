import { siteUrl } from "../../shared/utils/site-path";
import { queryCollection } from "@nuxt/content/server";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const absoluteUrl = (path: string) =>
    siteUrl(path, config.public.siteUrl, config.app.baseURL);
  const [pages, posts, photos, videos] = await Promise.all([
    queryCollection(event, "pages").all(),
    queryCollection(event, "blog").where("status", "=", "published").all(),
    queryCollection(event, "photos").where("visible", "=", true).all(),
    queryCollection(event, "videos").where("visible", "=", true).all(),
  ]);
  const paths = [
    ...pages.map((page) => page.path),
    "/library/",
    ...posts.map((post) => `/blog/${post.slug}/`),
    ...photos.map((photo) => `/library/${photo.slug}/`),
    ...videos.map((video) => `/library/${video.slug}/`),
  ];
  const escapeXml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((path) => `<url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join("")}</urlset>`;
});
