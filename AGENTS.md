# Working on Railjoy

- Keep the stack small: React, TypeScript, Vite; deployment through the existing GitHub → Vercel integration.
- Treat the initial rail-trip concept and demo data as provisional until the user supplies a product brief.
- Use `codex/` feature branches and a pull request for subsequent changes. Do not force-push `main`.
- Run `pnpm check` and verify relevant browser interactions before requesting review.
- Include the preview URL, concrete behavior changes, and validation in the final update.
- No extra service, backend, analytics, or authentication provider unless the requested feature needs it.
- Never commit tokens, `.env` values, `.vercel`, generated `dist`, or `node_modules`.
- Never describe sample routes as live results or add a booking button without a functioning booking flow.
- Saved journeys currently belong to this browser only. Preserve honest empty/error states and accessible keyboard behavior.
