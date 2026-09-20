# GitFolio audit implementation

Branch: `site-overhaul`. Preserve React/TypeScript/Vite, existing brand colors,
typography, and the public URL. Review in logical commits; do not deploy or merge.

## Must Fix
- [ ] A5: Remove unverified achievements, fallback skills, and assumed hireability.
- [ ] A17: Memory-only credentials, migration cleanup, accurate privacy disclosures.
- [ ] A18/A10: Sanitize Markdown, validate AI responses and URLs, preserve working output.
- [ ] A8: Profile-bound AI results, cancellation, authoritative section toggles.
- [ ] A6: Honest widget states, retry/removal, preserve image layout attributes.
- [ ] A7: Opt-in snake with complete downloadable workflow.
- [ ] A14/A15: Labels, control states, focus, announcements, contrast, reduced motion.

## Should Fix
- [ ] A1/A2: Realistic sample preview; disclose optional AI key before starting.
- [ ] A3/A4: Mobile Edit/Preview, step navigation, credential-free draft recovery.
- [ ] A9: Repository selection, pagination, sample labels, partial-failure recovery.
- [ ] A13: Lazy wizard, Markdown renderer, AI SDK; measure production bundles.
- [ ] A16: Metadata, social image, canonical, sitemap/robots, prerender landing.
- [ ] A17: Data-flow/privacy documentation, source and issue links.

## Nice to Have
- [ ] A12: Accurate action/model labels, clear reset/change-profile semantics.
- [ ] A15: Meaningful alt text, restrained motion, consistent icons.
- [ ] A19: Clean lint and focused regression tests.

## New Features
- [ ] Editable content review with explicit approval before applying AI.
- [ ] Repository picker.
- [ ] Minimal / Balanced / Animated presets.
- [ ] GitHub publishing checklist and snake workflow download.
- [ ] Widget readiness feedback.
- [ ] Credential-free demo.

## Verification and decisions
- Baseline build passes; baseline lint has seven errors.
- Earlier audit verified local production assets match the deployed assets.
- No live account or paid service required for implementation. Real Gemini calls
  require a user key and will not be fabricated as tested.
- Browser connection failed during the audit; retry and report actual coverage.
- Scores are not acceptance evidence: build, lint, regression tests, keyboard,
  responsive layout, security, and performance results will be recorded here.

## Change log
Implementation in progress.

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
