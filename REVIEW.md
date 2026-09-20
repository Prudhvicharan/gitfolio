# Reviewing `site-overhaul`

All work is on a feature branch. Nothing has been merged, pushed, or deployed.
The full finding-by-finding change log is in [OVERHAUL.md](./OVERHAUL.md).

## Run the release candidate

Use Node 22.18+:

```sh
git switch site-overhaul
npm ci
npm test
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

Open http://127.0.0.1:4173/. Use the production preview to verify prerendering and
security headers; the development server intentionally serves the interactive dev app.

## Review checklist

1. **Landing:** review the headline, example styles, AI prerequisite, FAQ, and privacy
   disclosure. Inspect the [desktop screenshot](./docs/review/home-desktop.png) and
   [mobile screenshot](./docs/review/home-mobile.png).
2. **Demo:** explore the fictional sample without an account. Confirm it is clearly
   labeled, starts with a complete fictional profile, and offers only safe visual
   exploration. Credentials, repository editing, Markdown, copy/download, saving,
   widget checks, publishing, and snake setup must not be available. Switch presets
   and verify Editorial, Studio, and Aurora change the actual README composition.
   Use **Exit demo** or **Build with my GitHub** to return to profile import.
3. **Real profile:** import your username, choose repositories (including forks if
   desired), and inspect the sample-size and partial-error messages.
4. **Content review:** choose either AI creation or guided manual writing. Confirm the
   selected path reveals only the controls it needs, every edited field updates the
   preview immediately, and notes/animation enable their destination automatically.
   Approve the content once before export.
5. **AI (credential-dependent):** enter your own key directly in the app, consent to
   sending metadata to Google, and request a complete draft. Verify every generated
   field is plausible, approve it, then leave and return to Review: the key field should be empty.
   Do not paste keys into chat, source, or test fixtures. Google quotas/billing apply.
6. **Export:** copy and download the README; inspect both raw Markdown and the visual
   preview. For image-based presets, use **Check widgets** to test loading and remove unavailable images. Follow the publishing checklist in a profile repository only when ready.
   Back up existing content before replacing it.
   Engineering footprint and language mix must render even with network image requests
   blocked; only explicitly labeled Live Widgets may depend on remote services.
7. **Snake:** optionally download `snake.yml`, save it at
   `.github/workflows/snake.yml`, commit it to `main`, allow read/write workflow
   permissions, run **GitHub Snake Game**, and verify both SVGs in the `output` branch.
   Only then confirm the setup and enable the image.
8. **Drafts and refresh:** reload Profile, Style, and Review and verify the same step
   and current-tab progress return. Enable long-term saving to continue after closing
   the browser. Reset-all requires confirmation and clears both saved copies.
9. **Mobile and keyboard:** use the sticky Edit/Preview controls; Tab through every
   control, try the skip link, inspect focus visibility, and test 200% zoom. Screenshots:
   [builder desktop](./docs/review/builder-desktop.png),
   [preview mobile](./docs/review/preview-mobile.png).
10. **Staging before merge:** verify response security headers, social preview image,
    canonical URL, and a published README's rendering on GitHub. No staging deployment
    was made by this implementation task.

## Repeat browser QA without changing app dependencies

The optional browser scripts use temporary packages outside the repository:

```sh
npm install --prefix /tmp/gitfolio-qa playwright @axe-core/playwright lighthouse
node /tmp/gitfolio-qa/node_modules/playwright/cli.js install chromium
node scripts/qa/check.mjs
node scripts/qa/flows.mjs
node scripts/qa/edges.mjs
node scripts/qa/live.mjs
node scripts/qa/performance.mjs
```

The production preview must be running. `flows` and `edges` intercept API requests
with fixtures; they do not need credentials. `live` performs a read-only import of
`Prudhvicharan` using GitHub's public API. Run performance measurements alone, not
concurrently with other browser suites. Set `GITFOLIO_QA_ROOT`, `GITFOLIO_QA_URL`, or
`GITFOLIO_QA_OUTPUT` to customize package, site, and artifact locations. Default
artifacts go to `/tmp/gitfolio-qa/artifacts`.

## Verified results

- Production build, TypeScript, lint, and 18 regression tests pass.
- 15 end-to-end flows and 14 failure-path/keyboard/layout checks pass in Chromium.
- Automated WCAG A/AA checks pass for the homepage at 320/375/768/1024/1440px, and
  for the profile/style/review/mobile-preview flows tested; no horizontal overflow.
- Happy-path browser checks report no runtime errors.
- Real GitHub import succeeded: 28 public repositories for `Prudhvicharan`.
- Initial JavaScript decreased from approximately 276 KB to 66 KB gzip; the wizard,
  Markdown renderer, and Gemini SDK are separate lazy chunks.
- Final Lighthouse and dependency-audit results are recorded in OVERHAUL.md and
  `docs/review/qa-summary.json`.

## Decisions made within the audit scope

- Preserved React/TypeScript/Vite, existing brand colors/typefaces, core headline,
  and public path. Builder steps use refresh-safe query URLs without a server rewrite.
- Defaulted to readable text instead of third-party images; Animated is opt-in.
- Replaced unverified trophy badges with explicitly labeled public profile facts.
- Kept credentials memory-only, with no “remember key” option.
- Bounded import at 500 recent public repositories and selection at 8; coverage is
  disclosed. Forks remain selectable.
- Kept AI to one disclosed model, with no automatic paid-model fallback.
- Added only the audit-recommended `rehype-sanitize` production dependency; removed
  unused packages and applied compatible security updates. QA tooling stays external.

## Remaining verification and limits

- A real Gemini request requires your Google project/key. Success/error/cancellation
  paths were tested with fixtures, not represented as a live AI success.
- Snake workflow execution and final GitHub rendering require a profile repository;
  no workflow was run or account content modified by this task.
- Automated scans and desktop/mobile emulation do not certify full WCAG conformance.
  Do a real-device Safari/Chrome and VoiceOver/NVDA pass before declaring conformance.
- Lighthouse numbers are local lab measurements, not field Core Web Vitals. Recheck
  the deployed build and security headers before promoting it.
- Optional image providers and Google model availability remain external dependencies.
- The latest demo presentation needs a short manual desktop/mobile visual pass; the
  in-app browser connection was unavailable for this final local review, and the
  existing screenshots predate this demo-only refinement.
- The deployed CSP must allow the current optional banner, typing, badge, skill-icon,
  and streak providers. A blocked provider appears unavailable even when its URL works
  outside GitFolio.
- Public work and profile metrics now use native Markdown/HTML and must render without
  any image service. Use the widget check only for optional banners, icons, and cards.

Beyond the original audit, consider adding the existing checks to CI, maintaining a
small dependency/model-availability review schedule, and collecting consent-based
completion feedback before adding more features. None requires changing the product
architecture now.
