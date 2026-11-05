import { queryCollection } from "@nuxt/content/server";
const escapeXml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl;
  const posts = await queryCollection(event, "blog")
    .where("status", "=", "published")
    .order("pubDate", "DESC")
    .all();
  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Marpos Studio manual</title><link>${escapeXml(site)}</link><description>The Nuxt Content reference manual</description>${posts.map((post) => `<item><title>${escapeXml(post.title)}</title><description>${escapeXml(post.description)}</description><link>${escapeXml(new URL(`/blog/${post.slug}/`, site).href)}</link><guid>${escapeXml(new URL(`/blog/${post.slug}/`, site).href)}</guid><pubDate>${new Date(post.pubDate).toUTCString()}</pubDate></item>`).join("")}</channel></rss>`;
});
