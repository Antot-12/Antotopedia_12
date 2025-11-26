
# AntotoPedia_12 — Next.js Neon + Prisma Blog

A small but solid blog/CMS built with **Next.js 15**, **Prisma**, **Neon/Postgres**, **Cloudinary**, and **Tailwind CSS**.
It has:

* public blog (home, blog list, post page, tags)
* simple admin (login + editor)
* Markdown editor with live preview and autosave
* images (fallback + Cloudinary upload)
* JWT cookie auth for Admin/Editor


---

## 1) Tech stack

* **Next.js 15** (App Router, Server Components)
* **TypeScript**
* **Tailwind CSS** (custom `globals.css`)
* **Prisma** (ORM)
* **Neon** (hosted Postgres)
* **Cloudinary** (image storage)
* **jose** (JWT)
* **bcryptjs** (hashing)

---

## 2) Features overview

* **Home page** shows:

    * For logged-in users: Search, Quick Actions, Recent posts, Trending tags
    * For guests: Recent posts, Topics (tags), Popular, Quick Links sidebar
* **Blog list** with search + pagination
* **Post page** with Markdown rendering
* **Tags** pages with post lists
* **Login** (Admin/Editor)
* **Editor** (create/edit):

    * Markdown textarea, **Preview** (react-markdown + GFM), **Markdown** raw tab
    * Toolbar: headings, bold, italic, strike, code, code block, quote, list, link, image, table
    * Color menu (wraps selection into `<span style="color:...">`)
    * Local autosave to `localStorage` (key: `editor_draft_{id|new}`)
    * Status panel: draft/publish/save/delete
    * Keyboard: **Ctrl/Cmd+S** save draft, **Ctrl/Cmd+B** bold, **Ctrl/Cmd+I** italic
* **Images**:

    * If a post has no cover URL → uses `/public/no_image.jpg`
    * API to upload to Cloudinary into a folder named by the **slug**

---

## 3) Project structure (what each file/folder does)

