# v0-cozy-health-landing-page

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Railway hosting

The website uses the `cozy-health-website` service in the `celebrated-flexibility` Railway project. Separate development and production environments are configured for GitHub `develop` and `main`, with Railway Wait for CI enabled. This directory is connected to `cozy-health/v0-cozy-health-landing-page`.

Railway's GitHub integration has access to this repository, and both environment deployment triggers are connected. Main-branch protection and Railway Wait for CI require passing release checks. Production uses https://cozyhealth.org; development uses https://dev.cozyhealth.org. The deployment handoff records the latest domain cutover and verification status. Use the GitHub release flow rather than bypassing CI with a CLI upload.

The Dockerfile builds with Node.js 22 and runs the Next.js standalone server as a non-root user. Railway supplies `PORT`; the default is 8080. The health check is `/`. Analytics keys remain unset.

Before releasing, run `npm run typecheck`, `npm run legal:check`, `npm test`, and `npm run build`. When sibling repositories are available, also run `npm run legal:check -- --workspace`. Push development changes to `develop`, then merge a passing release PR to `main` for production.

Development preview: https://cozy-health-website-production.up.railway.app. Production preview: https://cozy-health-website-production-a679.up.railway.app.

See `../docs/legal/ENVIRONMENT_SPLIT.md` for current status and `../docs/legal/HOSTING_MIGRATION.md` for the earlier DNS migration evidence. Legal documents remain drafts until their separate review requirements are resolved. Set `COZY_DEPLOYMENT_ENV=production` only in production; development builds send `X-Robots-Tag: noindex, nofollow`. Analytics keys remain unset.

## Built with v0

The original source was linked to a [v0](https://v0.app) project. Its original Vercel hosting project is paused, with deployment history retained for rollback. Railway releases follow the GitHub branch and CI process above.

[Continue working on v0 →](https://v0.app/chat/projects/prj_qgFLnTjsQiMQeN08tA3h3CtjVzjA)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/ifeyinwacordelia/v0-cozy-health-landing-page" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
