# Initial release validation

Validated on 21 September 2026 against the initial release, commit `0f2ed94`.

- Clean formatting, strict TypeScript checking, all five unit tests, and the optimized production build passed on Node.js 24.
- Browser checks passed for saving a journey, showing it in My journeys, and preserving it after reload.
- Search for Paris narrowed the catalog correctly; combining it with Into nature showed the empty state; Clear filters restored all six journeys.
- The native detail dialog displayed the correct journey; Escape closed it and returned focus to the opener.
- The public production site at https://railjoy.vercel.app loaded successfully after the GitHub push, with Vercel reporting a successful deployment.
- Desktop and 390px-wide mobile layouts were visually reviewed.

This pull request also exercises the separate branch → Vercel preview path. Consult its deployment check for the generated preview URL and its Quality check for hosted CI results.

## Authentication context for future changes

The GitHub connector could read this public repository, but its write attempt returned `403 Resource not accessible by integration` despite repository metadata reporting push permission. The command-line Git session had no usable GitHub login. The existing authenticated GitHub Desktop app successfully pushed the commits to the repository without adding credentials or changing permissions.

For this desktop environment, continue to use the existing GitHub Desktop app to publish local branches if connector writes remain unavailable. Do not extract its stored credentials. The Vercel project was already connected and automatically deployed the push.

## Scope

The production foundation is deployable and testable. Product behavior remains an editorial demo with browser-local saved journeys, without live rail data, booking, accounts, or server-side persistence. No extra services were added.