```
antotopedia_12/
├─ prisma/                                         # Database layer managed by Prisma
│  ├─ migrations/                                  # Versioned SQL migrations for schema changes
│  ├─ schema.prisma                                # Prisma data model and datasource configuration
│  └─ seed.mjs                                     # Database seeding script to populate initial data
├─ public/                                         # Static assets served as-is
│  └─ service-worker.js                            # Service Worker script for caching/offline behavior
├─ src/                                            # Application source code
│  ├─ app/                                         # Next.js App Router (routes, layouts, pages)
│  │  ├─ admin/                                    # Admin area for content management
│  │  │  ├─ editor/                                # Post editor feature
│  │  │  │  ├─ [id]/                               # Dynamic route for editing an existing post by id
│  │  │  │  │  └─ TagsPageView.tsx                         # Edit post page (load and update post by id)
│  │  │  │  ├─ new/                                # Route for creating a new post
│  │  │  │  │  └─ TagsPageView.tsx                         # New post creation page
│  │  │  └─ TagsPageView.tsx                               # Admin dashboard entry page
│  │  ├─ api/                                      # Server-only API routes
│  │  │  ├─ auth/                                  # Authentication API group
│  │  │  │  ├─ login/                              # Login endpoint
│  │  │  │  │  └─ route.ts                         # POST handler for user login
│  │  │  │  └─ logout/                             # Logout endpoint
│  │  │  │     └─ route.ts                         # POST handler for user logout
│  │  │  ├─ locale/                                # Locale switching API
│  │  │  │  └─ route.ts                            # POST handler to set/change user locale
│  │  │  ├─ posts/                                 # Post-related API group
│  │  │  │  ├─ [id]/                               # Post by id
│  │  │  │  │  ├─ reactions/                       # Reactions sub-resource
│  │  │  │  │  │  └─ route.ts                      # POST/GET handlers for reactions on a post
│  │  │  │  │  └─ route.ts                         # GET/PUT/DELETE handlers for a post by id
│  │  │  │  └─ route.ts                            # GET/POST handlers for listing/creating posts
│  │  │  ├─ tags/                                  # Tag-related API group
│  │  │  │  ├─ TagsPageView.tsx                            # Server-rendered tags explorer page
│  │  │  │  ├─ route.ts                            # GET handler returning tags with counts
│  │  │  │  ├─ TagFilters.tsx                      # UI controls for filtering/sorting tags
│  │  │  │  └─ TagList.tsx                         # UI list/grid/cloud render for tags
│  │  │  └─ upload/                                # Media upload API
│  │  │     └─ route.ts                            # POST handler to upload files (e.g., to Cloudinary)
│  │  ├─ blog/                                     # Public blog routes
│  │  │  ├─ [slug]/                                # Dynamic route for a single post by slug
│  │  │  │  └─ TagsPageView.tsx                            # Post detail page (content, TOC, reactions)
│  │  │  └─ TagsPageView.tsx                               # Blog index with search and pagination
│  │  ├─ login/                                    # Public login route
│  │  │  └─ TagsPageView.tsx                               # Login page with credentials form
│  │  ├─ tags/                                     # Public tags routes
│  │  │  ├─ [slug]/                                # Dynamic route listing posts by tag
│  │  │  │  └─ TagsPageView.tsx                            # Tag details page with posts under the tag
│  │  │  └─ TagsPageView.tsx                               # Tags index with filters, search, and views
│  │  ├─ favicon.ico                               # Site favicon
│  │  ├─ globals.css                               # Global styles and Tailwind component classes
│  │  ├─ layout.tsx                                # Root layout: HTML shell, navbar, footer
│  │  └─ TagsPageView.tsx                                  # Home page: hero, recent posts, side widgets
│  ├─ components/                                  # Reusable UI components
│  │  ├─ editor/                                   # Editor UI building blocks
│  │  │  ├─ color/                                 # Editor color tools
│  │  │  │  └─ ColorMenu.tsx                       # Dropdown/palette to apply colors in editor
│  │  │  ├─ Editor.tsx                             # Main rich-text/markdown editor component
│  │  │  ├─ PostMetadata.tsx                       # Form for title, description, tags, and cover
│  │  │  ├─ StatusPanel.tsx                        # Draft/publish status controls and indicators
│  │  │  └─ Toolbar.tsx                            # Editor toolbar with formatting actions
│  │  ├─ md/                                       # Markdown-render helpers
│  │  │  └─ CodeBlock.tsx                          # Syntax-highlighted code block renderer
│  │  ├─ ContinueDrafts.tsx                        # Shortcut to continue editing recent drafts
│  │  ├─ DevSWKiller.tsx                           # Utility to unregister service workers in dev
│  │  ├─ EditorForm.tsx                            # Editor page composition and submit handling
│  │  ├─ FeatureGrid.tsx                           # Grid of feature cards on marketing/home
│  │  ├─ Footer.tsx                                # Site footer component
│  │  ├─ Hero.tsx                                  # Landing hero component
│  │  ├─ LanguageSwitcher.tsx                      # Locale toggle control
│  │  ├─ LikeButton.tsx                            # Single-action like button
│  │  ├─ LoginForm.tsx                             # Auth form with validation and submit
│  │  ├─ MarkdownPreview.tsx                       # Live preview for markdown content
│  │  ├─ Navbar.tsx                                # Top navigation bar with search and links
│  │  ├─ OnThisPage.tsx                            # TOC widget with scroll spy and anchors
│  │  ├─ PostCard.tsx                              # Post preview card with cover and tags
│  │  ├─ PostLangSwitcher.tsx                      # Switch a lang in the post
│  │  ├─ QuickActions.tsx                          # Shortcuts panel with external links
│  │  ├─ QuickLinks.tsx                            # Sidebar links and quick searches
│  │  ├─ QuickSearch.tsx                           # Search form for posts and tags
│  │  ├─ Reactions.tsx                             # Reactions summary and controls
│  │  ├─ ReactionsBar.tsx                          # Inline reactions toolbar with counts
│  │  ├─ ReadingProgress.tsx                       # Scroll-based reading progress indicator
│  │  ├─ RecentPosts.tsx                           # Grid of recent posts and a featured post
│  │  ├─ ShareBar.tsx                              # Share panel with social links and copy URL
│  │  ├─ Stats.tsx                                 # Stats summary (posts, tags, totals)
│  │  ├─ TagChip.tsx                               # Styled tag pill used across the UI
│  │  └─ TrendingTags.tsx                          # Widget showing most-used tags
│  ├─ i18n/                                        # Localization dictionaries
│  │  ├─ en.ts                                     # English strings for UI and labels
│  │  └─ uk.ts                                     # Ukrainian strings for UI and labels
│  ├─ lib/                                         # Server and shared utilities
│  │  ├─ auth.ts                                   # Authentication helpers and session handling
│  │  ├─ cloudinary.ts                             # Cloudinary client and upload helpers
│  │  ├─ i18n-content.ts                           # Content localization helpers for posts/tags
│  │  ├─ i18n-format.ts                            # Formatting helpers (dates, numbers) per locale
│  │  ├─ i18n.ts                                   # Locale detection and dictionary loader
│  │  ├─ markdown.tsx                              # Markdown rendering and parsing utilities
│  │  └─ prisma.ts                                 # Prisma client singleton for database access
│  └─ middleware.ts                                # Edge middleware for headers, auth, or locale
├─ .env                                            # Environment variables for local development
├─ .gitignore                                      # Files and folders excluded from Git tracking
├─ eslint.config.mjs                               # ESLint configuration for linting rules
├─ MEADME.md                                       # Project notes or documentation file
├─ next-env.d.ts                                   # Next.js TypeScript type declarations
├─ next.config.ts                                  # Next.js runtime and build configuration
├─ output.txt                                      # Generated logs or command outputs stored as text
├─ package-lock.json                               # Locked dependency tree for npm installs
├─ package.json                                    # Project metadata, scripts, and dependencies
├─ postcss.config.mjs                              # PostCSS configuration used by Tailwind
├─ prisma.config.ts                                # Prisma-related runtime/build configuration
├─ README.md                                       # Primary project documentation
├─ tailwind.config.ts                              # Tailwind CSS configuration (theme, plugins)
└─ tsconfig.json                                   # TypeScript compiler options
```
---

