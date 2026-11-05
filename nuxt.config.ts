import { sitePath } from "./shared/utils/site-path";

const baseURL = process.env.NUXT_APP_BASE_URL || "/";

export default defineNuxtConfig({
  compatibilityDate: "2026-09-01",
  modules: ["@nuxt/content", "@nuxt/image"],
  devtools: { enabled: false },
  css: [
    "~/assets/css/global.css",
    "~/assets/css/showcase.css",
    "~/assets/css/motion.css",
  ],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: "en" },
      meta: [{ name: "theme-color", content: "#080f27" }],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: sitePath("/favicon.svg", baseURL),
        },
      ],
    },
  },
  runtimeConfig: { public: { siteUrl: "https://example.com" } },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        "/",
        "/blog/",
        "/library/",
        "/topics/",
        "/team/",
        "/about/",
        "/rss.xml",
        "/sitemap.xml",
      ],
    },
  },
  image: { quality: 75, domains: ["i.ytimg.com"] },
});
