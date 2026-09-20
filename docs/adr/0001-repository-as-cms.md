# The repository is the CMS

We are replacing Django and Wagtail with a prerendered SvelteKit site (adapter-static)
whose content is Uncial Content documents committed to this repository, edited in
place through uncial-cms `/…/edit/` routes. There is no server, no database and no
user table; a save is a commit, and a commit is a deploy.

The site is a low-traffic brochure site for a nonprofit with one editor, and the
Wagtail installation had become a liability rather than an asset: it shuttled its
own SQLite database to and from S3 on every publish, carried live AWS and SMTP
credentials in settings, and required a running host to serve pages that never
change between edits. Static hosting removes the host, the database, the
credential surface and the upgrade treadmill in one move.

## Consequences

- Content history becomes git history. There is no separate revision system,
  no draft/publish workflow beyond branches, and no scheduled publishing.
- Editing requires a GitHub account with push access, which is acceptable for one
  editor and would not be for twenty.
- This repository is also a dogfooding site for Uncial, alongside `triiiceratops`.
  Problems found here are expected to be fixed upstream rather than worked around.
