import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import { checkWidgets, widgetUrls } from '../utils/checkWidgets';
import { downloadFile } from '../utils/download';
const MarkdownPreview = lazy(() => import('./MarkdownPreview'));
interface Props {
  markdown: string;
  onRemoveWidget: (url: string) => void;
  onPublish: () => void;
  demo: boolean;
  pending: boolean;
  hasProfile: boolean;
}
export default function PreviewPanel({
  markdown,
  onRemoveWidget,
  onPublish,
  demo,
  pending,
  hasProfile,
}: Props) {
  const [mode, setMode] = useState<'preview' | 'code'>('preview');
  const [status, setStatus] = useState('');
  const [renderedMarkdown, setRenderedMarkdown] = useState(markdown);
  const [checking, setChecking] = useState(false);
  const [widgetResult, setWidgetResult] = useState<{
    source: string;
    failed: string[];
  } | null>(null);
  const widgetRequest = useRef<AbortController | null>(null);
  const previewDocument = useRef<HTMLDivElement | null>(null);
  const urls = widgetUrls(markdown);
  const visibleMode = demo ? 'preview' : mode;
  useEffect(() => () => widgetRequest.current?.abort(), []);
  useEffect(() => {
    if (markdown === renderedMarkdown) return;
    const timer = window.setTimeout(() => setRenderedMarkdown(markdown), 100);
    return () => window.clearTimeout(timer);
  }, [markdown, renderedMarkdown]);
  useEffect(() => {
    if (!previewDocument.current || !renderedMarkdown) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    previewDocument.current.animate(
      [
        { opacity: 0.86, transform: 'translateY(3px) scale(.998)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      { duration: 180, easing: 'cubic-bezier(.16, 1, .3, 1)' }
    );
  }, [renderedMarkdown, visibleMode]);
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
            aria-pressed={visibleMode === 'preview'}
            onClick={() => setMode('preview')}
          >
            <Eye size={16} /> Preview
          </button>
          {!demo && (
            <button
              aria-pressed={mode === 'code'}
              onClick={() => setMode('code')}
            >
              <Code size={16} /> Markdown
            </button>
          )}
        </div>
        <span className="file-label">
          <FileText size={14} /> README.md
        </span>
      </div>
      {!demo && (
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
        </div>
      )}
      {!demo && urls.length > 0 && (
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
      {!demo && (
        <p className="export-status" role="status">
          {status}
        </p>
      )}
      {demo && (
        <p className="notice demo-preview-notice">
          <strong>Interactive showroom.</strong> The profile is fictional and
          export is locked. Visual controls remain available in Style.
        </p>
      )}
      <div className="preview-body" ref={previewDocument}>
        {!renderedMarkdown ? (
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
        ) : visibleMode === 'code' ? (
          <div className="field">
            <label htmlFor="raw-markdown">Generated Markdown (read only)</label>
            <textarea
              id="raw-markdown"
              className="raw-markdown"
              value={renderedMarkdown}
              readOnly
              spellCheck={false}
            />
          </div>
        ) : (
          <Suspense fallback={<p role="status">Loading preview…</p>}>
            <MarkdownPreview
              markdown={renderedMarkdown}
              onRemove={onRemoveWidget}
              readOnly={demo}
            />
          </Suspense>
        )}
      </div>
      {markdown && (
        <footer className="preview-footer">
          <span>
            {markdown.split('\n').length} lines ·{' '}
            {(new Blob([markdown]).size / 1024).toFixed(1)} KB
          </span>
          {!demo && (
            <button className="text-button" onClick={onPublish}>
              How to publish <span aria-hidden="true">↗</span>
            </button>
          )}
        </footer>
      )}
    </section>
  );
}