## Key Files Explained

* `src/app/TagsPageView.tsx` — Home. Shows different layout for guests vs logged users (QuickLinks on the right, Recent, Popular, Trending).
* `src/app/blog/TagsPageView.tsx` — Blog list with search and pagination. Chooses one featured card and grid for the rest.
* `src/app/blog/[slug]/TagsPageView.tsx` — Single post with TOC, reading progress, share bar, related posts, previous/next, like button, safe Markdown.
* `src/app/admin/editor/new/TagsPageView.tsx` — Create a post in the editor.
* `src/app/admin/editor/[id]/TagsPageView.tsx` — Edit existing post.
* `src/app/api/posts/route.ts` — GET list, POST create.
* `src/app/api/posts/[id]/route.ts` — GET one post, PATCH update, DELETE.
* `src/app/api/tags/route.ts` — GET tags list with counts (used for Trending).
* `src/app/api/upload/route.ts` — Receives a file, uploads to Cloudinary under `posts/<slug>/...`, returns URL.
* `src/components/editor/*` — The modular editor UI (toolbar, color, status, keyboard help).
* `src/components/md/CodeBlock.tsx` — Better code blocks with copy button and language label.
* `src/lib/auth.ts` — Session cookie handling and password checks.
* `src/lib/prisma.ts` — Shared Prisma client with dev singleton.
* `public/no_image.jpg` — Fallback image when a post has no cover.

---

## API Routes

* `POST /api/auth/login` — `{ username, password }` → sets session cookie.
* `POST /api/auth/logout` — clears session cookie.
* `GET /api/posts` — list posts (with filters via query if needed).
* `POST /api/posts` — create post (title, slug, description, contentMarkdown, status, coverImageUrl).
* `GET /api/posts/[id]` — read one post.
* `PATCH /api/posts/[id]` — update one post.
* `DELETE /api/posts/[id]` — delete one post.
* `GET /api/tags` — list tags with counts.
* `POST /api/upload` — multipart file upload to Cloudinary (expects `slug` to build the folder).

