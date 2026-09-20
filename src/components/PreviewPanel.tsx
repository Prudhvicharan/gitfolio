import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileText,
  Shuffle,
} from 'lucide-react';
import { checkWidgets, widgetUrls } from '../utils/checkWidgets';
import { downloadFile } from '../utils/download';
const MarkdownPreview = lazy(() => import('./MarkdownPreview'));
interface Props {
  markdown: string;
  onRemoveWidget: (url: string) => void;
  onRegenerateStyle: () => void;
  onPublish: () => void;
  demo: boolean;
  pending: boolean;
  hasProfile: boolean;
}
export default function PreviewPanel({
  markdown,
  onRemoveWidget,
  onRegenerateStyle,
  onPublish,
  demo,
  pending,
  hasProfile,
}: Props) {
  const [mode, setMode] = useState<'preview' | 'code'>('preview');
  const [status, setStatus] = useState('');
  const [checking, setChecking] = useState(false);
  const [widgetResult, setWidgetResult] = useState<{
    source: string;
    failed: string[];
  } | null>(null);
  const widgetRequest = useRef<AbortController | null>(null);
  const urls = widgetUrls(markdown);
  useEffect(() => () => widgetRequest.current?.abort(), []);
  const check = async () => {
    widgetRequest.current?.abort();
    const controller = new AbortController();
    widgetRequest.current = controller;
    setChecking(true);
    const failed = await checkWidgets(urls, controller.signal);
    if (!controller.signal.aborted) {
      setWidgetResult({ source: markdown, failed });
      setChecking(false);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus('Markdown copied.');
    } catch {
      setStatus(
        'Clipboard unavailable. Use Download, or select and copy the raw Markdown.'
      );
      setMode('code');
    }
  };
  return (
    <section className="preview-card" aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="sr-only" tabIndex={-1}>
        README preview and export
      </h2>
      <div className="preview-toolbar">
        <div className="segmented" aria-label="Preview format">
          <button
            aria-pressed={mode === 'preview'}
            onClick={() => setMode('preview')}
          >
            <Eye size={16} /> Preview
          </button>
          <button
            aria-pressed={mode === 'code'}
            onClick={() => setMode('code')}
          >
            <Code size={16} /> Markdown
          </button>
        </div>
        <span className="file-label">
          <FileText size={14} /> README.md
        </span>
      </div>
      <div className="export-toolbar">
        <button
          className="btn-secondary"
          disabled={!markdown || pending}
          onClick={copy}
        >
          {status === 'Markdown copied.' ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}{' '}
          Copy
        </button>
        <button
          className="btn-secondary"
          disabled={!markdown || pending}
          onClick={() => {
            downloadFile(markdown, 'README.md', 'text/markdown');
            setStatus('README.md download requested.');
          }}
        >
          <Download size={16} /> Download
        </button>
        <button
          className="icon-button"
          aria-label="Vary typing animation font and color"
          title="Vary typing animation font and color"
          disabled={!markdown || pending}
          onClick={onRegenerateStyle}
        >
          <Shuffle size={17} />
        </button>
      </div>
      {urls.length > 0 && (
        <div className="widget-check">
          <button className="text-button" onClick={check} disabled={checking}>
            {checking ? 'Checking widget images…' : 'Check widgets'}
          </button>
          <p className="help">
            Checks whether images load now. Verify their content and final
            appearance on GitHub.
          </p>
          {widgetResult?.source === markdown && (
            <div
              role="status"
              className={
                widgetResult.failed.length ? 'notice warning' : 'notice'
              }
            >
              {widgetResult.failed.length
                ? `${widgetResult.failed.length} widget image(s) could not be loaded.`
                : `All ${urls.length} widget images loaded.`}
              {widgetResult.failed.length > 0 && (
                <button
                  className="text-button"
                  onClick={() => widgetResult.failed.forEach(onRemoveWidget)}
                >
                  Remove unavailable widgets
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <p className="export-status" role="status">
        {status}
      </p>
      {demo && (
        <p className="notice">
          Fictional sample profile. Import your GitHub username before
          publishing.
        </p>
      )}
      <div className="preview-body">
        {!markdown ? (
          <div className="empty-preview">
            <FileText size={38} />
            <h2>
              {hasProfile
                ? 'Choose what to include.'
                : 'Your next first impression.'}
            </h2>
            <p>
              {hasProfile
                ? 'Enable sections in Style to generate your README.'
                : 'Import a profile or try the demo to see your README here.'}
            </p>
            <span>Preview updates as you configure.</span>
          </div>
        ) : mode === 'code' ? (
          <div className="field">
            <label htmlFor="raw-markdown">Generated Markdown (read only)</label>
            <textarea
              id="raw-markdown"
              className="raw-markdown"
              value={markdown}
              readOnly
              spellCheck={false}
            />
          </div>
        ) : (
          <Suspense fallback={<p role="status">Loading preview…</p>}>
            <MarkdownPreview markdown={markdown} onRemove={onRemoveWidget} />
          </Suspense>
        )}
      </div>
      {markdown && (
        <footer className="preview-footer">
          <span>
            {markdown.split('\n').length} lines ·{' '}
            {(new Blob([markdown]).size / 1024).toFixed(1)} KB
          </span>
          <button className="text-button" onClick={onPublish}>
            How to publish <span aria-hidden="true">↗</span>
          </button>
        </footer>
      )}
    </section>
  );
}
