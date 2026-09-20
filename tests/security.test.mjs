import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { markdownSchema } from '../src/utils/markdownSchema.ts';
test('preview rejects active HTML but preserves supported image layout', () => {
  const output = renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      { rehypePlugins: [rehypeRaw, [rehypeSanitize, markdownSchema]] },
      '<iframe src="https://evil.test"></iframe><script>alert(1)</script><form action="https://evil.test"><input></form><img src="https://example.com/a.svg" width="260" align="right" onerror="alert(1)"><a href="javascript:alert(1)">bad link</a>'
    )
  );
  assert.doesNotMatch(
    output,
    /<iframe|<script|<form|<input|onerror|javascript:/
  );
  assert.match(output, /width="260"/);
  assert.match(output, /align="right"/);
});
