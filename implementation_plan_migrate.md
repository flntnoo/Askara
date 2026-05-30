# Next.js 16 Migration Implementation Plan for Askara

## 1. Goal

Migrate Askara from Next.js 15 to Next.js 16 with the smallest safe dependency change set.

This plan intentionally keeps the first migration focused on the framework boundary:

- `next`
- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`
- `eslint-config-next`
- ESLint script migration from `next lint` to `eslint .`
- Next.js 16 codemod
- Build, type, lint, and runtime fixes caused by those changes

Prisma 6 must remain in place for the initial migration. Prisma 7 is treated as a separate optional follow-up migration after Next.js 16 is already stable.

---

## 2. Current Project Assessment

| Area | Current State |
|---|---|
| Framework | Next.js 15.3.5, App Router |
| React | 18.3.1 |
| TypeScript | 5.8.3 |
| Styling | Tailwind CSS 4.1.12 + PostCSS |
| Database | PostgreSQL through Prisma 6.18.0 |
| Auth | next-auth 5.0.0-beta.31 with Prisma adapter |
| Package manager | pnpm |
| ESLint | ESLint 8.57.0 with `eslint-config-next` 15.3.5 |
| Lint script | `next lint` |
| Deployment | Ubuntu VPS, PM2 + Nginx |

Next.js 16 requires Node.js 20.9.0 or newer. The project is already on TypeScript 5.8.3, which satisfies the TypeScript 5.1.0 or newer requirement.

### Existing App Surface

| Feature | Notes |
|---|---|
| Solo card sessions | Client pages, API routes, Prisma services |
| Multiplayer rooms | Client pages, polling API routes, Prisma services |
| Favorites | Client pages, API routes, Prisma services |
| Deck browsing and detail pages | Local images through `next/image` |
| Google OAuth | Auth.js v5 and Prisma adapter |
| Anonymous users | Custom anonymous ID flow |
| Onboarding and settings | Client pages with Prisma-backed data |
| Analytics | API route and Prisma service |

### Already Low-Risk for Next.js 16

- No `middleware.ts`, so no middleware-to-proxy migration is expected.
- API dynamic route params already use the async `Promise<{ ... }>` pattern.
- No `next/legacy/image` usage is expected.
- No `images.domains` configuration is expected.
- No parallel routes are expected.
- No Server Actions are expected.
- No `serverRuntimeConfig` or `publicRuntimeConfig` usage is expected.
- No database schema change is required for the initial migration.

---

## 3. Phase 1 Scope: Minimal Next.js 16 Migration

### Included

| Package or Task | Current | Target / Action |
|---|---:|---|
| `next` | 15.3.5 | Upgrade to Next.js 16 |
| `react` | 18.3.1 | Upgrade to React version required by Next.js 16 |
| `react-dom` | 18.3.1 | Upgrade with React |
| `@types/react` | 18.3.23 | Upgrade with React |
| `@types/react-dom` | 18.3.7 | Upgrade with React DOM |
| `eslint-config-next` | 15.3.5 | Upgrade to match Next.js 16 |
| `lint` script | `next lint` | Change to `eslint .` |
| Next.js codemod | N/A | Run the official Next.js 16 codemod |
| Build/type/lint fixes | N/A | Fix only errors introduced by the minimal migration |

### Explicitly Excluded From Phase 1

- Do not upgrade `prisma` from 6 to 7.
- Do not upgrade `@prisma/client` from 6 to 7.
- Do not add `@prisma/adapter-pg`, `pg`, or Prisma 7 driver adapter code.
- Do not change `prisma/schema.prisma` generator settings.
- Do not create `prisma/prisma.config.ts`.
- Do not update all Radix, MUI, animation, form, carousel, chart, or other UI libraries at once.
- Do not refactor shadcn/ui components unless TypeScript or runtime failures require a narrow fix.
- Do not change database schema or migrations.
- Do not change auth behavior unless the Next.js 16 migration exposes a concrete failure.

### Dependency Strategy

Use one focused dependency update for the initial migration:

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

Keep the current Prisma dependencies unchanged:

```json
"@prisma/client": "6.18.0",
"prisma": "6.18.0"
```

Do not update unrelated UI libraries unless one of them blocks install, build, typecheck, lint, or a required acceptance test. If a UI library blocks the migration, update only that package and document why.

### ESLint Strategy

`next lint` is removed in newer Next.js versions, so the script must move to the ESLint CLI:

```diff
  "scripts": {
    "build": "next build",
    "dev": "next dev",
-   "lint": "next lint",
+   "lint": "eslint .",
    "cleanup:stale": "tsx prisma/cleanup-stale.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed"
  }
