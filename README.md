# Starter Project

An Eleventy (11ty) site starter with Tailwind CSS, Netlify Forms/CMS, and
a working blog/collections structure. This repo is intentionally generic —
follow the checklist below to rebrand it for a new business.

## Quick Start

```bash
npm install
npm start   # eleventy --serve + tailwind --watch, http://localhost:8080
npm run build
```

## 1. Identity data — `src/_data/site.json`

This is the single source of truth for the business identity used across
every layout and component: business name, tagline, description, contact
info (email, phone, mailing address), social handles, analytics/third-party
IDs, the production domain, and feed metadata.

Edit every value in this file first. Leave the key names alone unless you're
also updating the templates that reference them — the shape of this file is
what wires the whole site together.

Notable fields:

| Key | Used for |
|---|---|
| `title` | Site name — page titles, JSON-LD, Netlify form names, footer copyright |
| `tagline` | Homepage hero subheadline |
| `url` | Canonical domain — OG tags, JSON-LD, sitemap, RSS/JSON feeds |
| `author.firstName` | Used in the homepage hero ("Hi, I'm ___.") and a couple of other first-person headings |
| `author.*` | Byline name/credentials/email/phone, used in schema.org markup, contact/privacy pages |
| `address.*` | Mailing address shown on the Contact page |
| `social.*` | Leave any handle blank ("") to hide that icon/link entirely |
| `analytics.*` | Fathom, GA4, Google Ads, Font Awesome Kit — every one is blank by default and the relevant `<script>` tag only renders when a value is present |
| `clientPortalUrl` | Optional link in the top bar (e.g. a scheduling or client-portal tool). Leave blank to hide it. |
| `homeIntro` | The paragraph under the homepage hero headline |

All homepage copy now lives in `site.json` — there's no separate `home.json`.

## 2. Theming — `tailwind.config.js` + `src/styles/tailwind.css`

Brand color tokens live in `tailwind.config.js` under `theme.extend.colors`:

- `brand` — primary accent color (5-step scale: `light`, `bright`, `DEFAULT`, `dark`, `darker`, plus `border`)
- `subtle` — light neutral gray, currently unused by default templates but available

Page backgrounds, borders, and body text use Tailwind's built-in `neutral`
scale directly (`bg-neutral-50`, `text-neutral-700`, etc.) — no custom gray
palette to maintain. Font sizes and weights also use Tailwind's defaults
throughout; nothing is overridden in `tailwind.config.js`.

Change the hex values in `tailwind.config.js`; the class names (`bg-brand`,
etc.) stay the same throughout the templates, so a color swap is a
config-only change.

`src/styles/tailwind.css` has a `:root { }` custom-property block at the top
(`--color-brand`, `--color-brand-dark`, `--color-brand-bright`,
`--color-subtle`) for the handful of spots that need a raw CSS value instead
of a Tailwind utility class (currently just the Algolia autocomplete
widget's focus outline). **Keep these values in sync with the color scale
above.**

Fonts: templates use Tailwind's default `font-sans` stack (no external font
is loaded). `src/_includes/components/head/fonts.njk` only loads a Font
Awesome kit, and only if `site.analytics.fontAwesomeKit` is set. To use a
custom typeface, add a Google Fonts (or self-hosted) `<link>`/`@font-face`
there and set it as the `sans` font family in `tailwind.config.js`.

The homepage hero background is a named Tailwind `backgroundImage` token
(`home-cover`) pointing at a file in `src/assets/images/mast/`.

## 3. Templates — `src/_includes/`

All hardcoded identity strings (name, domain, phone, analytics IDs, social
links, form names) have been replaced with references to `site.*` /
`home.*`. If you add new components, follow the same pattern rather than
hardcoding a string that lives in `site.json`.

## 4. Page structure

- `src/index.md` → homepage (`layout: home`)
- `src/about/` → About page
- `src/articles/` → the `articles` collection (blog), with 3 example posts
  (`article-one.md`, `article-two.md`, `article-three.md`) and a
  category-archive pagination page (`resources/categories.njk`)
- `src/contact/index.md` → the single contact page, with a Netlify form
- `src/privacy.md` → privacy policy boilerplate
- `src/resources/404.md`, `sitemap.xml.njk`, `feed.njk`, `json.njk` → error
  page, sitemap, and Atom/JSON feeds, all generated from `collections.all` /
  `collections.articles`

All example content uses placeholder copy — replace it, but the
filenames/slugs/front-matter keys are intentionally left alone so the URL
structure doesn't shift under you.

To add a new top-level section (a services page, a second collection, etc),
follow the pattern in `src/articles/` and `src/about/`: a folder or file
under `src/`, an `eleventyNavigation` block in its front matter to appear in
the header nav, and a layout from `src/_includes/layouts/`.

## 5. Forms

`components/forms/general-contact.njk` is a Netlify form (`data-netlify=
"true"`) that posts back to `/contact/`. Its `name` attribute is
`{{ site.title }} General Contact` — Netlify's form detection just needs
that attribute present in the built HTML, so it updates automatically when
you rebrand `site.json`.

`components/global/signup.njk` (newsletter signup) is a separate, plain
Netlify form posting to the same page. Swap it for your email provider's
embed code if you use one.

## 6. Files that are NOT templated (edit by hand)

A few files are copied as-is by Eleventy's passthrough copy and are **not**
processed by the template engine, so `{{ site.* }}` won't work in them:

- `src/site.webmanifest` — app name/short_name, currently set to plain
  placeholder text
- `src/cms/config.yml` — Netlify CMS config; `site_url`/`display_url` and
  the article category options are set to generic placeholders

## 7. Images

`src/assets/images/` has no images checked in — `logo`/`favicon` in
`site.json` and `headshot.jpg` on the About page are placeholder paths.
Drop your own files in at those paths (or update the paths to match your
files) before deploying.

## What to do, in order

1. Edit `src/_data/site.json` top to bottom (includes homepage copy).
2. Update `tailwind.config.js` color hex values (and the matching `:root`
   block in `src/styles/tailwind.css`) to your brand palette.
3. Replace the images in `src/assets/images/` and `src/assets/favicons/`.
4. Replace the placeholder copy in `src/about/`, `src/articles/`, and
   `src/contact/`.
5. Hand-edit `src/site.webmanifest` and `src/cms/config.yml` (not
   templated — see §6).
6. `npm run build` and spot-check the output.
