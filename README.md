# Railjoy

A small, fast rail-journey discovery app: explore six editorial sample journeys, filter by mood or destination, open journey details, and save a shortlist in your browser.

**Status:** initial product foundation. The content and durations are demo data, not live timetables, fares, or booking offers. There is no account system, payment flow, backend, or database. Saved journeys stay in this browser and are not synced between devices. No secrets or environment variables are needed.

## Develop

Use Node.js 24 and pnpm 11.19.0 (pinned in `package.json`).

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. `pnpm check` runs TypeScript checks, unit tests, and the production build. `pnpm preview` serves the compiled `dist/` after a build.

## GitHub → Vercel → test → iterate

The source of truth is [simonwithane/railjoy](https://github.com/simonwithane/railjoy). Its existing Vercel project is [joan-team/railjoy](https://vercel.com/joan-team/railjoy), with production at [railjoy.vercel.app](https://railjoy.vercel.app).

1. Describe the requested change in the conversation that has repository access. Include what should happen and any design reference.
2. Implement the change on a `codex/…` branch, run `pnpm check`, and commit with a specific message.
3. Push and open a pull request. GitHub Actions validates the code; the Vercel Git integration creates a preview URL in the pull request checks.
4. Test the preview on desktop and mobile. Request adjustments on the same branch.
5. Merge an approved, passing change into `main` to update production. Verify the deployment reaches **Ready** and open the production URL.

The integrations do the build/deploy work. A conversation must have working repository tools to make code changes; an ordinary chat without those tools cannot push commits by itself.

## Deployment settings

- Vercel project: existing `railjoy` project, linked to `simonwithane/railjoy`.
- Framework: Vite. Repository root: `.`. Production branch: `main`.
- Runtime: Node.js 24.x. Install: `pnpm install --frozen-lockfile`.
- Build: `pnpm build`. Output: `dist`. Settings are checked into `vercel.json`.
- No deployment tokens in GitHub Actions: deployment uses the existing Vercel GitHub connection.
- No environment variables required. If server integrations are introduced later, place credentials in Vercel's environment settings and local `.env.local`, never in source control. `VITE_` variables are public browser values and must never contain secrets.

Vercel preview authentication, if enabled on the account, may require signing in to view branch previews. The public production URL is separate.

## Structure

- `src/App.tsx`: discovery, saved journeys, accessible native detail dialog.
- `src/journeys.ts`: typed demo catalog, filtering, duration formatting, defensive storage parsing.
- `src/styles.css`: responsive visual system and locally rendered landscape illustrations.
- `src/journeys.test.ts`: search/filter behavior and corrupt-storage recovery tests.
- `.github/workflows/ci.yml`: checks for pushes and pull requests.
- `vercel.json`: build configuration and security headers.

All illustrations and fonts render locally. No analytics, external fonts, tracking scripts, or paid services are included. Browser storage errors fall back to in-memory saves with a visible explanation.

## Release and recovery

Keep commits focused and never force-push `main`. To undo a bad release, revert the offending commit through a new reviewed change; Vercel then redeploys the corrected `main`. For immediate restoration, use Vercel's rollback to a known working deployment and subsequently reconcile the code in GitHub.

Before release, verify discovery/filtering, save and unsave, persistence after reload, empty results, keyboard dialog close, and the layout on a narrow screen. Automated checks do not replace these interaction checks. Enable a GitHub rule requiring the `quality` check before merging when branch protection is configured; merely adding the workflow does not enforce branch protection or block Vercel deployments.

## Android app

The same interface is packaged as a Capacitor Android app. See [Android setup and APK downloads](docs/ANDROID.md) for installation, local development, and release limitations. The **Android APK** GitHub workflow produces a downloadable test APK for each branch.