```

Start by keeping the existing ESLint setup as small as possible. If `eslint .` fails because the current `.eslintrc.json` format or ESLint version is incompatible with the upgraded Next config, then migrate ESLint config as the smallest necessary follow-up within Phase 1.

Only upgrade `eslint` itself if the upgraded `eslint-config-next` or `eslint .` requires it.

`next build` no longer runs linting automatically, so `pnpm lint` must be run as a separate verification step.

---

## 4. Files Expected to Change in Phase 1

| File | Expected Change |
|---|---|
| `package.json` | Update the focused dependency set, peer dependencies, and `lint` script |
| `pnpm-lock.yaml` | Lockfile refresh from the focused dependency update |
| `.eslintrc.json` or `eslint.config.mjs` | Only if required by `eslint .` after the package update |
| React/Next source files | Only narrow fixes for build, type, lint, or runtime errors |
| `next.config.mjs` | No planned change unless Next.js 16 reports a required config adjustment |

### Files Not Expected to Change in Phase 1

| File or Area | Reason |
|---|---|
| `prisma/schema.prisma` | Prisma remains on v6 |
| `src/lib/prisma.ts` | Prisma client initialization remains on the v6 pattern |
| `prisma/prisma.config.ts` | Not needed unless Prisma 7 is adopted later |
| `pnpm-workspace.yaml` | No new Prisma adapter packages in Phase 1 |
| Database migrations | No schema change in Phase 1 |
| Broad UI component library files | Avoid unrelated churn |

---

## 5. Phase 1 Implementation Steps

### Step 1: Pre-Flight Verification

Verify the current app before changing dependencies.

```bash
node --version
pnpm --version
npx tsc --noEmit
pnpm build
pnpm lint
pnpm prisma generate
```

Also verify the production VPS Node.js version before deployment:

```bash
node --version
```

The version must be Node.js 20.9.0 or newer for Next.js 16. If the installed Node.js version is older, upgrade Node on the VPS before deploying the branch.

Pass criteria:

- Current baseline is known.
- Existing failures, if any, are documented before migration work starts.
- VPS Node.js compatibility is confirmed before production deployment.

### Step 2: Create a Migration Branch

```bash
git checkout -b upgrade/nextjs-16-minimal
```

Pass criteria:

- The migration is isolated from `main`.
- No production deployment happens directly from an untested local branch.

### Step 3: Run the Next.js 16 Codemod

Run the official Next.js codemod for the Next.js 16 migration.

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

The `@canary` codemod is the documented Next.js upgrade path and can assist with framework migration tasks such as Turbopack config updates, `next lint` to ESLint CLI migration, middleware-to-proxy migration if middleware exists, and other Next.js 16 changes.

Review the codemod diff carefully. Keep only relevant changes. If the codemod proposes broad unrelated rewrites, split them out or discard them before continuing.

Pass criteria:

- Codemod changes are reviewed.
- Any generated changes are limited to the Next.js 16 migration.

### Step 4: Update Only Required Packages

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

Do not include Prisma or broad UI dependency updates in this step.

Update `peerDependencies` for React if the package still declares them:

```diff
  "peerDependencies": {
-   "react": "18.3.1",
-   "react-dom": "18.3.1"
+   "react": "^19.0.0",
+   "react-dom": "^19.0.0"
  }
