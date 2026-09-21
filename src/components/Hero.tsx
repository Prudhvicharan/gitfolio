import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Code,
  Eye,
  FileText,
  GitBranch,
  LockKeyhole,
  Palette,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
interface Props {
  onStart: () => void;
  onDemo?: () => void;
}
export default function Hero({ onStart, onDemo }: Props) {
  const landingRef = useRef<HTMLDivElement>(null);
  const [sampleStyle, setSampleStyle] = useState<'balanced' | 'minimal'>(
    'balanced'
  );
  useEffect(() => {
    const root = landingRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(
        '.proof-strip, .landing-section, .how-card, .privacy-item, .closing-cta'
      )
    );
    root.classList.add('motion-ready');
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    items.forEach((item, index) => {
      item.classList.add('reveal-item');
      item.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const root = landingRef.current;
    if (
      !root ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    )
      return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${event.clientX}px`);
        root.style.setProperty('--pointer-y', `${event.clientY}px`);
        root.style.setProperty(
          '--pointer-rotate-y',
          `${(event.clientX / window.innerWidth - 0.5) * 2.5}deg`
        );
        root.style.setProperty(
          '--pointer-rotate-x',
          `${(event.clientY / window.innerHeight - 0.5) * -2}deg`
        );
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
    };
  }, []);
  return (
    <div className="landing" ref={landingRef}>
      <div className="landing-light" aria-hidden="true" />
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
          <a href="#whats-new">What’s new</a>
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
                Explore a demo <Eye size={17} />
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
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit-ring orbit-ring-one" />
              <span className="orbit-ring orbit-ring-two" />
              <span className="orbit-node orbit-node-one" />
              <span className="orbit-node orbit-node-two" />
              <span className="orbit-node orbit-node-three" />
            </div>
            <div className="floating-signal signal-import" aria-hidden="true">
              <GitBranch size={13} /> Public work
            </div>
            <div className="floating-signal signal-compose" aria-hidden="true">
              <WandSparkles size={13} /> Story composed
            </div>
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
                <span className="demo-file">alex / README.md</span>
                <span className="demo-live"><i /> LIVE</span>
              </div>
              <div className="demo-content" key={sampleStyle}>
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
        <div className="signal-rail" aria-hidden="true">
          <div className="signal-track">
            {[0, 1].map((copy) => (
              <div className="signal-sequence" key={copy}>
                <span><GitBranch size={13} /> PUBLIC REPOSITORIES</span><i>→</i>
                <span><WandSparkles size={13} /> AI NARRATIVE</span><i>→</i>
                <span><Palette size={13} /> VISUAL DIRECTION</span><i>→</i>
                <span><FileText size={13} /> README.MD</span><b>✦</b>
              </div>
            ))}
          </div>
        </div>
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
              <div className="how-graphic how-graphic-import" aria-hidden="true">
                <span /><span /><span />
              </div>
              <span className="how-number">01 / IMPORT</span>
              <h3>Bring your work.</h3>
              <p>
                Enter your GitHub username. Pick the public repositories that
                best represent you, including forks you want to highlight.
              </p>
            </article>
            <article className="how-card">
              <div className="how-graphic how-graphic-style" aria-hidden="true">
                <span /><span /><span />
              </div>
              <span className="how-number">02 / CUSTOMIZE</span>
              <h3>Find your expression.</h3>
              <p>
                Go Minimal, Balanced, or Animated. Choose your sections, eight
                stats palettes, and four accurate header shapes.
              </p>
            </article>
            <article className="how-card">
              <div className="how-graphic how-graphic-export" aria-hidden="true">
                <span /><span /><i />
              </div>
              <span className="how-number">03 / MAKE IT YOURS</span>
              <h3>Review. Export. Introduce yourself.</h3>
              <p>
                Write your bio or ask AI for a draft. Review every claim, then
                copy your Markdown and follow the publishing checklist.
              </p>
            </article>
          </div>
        </section>
        <section className="landing-section direction-showcase" aria-labelledby="directions-title">
          <div className="direction-copy">
            <span className="eyebrow">ONE STORY · THREE SIGNATURES</span>
            <h2 id="directions-title">Taste you can see before you publish.</h2>
            <p className="section-subtitle">
              Every direction reshapes the same work with a distinct rhythm,
              hierarchy, and first impression.
            </p>
          </div>
          <div className="direction-stage" aria-label="Editorial, Studio, and Aurora README previews">
            <article className="direction-sheet direction-editorial">
              <span className="sheet-kicker">EDITORIAL</span>
              <strong>Alex Morgan</strong>
              <p>Product engineer building calm tools.</p>
              <div className="sheet-rule" />
              <small>SELECTED WORK · 04</small>
            </article>
            <article className="direction-sheet direction-studio">
              <span className="sheet-kicker">STUDIO</span>
              <strong>Alex Morgan</strong>
              <p>Ideas shaped into useful products.</p>
              <div className="sheet-metrics"><i>12</i><i>48</i><i>06</i></div>
              <small>DESIGN · CODE · SYSTEMS</small>
            </article>
            <article className="direction-sheet direction-aurora">
              <span className="sheet-kicker">AURORA</span>
              <strong>Alex Morgan</strong>
              <p>Building what should exist next.</p>
              <div className="sheet-wave" />
              <small>MOTION · STORY · SIGNAL</small>
            </article>
          </div>
        </section>
        <section
          className="landing-section whats-new-section"
          id="whats-new"
          aria-labelledby="whats-new-title"
        >
          <div className="whats-new-heading">
            <div>
              <span className="eyebrow">WHAT’S NEW · SEPTEMBER 2026</span>
              <h2 id="whats-new-title">A sharper path from repositories to story.</h2>
            </div>
            <span className="release-badge">MAJOR BUILDER UPDATE</span>
          </div>
          <div className="release-grid">
            {[
              ['Smarter project selection', 'Recommendations favor described, recent, original work while keeping every repository searchable.'],
              ['Three visual directions', 'Editorial, Studio, and Aurora turn the same evidence into distinctly different profiles.'],
              ['AI or manual writing', 'Generate from public repository evidence, then review every field—or write the complete story yourself.'],
              ['Keys stay unsaved', 'Gemini credentials remain in memory and are never written into browser drafts.'],
              ['Export confidence', 'Readiness checks catch empty content, weak project metadata, invalid links, widgets, and escaping artifacts.'],
              ['Guided publishing', 'Clear GitHub instructions and downloadable workflows cover profile setup, snake, and 3D contributions.'],
            ].map(([title, description]) => (
              <article className="release-item" key={title}>
                <Check size={16} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
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
          <a href="#whats-new">What’s new</a>
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
