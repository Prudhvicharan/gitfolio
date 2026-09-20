# GitFolio audit implementation

Branch: `site-overhaul`. Preserve React/TypeScript/Vite, existing brand colors,
typography, and the public URL. Review in logical commits; do not deploy or merge.

## Must Fix
- [x] A5: Remove unverified achievements, fallback skills, and assumed hireability.
- [x] A17: Memory-only credentials, migration cleanup, accurate privacy disclosures.
- [x] A18/A10: Sanitize Markdown, validate AI responses and URLs, preserve working output.
- [x] A8: Profile-bound AI results, cancellation, authoritative section toggles.
- [x] A6: Honest widget states, retry/removal, preserve image layout attributes.
- [x] A7: Opt-in snake with complete downloadable workflow.
- [x] A14/A15: Labels, control states, focus, announcements, contrast, reduced motion.

## Should Fix
- [x] A1/A2: Realistic sample preview; disclose optional AI key before starting.
- [x] A3/A4: Mobile Edit/Preview, step navigation, credential-free draft recovery.
- [x] A9: Repository selection, pagination, sample labels, partial-failure recovery.
- [x] A13: Lazy wizard, Markdown renderer, AI SDK; measure production bundles.
- [x] A16: Metadata, social image, canonical, sitemap/robots, prerender landing.
- [x] A17: Data-flow/privacy documentation, source and issue links.

## Nice to Have
- [x] A12: Accurate action/model labels, clear reset/change-profile semantics.
- [x] A15: Meaningful alt text, restrained motion, consistent icons.
- [x] A19: Clean lint and focused regression tests.

## New Features
- [x] Editable content review with explicit approval before applying AI.
- [x] Repository picker.
- [x] Minimal / Balanced / Animated presets.
- [x] GitHub publishing checklist and snake workflow download.
- [x] Widget readiness feedback.
- [x] Credential-free demo.

## Verification and decisions
- Baseline build passes; baseline lint has seven errors.
- Earlier audit verified local production assets match the deployed assets.
- No live account or paid service required for implementation. Real Gemini calls
  require a user key and will not be fabricated as tested.
- Browser connection failed during the audit; retry and report actual coverage.
- Scores are not acceptance evidence: build, lint, regression tests, keyboard,
  responsive layout, security, and performance results will be recorded here.

## Change log
Implementation completed in four logical commits; see REVIEW.md for the release checklist.

### Chunk 1 — trustworthy generation and data boundaries
- A5/A8/A9: Removed inferred achievements/availability and fallback skills; all-off
  exports are empty; star totals identify selected repositories. Added bounded
  pagination (500 public repositories), username validation, partial-error notices.
- A7: Added complete snake workflow generation; export requires explicit readiness.
- A10/A18: Plain-text escaping, safe URL normalization, AI runtime schema checks,
  explicit HTML allowlist sanitizer; arbitrary iframe/script/form content rejected.
- A11/A13: Single named AI model, structured response, abort support, lazy SDK,
  factual prompt with no minimum skills or speculative personal claims.
- A19: Native Node regression suite (9 tests); lint cleaned. Compatible npm security
  updates resolved all 12 reported advisories without a framework/major upgrade.
- Judgment: cap repository import at 500 and disclose incompleteness; preserve forks
  for explicit selection. No achievement badge is emitted without verified data.

### Chunk 2 — accessible editor and export workflow
- A2–4/A14–15: Three clearly named steps, semantic forms/toggles, mobile Edit/Preview,
  visible focus, higher-contrast design tokens, reduced motion, browser-history steps.
- A5/A10: Editable content review; apply/discard controls and export lock for pending
  edits. Explicit opt-in employment availability; drafts never auto-publish AI text.
- A8/A17: Profile-bound requests, cancellation/timeouts, memory-only key with clear
  control and data-transfer consent. Old stored credentials are removed, never read.
- A9/New: Up to eight user-selected repositories; no silent removal of reviewed bio
  when project selection changes. Repository coverage warning remains visible.
- A4/New: Opt-in versioned draft recovery; malformed drafts rejected and unknown fields
  dropped. Reset-all confirmation; home navigation retains the in-session draft.
- A6/A7/New: Sanitized lazy preview, honest retry/removal, retained image attributes,
  copy error fallback, download, publishing checklist, explicit snake readiness.
- A13: Wizard, Markdown preview, and AI SDK are separate asynchronous chunks.
- Judgment: Balanced defaults to readable content without external image requests;
  Animated remains available. No API key persistence option is offered.
- Verification: 11 regression tests, lint and production build pass. In-app browser
  bootstrap still fails before connection; isolated browser QA is being prepared.

