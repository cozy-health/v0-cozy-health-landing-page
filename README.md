# v0-cozy-health-landing-page

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Railway hosting

The website runs on the `cozy-health-website` service in the existing `celebrated-flexibility` Railway project, production environment. The live site is https://cozyhealth.org with Cloudflare DNS. Deployments currently use the Railway CLI from this folder; this local source is not a Git checkout and GitHub autodeployment is not connected to Railway.

The Dockerfile builds with Node.js 22 and runs the Next.js standalone server as a non-root user. Railway supplies `PORT`; the default is 8080. The health check is `/`. Analytics keys remain unset.

Before deploying, run `npm run typecheck`, `npm run legal:check`, `npm test`, and `npm run build`. Deploy only to the website service:

```sh
railway up . --path-as-root --project 33f9a938-49e3-42c5-83c7-633ee85760fa --environment production --service 3244f8df-dbca-4d75-8aaf-adf9acba9c2b --detach
```

Preview: https://cozy-health-website-production.up.railway.app

See `../docs/legal/HOSTING_MIGRATION.md` for DNS records, mail preservation and cutover status. Legal documents remain drafts until their separate review requirements are resolved.

## Built with v0

The original source was linked to a [v0](https://v0.app) project. Its original Vercel hosting project is paused, with deployment history retained for rollback. Changes in v0 do not automatically update the Railway CLI deployment.

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