---

## 4) Database (Prisma + Neon)

### Models (simplified)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id                 Int           @id @default(autoincrement())
  slug               String        @unique
  title              String
  description        String?
  contentMarkdown    String?
  coverImageUrl      String?
  coverImagePublicId String?
  status             PostStatus    @default(draft)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  tags               Tag[]
  reaction           PostReaction?
  i18n               PostI18n[]

  @@index([status, createdAt])
  @@index([createdAt])
}

model PostI18n {
  id              Int      @id @default(autoincrement())
  postId          Int
  locale          String   @db.Char(2)
  title           String
  description     String?
  contentMarkdown String?
  post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, locale])
  @@index([locale])
}

model Tag {
  id    Int      @id @default(autoincrement())
  slug  String   @unique
  name  String   @unique
  posts Post[]
  i18n  TagI18n[]

  @@index([name])
}

model TagI18n {
  id     Int    @id @default(autoincrement())
  tagId  Int
  locale String @db.Char(2)
  name   String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([tagId, locale])
  @@index([locale, name])
}

model PostReaction {
  id        Int      @id @default(autoincrement())
  postId    Int      @unique
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  likes     Int      @default(0)
  love      Int      @default(0)
  wow       Int      @default(0)
  fire      Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
}

enum PostStatus {
  draft
  published
}

```

### Connect to Neon

Create a Neon database, copy the connection string, then set:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require&pgbouncer=true&connect_timeout=10"
```

### Migrate & seed

```bash
# install deps
npm i

# generate prisma client
npx prisma generate

# push schema
npx prisma db push
# or if you use migrations:
# npx prisma migrate dev --name init

# seed demo data
npx prisma db seed
```

You can inspect data with:

```bash
npx prisma studio
```

---

## 5) Cloudinary uploads

We upload to a folder named after the **post slug**.
Add these to `.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**API**: `POST /api/upload` with a multipart file and `slug` field.
The editor can call this and then save the returned `secure_url` and `public_id` in the post.

If a post has no cover URL, UI uses **`/no_image.jpg`** from `public/`.

---

## 6) Auth (Admin + Editor)

JWT cookie stored in `session`. Main env vars:

```
AUTH_SECRET=long_random_string
ADMIN_USERNAME=Kurwa_redaktor
ADMIN_HASH=$2b$12$...   # bcrypt hash for admin password
EDITOR_HASH=$2b$12$...  # bcrypt hash for editor password (optional)
```

> To generate a hash quickly (Node REPL):
>
> ```js
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('Kurwa_12', 12)
> ```

`lib/auth.ts` exports:

* `login(username, password)` → sets cookie if hash matches
* `logout()` → clears cookie
* `getCurrentUser()` → reads cookie & returns `{ role: "admin" | "editor" }` or `null`

Only Admin/Editor see admin UI. Guests see the public UI.

---

## 7) Environment variables (quick list)

Create `.env`:

```
# Next
NODE_ENV=development

# Prisma / Neon
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=replace_with_long_random_string
ADMIN_USERNAME=Kurwa_redaktor
ADMIN_HASH=$2b$12$...   # your bcrypt hash
EDITOR_HASH=$2b$12$...  # optional

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 8) Install & run

```bash
# Node 18+ (prefer 20+)
npm i
npm run dev
# http://localhost:3000
```

Build & start:

```bash
npm run build
npm run start
```

---

## 9) Styling and UI notes

* Tailwind is enabled via `globals.css` (custom utility classes for `card`, `btn`, `chip`, `skeleton`, etc.).
* The accent color is `#2ee7d8`.
* Right sidebar on home is **narrow (≈ 320px)**: `lg:grid-cols-[1fr_320px]`.
* `PostCard` uses `Image` with `post.coverImageUrl || "/no_image.jpg"`.

