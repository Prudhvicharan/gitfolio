import { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, FilePenLine, LoaderCircle, Sparkles } from 'lucide-react';
import type { AIContent, GeneratorConfig } from '../types';
import { EMPTY_CONTENT, validateAIContent } from '../utils/content';
import { extractLanguages } from '../hooks/useGithub';
import { AI_MODEL } from '../hooks/useGemini';

interface Props {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
  onGenerate: (key: string) => Promise<AIContent | null>;
  generating: boolean;
  onCancel: () => void;
  onBack: () => void;
  onFinish: () => void;
  active: boolean;
  onPending: (pending: boolean) => void;
}

export default function Step3({ config, onChange, onGenerate, generating, onCancel, onBack, onFinish, active, onPending }: Props) {
  const fallback = { ...EMPTY_CONTENT, aboutMe: config.userData?.bio || '', skills: extractLanguages(config.repos) };
  const [draft, setDraft] = useState<AIContent>(() => config.aiContent ?? fallback);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [consent, setConsent] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual' | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [message, setMessage] = useState('');
  const [wasActive, setWasActive] = useState(active);

  if (wasActive !== active) {
    setWasActive(active);
    if (!active) {
      setApiKey('');
      setConsent(false);
    }
  }

  const update = (patch: Partial<AIContent>, section?: 'aboutCode' | 'funFacts' | 'typing' | 'skillIcons') => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onChange({
      aiContent: next,
      sections: section
        ? { ...config.sections, [section]: true }
        : config.sections,
    });
    setNeedsApproval(true);
    onPending(true);
    setMessage('Preview updated. Approve the content when it reads like you.');
  };

  const generate = async () => {
    setMessage('');
    const value = await onGenerate(apiKey);
    if (!value) return;
    setDraft(value);
    onChange({
      aiContent: value,
      sections: {
        ...config.sections,
        aboutCode: true,
        skillIcons: value.skills.length > 0 || config.sections.skillIcons,
        funFacts:
          value.funFacts.length > 0 || !!value.dreamProject || config.sections.funFacts,
        typing: value.typingLines.length > 0 || config.sections.typing,
      },
    });
    setNeedsApproval(true);
    onPending(true);
    setMessage('Your complete AI draft is in the preview. Fine-tune it or approve it.');
  };

  const approve = () => {
    try {
      const content = validateAIContent(draft);
      setDraft(content);
      onChange({ aiContent: content });
      setNeedsApproval(false);
      onPending(false);
      setMessage('Content approved. Your README is ready to review and export.');
    } catch {
      setMessage('Shorten the lists or entries before approving this content.');
    }
  };

  return (
    <section className="step-content" aria-labelledby="step-heading-3">
      <div className="section-intro">
        <span className="eyebrow">03 / CREATE YOUR STORY</span>
        <h1 id="step-heading-3" tabIndex={-1}>How do you want to create?</h1>
        <p>Choose one path. We will guide you through it, then show one final review.</p>
      </div>

      {!mode && <div className="creation-paths" role="group" aria-label="Choose how to create your content">
        <button className="creation-path" onClick={() => setMode('ai')}>
          <Sparkles size={22} />
          <strong>Let AI build it</strong>
          <span>Use your repositories to create a complete first draft in one step.</span>
          <small>Fastest · review before export</small>
        </button>
        <button className="creation-path" onClick={() => setMode('manual')}>
          <FilePenLine size={22} />
          <strong>Write it myself</strong>
          <span>Fill every section with examples and prompts to guide you.</span>
          <small>Full control · no API key</small>
        </button>
      </div>}

      {mode && <button className="text-button path-reset" onClick={() => setMode(null)}>← Choose a different method</button>}

      {mode === 'ai' && <section className="ai-workspace" aria-labelledby="ai-draft-heading">
        <div className="ai-workspace-heading">
          <Sparkles size={20} />
          <div>
            <h2 id="ai-draft-heading">Generate my README content</h2>
            <p>Open Google AI Studio, create a free Gemini key, paste it here, and generate. It usually takes less than a minute.</p>
          </div>
        </div>
        <div className="form-stack">
          <div className="field">
            <label htmlFor="gemini-key">Gemini API key</label>
            <div className="input-action">
              <input id="gemini-key" type={showKey ? 'text' : 'password'} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Paste your key to generate" autoComplete="off" spellCheck={false} />
              <button type="button" aria-label={showKey ? 'Hide API key' : 'Show API key'} onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <label className="check-option">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>Send my public profile and selected repository details to Google for this draft. The key stays in memory and is never saved.</span>
          </label>
          <div className="button-row">
            <button className="btn-primary" disabled={!apiKey.trim() || !consent || generating || config.userData?.id === 0} onClick={generate}>
              {generating ? <><LoaderCircle className="spin" size={17} /> Writing your README…</> : <><Sparkles size={17} /> Generate complete draft</>}
            </button>
            {generating && <button className="btn-secondary" onClick={onCancel}>Cancel</button>}
          </div>
          <p className="help">Uses {AI_MODEL}. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Get a Gemini API key ↗</a>{' · '}<a href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noopener noreferrer">Pricing & data use ↗</a></p>
          {config.userData?.id === 0 && <p className="help">Import your own profile to use AI. The sample remains editable by hand.</p>}
        </div>
      </section>}

      {(mode === 'manual' || (mode === 'ai' && needsApproval)) && <details className="disclosure content-editor" open>
        <summary>{mode === 'ai' ? 'Review the AI draft' : 'Build your story'} <span>{mode === 'ai' ? 'edit anything' : 'guided fields'}</span></summary>
        <div className="form-stack">
          <div className="editor-section-label"><span>01</span><div><strong>Your introduction</strong><p>The first thing visitors will read.</p></div></div>
          <div className="field"><label htmlFor="bio">About me <span>2–4 sentences</span></label><textarea id="bio" rows={5} maxLength={4000} placeholder="I build thoughtful web products that turn complex problems into clear, useful experiences…" value={draft.aboutMe} onChange={(event) => update({ aboutMe: event.target.value }, 'aboutCode')} /></div>
          <div className="field"><label htmlFor="tagline">Short tagline <span>shown below your name</span></label><input id="tagline" maxLength={300} placeholder="Building useful software with care" value={draft.tagline} onChange={(event) => update({ tagline: event.target.value }, 'aboutCode')} /></div>
          <div className="field"><label htmlFor="skills">Skills <span>comma separated</span></label><input id="skills" maxLength={1000} placeholder="TypeScript, React, Python, PostgreSQL" value={draft.skills.join(', ')} onChange={(event) => update({ skills: event.target.value.split(',').map((value) => value.trim()) }, 'skillIcons')} /></div>
          <div className="field"><label htmlFor="learning">Currently exploring <span>optional</span></label><input id="learning" maxLength={300} placeholder="Accessible design systems and applied AI" value={draft.currentlyLearning} onChange={(event) => update({ currentlyLearning: event.target.value }, 'aboutCode')} /></div>
          <label className="check-option"><input type="checkbox" checked={!!config.openToWork} onChange={(event) => onChange({ openToWork: event.target.checked })} /><span>Add “Open to work” to the About section</span></label>

          <details className="disclosure" open={mode === 'manual'}>
            <summary>Professional depth <span>turn a bio into a story</span></summary>
            <div className="form-stack">
              <div className="field"><label htmlFor="focus-areas">What I build <span>one focus area per line</span></label><textarea id="focus-areas" rows={3} maxLength={1200} placeholder={'Accessible product interfaces\nDeveloper tools and automation\nData-informed web applications'} value={draft.focusAreas.join('\n')} onChange={(event) => update({ focusAreas: event.target.value.split('\n') }, 'aboutCode')} /></div>
              <div className="field"><label htmlFor="working-style">How I work <span>one principle per line</span></label><textarea id="working-style" rows={3} maxLength={1200} placeholder={'Start with the user problem\nKeep systems understandable\nTest the behavior that matters'} value={draft.workingStyle.join('\n')} onChange={(event) => update({ workingStyle: event.target.value.split('\n') }, 'funFacts')} /></div>
              <div className="field"><label htmlFor="current-goals">Current goals <span>one goal per line</span></label><textarea id="current-goals" rows={3} maxLength={1200} placeholder={'Ship a meaningful open-source tool\nContribute to accessibility projects'} value={draft.currentGoals.join('\n')} onChange={(event) => update({ currentGoals: event.target.value.split('\n') }, 'funFacts')} /></div>
            </div>
          </details>

          <details className="disclosure" open={mode === 'manual'}>
            <summary>Personality and motion <span>make it memorable</span></summary>
            <div className="form-stack">
              <div className="field"><label htmlFor="notes">Personal notes <span>one memorable point per line</span></label><textarea id="notes" rows={3} maxLength={1500} placeholder={'I care about accessible interfaces\nI enjoy turning repetitive work into tools'} value={draft.funFacts.join('\n')} onChange={(event) => update({ funFacts: event.target.value.split('\n') }, 'funFacts')} /></div>
              <div className="field"><label htmlFor="dream">What I want to build next</label><textarea id="dream" rows={2} maxLength={500} placeholder="A developer tool that helps small teams ship accessible products faster." value={draft.dreamProject} onChange={(event) => update({ dreamProject: event.target.value }, 'funFacts')} /></div>
              <div className="field"><label htmlFor="quote">Developer philosophy <span>shown as a pull quote</span></label><input id="quote" maxLength={300} placeholder="Clarity is a feature." value={draft.quote} onChange={(event) => update({ quote: event.target.value }, 'aboutCode')} /></div>
              <div className="field"><label htmlFor="typing">Animated intro lines <span>one short line each</span></label><textarea id="typing" rows={3} maxLength={300} placeholder={'Product-minded developer\nBuilding thoughtful tools\nAlways learning'} value={draft.typingLines.join('\n')} onChange={(event) => update({ typingLines: event.target.value.split('\n') }, 'typing')} /></div>
            </div>
          </details>
        </div>
      </details>}

      <p role="status" className="status-message">{message}</p>
      {needsApproval && <div className="review-box"><h2>{mode === 'ai' ? 'Review what AI created' : 'Review your story'}</h2><p>Read the live preview, correct anything that does not sound like you, then approve it for export.</p><button className="btn-primary" onClick={approve}><Check size={17} /> Approve this content</button></div>}
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack} disabled={generating}><ArrowLeft size={16} /> Style</button>
        <button className="btn-primary" onClick={onFinish} disabled={!mode || needsApproval || generating}>Review & export <Check size={17} /></button>
      </div>
    </section>
  );
}