### Chunk 3 — product presentation, performance, discoverability, trust
- A1/A2/New: Retained the core headline and brand palette/typefaces; added a realistic
  fictional README example, two sample styles, credential-free demo, and clear AI
  prerequisites. Added how-it-works, FAQ, privacy/data flow, and project/support links.
- A13/A15: Removed particle/shimmer motion and unused animation/icon/legacy-AI/Markdown
  packages. Self-hosted existing fonts with OFL licenses. All changed code formatted
  for maintainability; no additional production framework was introduced.
- A16: Descriptive metadata, canonical, Open Graph/Twitter tags, generated 1200×630
  sharing artwork, branded favicon, robots/sitemap, and React prerender/hydration.
- A18: Production CSP, no frames/objects, nosniff, no-referrer, and permissions headers;
  local production preview uses the same header configuration.
- A12/A17: README documentation now matches actual key/data behavior and quota limits.
- Integration polish: no spurious cancellation messages, safe demo replacement,
  same-profile refresh preserves reviewed text, widget removal disables its section
  and re-enabling restores it, all-off output has an accurate empty state.
- Browser evidence: desktop/mobile screenshots reviewed; no overflow at 320, 375,
  768, 1024, 1440px; automated WCAG A/AA scans pass on the landing, style, review,
  and mobile preview. Fifteen end-to-end flows pass with intercepted GitHub/Gemini
  responses and no real credentials. Final performance checks are in progress.

### Chunk 4 — verification, integration polish, and handoff
- A14/A15: Keyboard skip-link/step/export focus, a persistent mobile view switch,
  and matching visible/accessibility names. “Review & export” opens the export
  controls; the publishing guide remains a separate action.
- A6: Verified failed-widget retry, removal, re-enabling, and all-sections-off output.
  Added an explicit image-loading check with timeout and bulk removal; its copy
  distinguishes successful loading from content accuracy or GitHub compatibility.
- A10: Verified quota errors, malformed AI responses, cancellation, storage denial,
  and preservation of existing content. No real key was used in fixture tests.
- A7/A12: Corrected inherited custom-gradient URL syntax against Capsule Render's
  documentation; renamed the provider's random gradient option accurately.
- Added optional, repeatable browser/axe/Lighthouse scripts outside app dependencies,
  screenshots, QA summary, and a concrete branch review checklist in REVIEW.md.

## Final verification — 2026-09-20

- `npm test`: 13/13 passing; `npm run lint` and `npm run build`: passing.
- `npm audit`: 0 reported vulnerabilities, including development dependencies.
- Chromium: 15 happy-path end-to-end checks and 14 failure/keyboard/layout checks pass.
- axe: no tested WCAG A/AA violations; homepage widths 320/375/768/1024/1440 and
  profile/style/review/mobile-preview states checked. Screenshots visually reviewed.
- Real GitHub import: Prudhvicharan, 28 public repositories, successful.
- Local Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9s, TBT 0ms, CLS 0.
- Local Lighthouse desktop: all four categories 100; LCP 0.4s, TBT 0ms, CLS 0.
- Initial JS: ~276 KB → ~66 KB gzip (about 76% reduction). Wizard, preview, AI SDK
  remain separate lazy chunks. No >500 KB chunk warning.
- Remaining non-blocking Lighthouse opportunities: unused framework JS (~34 KiB),
  the CSS render-blocking request, and the font dependency chain. No extra complexity
  was added to chase a single lab point.

## Explicitly unverified / requires user environment

- Real Gemini generation needs the user's Google project/key. The user was offered
  local testing without sharing a key in chat. Fixture success/failure is not live AI.
- Publishing a README and running snake.yml were not performed; those change a user's
  GitHub repository. Generated workflow inputs were checked against upstream docs.
- Physical-device Safari/Chrome and VoiceOver/NVDA testing, and deployed Vercel header /
  social-preview verification remain release checks. Local lab scores are not field
  performance or full accessibility certification.
- No content assets or brand decisions remain required. No paid service was added.
- All changes are on site-overhaul; no merge, push, or deployment was performed.

## Chunk 5 — refresh recovery and AI-first content workflow

- Refresh-safe `?builder=profile|style|review` URLs restore the exact builder step.
  Current-tab recovery is automatic through session storage; optional device saving
  now means continuing after the browser closes.
- Removed the shuffle control because it changed only hidden animation parameters and
  did not help users build a better README.
- Review now begins with an explicit AI or manual choice. AI explains the key flow in
  three short steps and then reveals populated review fields. Manual mode provides all
  fields with concrete examples. Edits update the preview immediately and one approval
  action unlocks export.
- Added the previously missing tagline output, kept notes/project ideas in their own
  section, centered the typing animation, and added warnings when filled content is
  hidden by a disabled Style toggle.
