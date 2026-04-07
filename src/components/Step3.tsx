import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import type { GithubUser, GithubRepo, AIContent } from '../types';

interface TerminalLine {
  text: string;
  type: string;
  id: number;
}

interface Step3Props {
  user: GithubUser;
  repos: GithubRepo[];
  jobTitle: string;
  aiContent: AIContent | null;
  onGenerate: (apiKey: string) => Promise<void>;
  onBack: () => void;
  onFinish: () => void;
  generating: boolean;
  terminalLines: TerminalLine[];
}

const Step3: React.FC<Step3Props> = ({
  user, repos, aiContent, onGenerate, onBack, onFinish, generating, terminalLines,
}) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gitfolio_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('gitfolio_gemini_key', apiKey);
    await onGenerate(apiKey);
  };

  const handleSkip = () => onFinish();

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-mono font-bold text-white mb-1">
          <span className="gradient-text">AI Magic ✨</span>
        </h2>
        <p className="text-sm text-gray-500">
          Let Gemini AI craft a personalized bio, tagline, and fun facts from your GitHub data.
        </p>
      </div>

      {/* User card preview */}
      <div className="glass rounded-xl p-4 flex items-center gap-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-14 h-14 rounded-full border-2 border-indigo-500/40 ring-2 ring-purple-500/20"
        />
        <div>
          <p className="font-mono font-bold text-white">{user.name || user.login}</p>
          <p className="text-xs text-gray-500 font-mono">@{user.login}</p>
          <p className="text-xs text-gray-500 mt-0.5">{repos.length} repos analyzed · {user.followers} followers</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3.5">
        <span className="text-emerald-400 text-lg mt-0.5">🔒</span>
        <div>
          <p className="text-xs font-mono font-semibold text-emerald-400 mb-0.5">Your key never leaves your browser</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Stored in <span className="text-gray-400 font-mono">localStorage</span>. API calls go directly from your browser to Google — our code never sees your key.
            Get a free key at{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              aistudio.google.com
            </a>
            {' '}(1,500 free requests/day).
          </p>
        </div>
      </div>

      {/* API Key Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-gray-400">GEMINI API KEY</label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            className="input-field pr-11 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Terminal log */}
      <AnimatePresence>
        {(generating || terminalLines.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-log"
            ref={terminalRef}
          >
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 font-mono border-b border-white/5 pb-1.5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              gitfolio — gemini-1.5-flash
            </div>
            {terminalLines.map(({ id, text, type }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`terminal-line ${type}`}
              >
                <span className="text-gray-700 select-none">$ </span>
                {text}
                {id === terminalLines[terminalLines.length - 1].id && generating && (
                  <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Already has AI content */}
      {aiContent && !generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3 flex items-center gap-2"
        >
          <span className="text-emerald-400">✓</span>
          <span className="text-xs font-mono text-emerald-400">AI content generated! Tagline: "{aiContent.tagline}"</span>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary min-w-[80px]">← Back</button>

        {!aiContent ? (
          <button
            onClick={handleGenerate}
            disabled={!apiKey.trim() || generating}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Enhance with AI
              </>
            )}
          </button>
        ) : (
          <div className="flex gap-2 flex-1">
            <button
              onClick={handleGenerate}
              disabled={!apiKey.trim() || generating}
              className="btn-secondary flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              Regenerate
            </button>
            <button onClick={onFinish} className="btn-primary flex-1">
              Generate README →
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSkip}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors text-center w-full font-mono"
      >
        Skip AI — Generate without personalization
      </button>
    </motion.div>
  );
};

export default Step3;
