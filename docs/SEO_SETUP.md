# Website SEO - 11 November 2026

Public website SEO uses COZY_DEPLOYMENT_ENV at build time. Production uses https://cozyhealth.org; every other value uses https://dev.cozyhealth.org and retains noindex headers. Rebuild when changing environments.

- /robots.txt allows public crawling; production advertises /sitemap.xml and excludes API routes. Guardian utility pages remain crawlable so crawlers can read their noindex rules.
- Production sitemap includes public marketing pages and published current policies from the existing legal manifest. Development sitemap is empty. No fabricated modification dates.
- Public pages have individual titles, descriptions, canonical URLs and social metadata. Archived and unpublished policies remain noindex. Redirect aliases stay out of the sitemap.
- Organization/WebSite JSON-LD uses verified brand name, URL and logo only. /opengraph-image serves a generated 1200x630 PNG using existing branding. Existing consent, forms, authentication and clinical/legal copy are preserved.
- Search Console account changes/submission are outside this release. After production verification, submit https://cozyhealth.org/sitemap.xml in the existing property.

Validation and release evidence: workspace docs/SEO_STATUS_2026-11-11.md and docs/HANDOFF.md. Source supports both environments. Production release must be based on the production baseline with only this SEO patch; do not merge all development changes.
