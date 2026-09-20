import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    label: 'Radical',
    colors: ['#fe428e', '#141321', '#a9fef7'],
  },
  {
    id: 'tokyonight',
    label: 'Tokyo Night',
    colors: ['#70a5fd', '#1a1b27', '#bf91f3'],
  },
  {
    id: 'dracula',
    label: 'Dracula',
    colors: ['#ff79c6', '#282a36', '#bd93f9'],
  },
  {
    id: 'github_dark',
    label: 'GitHub Dark',
    colors: ['#58a6ff', '#0d1117', '#1f6feb'],
  },
  {
    id: 'onedark',
    label: 'One Dark',
    colors: ['#e5c07b', '#282c34', '#61afef'],
  },
  { id: 'nord', label: 'Nord', colors: ['#81a1c1', '#2e3440', '#88c0d0'] },
  {
    id: 'catppuccin_mocha',
    label: 'Catppuccin',
    colors: ['#cba6f7', '#1e1e2e', '#89b4fa'],
  },
];

const HEADER_STYLES: { id: HeaderStyle; label: string; desc: string }[] = [
  { id: 'wave', label: 'Wave', desc: 'Smooth flowing wave banner' },
  { id: 'venom', label: 'Venom', desc: 'Jagged, dramatic edge' },
  { id: 'slice', label: 'Slice', desc: 'Clean diagonal cut' },
  { id: 'cylinder', label: 'Cylinder', desc: 'Rounded cylindrical pill' },
  { id: 'shark', label: 'Shark', desc: 'Shark-fin spike' },
];

const HEADER_COLORS = [
  { value: '#6366F1', label: 'Indigo' },
  { value: '0:3F3FFF,100:8B21F8', label: 'Violet Grad' },
  { value: '0:22D3EE,100:6366F1', label: 'Cyan Blue' },
  { value: '0:F59E0B,100:EF4444', label: 'Sunset' },
  { value: 'gradient', label: 'Random gradient' },
  { value: '#0D1117', label: 'Dark' },
];

interface Props {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
  availableRepos: GithubRepo[];
  warning: string | null;
  onNext: () => void;
  onBack: () => void;
}
export default function Step2({
  config,
  onChange,
  availableRepos,
  warning,
  onNext,
  onBack,
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
        <p>Start with a preset, then choose your projects and sections.</p>
      </div>
      <fieldset>
        <legend>Start with a preset</legend>
        <div className="preset-grid">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((name) => (
            <button
              key={name}
              className="choice"
              aria-pressed={
                JSON.stringify(config.sections) ===
                JSON.stringify(PRESETS[name])
              }
              onClick={() =>
                onChange({
                  sections: { ...PRESETS[name] },
                  disabledWidgetUrls: [],
                })
              }
            >
              <strong>{name[0].toUpperCase() + name.slice(1)}</strong>
              <span>
                {
                  {
                    minimal: 'Just the essentials',
                    balanced: 'A clear, complete story',
                    animated: 'Motion and live stats',
                  }[name]
                }
              </span>
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
          Choose up to 8. Only these repositories inform your AI draft and
          project list.
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
                  disabled={!selected.has(repo.id) && selected.size >= 8}
                  onChange={(e) =>
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
        <legend>Sections</legend>
        <div className="section-options">
          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <label className="check-option" key={key}>
              <input
                type="checkbox"
                checked={config.sections[key as keyof SectionToggles]}
                onChange={(e) =>
                  setSection(key as keyof SectionToggles, e.target.checked)
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {(config.sections.header ||
        config.sections.stats ||
        config.sections.streak ||
        config.sections.languages) && (
        <details className="disclosure" open>
          <summary>Colors & header style</summary>
          <div className="form-stack">
            <fieldset>
              <legend>Stats theme</legend>
              <div className="theme-options">
                {THEMES.map((t) => (
                  <button
                    className="theme-choice"
                    key={t.id}
                    aria-pressed={config.theme === t.id}
                    onClick={() => onChange({ theme: t.id })}
                  >
                    <span
                      className="swatch"
                      style={{ background: t.colors[0] }}
                    />
                    {t.label}
                    {config.theme === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </fieldset>
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
        Stats, icons, banners, and animations load from third-party services.
        Availability can vary. Minimal uses text only.
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
