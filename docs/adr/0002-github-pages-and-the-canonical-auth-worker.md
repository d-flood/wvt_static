# GitHub Pages, and the canonical uncial-cms auth worker

The built site is served by GitHub Pages via Actions on the custom domain
`www.wevalueteens.com`, and editor sign-in uses the canonical hosted
`uncial-cms-auth` worker at `uncial-cms-auth.dflood.workers.dev` rather than a
worker deployed for this project.

Cloudflare Pages was the initial preference on the assumption that a GitHub OAuth
broker would have to be deployed alongside it. That assumption was wrong: the auth
worker is stateless and generic, keyed per repository — it checks that the
signed-in user has push access to the claimed repo and that the calling origin is
listed in that repo's committed `.uncial/cms.json`. Reuse therefore costs one JSON
file plus installing the GitHub App on this repository, and hosting became a free
choice decided on deploy ergonomics: a save commits to this repository, and Pages'
deploy trigger is that commit.

## Consequences

- The custom domain is load-bearing for authorization, not just for branding.
  Allowlisting a bare `*.github.io` origin would authorize every project page
  served from it; the custom domain restores per-site granularity.
- An outage of the canonical worker blocks editing (not reading). Self-hosting the
  same worker is a documented, unblocked fallback.