```

Pass criteria:

- `package.json` and `pnpm-lock.yaml` show only the intended dependency movement.
- Prisma remains on `6.18.0`.
- Unrelated UI libraries remain pinned unless a concrete blocker is found.

### Step 5: Replace `next lint`

Update the lint script from `next lint` to `eslint .`.

```bash
pnpm lint
```

If lint fails because the ESLint config format is incompatible, migrate the ESLint config as narrowly as possible. Prefer the configuration recommended by the installed Next.js 16 `eslint-config-next` package.

Pass criteria:

- `pnpm lint` runs through the ESLint CLI.
- Any ESLint config migration is small and documented.

### Step 6: Verify Prisma 6 With Next.js 16

Keep Prisma at v6 and verify it still works with Next.js 16.

```bash
pnpm prisma generate
npx tsc --noEmit
pnpm build
```

Then run database-backed flows manually in the app:

- Auth session lookup
- Deck loading
- Solo session creation and completion
- Multiplayer room creation and updates
- Favorites add/remove

Pass criteria:

- `pnpm prisma generate` succeeds with Prisma 6.
- No Prisma runtime crash appears during required user flows.
- No Prisma 7 files or adapter packages are introduced.

### Step 7: Fix Build, Type, Lint, and Runtime Errors

Run verification repeatedly and fix only migration-related failures.

```bash
npx tsc --noEmit
pnpm build
pnpm lint
pnpm prisma generate
```

Expected possible fixes:

| Error Area | Fix Approach |
|---|---|
| React 19 type errors | Apply the smallest local type fix |
| `useRef()` without an initial value | Add `null` or `undefined`, depending on intended ref type |
| Next.js 16 config warnings | Adjust only the flagged config |
| ESLint CLI/config issues | Keep the config migration minimal |
| Peer dependency warnings | Update only the blocking package, if any |
| Prisma bundling/runtime issue | First verify whether config can solve it while staying on Prisma 6 |

Pass criteria:

- Fixes are connected to a failing command or acceptance test.
- No broad cleanup or dependency refresh is included.

### Step 8: Local Functional Smoke Test

Run the app locally and verify the critical flows listed in the acceptance criteria.

```bash
pnpm dev
```

If Turbopack causes a development-only issue, test a Webpack fallback:

```bash
pnpm dev -- --webpack
```

Only add a Webpack fallback to scripts if it is required and documented.

Pass criteria:

- The app starts.
- Critical pages render.
- Auth, API routes, images, solo sessions, multiplayer, and favorites work.

---

## 6. Optional Phase 2: Prisma 7 Migration

This phase is optional and must be done separately after the Next.js 16 migration has passed and shipped or has been stabilized on its own branch.

### Why Separate It

Prisma 7 is a major migration with its own breaking changes. Combining it with Next.js 16 makes failures harder to isolate:

- Next.js 16 may introduce React, bundling, lint, or runtime changes.
- Prisma 7 may introduce client generation, config, adapter, or deployment changes.
- Auth and API route failures become harder to attribute when both migrations happen together.

### Phase 2 Scope

Potential Prisma 7 tasks may include:

- Upgrade `prisma` from 6.x to 7.x.
- Upgrade `@prisma/client` from 6.x to 7.x.
- Add required driver adapter packages if Prisma 7 requires them for this app.
- Update Prisma client initialization.
- Update Prisma generator configuration if required.
- Add or update Prisma config files if required.
- Revalidate Auth.js Prisma adapter behavior.
- Revalidate production generation and deployment commands.

### Phase 2 Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Prisma client generation changes | Build or deploy failure | Test `pnpm prisma generate` locally and on VPS |
| Driver adapter runtime issues | API/auth failures | Smoke test all database-backed routes |
| Auth adapter incompatibility | Sign-in/session failures | Test Google OAuth and anonymous-to-auth flows |
| Deployment env/config changes | Production startup failure | Test with production-like env before release |
| Harder rollback if mixed with Next.js 16 | High | Keep Phase 2 on a separate branch and deploy separately |

### Phase 2 Checklist

- [ ] Create a separate branch, for example `upgrade/prisma-7`.
- [ ] Confirm the latest Prisma 7 migration requirements from official Prisma docs.
- [ ] Update only Prisma-related dependencies.
- [ ] Run `pnpm prisma generate`.
- [ ] Run `pnpm build`.
- [ ] Test all API routes that use Prisma.
- [ ] Test Google OAuth login/logout.
- [ ] Test anonymous user flows.
- [ ] Test solo sessions.
- [ ] Test multiplayer rooms.
- [ ] Test favorites.
- [ ] Deploy only after Phase 2 passes independently.

---

## 7. Deployment Plan for Phase 1

### Pre-Deployment Checklist

- [ ] `node --version` on the VPS reports Node.js 20.9.0 or newer.
- [ ] Branch has been tested locally.
- [ ] `npx tsc --noEmit` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm prisma generate` passes with Prisma 6.
- [ ] Critical manual flows pass locally.
- [ ] Database backup exists before production deployment.

### VPS Deployment Steps

```bash
ssh user@your-vps
cd /path/to/askara

node --version

pg_dump -U convo_user -d convo > ~/backups/convo_pre_nextjs16_$(date +%Y%m%d).sql

git fetch origin
git checkout upgrade/nextjs-16-minimal
git pull origin upgrade/nextjs-16-minimal

pnpm install --frozen-lockfile
pnpm prisma generate
npx tsc --noEmit
pnpm build
pm2 restart askara
pm2 logs askara --lines 50
```

No Prisma migration command is expected for Phase 1 because the database schema does not change.

Nginx changes are not expected. The reverse proxy should continue forwarding to the same app port.

---

## 8. Rollback Plan

Because Phase 1 avoids Prisma 7 and broad UI dependency updates, rollback should be mostly a code and dependency rollback.

### Development Rollback

If the migration branch becomes unstable:

```bash
git checkout main
pnpm install
pnpm prisma generate
```

