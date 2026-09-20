# GitFolio

A free, browser-based GitHub profile README builder. Import public repositories,
choose a style, review your content, and export Markdown. Optional Gemini assistance
creates a draft for your approval; no GitFolio account is required.

**Live site:** https://gitfolio-eight.vercel.app/

## What it does

- Imports up to 500 recently updated public repositories and discloses partial data.
- Lets you select up to 8 projects, including forks.
- Offers Minimal, Balanced, and Animated presets, 7 stats themes, and 5 header shapes.
- Supports editable biographies, skills, personal notes, social links, and explicit
  opt-in “Open to work” status. It does not invent achievement badges or default skills.
- Previews sanitized Markdown with clear widget failures and removal controls.
- Copies or downloads `README.md`, with a GitHub publishing checklist.
- Supplies an optional `snake.yml` workflow; the snake is exported only after setup.
- Saves drafts on the current device only when you opt in. API keys are never saved.

## Privacy and optional AI

The builder calls GitHub directly for public data. If you choose **Enhance with AI**,
it sends your entered key, name, bio, focus, and selected repository metadata directly
to Google. The key stays in tab memory and is cleared when you leave the Review step;
it is not sent to a GitFolio application server. Legacy stored keys are deleted when
the builder opens. Draft storage includes profile content and any contact links you
enter, never API keys. Turn draft saving off or reset the builder to delete it.

Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey). The current
integration uses `gemini-2.5-flash`; Google project access, quotas, billing, and
[data-use terms](https://ai.google.dev/gemini-api/docs/pricing) apply. There is no fixed
free-request guarantee. AI output remains a draft until you review and apply it.

Optional widgets make requests to their image providers. The default Balanced preset
uses text only; enable external widgets deliberately. Availability is not guaranteed.
GitFolio adds no analytics or advertising trackers. Hosting providers may retain
standard request logs.

## Local development

Requires Node **22.18+** (or a newer supported release).

```sh
npm ci
npm run dev
```

## Checks and production preview

```sh
npm test
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

`build` compiles TypeScript, builds the client and a temporary server-render bundle,
then prerenders the landing page into `dist/index.html`. Hosting serves only `dist`;
there is no runtime application server. Fonts are self-hosted with licenses in
`public/fonts`. The wizard, Markdown renderer, and AI SDK load on demand.

The Node test suite covers generation accuracy, escaping/sanitization, draft
validation, repository pagination, partial errors, and snake configuration. See
[OVERHAUL.md](./OVERHAUL.md) for audit mapping and [REVIEW.md](./REVIEW.md) for branch
review and browser verification instructions.

## Deployment

Deploy the `dist` directory with `npm run build`. `vercel.json` supplies CSP,
anti-framing, MIME, referrer, and permissions headers. The local production preview
uses the same headers. If you change the public domain, update the canonical and
social URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.

## Known boundaries

- Public data only; GitHub rate limits apply. A failed repository import is disclosed.
- AI access must be verified with your own Google project. Never put a shared key in
  source code, build-time environment variables exposed to the browser, or a draft.
- GitHub and browser Markdown layouts may differ. Always check the published profile.
- Snake setup requires enabling GitHub Actions in your profile repository and reviewing
  its third-party actions/write permissions. GitFolio does not modify your account.
- Automated accessibility scans complement, but do not replace, assistive-technology
  and real-device testing.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, Google GenAI, react-markdown, remark-gfm,
rehype-raw, rehype-sanitize, and Lucide icons.

Issues and contributions: https://github.com/Prudhvicharan/gitfolio/issues
