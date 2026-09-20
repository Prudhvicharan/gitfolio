import { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react';
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

  const update = (patch: Partial<AIContent>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onChange({ aiContent: next });
    setNeedsApproval(true);
    onPending(true);
    setMessage('Preview updated. Approve the content when it reads like you.');
  };

  const generate = async () => {
    setMessage('');
    const value = await onGenerate(apiKey);
    if (!value) return;
    setDraft(value);
    onChange({ aiContent: value });
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
        <h1 id="step-heading-3" tabIndex={-1}>Let AI do the first draft.</h1>
        <p>Generate a complete profile from your selected repositories, then change only what you want.</p>
      </div>

      <section className="ai-workspace" aria-labelledby="ai-draft-heading">
        <div className="ai-workspace-heading">
          <Sparkles size={20} />
          <div>
            <h2 id="ai-draft-heading">Generate my README content</h2>
            <p>Creates your intro, skills, profile lines, notes, project idea, and developer philosophy in one pass.</p>
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
      </section>

      <details className="disclosure content-editor" open={!config.aiContent}>
        <summary>Fine-tune the generated content <span>{config.aiContent ? 'optional' : 'or write it yourself'}</span></summary>
        <div className="form-stack">
          <div className="field"><label htmlFor="bio">About me <span>your main introduction</span></label><textarea id="bio" rows={5} maxLength={4000} value={draft.aboutMe} onChange={(event) => update({ aboutMe: event.target.value })} /></div>
          <div className="field"><label htmlFor="tagline">Short tagline <span>shown below your name</span></label><input id="tagline" maxLength={300} value={draft.tagline} onChange={(event) => update({ tagline: event.target.value })} /></div>
          <div className="field"><label htmlFor="skills">Skills <span>comma separated</span></label><input id="skills" maxLength={1000} value={draft.skills.join(', ')} onChange={(event) => update({ skills: event.target.value.split(',').map((value) => value.trim()) })} /></div>
          <div className="field"><label htmlFor="learning">Currently learning <span>leave blank if it does not apply</span></label><input id="learning" maxLength={300} value={draft.currentlyLearning} onChange={(event) => update({ currentlyLearning: event.target.value })} /></div>
          <label className="check-option"><input type="checkbox" checked={!!config.openToWork} onChange={(event) => onChange({ openToWork: event.target.checked })} /><span>Add “Open to work” to the About section</span></label>

          <details className="disclosure">
            <summary>Personality and animation <span>each field has a clear destination</span></summary>
            <div className="form-stack">
              <div className="field"><label htmlFor="notes">Personal notes <span>bullet points in “Personal notes”</span></label><textarea id="notes" rows={3} maxLength={1500} value={draft.funFacts.join('\n')} onChange={(event) => update({ funFacts: event.target.value.split('\n') })} /></div>
              <div className="field"><label htmlFor="dream">A project you would like to build <span>added to “Personal notes”</span></label><textarea id="dream" rows={2} maxLength={500} value={draft.dreamProject} onChange={(event) => update({ dreamProject: event.target.value })} /></div>
              <div className="field"><label htmlFor="quote">Your philosophy <span>shown as a quote in “About me”</span></label><input id="quote" maxLength={300} value={draft.quote} onChange={(event) => update({ quote: event.target.value })} /></div>
              <div className="field"><label htmlFor="typing">Animated intro lines <span>one per line, shown above “About me”</span></label><textarea id="typing" rows={3} maxLength={300} value={draft.typingLines.join('\n')} onChange={(event) => update({ typingLines: event.target.value.split('\n') })} /></div>
              {!config.sections.funFacts && (draft.funFacts.some(Boolean) || draft.dreamProject) && <p className="notice warning">Personal notes are filled in but hidden. Turn on “Personal notes” in Style to include them.</p>}
              {!config.sections.typing && draft.typingLines.some(Boolean) && <p className="notice warning">Animated lines are filled in but hidden. Turn on “Typing animation” in Style to include them.</p>}
            </div>
          </details>
        </div>
      </details>

      <p role="status" className="status-message">{message}</p>
      {needsApproval && <div className="review-box"><h2>One final check</h2><p>Read the live preview, correct anything that does not sound like you, then approve it for export.</p><button className="btn-primary" onClick={approve}><Check size={17} /> Approve this content</button></div>}
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack} disabled={generating}><ArrowLeft size={16} /> Style</button>
        <button className="btn-primary" onClick={onFinish} disabled={needsApproval || generating}>Review & export <Check size={17} /></button>
      </div>
    </section>
  );
}