If you need to keep the branch but revert the dependency experiment, restore only these files from the last known good commit:

- `package.json`
- `pnpm-lock.yaml`
- ESLint config file, if changed
- Any narrow source fixes made only for the migration

Then run:

```bash
pnpm install
pnpm prisma generate
pnpm build
```

### Production Rollback

```bash
pm2 stop askara

git checkout main
pnpm install --frozen-lockfile
pnpm prisma generate
pnpm build

pm2 restart askara
```

Database restore should not be necessary for Phase 1 because Prisma remains on v6 and no schema migration is planned. Use the database backup only if production data was changed by a separate incident.

### Rollback Triggers

- `pnpm build` cannot be fixed quickly.
- `pnpm prisma generate` fails with Prisma 6 and no small fix is available.
- Google OAuth or session handling breaks.
- API routes fail broadly.
- Solo session creation/completion breaks.
- Multiplayer room creation/join/play breaks.
- Favorites add/remove breaks.
- Image rendering breaks across key pages.

---

## 9. Acceptance Criteria

The Phase 1 migration is accepted only when all must-pass checks succeed with Prisma 6 still installed.

### Automated Checks

- [ ] `pnpm build` completes without errors.
- [ ] `npx tsc --noEmit` completes without errors.
- [ ] `pnpm lint` runs through `eslint .` and completes without blocking errors.
- [ ] `pnpm prisma generate` succeeds with Prisma 6.

### Manual Functional Checks

- [ ] Auth works: Google login, logout, and session persistence.
- [ ] API routes used by the app return expected responses.
- [ ] Images load correctly, especially local deck/card assets through `next/image`.
- [ ] Solo session works: create, play cards, favorite/skip/reveal as applicable, complete, view summary.
- [ ] Multiplayer works: create room, join room, start game, update shared state, complete or exit safely.
- [ ] Favorites work: add favorite, remove favorite, and verify persistence after refresh/sign-in state change.

### Non-Blocking Follow-Up Checks

- [ ] Lint warnings are reviewed and either fixed or documented.
- [ ] Dev server works without requiring a Webpack fallback.
- [ ] Table mode works.
- [ ] Onboarding works.
- [ ] Settings page works.
- [ ] Analytics still records expected events.

---

## 10. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| React 19 type errors | Medium | Medium | Fix only reported type/build errors |
| UI package peer warnings | Medium | Low to Medium | Do not mass-update; update only blockers |
| ESLint script/config migration issue | Medium | Low | Move to `eslint .`; migrate config only if required |
| Prisma 6 runtime issue under Next.js 16 | Low to Medium | High | Keep Prisma 6, test database-backed flows, isolate any fix |
| Turbopack dev/build issue | Low to Medium | Medium | Test Webpack fallback before changing scripts |
| VPS Node.js too old | Medium | High | Verify and upgrade Node before deployment |

---

## 11. Approval Checklist

- [ ] I approve keeping Prisma on 6.x during the initial Next.js 16 migration.
- [ ] I approve treating Prisma 7 as an optional separate Phase 2.
- [ ] I approve updating only the dependencies required for Next.js 16 first.
- [ ] I approve changing the lint script from `next lint` to `eslint .`.
- [ ] I approve running the Next.js 16 codemod and reviewing its diff.
- [ ] I approve fixing only build, type, lint, and runtime errors related to this migration.
- [ ] I approve using the simplified rollback plan based on reverting the focused dependency changes.

---

## Appendix: Phase 1 Change Inventory

### Expected Package Changes

| Package | Phase 1 Action |
|---|---|
| `next` | Upgrade to Next.js 16 |
| `react` | Upgrade to version required by Next.js 16 |
| `react-dom` | Upgrade with React |
| `@types/react` | Upgrade with React |
| `@types/react-dom` | Upgrade with React DOM |
| `eslint-config-next` | Upgrade to match Next.js 16 |
| `eslint` | Upgrade only if required by `eslint-config-next` or `eslint .` |

### Packages Intentionally Held

| Package | Phase 1 Action |
|---|---|
| `prisma` | Keep at 6.18.0 |
| `@prisma/client` | Keep at 6.18.0 |
| `@auth/prisma-adapter` | Keep unless a concrete compatibility failure appears |
| Radix UI packages | Keep unless a concrete blocker appears |
| MUI packages | Keep unless a concrete blocker appears |
| Animation/form/chart/carousel packages | Keep unless a concrete blocker appears |

### Files Expected to Be Created

None by default.

`eslint.config.mjs` may be created only if the ESLint CLI migration requires flat config.

### Files Expected to Be Removed

None by default.

`.eslintrc.json` may be removed only if replaced by a working `eslint.config.mjs`.
