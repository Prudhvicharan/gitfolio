import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Code,
  FileText,
  LockKeyhole,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
interface Props {
  onStart: () => void;
  onDemo?: () => void;
}
export default function Hero({ onStart, onDemo }: Props) {
  const [sampleStyle, setSampleStyle] = useState<'balanced' | 'minimal'>(
    'balanced'
  );
  return (
    <div className="landing">
      <header className="site-nav">
        <a className="brand" href="#" aria-label="GitFolio home">
          <img
            className="brand-mark"
            src="/favicon.svg"
            width={34}
            height={34}
            alt=""
          />
          GitFolio
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy</a>
          <a
            className="nav-source"
            href="https://github.com/Prudhvicharan/gitfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source ↗
          </a>
        </nav>
      </header>
      <main className="landing-main" id="main-content" tabIndex={-1}>
        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <Code size={14} /> BUILT FOR YOUR NEXT CHAPTER
            </span>
            <h1 id="hero-title">
              Your GitHub Profile,
              <br />
              <span>Reimagined.</span>
            </h1>
            <p>
              Turn your repositories into a profile README that tells your
              story. Choose your projects, find your style, and make every word
              yours.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onStart}>
                Generate my profile <ArrowRight size={17} />
              </button>
              <button className="btn-secondary" onClick={onDemo}>
                Explore a demo <EyeIcon />
              </button>
            </div>
            <p className="hero-fine">
              <strong>Free builder. No GitFolio account.</strong>
              <br />
              Optional AI uses your own Gemini API key. Google’s limits and
              billing apply.
            </p>
          </div>
          <div className="hero-demo">
            <div className="demo-mode-row" aria-label="Sample README style">
              <button
                aria-pressed={sampleStyle === 'balanced'}
                onClick={() => setSampleStyle('balanced')}
              >
                Balanced
              </button>
              <button
                aria-pressed={sampleStyle === 'minimal'}
                onClick={() => setSampleStyle('minimal')}
              >
                Minimal
              </button>
            </div>
            <div className="demo-window">
              <div className="demo-toolbar">
                <span className="demo-dot" />
                <span className="demo-dot" />
                <span className="demo-dot" />
                <span>alex / README.md</span>
              </div>
              <div className="demo-content">
                <div className="demo-heading">
                  <div className="demo-avatar" aria-hidden="true">
                    am
                  </div>
                  <div>
                    <h2>Hi, I’m Alex Morgan.</h2>
                    <small>Building useful things, thoughtfully.</small>
                  </div>
                </div>
                <p>
                  I build accessible web experiences and tools that make
                  everyday development a little easier.
                </p>
                {sampleStyle === 'balanced' && (
                  <div className="demo-skills">
                    <span>TypeScript</span>
                    <span>React</span>
                    <span>Python</span>
                  </div>
                )}
                <h3 className="demo-section-title">Selected projects</h3>
                <div className="demo-project">
                  <strong>accessible-ui</strong>
                  <p>A collection of keyboard-friendly interface components.</p>
                  <small>
                    <span className="language-dot" /> TypeScript
                  </small>
                </div>
                {sampleStyle === 'balanced' && (
                  <div className="demo-project">
                    <strong>tiny-tools</strong>
                    <p>Small utilities for everyday development tasks.</p>
                    <small>
                      <span className="language-dot" /> Python
                    </small>
                  </div>
                )}
              </div>
            </div>
            <p className="demo-caption">
              ILLUSTRATIVE PREVIEW · FICTIONAL SAMPLE PROFILE
            </p>
          </div>
        </section>
        <div className="proof-strip">
          <div className="proof-item">
            <SlidersHorizontal size={20} />
            <div>
              <strong>Your profile, your choices</strong>
              <p>Curated projects. Editable content. Flexible styles.</p>
            </div>
          </div>
          <div className="proof-item">
            <LockKeyhole size={20} />
            <div>
              <strong>You control your data</strong>
              <p>No account. Optional local drafts. Keys stay unsaved.</p>
            </div>
          </div>
          <div className="proof-item">
            <FileText size={20} />
            <div>
              <strong>Plain Markdown. Yours to keep.</strong>
              <p>Copy or download. Publish directly on GitHub.</p>
            </div>
          </div>
        </div>
        <section
          className="landing-section"
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <span className="eyebrow">FROM REPOSITORIES TO README</span>
          <h2 id="how-title">A better introduction, in three steps.</h2>
          <p className="section-subtitle">
            Start with what you’ve built. Finish with a profile you’re proud to
            share.
          </p>
          <div className="how-grid">
            <article className="how-card">
              <span className="how-number">01 / IMPORT</span>
              <h3>Bring your work.</h3>
              <p>
                Enter your GitHub username. Pick the public repositories that
                best represent you, including forks you want to highlight.
              </p>
            </article>
            <article className="how-card">
              <span className="how-number">02 / CUSTOMIZE</span>
              <h3>Find your expression.</h3>
              <p>
                Go Minimal, Balanced, or Animated. Choose your sections, seven
                stats themes, and five header shapes.
              </p>
            </article>
            <article className="how-card">
              <span className="how-number">03 / MAKE IT YOURS</span>
              <h3>Review. Export. Introduce yourself.</h3>
              <p>
                Write your bio or ask AI for a draft. Review every claim, then
                copy your Markdown and follow the publishing checklist.
              </p>
            </article>
          </div>
        </section>
        <section
          className="landing-section privacy-section"
          id="privacy"
          aria-labelledby="privacy-title"
        >
          <div>
            <span className="eyebrow">CLEAR BY DESIGN</span>
            <h2 id="privacy-title">
              Your keys.
              <br />
              Your words.
              <br />
              Your call.
            </h2>
            <p className="section-subtitle">
              A useful profile shouldn’t require guessing what happens to your
              data.
            </p>
            <a
              className="text-button"
              href="https://github.com/Prudhvicharan/gitfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inspect the source <ArrowRight size={15} />
            </a>
          </div>
          <div className="privacy-list">
            <div className="privacy-item">
              <Check size={18} />
              <div>
                <strong>Direct connections, explained.</strong>
                <p>
                  Public profile data is fetched from GitHub. Only when you
                  request AI, your key and selected profile metadata go directly
                  to Google. They are not sent to a GitFolio application server.
                </p>
              </div>
            </div>
            <div className="privacy-item">
              <Check size={18} />
              <div>
                <strong>Your API key is never saved.</strong>
                <p>
                  It is held in this browser tab’s memory and cleared when you
                  leave the AI review step. Saved keys from earlier GitFolio
                  versions are removed when you open the builder.
                </p>
              </div>
            </div>
            <div className="privacy-item">
              <Check size={18} />
              <div>
                <strong>Draft saving is your choice.</strong>
                <p>
                  Opt in to save profile content and entered links on this
                  device. Turn saving off or reset the builder to delete that
                  saved copy. Drafts never contain API keys.
                </p>
              </div>
            </div>
            <div className="privacy-item">
              <Check size={18} />
              <div>
                <strong>External services stay visible.</strong>
                <p>
                  Optional widgets contact their image providers and may share
                  your username and request details. Google’s data-use terms
                  apply to AI requests. GitFolio adds no analytics or
                  advertising trackers; the hosting provider may keep standard
                  request logs.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="landing-section faq-section"
          id="faq"
          aria-labelledby="faq-title"
        >
          <span className="eyebrow">A FEW GOOD QUESTIONS</span>
          <h2 id="faq-title">Before you get started.</h2>
          <details className="disclosure">
            <summary>Can I use GitFolio without AI?</summary>
            <p>
              Yes. Import your GitHub profile, choose your projects, and edit
              your content yourself. Copy and download work without a Gemini
              key.
            </p>
          </details>
          <details className="disclosure">
            <summary>Is it free?</summary>
            <p>
              The GitFolio builder is free. Optional AI uses your Google
              project, whose quotas, billing, and data-use policies apply. Check{' '}
              <a
                href="https://ai.google.dev/gemini-api/docs/pricing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google’s current pricing ↗
              </a>{' '}
              before generating.
            </p>
          </details>
          <details className="disclosure">
            <summary>Will it change my GitHub account?</summary>
            <p>
              No. GitFolio reads public data and creates a Markdown file. It
              does not sign in to GitHub or write to your repositories. You
              review and publish the file yourself.
            </p>
          </details>
          <details className="disclosure">
            <summary>Why might a widget fail to load?</summary>
            <p>
              Stats and animation providers can be unavailable or rate-limited.
              Retry the widget or remove it from your README. A contribution
              snake needs a GitHub Actions workflow; the builder supplies the
              file and instructions.
            </p>
          </details>
          <details className="disclosure">
            <summary>How do I publish my profile README?</summary>
            <p>
              Create a public repository whose name matches your GitHub
              username, then add a README.md file at its root. The builder
              includes a step-by-step checklist and reminds you to back up
              existing content first.
            </p>
          </details>
        </section>
        <section className="closing-cta">
          <Sparkles
            size={22}
            aria-hidden="true"
            style={{ margin: '0 auto 16px', color: '#c4b5fd' }}
          />
          <h2>
            You’ve done the work.
            <br />
            Give it a good introduction.
          </h2>
          <p>Build a profile that feels like you.</p>
          <button className="btn-primary" onClick={onStart}>
            Generate my profile <ArrowRight size={17} />
          </button>
        </section>
      </main>
      <footer className="site-footer">
        <span>GitFolio · Made for developers.</span>
        <div>
          <a href="#privacy">Privacy & data</a>
          <a
            href="https://github.com/Prudhvicharan/gitfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source ↗
          </a>
          <a
            href="https://github.com/Prudhvicharan/gitfolio/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report an issue ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
function EyeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
