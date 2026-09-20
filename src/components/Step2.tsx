import { ArrowLeft, ArrowRight, Check, Sparkles, WandSparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import type {
  GithubRepo,
  HeaderStyle,
  SectionToggles,
  ThemeId,
  GeneratorConfig,
} from '../types';
import { PRESETS, SECTION_LABELS, widgetSection } from '../utils/content';
const THEMES: { id: ThemeId; label: string; colors: string[] }[] = [
  {
    id: 'radical',
    label: 'Obsidian Rose',
    colors: ['#fe428e', '#141321', '#a9fef7'],
  },
  {
    id: 'tokyonight',
    label: 'Midnight Blue',
    colors: ['#70a5fd', '#1a1b27', '#bf91f3'],
  },
  {
    id: 'dracula',
    label: 'Plum Noir',
    colors: ['#ff79c6', '#282a36', '#bd93f9'],
  },
  {
    id: 'github_dark',
    label: 'Carbon Blue',
    colors: ['#58a6ff', '#0d1117', '#1f6feb'],
  },
  {
    id: 'onedark',
    label: 'Warm Graphite',
    colors: ['#e5c07b', '#282c34', '#61afef'],
  },
  { id: 'nord', label: 'Arctic', colors: ['#81a1c1', '#2e3440', '#88c0d0'] },
  {
    id: 'catppuccin_mocha',
    label: 'Mocha Violet',
    colors: ['#cba6f7', '#1e1e2e', '#89b4fa'],
  },
];

const HEADER_STYLES: { id: HeaderStyle; label: string; desc: string }[] = [
  { id: 'wave', label: 'Soft wave', desc: 'Smooth flowing banner' },
  { id: 'slice', label: 'Editorial cut', desc: 'Clean diagonal edge' },
  { id: 'cylinder', label: 'Soft frame', desc: 'Rounded premium frame' },
];

const HEADER_COLORS = [
  { value: '#312E81', label: 'Deep indigo' },
  { value: '0:312E81,100:7C3AED', label: 'Violet dusk' },
  { value: '0:0F766E,50:2563EB,100:7C3AED', label: 'Aurora' },
  { value: '0:9A3412,100:BE123C', label: 'Ember' },
  { value: '#0D1117', label: 'Obsidian' },
];
const STYLE_PRESETS = {
  minimal: {
    name: 'Editorial',
    eyebrow: 'Quiet confidence',
    description: 'Typography-led, focused, and fast. No decorative widgets.',
    theme: 'github_dark' as ThemeId,
    headerStyle: 'slice' as HeaderStyle,
    headerColor: '#0D1117',
    accent: ['#f8fafc', '#64748b'],
  },
  balanced: {
    name: 'Studio',
    eyebrow: 'Premium portfolio',
    description: 'A polished story with metrics, projects, and purposeful detail.',
    theme: 'catppuccin_mocha' as ThemeId,
    headerStyle: 'cylinder' as HeaderStyle,
    headerColor: '0:312E81,100:7C3AED',
    accent: ['#8b5cf6', '#c4b5fd'],
  },
  animated: {
    name: 'Aurora',
    eyebrow: 'Signature motion',
    description: 'A cinematic header, animated intro, skills, and rich project story.',
    theme: 'tokyonight' as ThemeId,
    headerStyle: 'wave' as HeaderStyle,
    headerColor: '0:0F766E,50:2563EB,100:7C3AED',
    accent: ['#22d3ee', '#8b5cf6'],
  },
};
const SECTION_GROUPS: {
  title: string;
  description: string;
  ai?: boolean;
  keys: (keyof SectionToggles)[];
}[] = [
  {
    title: 'Story',
    description: 'AI can draft these sections from your selected projects.',
    ai: true,
    keys: ['aboutCode', 'funFacts', 'typing'],
  },
  {
    title: 'Identity',
    description: 'Visual elements that establish a memorable first impression.',
    keys: ['header', 'socialBadges', 'skillIcons'],
  },
  {
    title: 'Proof',
    description: 'Show useful evidence without relying on a fragile activity image.',
    keys: ['trophies', 'stats', 'languages', 'activityGraph', 'topRepos'],
  },
  {
    title: 'Live widgets',
    description: 'Optional activity visuals. Workflow assets are generated in your repository.',
    keys: ['streak', 'contribution3d', 'snake'],
  },
];

interface Props {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
  availableRepos: GithubRepo[];
  warning: string | null;
  onNext: () => void;
  onBack: () => void;
  demo?: boolean;
}
export default function Step2({
  config,
  onChange,
  availableRepos,
  warning,
  onNext,
  onBack,
  demo = false,
}: Props) {
  const selected = new Set(config.repos.map((repo) => repo.id));
  const setSection = (key: keyof SectionToggles, value: boolean) =>
    onChange({
      sections: { ...config.sections, [key]: value },
      disabledWidgetUrls: value
        ? config.disabledWidgetUrls?.filter((url) => widgetSection(url) !== key)
        : config.disabledWidgetUrls,
    });
  return (
    <section className="step-content" aria-labelledby="step-heading-2">
      <div className="section-intro">
        <span className="eyebrow">02 / MAKE IT YOURS</span>
        <h1 id="step-heading-2" tabIndex={-1}>
          Your work. Your style.
        </h1>
        <p>Choose a complete visual direction, then shape the story it tells.</p>
      </div>
      {demo && (
        <div className="demo-banner" role="status">
          <Sparkles size={16} />
          <div>
            <strong>Curated demo</strong>
            <span>
              Sample content and repositories are locked. Explore layouts,
              sections, and colors, then import your GitHub profile to create
              yours.
            </span>
          </div>
        </div>
      )}
      <fieldset>
        <legend>Choose your visual direction</legend>
        <div className="signature-grid">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((name) => (
            <button
              key={name}
              className="signature-card"
              aria-pressed={
                config.layout ===
                {
                  minimal: 'editorial',
                  balanced: 'studio',
                  animated: 'aurora',
                }[name]
              }
              onClick={() => {
                const style = STYLE_PRESETS[name];
                onChange({
                  sections: { ...PRESETS[name] },
                  layout: {
                    minimal: 'editorial',
                    balanced: 'studio',
                    animated: 'aurora',
                  }[name] as GeneratorConfig['layout'],
                  theme: style.theme,
                  headerStyle: style.headerStyle,
                  headerColor: style.headerColor,
                  disabledWidgetUrls: [],
                });
              }}
            >
              <span
                className={`signature-preview signature-preview-${name}`}
                style={{ '--signature-accent': STYLE_PRESETS[name].accent[0], '--signature-accent-soft': STYLE_PRESETS[name].accent[1] } as CSSProperties}
                aria-hidden="true"
              >
                <span className="signature-preview-header" />
                <span className="signature-preview-title" />
                <span className="signature-preview-copy" />
                <span className="signature-preview-detail">
                  <i /><i /><i />
                </span>
              </span>
              <span className="signature-eyebrow">{STYLE_PRESETS[name].eyebrow}</span>
              <strong>{STYLE_PRESETS[name].name}</strong>
              <span>{STYLE_PRESETS[name].description}</span>
              <small>{name === 'animated' ? 'Motion + AI story' : name === 'balanced' ? 'Best all-round choice' : 'Zero external widgets'}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Featured repositories{' '}
          <span className="help">
            {config.repos.length} of {availableRepos.length} selected
          </span>
        </legend>
        <p className="help">
          Choose up to 8 for focused project stories. Every skill you review
          next remains visible, including technologies without an icon.
        </p>
        {warning && (
          <p className="notice warning" role="status">
            {warning} Use “Profile” to retry.
          </p>
        )}
        {availableRepos.length === 0 ? (
          <p className="quiet-note">
            No repository data available. You can still write your profile
            manually.
          </p>
        ) : (
          <div className="repo-list">
            {availableRepos.map((repo) => (
              <label key={repo.id} className="repo-option">
                <input
                  type="checkbox"
                  checked={selected.has(repo.id)}
                  disabled={
                    demo || (!selected.has(repo.id) && selected.size >= 8)
                  }
                  onChange={(e) =>
                    !demo &&
                    onChange({
                      repos: e.target.checked
                        ? [...config.repos, repo]
                        : config.repos.filter((item) => item.id !== repo.id),
                    })
                  }
                />
                <span>
                  <strong>{repo.name}</strong>
                  <small>
                    {repo.language || 'No primary language'} ·{' '}
                    {repo.stargazers_count} stars{repo.fork ? ' · Fork' : ''}
                  </small>
                  {repo.description && (
                    <span className="repo-description">{repo.description}</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
        <p className="help">
          Changing projects does not rewrite your bio. Review it before
          exporting.
        </p>
      </fieldset>
      <fieldset>
        <legend>Build your README</legend>
        <div className="section-groups">
          {SECTION_GROUPS.map((group) => (
            <section className="section-group" key={group.title}>
              <div className="section-group-heading">
                <div>
                  <strong>{group.title}</strong>
                  <p>{group.description}</p>
                </div>
                {group.ai && <span className="ai-capability"><WandSparkles size={13} /> AI generated</span>}
              </div>
              <div className="section-options">
                {group.keys.map((key) => (
                  <label className="check-option" key={key}>
                    <input
                      type="checkbox"
                      checked={config.sections[key]}
                      disabled={demo && (key === 'snake' || key === 'contribution3d')}
                      onChange={(event) =>
                        setSection(key, event.target.checked)
                      }
                    />
                    <span>
                      {SECTION_LABELS[key]}
                      {(key === 'snake' || key === 'contribution3d') && (
                        <small>
                          {demo
                            ? 'Available after importing your profile'
                            : 'Setup required'}
                        </small>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      </fieldset>
      {(config.sections.header || config.sections.streak) && (
        <details className="disclosure" open>
          <summary><Sparkles size={16} /> Refine the visual system <span>optional</span></summary>
          <div className="form-stack">
            {config.sections.streak && (
              <fieldset>
                <legend>Contribution card palette</legend>
                <div className="theme-options">
                  {THEMES.map((t) => (
                    <button
                      className="theme-choice"
                      key={t.id}
                      aria-pressed={config.theme === t.id}
                      onClick={() => onChange({ theme: t.id })}
                    >
                      <span className="swatch" style={{ background: t.colors[0] }} />
                      {t.label}
                      {config.theme === t.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {config.sections.header && (
              <>
                <fieldset>
                  <legend>Header shape</legend>
                  <div className="theme-options">
                    {HEADER_STYLES.map((h) => (
                      <button
                        key={h.id}
                        className="theme-choice"
                        aria-pressed={config.headerStyle === h.id}
                        onClick={() => onChange({ headerStyle: h.id })}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Banner color</legend>
                  <div className="theme-options">
                    {HEADER_COLORS.map((c) => (
                      <button
                        key={c.value}
                        className="theme-choice"
                        aria-pressed={config.headerColor === c.value}
                        onClick={() => onChange({ headerColor: c.value })}
                      >
                        {c.label}
                        {config.headerColor === c.value && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          </div>
        </details>
      )}
      <div className="quiet-note">
        Core story, facts, public-work summary, and projects always render as native
        GitHub Markdown. Only items under “Live widgets,” plus banners and icons,
        depend on external image services.
      </div>
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Profile
        </button>
        <button className="btn-primary" onClick={onNext}>
          Review content <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