---

## 10) Editor details

* **Tabs**: Write / Preview / Markdown
* **Preview** uses `react-markdown` + `remark-gfm`
* **Toolbar**:

    * H2/H3
    * Bold/Italic/Strike
    * Inline code / Code block
    * Quote / List
    * Link / Image / Table
    * Color menu (wraps selected text with `<span style="color:#hex">`)
* **Autosave**: on any change, editor saves `{...form}` to localStorage under `editor_draft_{id|new}`.
* **StatusPanel**: Draft/Published toggle, Save Draft, Publish, Delete
* **Shortcuts**:

    * **Ctrl/Cmd+S** — Save draft
    * **Ctrl/Cmd+B** — Bold
    * **Ctrl/Cmd+I** — Italic

---

## 11) API summary

> All routes are App Router handlers (Next 15).
> **Important**: `params` and `searchParams` may be **Promises**. Always `await` them.

* `GET /api/posts` — (optional) list posts
* `POST /api/posts` — create post `{ title, slug, description, contentMarkdown, coverImageUrl, status, tags[] }`
* `GET /api/posts/[id]` — fetch post by id
* `PATCH /api/posts/[id]` — update post
* `DELETE /api/posts/[id]` — delete post
* `POST /api/upload` — Cloudinary upload (multipart); returns `{ url, publicId }`

---

## 12) Pages summary

* `/` — Home. Shows different blocks for logged vs guest. Fetches trending tags with counts.
* `/blog` — List, search, pagination.
* `/blog/[slug]` — Single post page.
* `/tags` — All tags.
* `/tags/[slug]` — Posts for that tag.
* `/login` — Sign in form.
* `/admin/editor/new` — Create post.
* `/admin/editor/[id]` — Edit post.

---

## 13) Common problems & quick fixes

**“Module not found: 'jose'”**
→ `npm i jose`

**“cookies() should be awaited…” / “params should be awaited…”**
→ In Next 15 some dynamic APIs are async. Make component signatures like:

```ts
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  ...
}
```

**“Maximum update depth exceeded” in Editor**
→ We guard local draft restore with a `loadedRef` so it runs once. Do not remove that.

**Hydration error `<pre>` inside `<p>`**
→ Our Markdown components render inline vs block code differently to avoid nesting errors. Do not wrap `<pre>` inside `<p>`.

**Tailwind class missing (`border-accent`)**
→ We define fallbacks in `globals.css`: `.border-accent { border-color: var(--accent); }`

**`ssr:false` not allowed**
→ Do not use `next/dynamic` with `ssr:false` inside Server Components. Move it into a Client Component.

**TS71007… Props must be serializable**
→ For client components, callback props should end with `Action` (e.g., `onPickAction`) to silence Next 15 warnings.

---

## 14) How to remove demo posts

When connected to a real DB, just delete them in the admin editor or run:

```sql
DELETE FROM "Post" WHERE slug LIKE 'demo-post%';
```

If you only see “demo” content in UI, it means **DATABASE_URL** is not set or Prisma can’t reach Neon.
Fix DB connection and refresh.

---

## 15) Deployment notes

* Set all **env vars** on your platform (Vercel/Render/etc.)
* Allow Cloudinary in `next.config.ts` images domains:

  ```ts
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] }
  ```
* Run `prisma generate` + migrations during build.
* Ensure `AUTH_SECRET` is long and random.

---

## 16) Conventions

* Slug is auto-generated from title but can be edited.
* Tags are typed without `#` (UI shows `#tag`).
* Cover image is optional (fallback used).
* Right column is 320px on large screens.
* Keep components small and reusable.

---

## 17) Useful scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:seed": "prisma db seed",
    "studio": "prisma studio"
  }
}
```

---

## 18) Checklist to run from zero

1. `npm i`
2. Create `.env` with DB, auth, and Cloudinary
3. `npx prisma generate`
4. `npx prisma db push` (or `migrate dev`)
5. `npx prisma db seed`
6. `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000)
8. Login at `/login` (use your admin username + password)

---
 