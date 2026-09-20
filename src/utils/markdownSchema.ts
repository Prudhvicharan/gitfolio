import { defaultSchema } from 'rehype-sanitize';

// Keep only the HTML needed by the generator. No frames, styles, forms, or scripts.
export const markdownSchema = {
  ...defaultSchema,
  tagNames: ['a', 'p', 'div', 'span', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'details', 'summary', 'del'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [],
    a: ['href', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', ['align', 'left', 'right', 'center']],
    div: [['align', 'left', 'right', 'center']],
    code: [['className', /^language-./]],
  },
  protocols: { ...defaultSchema.protocols, href: ['http', 'https', 'mailto'], src: ['https'] },
};
