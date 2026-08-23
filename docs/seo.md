# SEO (marketing site)

SEO is a first-class concern in `apps/web` and is implemented from day one. Use
the Next.js Metadata APIs; avoid manual `<head>` tags.

## Building blocks

| Concern            | Where                                        |
| ------------------ | -------------------------------------------- |
| Site config        | `apps/web/config/site.ts` (single source)    |
| Metadata defaults  | `apps/web/lib/seo/metadata.ts` → `baseMetadata` |
| Per-page metadata  | `createMetadata({ title, description, path })`  |
| Structured data    | `apps/web/lib/seo/json-ld.tsx`               |
| Sitemap            | `apps/web/app/sitemap.ts`                    |
| Robots             | `apps/web/app/robots.ts`                     |
| OG image           | `apps/web/app/opengraph-image.tsx`           |

## Page metadata

```ts
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Pricing",
  description: "Simple, transparent pricing.",
  path: "/pricing", // used for canonical + OG url
});
```

`baseMetadata` (in `app/layout.tsx`) provides site-wide defaults, title
templates, Open Graph, Twitter and robots settings. Page metadata inherits and
overrides it.

## Structured data (JSON-LD)

Use the typed helpers and the `<JsonLd>` component. Only add a schema when it
accurately describes the page.

```tsx
import { JsonLd, faqSchema } from "@/lib/seo/json-ld";

<JsonLd schema={faqSchema(items)} />;
```

Available: `organizationSchema`, `websiteSchema`, `softwareApplicationSchema`,
`faqSchema`, `breadcrumbSchema`. Types are enforced via `schema-dts`.

## Environment-aware indexing

Indexing is driven by `NEXT_PUBLIC_APP_ENV`:

- `production` → indexable; `robots.ts` allows crawling and points to the sitemap.
- anything else (`development`, `preview`) → `noindex` + `Disallow: /`.

This prevents staging/preview from being indexed. **Never** hard-code
`index: true`.

## Performance & accessibility

- Prefer Server Components and static generation; minimize client JS.
- Fonts are self-hosted via `geist` (no layout shift, no external fetch).
- Optimize images with `next/image`; lazy-load below-the-fold media.
- Use semantic HTML, correct heading order, labelled controls, visible focus,
  and the accessible shadcn/ui primitives.

## Adding a new indexable route

1. Create the page with `createMetadata({ path: "/new" })`.
2. Add the route to `app/sitemap.ts`.
3. Add structured data only if a schema genuinely applies.
4. Verify `curl localhost:3000/sitemap.xml` and `/robots.txt`.
