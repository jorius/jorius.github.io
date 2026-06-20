# Blog Tags — Design Spec

**Date:** 2026-06-19  
**Branch:** fix/audit-cleanup-and-standards  
**Status:** Approved

---

## Overview

Add a predefined tag system to the Writing section so readers can discover posts by topic. Tags are managed in pagescms.org as a collection (one JSON per tag), posts reference multiple tags, and the `/writing` page gains a blog home landing and a tag-filtered sidebar view.

---

## Data Layer

### Tag collection

New directory: `src/content/writing/tags/`  
One JSON file per tag, filename = tag ID:

```json
{ "id": "databases", "order": 1, "label": { "en": "Databases", "es": "Bases de datos" } }
```

Fields: `id` (string), `order` (number, for display sorting), `label` (bilingual object).

### Post files

The existing `tag: string` field is renamed to `tags: string[]` (array of tag IDs). A post with no tags gets `"tags": []`. Existing posts are migrated at implementation time (e.g. `"tag": "hardware"` → `"tags": ["hardware"]`).

### `.pages.yml`

Two changes:

1. Add a `writing-tags` collection (same structure as `writing-categories`):
   ```yaml
   - name: writing-tags
     label: Writing — Tags
     type: collection
     path: src/content/writing/tags
     filename: '{fields.id}.json'
     view:
       primary: id
       sort: order
       order: asc
     fields:
       - { name: id, label: ID, type: string }
       - { name: order, label: Order, type: number }
       - name: label
         label: Label
         type: object
         fields:
           - { name: en, label: English, type: string }
           - { name: es, label: Spanish, type: string }
   ```

2. Replace the post's `{ name: tag, type: string }` field with a multi-select reference:
   ```yaml
   - name: tags
     label: Tags
     type: reference
     list: true
     options:
       collection: writing-tags
       value: '{fields.id}'
       label: '{fields.label.en}'
       search: 'fields.id,fields.label.en'
   ```

### `src/utils/content.ts`

- Add `WritingTag` interface (mirrors `WritingCategory`, with `order: number`).
- Add `loadTags(): WritingTag[]` (mirrors `loadCategories()`).
- Change `WritingPost.tag: string` → `tags: string[]`.

---

## UI

### `/writing` — Blog Home (new landing page)

Currently `/writing` with no slug auto-redirects to the first post. After this change, it renders a blog home in the right panel instead:

- Short intro paragraph (copy managed in i18n locale files under `directionB.read.blogHomeIntro` or similar key).
- "Content managed with [Pages CMS](https://pagescms.org)" credit line — dim text, plain underlined link, no chip style.
- Recent posts list below the intro: `date | title (with tag chips) | read time` — same row style as `BOssWriting`, clicking a row navigates to `/writing/:slug`.

The left sidebar is identical to the post-reader view (category tree + tags footer).

### Left sidebar — Tags footer

Always visible at the bottom of the left sidebar, separated from the category tree by a `1px solid t.rule` divider:

- Section label: `TAGS` (11px, dim, uppercase, `0.15em` letter-spacing).
- Tag chips: horizontal wrapping row of pill buttons. Style: `1px solid t.rule` border, `t.dim` text, uppercase, Space Mono. Active chip: `t.ink` text + border + `t.ink` background at low opacity.
- Overflow: the first 5 tags (by `order`) are shown as chips. If there are more than 5, a `+ Show More` button (blue `t.rgbB` text, `1px solid` blue-tinted border) appears after them and opens a modal listing all tags. If there are 5 or fewer tags total, no Show More button appears.

**Show More modal:**
- Overlay: `rgba(10,10,10,0.8)` fullscreen backdrop, click-outside to close.
- Panel: `t.sub` background, `1px solid t.rule`, `8px 8px 0 t.ink` box-shadow (matching the paper card style).
- Header: `ALL TAGS` label (dim, uppercase).
- Close button: plain `✕` icon, top-right corner, no border, `t.dim` color → `t.ink` on hover.
- Body: same chip style as the sidebar footer, all tags shown.

### Left sidebar — Tag-filtered state

Clicking a tag chip (in the footer or the modal) replaces the category tree with:

- `← All posts` button (blue, uppercase) at top — clicking it restores the category tree and clears the active tag.
- `Posts tagged [TAG]` label (dim, uppercase, small).
- Flat post list: post title + date/len below, same link style as existing post links. Active post has `font-weight: 700`.

The tags footer remains visible in this state with the active tag chip highlighted.

Clicking the active tag chip again deselects it and restores the category tree.

### Post reader header

The `date · len · tag` line becomes `date · len` followed by inline tag chips (same pill style). Clicking a chip in the reader activates the tag filter in the sidebar (sets `activeTag` state) — the reader content stays visible, but the sidebar switches to the filtered state for that tag.

### Home page `BOssWriting`

No visual change to the writing list rows. The section's "view all" navigation target changes from `/writing/${posts[0].slug}` to `/writing` (the blog home). Individual post row clicks still navigate to `/writing/:slug`.

---

## State Management

All state is local to the `Writing` page component (no global store needed):

| State | Type | Purpose |
|---|---|---|
| `activeTag` | `string \| null` | Which tag is filtered; `null` = show category tree |
| `showAllTags` | `boolean` | Whether the Show More modal is open |
| `collapsed` | `Record<string, boolean>` | Category collapse state (existing) |
| `fullWidth` | `boolean` | Reader width toggle (existing) |
| `lightbox` | `{src,alt} \| null` | Image lightbox (existing) |

The blog home vs. post reader distinction is handled by the existing `slug` param: no slug → blog home, slug present → post reader. No new route is needed.

---

## i18n

New keys required in both `src/i18n/locales/en.json` and `src/i18n/locales/es.json`:

| Key | English value |
|---|---|
| `directionB.read.blogHomeTitle` | `Writing` |
| `directionB.read.blogHomeIntro` | `A personal space where I write about the things I'm exploring — hardware tinkering, cybersecurity, infrastructure, databases, and the occasional sci-fi rabbit hole. No editorial calendar. Just notes from someone who enjoys learning out loud.` |
| `directionB.read.blogHomeCms` | `Content managed with` |
| `directionB.read.tagsLabel` | `Tags` |
| `directionB.read.tagsShowMore` | `+ Show More` |
| `directionB.read.tagsAllTags` | `All Tags` |
| `directionB.read.tagsFilterLabel` | `Posts tagged` |
| `directionB.read.tagsAllPosts` | `← All posts` |

---

## Out of Scope

- Tag pages at their own routes (`/writing/tag/:id`) — not needed; filtering is sidebar-only.
- Tag-based RSS or sitemap entries.
- Tag count badges on chips.
- Search/filter within the Show More modal.
