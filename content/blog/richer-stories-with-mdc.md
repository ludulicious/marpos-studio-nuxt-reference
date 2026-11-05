---
slug: richer-stories-with-mdc
title: "Build richer stories with MDC"
description: "Compose a story from reusable Vue components and named Markdown slots, with visual editing and predictable previews in Marpos Studio."
pubDate: "2026-10-26"
status: "published"
author: "studio-developers"
categories: ["nuxt", "editing"]
tags: ["Nuxt Content", "MDC", "publishing"]
featured: false
readingMinutes: 4
hero: {"src": "/images/library/room-to-grow.jpg", "alt": "Close-up shot of a small potted succulent plant with fleshy green leaves in a white ceramic pot, set on an office desk with a softly blurred office interior in the background."}
relatedPosts: ["your-first-edit", "review-before-publishing"]
chapter: 8
videos: []
studio:
  blocks:
    - id: story
      label: Story
      type: markdown
      component: story-sections
      slot: default
    - id: checklist
      label: Review checklist
      type: markdown
      component: story-sections
      slot: checklist
---

::story-sections
#default

Most stories only need words, headings, images, and links. When a reusable layout helps, Nuxt Content MDC lets authors write Markdown inside registered Vue components.

## Keep the content in one place

The title, description, author, topics, and related chapters use the same fields as ordinary Markdown stories. The words in this section and the review checklist live in named slots in this document.

In Marpos Studio, use the **Story** and **Review checklist** tabs to edit each section. Preview the page, save, and reopen it to check both slots survive the round trip.

![A small plant on an office desk.](/images/library/room-to-grow.jpg){size="compact"}

#checklist

## A small review routine

1. Read the story in its real page layout.
2. Check the author, topics, links, and image description.
3. Review the saved change before publishing.

Follow [your first content edit](/blog/your-first-edit/) for a complete editing exercise, or [try a reusable callout](/blog/reusable-blocks-with-mdc/).
::
