import type { AIContent, SectionToggles } from '../types';

export const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  header: 'Header banner',
  typing: 'Typing animation',
  socialBadges: 'Social links',
  aboutCode: 'About me',
  skillIcons: 'Skill icons',
  funFacts: 'Personal notes',
  trophies: 'Profile facts',
  stats: 'Engineering footprint',
  streak: 'Contribution streak',
  languages: 'Language mix',
  activityGraph: 'Public work snapshot',
  topRepos: 'Selected projects',
  snake: 'Contribution snake',
  contribution3d: '3D contribution landscape',
};
const base = Object.fromEntries(
  Object.keys(SECTION_LABELS).map((key) => [key, false])
) as unknown as SectionToggles;
export const PRESETS: Record<
  'minimal' | 'balanced' | 'animated',
  SectionToggles
> = {
  minimal: { ...base, aboutCode: true, socialBadges: true, topRepos: true },
  balanced: {
    ...base,
    header: true,
    aboutCode: true,
    socialBadges: true,
    topRepos: true,
    trophies: true,
    skillIcons: true,
    funFacts: true,
    activityGraph: true,
  },
  animated: {
    ...base,
    aboutCode: true,
    socialBadges: true,
    topRepos: true,
    skillIcons: true,
    header: true,
    typing: true,
    trophies: true,
    activityGraph: true,
    funFacts: true,
  },
};
export const EMPTY_CONTENT: AIContent = {
  tagline: '',
  aboutMe: '',
  quote: '',
  funFacts: [],
  skills: [],
  dreamProject: '',
  currentlyLearning: '',
  typingLines: [],
  focusAreas: [],
  workingStyle: [],
  currentGoals: [],
  projectStories: [],
  collaborationPitch: '',
};

export function safeUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const input = value.trim();
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`
    );
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      !url.hostname.includes('.')
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

// User/API values are plain text, never Markdown or HTML instructions.
export function markdownText(value: string): string {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/[`*_[\]|]/g, '\\$&');
  return escaped.replace(/^(\s*)(#{1,6}|[+-]|\d+[.)])(?=\s)/, '$1\\$2');
}
export function htmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
export function validateAIContent(value: unknown): AIContent {
  if (!value || typeof value !== 'object')
    throw new Error(
      'AI returned an invalid response. Your existing content is unchanged.'
    );
  const data = value as Record<string, unknown>;
  const result = { ...EMPTY_CONTENT };
  for (const key of [
    'tagline',
    'aboutMe',
    'quote',
    'dreamProject',
    'currentlyLearning',
    'collaborationPitch',
  ] as const) {
    if (typeof data[key] !== 'string' || data[key].length > 4000)
      throw new Error(
        `AI returned an invalid ${key}. Try again; your existing content is unchanged.`
      );
    result[key] = data[key].trim();
  }
  for (const key of [
    'funFacts',
    'skills',
    'typingLines',
    'focusAreas',
    'workingStyle',
    'currentGoals',
    'projectStories',
  ] as const) {
    const input = data[key] ?? [];
    const maximumItems = key === 'skills' ? 100 : key === 'projectStories' ? 50 : 35;
    if (
      !Array.isArray(input) ||
      input.length > maximumItems ||
      !input.every((item) => typeof item === 'string' && item.length <= 300)
    ) {
      throw new Error(
        `AI returned an invalid ${key} list. Your existing content is unchanged.`
      );
    }
    result[key] = [
      ...new Set(
        (input as string[]).map((item) => item.trim()).filter(Boolean)
      ),
    ];
  }
  return result;
}

export function widgetSection(url: string): keyof SectionToggles | null {
  if (url.includes('capsule-render.vercel.app/')) return 'header';
  if (url.includes('readme-typing-svg.demolab.com')) return 'typing';
  if (url.includes('skillicons.dev/')) return 'skillIcons';
  if (url.includes('streak-stats.demolab.com')) return 'streak';
  if (url.includes('github-snake')) return 'snake';
  if (url.includes('/profile-3d-contrib/')) return 'contribution3d';
  return null;
}
