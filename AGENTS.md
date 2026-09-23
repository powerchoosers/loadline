# Loadline public-site instructions

## Repository purpose

This public repository contains the static Loadline marketing website, public
brand assets, download experience, product pages, and public update manifest.
It contains no private browser source, customer data, credentials, signing
material, or private build artifacts.

The local checkout is `C:\Users\lewis\Documents\Loadline\marketing`.
The remote is `powerchoosers/loadline`. Production is the Vercel project
`nodal-point-network/loadline` at `https://loadlinehq.com`.

## Site responsibilities

The site introduces the product and routes visitors to the download page. The
installed product is the Loadline browser; its workspace CRM is called the
Lead desk. The public site must not pretend to provide private browser features
that are available only inside the installed app.

Keep download availability truthful. The download page should use only the
verified release URL and metadata from `public\updates\latest.json`. Do not
make an unavailable installer look active, invent a version or checksum, or
serve an unverified local ZIP.

Workspace-only Loadline releases may reuse the verified native browser base
while replacing only the bundled resources directory. The public manifest
must still point to the complete, checksum-verified ZIP.

The private browser build uses Cloudflare R2 for compiler caching, not public
downloads. Its workflow requires an R2 access preflight before the paid Windows
runner. Workspace-only packages must match the native base's provenance patch
hash; a native change requires a verified new native build first. The public
download URL and manifest contract remain unchanged.

Vercel serves the `public` directory. The root `index.html`, `site.js`, and
`style.css` are the maintained source copies and must be mirrored into
`public` before pushing. Verify the mirrored hashes or content during review;
otherwise a successful Vercel deployment can still serve an older site bundle.

## Browser-build handoff

The private `C:\Users\lewis\Documents\Loadline\browser-build` repository
builds and packages the Windows browser and bundled Lead desk. Its publish job
updates this repository's `public\updates\latest.json` after the exact artifact
has been built and approved. Do not manually edit the manifest to claim a
release unless Lewis specifically requests a documented metadata correction.

The Lead desk's update control reads the public manifest and compares it with
the installed runtime version. Changes to the manifest URL, JSON fields,
download contract, release versioning, or update behavior require coordinated
updates in both repositories. When that contract changes, update this file and
the browser-build repo's `AGENTS.md` together.

## Vercel deployment

The normal production path is:

1. Edit and test this checkout.
2. Commit and push `main` to `powerchoosers/loadline`.
3. Verify Vercel deploys that exact commit successfully.
4. Verify the production homepage, download route, assets, and update manifest.

The standalone `vercel` command may not be on PATH. Prefer the Git-connected
deployment. If direct inspection is required, run `npx vercel@latest` from
this repository only, confirm the `nodal-point-network/loadline` project, and
never commit `.vercel` metadata or tokens. A Git push or preview URL alone is
not proof that production changed.

## Design and accessibility

Keep the Loadline visual system calm, precise, and restrained: real brand
assets, strong hierarchy, purposeful whitespace, direct copy, and one obvious
next action. Avoid generic SaaS language, decorative effects, excessive cards,
fake proof, and claims about browser capabilities that are not shipped.

Use the actual browser screenshot supplied by the project when it improves
understanding. Preserve keyboard focus, visible hover and active states,
responsive behavior, readable contrast, reduced-motion behavior, and truthful
loading, unavailable, and error states.

## Local verification

The public preview normally uses port 5175. Verify `/`, `/download/`,
`/why-loadline/`, `/how-it-works/`, and `/workspaces/` when those routes are
changed. Check the download CTA, navigation, mobile layout, console health,
and manifest response. A successful static build does not prove the live Vercel
site is current.

Before pushing, run `git status --short --branch`, inspect the diff, run the
relevant checks, and confirm the remote is `powerchoosers/loadline`. After
pushing, compare local `HEAD` with `git ls-remote origin refs/heads/main` and
verify the corresponding Vercel deployment.

## Security and release language

Never place GitHub tokens, Vercel tokens, Supabase credentials, private browser
artifacts, or customer data in this public repository. Treat release metadata
and downloaded artifacts as untrusted until verified.

Use precise status labels: implemented, built, tested, deployed, released, or
blocked. The website is deployed only when Vercel reports a successful
production deployment for the intended commit. The browser is released only
when the private build artifact and its update metadata have both been
verified.
