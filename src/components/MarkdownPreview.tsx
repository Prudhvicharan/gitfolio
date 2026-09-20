import { useState } from 'react';
import type { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { markdownSchema } from '../utils/markdownSchema';
function PreviewImage({
  onRemove,
  ...props
}: ComponentProps<'img'> & {
  onRemove: (url: string) => void;
  align?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className="widget-error" role="status">
        <strong>{props.alt || 'Widget'} could not load.</strong>
        <span>
          The service may be unavailable, or this asset may not exist yet.
        </span>
        <span className="button-row">
          <button onClick={() => setFailed(false)} className="btn-secondary">
            Retry
          </button>
          {props.src && (
            <button
              className="btn-secondary"
              onClick={() => onRemove(props.src!)}
            >
              Remove from README
            </button>
          )}
        </span>
      </span>
    );
  return (
    <img
      {...props}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
export default function MarkdownPreview({
  markdown,
  onRemove,
}: {
  markdown: string;
  onRemove: (url: string) => void;
}) {
  return (
    <div className="md-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
        components={{
          img: ({ node, src, alt, width, height }) => (
            <PreviewImage
              key={src}
              src={src}
              alt={alt}
              width={width}
              height={height}
              align={
                typeof node?.properties.align === 'string'
                  ? node.properties.align
                  : undefined
              }
              onRemove={onRemove}
            />
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
              <span className="sr-only"> (opens a new tab)</span>
            </a>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
