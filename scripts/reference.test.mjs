import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { gunzipSync } from "node:zlib";

const output = ".output/public";
const htmlAt = (path) => readFileSync(join(output, path, "index.html"), "utf8");
// Read the generated site's snapshots instead of the live development database.
const db = new Database(":memory:");
for (const name of ["blog", "authors", "categories", "photos", "videos"]) {
  const dump = readFileSync(
    join(output, "__nuxt_content", name, "sql_dump.txt"),
    "utf8",
  );
  const statements = JSON.parse(
    gunzipSync(Buffer.from(dump, "base64")).toString(),
  );
  for (const statement of statements) db.exec(statement);
}
const rows = (name) => db.prepare(`SELECT * FROM _content_${name}`).all();
const posts = rows("blog");
const authors = rows("authors");
const categories = rows("categories");
const photos = rows("photos");
const videos = rows("videos");
const media = [...photos, ...videos];
const array = (value) => JSON.parse(value || "[]");

for (const [name, records] of Object.entries({
  posts,
  authors,
  categories,
  media,
})) {
  test(`${name} have unique stable slugs`, () => {
    assert.equal(
      new Set(records.map((item) => item.slug)).size,
      records.length,
    );
    assert.ok(records.every((item) => item.slug));
  });
}

test("declared relationships resolve to real records and dates are chronological", () => {
  for (const post of posts) {
    assert.ok(
      authors.some((author) => author.slug === post.author),
      post.slug,
    );
    for (const slug of array(post.categories))
      assert.ok(
        categories.some((item) => item.slug === slug),
        slug,
      );
    for (const slug of array(post.videos))
      assert.ok(
        videos.some((item) => item.slug === slug),
        slug,
      );
    for (const slug of array(post.relatedPosts))
      assert.ok(
        posts.some((item) => item.slug === slug),
        slug,
      );
    if (post.updatedDate)
      assert.ok(post.updatedDate >= post.pubDate, post.slug);
  }
  for (const item of media)
    if (item.lesson)
      assert.ok(
        posts.some((post) => post.slug === item.lesson),
        item.slug,
      );
});

test("published chapters render, while drafts have no public route or listing", () => {
  const index = htmlAt("blog");
  const feed = readFileSync(join(output, "rss.xml"), "utf8");
  const sitemap = readFileSync(join(output, "sitemap.xml"), "utf8");
  for (const post of posts) {
    const path = `blog/${post.slug}`;
    if (post.status === "published") {
      assert.ok(existsSync(join(output, path, "index.html")), path);
      assert.ok(index.includes(`/blog/${post.slug}/`), path);
      assert.ok(htmlAt(path).includes("<h1>"), path);
    } else {
      assert.ok(!existsSync(join(output, path, "index.html")), path);
      assert.ok(!index.includes(`/blog/${post.slug}/`), path);
      assert.ok(!feed.includes(`/blog/${post.slug}/`), path);
      assert.ok(!sitemap.includes(`/blog/${post.slug}/`), path);
    }
  }
});

test("media visibility, previews, local images and attribution survive generation", () => {
  const library = htmlAt("library");
  for (const item of media) {
    const path = `library/${item.slug}`;
    if (item.visible) {
      assert.ok(library.includes(`/${path}/`), path);
      assert.ok(htmlAt(path).includes("About this asset"), path);
      if (item.sourceUrl)
        assert.ok(
          htmlAt(path).includes(item.sourceUrl.replaceAll("&", "&amp;")),
          path,
        );
    } else {
      assert.ok(!library.includes(`/${path}/`), path);
    }
    for (const image of [item.image, item.thumbnail]
      .filter(Boolean)
      .map(JSON.parse)) {
      assert.ok(image.alt, item.slug);
      assert.ok(existsSync(join("public", image.src)), image.src);
    }
  }
});

test("MDC callouts, named slots and image formats render as components", () => {
  const callout = htmlAt("blog/reusable-blocks-with-mdc");
  assert.match(callout, /class="workflow-note/);
  assert.match(callout, /data-tone="warning"/);
  assert.doesNotMatch(callout, /{%\s*callout/);
  const story = htmlAt("blog/richer-stories-with-mdc");
  assert.match(story, /class="review-checklist"/);
  assert.match(story, /A small review routine/);
  assert.match(story, /data-size="compact"/);
});

function walk(path) {
  return readdirSync(path).flatMap((name) => {
    const file = join(path, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

test("all generated internal links and image sources point to output files", () => {
  const broken = [];
  for (const file of walk(output).filter(
    (file) => file.endsWith(".html") && !/\/(200|404)\.html$/.test(file),
  )) {
    const html = readFileSync(file, "utf8");
    for (const [, attr] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
      if (attr.startsWith("//")) continue;
      const pathname = decodeURIComponent(
        attr.split(/[?#]/)[0].replaceAll("&amp;", "&"),
      );
      if (!existsSync(join(output, pathname)))
        broken.push(`${file}: ${pathname}`);
    }
  }
  assert.deepEqual([...new Set(broken)], []);
});

// The browser selects from srcset, which can differ from the fallback src.
// Check every candidate, including lazy images and initially hidden tab panels.
test("every responsive image candidate is generated as a valid WebP", () => {
  const candidates = new Set();
  for (const file of walk(output).filter((file) => file.endsWith(".html"))) {
    for (const [, srcset] of readFileSync(file, "utf8").matchAll(
      /srcset="([^"]+)"/g,
    )) {
      for (const candidate of srcset.split(",")) {
        const path = candidate.trim().split(/\s+/)[0].replaceAll("&amp;", "&");
        if (path.startsWith("/_ipx/")) candidates.add(decodeURIComponent(path));
      }
    }
  }
  assert.ok(candidates.size > 0, "Responsive variants exist");
  for (const path of candidates) {
    const bytes = readFileSync(join(output, path));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF", path);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", path);
  }
});
