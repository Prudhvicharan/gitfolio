import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Check, Eye, Code, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Stateful image component — prevents duplicate placeholders on re-render.
// DOM manipulation in onError creates orphaned nodes each time React unmounts/remounts
// the img (e.g. multiple state updates while GitHub data + AI content loads).
// React state ensures exactly one placeholder per failed image, regardless of re-renders.
const PreviewImage = ({ src, alt }: { src?: string; alt?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        title={src}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', margin: '3px 2px', borderRadius: 5,
          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
          fontSize: 10, color: '#6366f1', fontFamily: 'monospace', whiteSpace: 'nowrap',
        }}
      >
        <span style={{ opacity: 0.6 }}>⬛</span>
        <span style={{ color: '#818cf8' }}>{alt || 'widget'}</span>
        <span style={{ color: '#4b5563', marginLeft: 2 }}>· renders on GitHub</span>
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ maxWidth: '100%', display: 'inline-block', margin: '4px 2px', borderRadius: 6 }}
    />
  );
};

interface PreviewPanelProps {
  markdown: string;
  onReset: () => void;
  onRegenerateStyle: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ markdown, onReset, onRegenerateStyle }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col gap-0 rounded-2xl overflow-hidden border border-white/8">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white/3 border-b border-white/8 shrink-0 gap-2">
        {/* View tabs */}
        <div className="flex items-center bg-black/40 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Eye size={13} /> Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              viewMode === 'code' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Code size={13} /> Raw Code
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {markdown && (
            <button
              onClick={onRegenerateStyle}
              className="btn-ghost flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-lg px-2 py-1.5 transition-all"
              title="Shuffle GIFs, emojis and dividers — keeps your settings"
            >
              <span className="text-sm">✦</span>
              <span className="hidden lg:inline">Try Different Style</span>
            </button>
          )}
          <button
            onClick={onReset}
            className="btn-ghost flex items-center gap-1.5 text-xs"
            title="Start over"
          >
            <RefreshCw size={13} />
            <span className="hidden md:inline">Restart</span>
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!markdown}
            className={`btn-ghost flex items-center gap-1.5 text-xs transition-colors ${copied ? 'text-emerald-400' : ''}`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadMarkdown}
            disabled={!markdown}
            className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
            title="Download README.md"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black/20" style={{ minWidth: 0 }}>
        <AnimatePresence mode="wait">
          {!markdown ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-3 text-gray-600 p-8 text-center"
            >
              <div className="text-6xl opacity-20">📄</div>
              <p className="font-mono text-sm">Your README preview will appear here</p>
              <p className="text-xs">Complete the wizard on the left to generate your profile</p>
            </motion.div>
          ) : viewMode === 'code' ? (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5"
            >
              <pre className="code-block text-xs leading-relaxed">{markdown}</pre>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 md-preview"
              style={{ minWidth: 0, maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
            >
              {/* GitHub-style dark header bar */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/6">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-gray-600">README.md — GitHub Profile Preview</span>
              </div>
              {/* GitHub-only widgets notice */}
              <div className="mb-4 flex items-start gap-2 px-3 py-2 rounded-lg bg-indigo-500/8 border border-indigo-500/15">
                <span className="text-indigo-400 text-xs shrink-0 mt-px">ⓘ</span>
                <p className="text-xs text-gray-500 font-mono leading-relaxed">
                  <span className="text-indigo-400">Dynamic widgets</span> (stats cards, trophies, activity graphs) are blocked by browser security — they render correctly when pasted into GitHub.
                </p>
              </div>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ src, alt }) => <PreviewImage src={src} alt={alt} />,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#818CF8' }}>
                      {children}
                    </a>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      {markdown && (
        <div className="px-4 py-2 border-t border-white/5 bg-black/30 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-600">
            {markdown.split('\n').length} lines · {(new Blob([markdown]).size / 1024).toFixed(1)} KB
          </span>
          <span className="text-xs text-gray-700 font-mono">
            Copy → paste into your GitHub profile repo's README.md
          </span>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
