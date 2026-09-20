import { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react';
import type { AIContent, GeneratorConfig } from '../types';
import { EMPTY_CONTENT } from '../utils/content';
import { extractLanguages } from '../hooks/useGithub';
import { AI_MODEL } from '../hooks/useGemini';
interface Props { config:GeneratorConfig; onChange:(patch:Partial<GeneratorConfig>)=>void; onGenerate:(key:string)=>Promise<AIContent|null>; generating:boolean; onCancel:()=>void; onBack:()=>void; onFinish:()=>void; active:boolean; onPending:(pending:boolean)=>void; }
export default function Step3({config,onChange,onGenerate,generating,onCancel,onBack,onFinish,active,onPending}:Props) {
 const [apiKey,setApiKey]=useState('');
 const [showKey,setShowKey]=useState(false);
 const [consent,setConsent]=useState(false);
 const [draft,setDraft]=useState<AIContent>(()=>config.aiContent??{...EMPTY_CONTENT,aboutMe:config.userData?.bio||'',skills:extractLanguages(config.repos)});
 const [dirty,setDirty]=useState(false);
 const [reviewed,setReviewed]=useState(false);
 const [message,setMessage]=useState('');
 const [wasActive,setWasActive]=useState(active);
 if(wasActive!==active){setWasActive(active);if(!active){setApiKey('');setConsent(false);}}
 const edit=(patch:Partial<AIContent>)=>{setDraft({...draft,...patch});setDirty(true);onPending(true);setReviewed(false);setMessage('');};
 const generate=async()=>{setMessage('');const value=await onGenerate(apiKey);if(value){setDraft(value);setDirty(true);onPending(true);setReviewed(false);setMessage('AI draft ready. Check and edit the content below before applying it.');}};
 const apply=()=>{onChange({aiContent:draft});setDirty(false);onPending(false);setMessage('Reviewed content applied to your README.');};
 return <section className="step-content" aria-labelledby="step-heading-3">
  <div className="section-intro"><span className="eyebrow">03 / TELL YOUR STORY</span><h1 id="step-heading-3" tabIndex={-1}>Make every word yours.</h1><p>Edit your profile below. AI can help with a draft, but you decide what gets published.</p></div>
  <details className="disclosure ai-disclosure"><summary><Sparkles size={17}/> Enhance with AI <span>optional</span></summary><div className="form-stack">
   <p className="help">Uses {AI_MODEL}. Your key is held in memory only, sent directly to Google, and cleared when you leave this step. Google’s project limits and billing apply.</p>
   <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Get a Gemini API key <span className="sr-only">(opens a new tab)</span>↗</a>
   <div className="field"><label htmlFor="gemini-key">Gemini API key</label><div className="input-action"><input id="gemini-key" type={showKey?'text':'password'} value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Paste your key" autoComplete="off" spellCheck={false}/><button type="button" aria-label={showKey?'Hide API key':'Show API key'} aria-pressed={showKey} onClick={()=>setShowKey(!showKey)}>{showKey?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>
   <button className="text-button" onClick={()=>{setApiKey('');setConsent(false);setMessage('API key cleared from this step.');}}>Clear key</button>
   <label className="check-option"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Send my name, bio, focus, and selected repository metadata to Google to generate a draft.</span></label>
   <div className="button-row"><button className="btn-primary" disabled={!apiKey.trim()||!consent||generating||config.userData?.id===0} onClick={generate}>{generating?<><LoaderCircle className="spin" size={17}/> Drafting…</>:<><Sparkles size={17}/> Generate AI draft</>}</button>{generating&&<button className="btn-secondary" onClick={onCancel}>Cancel</button>}</div>
   {config.userData?.id===0&&<p className="help">The sample is fictional. Import your own profile to use AI.</p>}
   <p className="help"><a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener noreferrer">Google quotas ↗</a> · <a href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noopener noreferrer">Google pricing & data use ↗</a></p>
  </div></details>
  <div className="form-stack">
   <div className="field"><label htmlFor="bio">About me</label><textarea id="bio" rows={5} maxLength={4000} value={draft.aboutMe} onChange={e=>edit({aboutMe:e.target.value})}/></div>
   <div className="field"><label htmlFor="skills">Skills <span>comma separated</span></label><input id="skills" value={draft.skills.join(', ')} onChange={e=>edit({skills:e.target.value.split(',').map(s=>s.trim())})} maxLength={1000}/><p className="help">Include only technologies you are comfortable claiming.</p></div>
   <div className="field"><label htmlFor="learning">Currently learning <span>optional</span></label><input id="learning" value={draft.currentlyLearning} onChange={e=>edit({currentlyLearning:e.target.value})} maxLength={300}/></div>
   <details className="disclosure"><summary>Personal notes & animation text <span>optional</span></summary><div className="form-stack">
    <div className="field"><label htmlFor="notes">Personal notes <span>one per line</span></label><textarea id="notes" rows={3} value={draft.funFacts.join('\n')} onChange={e=>edit({funFacts:e.target.value.split('\n')})} maxLength={1500}/></div>
    <div className="field"><label htmlFor="dream">A project you would like to build</label><textarea id="dream" rows={2} value={draft.dreamProject} onChange={e=>edit({dreamProject:e.target.value})} maxLength={500}/></div>
    <div className="field"><label htmlFor="quote">Your own quote or philosophy</label><input id="quote" value={draft.quote} onChange={e=>edit({quote:e.target.value})} maxLength={300}/></div>
    <div className="field"><label htmlFor="typing">Typing animation lines <span>one per line, up to 45 characters each</span></label><textarea id="typing" rows={3} value={draft.typingLines.join('\n')} onChange={e=>edit({typingLines:e.target.value.split('\n')})} maxLength={300}/></div>
   </div></details>
   <label className="check-option"><input type="checkbox" checked={!!config.openToWork} onChange={e=>onChange({openToWork:e.target.checked})}/><span>Include “Open to work” in my About section</span></label>
   {dirty&&<div className="review-box"><label className="check-option"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/><span>I’ve reviewed this draft and its claims accurately describe me.</span></label><button className="btn-primary" disabled={!reviewed} onClick={apply}><Check size={17}/> Apply reviewed content</button><button className="text-button" onClick={()=>{setDraft(config.aiContent??{...EMPTY_CONTENT,aboutMe:config.userData?.bio||'',skills:extractLanguages(config.repos)});setDirty(false);onPending(false);setReviewed(false);}}>Discard unapplied edits</button><p className="help">Your preview keeps the previous content until you apply these edits.</p></div>}
   <p role="status" className="status-message">{message}</p>
  </div>
  <div className="button-row"><button className="btn-secondary" onClick={onBack} disabled={generating}><ArrowLeft size={16}/> Style</button><button className="btn-primary" onClick={onFinish} disabled={dirty||generating}>Review & export <Check size={17}/></button></div>
  {dirty&&<p className="help">Apply your reviewed edits to continue.</p>}
 </section>;
}
