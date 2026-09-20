import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, Pencil, RotateCcw } from 'lucide-react';
import type { GeneratorConfig, GithubRepo, AIContent } from '../types';
import { PRESETS, widgetSection } from '../utils/content';
import {
  clearDraft,
  clearPersistentDraft,
  clearLegacyKey,
  hasPersistentDraft,
  readDraft,
  writeDraft,
  writeSessionDraft,
} from '../utils/draft';
import { DEMO_USER, DEMO_REPOS } from '../utils/demo';
import { fetchProfile } from '../hooks/useGithub';
import { generateAIContent } from '../hooks/useGemini';
import { generateReadme } from '../utils/generateMarkdown';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { StepIndicator } from './StepIndicator';
import PreviewPanel from './PreviewPanel';
import PublishGuide from './PublishGuide';
const initialConfig = (): GeneratorConfig => ({
  theme: 'radical',
  headerStyle: 'wave',
  headerColor: '0:3F3FFF,100:8B21F8',
  socialLinks: {},
  sections: { ...PRESETS.balanced },
  aiContent: null,
  userData: null,
  repos: [],
  jobTitle: '',
  creativeSeed: 0.5,
  openToWork: false,
  snakeReady: false,
  disabledWidgetUrls: [],
  layout: 'studio',
});
interface Props {
  step: number;
  onStep: (step: number) => void;
  onHome: () => void;
  startDemo: boolean;
  active: boolean;
}
export default function Wizard({
  step,
  onStep,
  onHome,
  startDemo,
  active,
}: Props) {
  const [saved] = useState(readDraft);
  const [config, setConfig] = useState<GeneratorConfig>(() =>
    startDemo
      ? { ...initialConfig(), userData: DEMO_USER, repos: DEMO_REPOS }
      : (saved?.config ?? initialConfig())
  );
  const [repos, setRepos] = useState<GithubRepo[]>(() =>
    startDemo ? DEMO_REPOS : (saved?.availableRepos ?? [])
  );
  const [username, setUsername] = useState(() => config.userData?.login || '');
  const [save, setSave] = useState(() => hasPersistentDraft() && !startDemo);
  const [status, setStatus] = useState(
    saved && !startDemo ? 'Your progress was restored at this step.' : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [pending, setPending] = useState(false);
  const githubRequest = useRef<AbortController | null>(null);
  const aiRequest = useRef<AbortController | null>(null);
  const patch = (value: Partial<GeneratorConfig>) =>
    setConfig((previous) => ({ ...previous, ...value }));
  const cancelAI = () => {
    if (!aiRequest.current) return;
    aiRequest.current.abort();
    aiRequest.current = null;
    setGenerating(false);
    setStatus('AI generation cancelled. Existing content is unchanged.');
  };
  useEffect(() => {
    clearLegacyKey();
    return () => {
      githubRequest.current?.abort();
      aiRequest.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!config.userData) return;
    const draft = { config, availableRepos: repos };
    const savedNow = save ? writeDraft(draft) : writeSessionDraft(draft);
    if (!savedNow)
      setStatus('This browser could not save your progress. Download your README before leaving.');
  }, [config, repos, save]);
  useEffect(() => {
    if (active) document.getElementById('step-heading-' + step)?.focus();
  }, [step, active]);
  useEffect(() => {
    if (!active || step !== 3) aiRequest.current?.abort();
  }, [active, step]);
  useEffect(() => {
    if (!pending) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending]);
  const go = (next: number) => {
    if (pending && next !== 3) {
      setError('Apply or discard your content edits before leaving Review.');
      return;
    }
    cancelAI();
    setError(null);
    setMobileView('edit');
    onStep(next);
  };
  const importProfile = async () => {
    if (
      config.userData &&
      username.trim().replace(/^@/, '').toLowerCase() !==
        config.userData.login.toLowerCase() &&
      (config.aiContent || pending) &&
      !window.confirm(
        'Import a different profile? This replaces the current profile and reviewed content. Download your README first if you want to keep it.'
      )
    )
      return;
    githubRequest.current?.abort();
    cancelAI();
    const controller = new AbortController();
    githubRequest.current = controller;
    setLoading(true);
    setError(null);
    setWarning(null);
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const result = await fetchProfile(username, controller.signal);
      if (githubRequest.current !== controller) return;
      setRepos(result.repos);
      setConfig((previous) => {
        const same = previous.userData?.login === result.user.login;
        return {
          ...previous,
          userData: result.user,
          repos: same
            ? result.repos
                .filter((repo) =>
                  previous.repos.some((selected) => selected.id === repo.id)
                )
                .slice(0, 8)
            : result.repos.filter((repo) => !repo.fork).slice(0, 6),
          aiContent: same ? previous.aiContent : null,
          openToWork: same ? previous.openToWork : false,
          snakeReady: same ? previous.snakeReady : false,
          disabledWidgetUrls: same ? previous.disabledWidgetUrls : [],
          creativeSeed: same ? previous.creativeSeed : Math.random(),
        };
      });
      setPending(false);
      setWarning(result.warning);
      setStatus(
        `Imported @${result.user.login}. ${result.repos.length} public repositories available.`
      );
      onStep(2);
    } catch (e) {
      if (githubRequest.current === controller)
        setError(
          controller.signal.aborted
            ? 'Import stopped or timed out. Try again or use the demo.'
            : e instanceof Error
              ? e.message
              : 'GitHub is unavailable.'
        );
    } finally {
      clearTimeout(timeout);
      if (githubRequest.current === controller) {
        setLoading(false);
        githubRequest.current = null;
      }
    }
  };
  const demo = () => {
    if (
      config.userData &&
      config.userData.id !== 0 &&
      !window.confirm(
        'Open a sample profile? Unsaved session changes will be replaced. Your saved draft will be kept.'
      )
    )
      return;
    setSave(false);
    cancelAI();
    setConfig({ ...initialConfig(), userData: DEMO_USER, repos: DEMO_REPOS });
    setRepos(DEMO_REPOS);
    setUsername('gitfolio-demo');
    setWarning(null);
    setPending(false);
    setStatus('Exploring a fictional sample. No account or API key needed.');
    onStep(2);
  };
  const generate = async (key: string): Promise<AIContent | null> => {
    if (!config.userData) return null;
    cancelAI();
    const controller = new AbortController();
    aiRequest.current = controller;
    setGenerating(true);
    setError(null);
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const content = await generateAIContent(
        key,
        config.userData,
        config.repos,
        config.jobTitle,
        undefined,
        controller.signal
      );
      return aiRequest.current === controller && !controller.signal.aborted
        ? content
        : null;
    } catch (e) {
      if (aiRequest.current === controller)
        setError(
          controller.signal.aborted
            ? 'AI request timed out or was cancelled. Your content is unchanged.'
            : e instanceof Error
              ? e.message
              : 'Generation failed.'
        );
      return null;
    } finally {
      clearTimeout(timeout);
      if (aiRequest.current === controller) {
        aiRequest.current = null;
        setGenerating(false);
      }
    }
  };
  const reset = () => {
    if (
      !window.confirm(
        'Reset this profile and all settings, and delete its saved draft from this browser?'
      )
    )
      return;
    githubRequest.current?.abort();
    githubRequest.current = null;
    setLoading(false);
    cancelAI();
    clearDraft();
    setSave(false);
    setConfig(initialConfig());
    setRepos([]);
    setUsername('');
    setPending(false);
    setWarning(null);
    setError(null);
    setStatus('Profile and saved draft cleared.');
    onStep(1);
    setMobileView('edit');
  };
  const showPreview = () => {
    setMobileView('preview');
    requestAnimationFrame(() => {
      document
        .querySelector('.preview-card')
        ?.scrollIntoView({ block: 'start' });
      document
        .getElementById('preview-heading')
        ?.focus({ preventScroll: true });
    });
  };
  const publish = () => {
    setMobileView('preview');
    requestAnimationFrame(() => {
      document
        .getElementById('publish-guide')
        ?.scrollIntoView({ behavior: 'smooth' });
      document
        .getElementById('publish-heading')
        ?.focus({ preventScroll: true });
    });
  };
  const markdown = generateReadme(config);
  return (
    <div className="builder-shell">
      <header className="builder-header">
        <button
          className="brand"
          onClick={() => {
            if (pending) {
              setError(
                'Apply or discard your content edits before leaving Review.'
              );
              return;
            }
            cancelAI();
            onHome();
          }}
          aria-label="GitFolio home, keep current draft"
        >
          <img
            className="brand-mark"
            src="/favicon.svg"
            width={34}
            height={34}
            alt=""
          />{' '}
          GitFolio
        </button>
        <div className="header-actions">
          <button className="text-button" onClick={reset}>
            <RotateCcw size={15} /> Reset all
          </button>
          <a
            href="https://github.com/Prudhvicharan/gitfolio/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Feedback ↗
          </a>
        </div>
      </header>
      <main
        id={active ? 'main-content' : undefined}
        className="builder-main"
        tabIndex={-1}
      >
        <div className="builder-controls">
          <StepIndicator
            currentStep={step}
            hasProfile={!!config.userData}
            onStep={go}
          />
          <div className="mobile-tabs segmented" aria-label="Builder view">
            <button
              aria-pressed={mobileView === 'edit'}
              onClick={() => {
                setMobileView('edit');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              aria-pressed={mobileView === 'preview'}
              onClick={() => {
                setMobileView('preview');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <Eye size={16} /> Preview
            </button>
          </div>
        </div>
        <div className="builder-grid">
          <div
            className={`editor-panel ${mobileView === 'preview' ? 'mobile-hidden' : ''}`}
          >
            {error && (
              <div className="notice error" role="alert">
                {error}
              </div>
            )}
            <div hidden={step !== 1}>
              <Step1
                username={username}
                setUsername={setUsername}
                jobTitle={config.jobTitle}
                setJobTitle={(jobTitle) => patch({ jobTitle })}
                socialLinks={config.socialLinks}
                setSocialLinks={(socialLinks) => patch({ socialLinks })}
                loading={loading}
                error={null}
                onNext={importProfile}
                onDemo={demo}
                onCancel={() => {
                  githubRequest.current?.abort();
                }}
              />
            </div>
            {config.userData && (
              <>
                <div hidden={step !== 2}>
                  <Step2
                    config={config}
                    onChange={patch}
                    availableRepos={repos}
                    warning={warning}
                    onNext={() => go(3)}
                    onBack={() => go(1)}
                  />
                </div>
                <div hidden={step !== 3}>
                  <Step3
                    key={
                      config.userData.login +
                      config.repos.map((repo) => repo.id).join(',')
                    }
                    config={config}
                    onChange={patch}
                    onGenerate={generate}
                    generating={generating}
                    onCancel={cancelAI}
                    onBack={() => go(2)}
                    onFinish={showPreview}
                    active={active && step === 3}
                    onPending={setPending}
                  />
                </div>
              </>
            )}
            {!config.userData && step !== 1 && (
              <button className="btn-primary" onClick={() => onStep(1)}>
                <ArrowLeft size={16} /> Import a profile first
              </button>
            )}
            <div className="draft-settings">
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={save}
                  onChange={(e) => {
                    setSave(e.target.checked);
                    if (!e.target.checked) {
                      clearPersistentDraft();
                      setStatus(
                        'This tab still recovers after refresh. Long-term device saving is off.'
                      );
                    } else
                      setStatus(
                        'Draft saving is on for this browser. API keys are never saved.'
                      );
                  }}
                />
                <span>Keep this draft after I close the browser</span>
              </label>
              <p className="help">
                Refresh recovery is automatic in this tab. Turn this on to
                continue another day. API keys are never saved.
              </p>
              <p role="status" className="help">
                {status}
              </p>
            </div>
          </div>
          <div
            className={`preview-column ${mobileView === 'edit' ? 'mobile-hidden' : ''}`}
          >
            {pending && (
              <p className="notice warning">
                You have unapplied content edits. Apply or discard them in
                Review before exporting.
              </p>
            )}
            <PreviewPanel
              markdown={markdown}
              onRemoveWidget={(url) =>
                setConfig((previous) => ({
                  ...previous,
                  disabledWidgetUrls: [
                    ...(previous.disabledWidgetUrls || []),
                    url,
                  ],
                  sections: widgetSection(url)
                    ? { ...previous.sections, [widgetSection(url)!]: false }
                    : previous.sections,
                }))
              }
              onPublish={publish}
              demo={config.userData?.id === 0}
              pending={pending}
              hasProfile={!!config.userData}
            />
            {config.userData && (
              <PublishGuide config={config} onChange={patch} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