- Removed the failing contribution image dependency. Profile metrics and the public
  work snapshot are native README markup, while the contribution snake remains a
  separate setup-based option because GitHub Actions must generate it.
- Verification: 14 regression tests, lint, TypeScript, client/SSR builds, and landing
  prerender pass. Live Gemini and deployed third-party image checks still require the
  user's environment.

## Chunk 6 — premium README system

- Replaced generic presets with three curated directions: Editorial, Studio, and
  Aurora. Each applies a coherent layout, palette, banner treatment, and section set.
- Grouped Style controls into Story, Identity, Proof, and optional Live Widgets.
  AI-generatable sections are labeled before the user reaches content creation.
- Rebuilt generated READMEs with a centered identity treatment, restrained social
  badges, native metric tiles, a reliable public-work snapshot, and a two-column
  selected-work presentation. Core content no longer depends on public widget uptime.
- Renamed provider themes and header options around visual intent, removed jagged
  novelty options from the UI, and retained optional live cards for users who want them.
- The raw Markdown editor now has a responsive viewport height, preserves source line
  width, scrolls in both directions, and remains vertically resizable.

## Chunk 7 — composition engine and reference-driven storytelling

- Audited the owner's profile README as the quality reference. Its strength comes from
  content depth and pacing: developer-as-code identity, categorized expertise, project
  narratives, current focus, working principles, personality, proof, and a strong close.
- Added a persisted layout identity. Editorial, Studio, and Aurora now produce different
  Markdown structures rather than sharing one template with renamed colors.
- Aurora adds a generated code-profile block, expressive section system, technology
  constellation, featured-build grid, and closing statement. Studio keeps the project
  grid and premium hierarchy without the code motif. Editorial produces a restrained,
  linear, text-first portfolio.
- Expanded AI and manual content with focus areas, working principles, and current goals.
  Older saved drafts migrate safely with empty values for the new fields.
- Fixed the preview CSP that was blocking Shields and the current GitHub Stats host;
  removed obsolete provider domains and added a regression test for the allowlist.

## Chunk 8 — zero-outage insights and richer projects

- Removed public GitHub Stats and language-card endpoints after their own project
  documented that the shared service is best-effort and rate-limit prone.
- Engineering footprint and language mix now render entirely from GitFolio's imported
  repository data. They use native tables, topic signals, and text-based distribution
  bars, so they work in Preview and on GitHub without a remote image request.
- Moved native insights into Proof and left only the contribution streak and snake in
  Live Widgets. The palette control appears only when the external streak is enabled.
- AI now writes a grounded one-sentence story for every selected repository plus a
  custom collaboration invitation. Manual mode exposes an editor for each project.
- Featured-build cards now include those narratives and repository topics instead of
  repeating generic “explore this repository” filler.
- Verification: 17 regression tests, lint, TypeScript, client/SSR builds, and prerender
  pass. CSP tests explicitly reject the removed unreliable statistics hosts.

## Chunk 9 — contribution snake handoff

- Replaced the downloaded workflow with a portable GitHub Snake Game workflow using
  `github.repository_owner`; it contains no username, email, token, or repository name.
- The workflow uses current major releases of checkout, Platane/snk, and
  peaceiris/actions-gh-pages. It creates light/dark SVGs plus the requested ocean GIF,
  publishes a clean `output` branch, runs daily, supports manual dispatch, and runs when
  first pushed to `main`.
- Added a five-step setup guide with the exact `.github/workflows/snake.yml` path,
  workflow permission setting, manual-run instructions, output-branch verification,
  and direct repository links.
- The README includes the snake only after the user confirms a successful workflow run
  and verifies both SVG files in the output branch.

## Chunk 10 — curated demo and builder refinement

- Turned demo mode into a clearly labeled, fictional showroom. It starts with a
  complete profile, four project narratives, and a selected Aurora composition.
- Removed misleading demo actions: no API-key UI, manual editing, repository changes,
  draft persistence, raw Markdown, copy/download, publishing guide, widget checks, or
  workflow setup. Layout, section, header, and palette controls remain interactive so
  visitors can safely compare the visual system.
- Added a dedicated read-only Review step that explains what is prefilled and routes
  directly to Style or real GitHub import. Demo links and failed-image controls are
  inert, and the header now says **Exit demo** instead of **Reset all**.
- Refined the builder with restrained ambient depth, a clearer active-step treatment,
  a focused section rail, stronger preview framing, and dedicated demo cards and
  notices. Existing typography and violet/cyan identity remain intact.
- Verification: 18 regression tests, lint, TypeScript, client/SSR builds, and landing
  prerender pass. The final demo-only visual pass remains a manual review item because
  the in-app browser connection was unavailable in this environment.
