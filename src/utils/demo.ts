import type { AIContent, GithubUser, GithubRepo } from '../types';
export const DEMO_USER: GithubUser = {
  login: 'gitfolio-demo',
  id: 0,
  name: 'Alex Morgan',
  company: 'Northstar Studio',
  blog: null,
  location: 'Toronto, Canada',
  email: null,
  bio: 'I build accessible web experiences and tools that make everyday development a little easier.',
  public_repos: 12,
  followers: 86,
  following: 34,
  created_at: '2022-01-01',
  twitter_username: null,
  avatar_url: '',
};
export const DEMO_REPOS: GithubRepo[] = [
  {
    id: 1,
    name: 'accessible-ui',
    description: 'A collection of keyboard-friendly interface components.',
    language: 'TypeScript',
    topics: ['react', 'accessibility'],
    stargazers_count: 48,
  },
  {
    id: 2,
    name: 'dev-journal',
    description: 'A lightweight writing space for project notes and ideas.',
    language: 'JavaScript',
    topics: ['knowledge-management', 'offline-first'],
    stargazers_count: 31,
  },
  {
    id: 3,
    name: 'tiny-tools',
    description: 'Small Python utilities for everyday development tasks.',
    language: 'Python',
    topics: ['python', 'automation', 'cli'],
    stargazers_count: 67,
  },
  {
    id: 4,
    name: 'signal-lab',
    description: 'A visual playground for understanding real-time data streams.',
    language: 'TypeScript',
    topics: ['data-visualization', 'websockets'],
    stargazers_count: 54,
  },
].map((repo) => ({
  ...repo,
  full_name: `gitfolio-demo/${repo.name}`,
  html_url: `https://github.com/gitfolio-demo/${repo.name}`,
  forks_count: Math.max(1, Math.round(repo.stargazers_count / 12)),
  fork: false,
}));

export const DEMO_CONTENT: AIContent = {
  tagline: 'Designing calm tools for complex work',
  aboutMe:
    'I’m a product-minded engineer focused on accessible interfaces, thoughtful developer tools, and data-rich experiences that remain easy to understand.',
  quote: 'Clarity is not decoration. It is how useful software earns trust.',
  funFacts: [
    'I prototype interactions before polishing pixels.',
    'I enjoy turning repetitive workflows into small, dependable tools.',
    'My favorite projects sit between design systems and developer experience.',
  ],
  skills: ['TypeScript', 'React', 'Python', 'Node.js', 'PostgreSQL', 'Docker'],
  dreamProject:
    'An open-source workspace that helps small teams test accessibility while they design.',
  currentlyLearning: 'Realtime collaboration patterns and local-first software',
  typingLines: [
    'Product-minded engineer',
    'Accessible by default',
    'Building tools with clarity',
  ],
  focusAreas: [
    'Accessible product interfaces',
    'Developer tools and automation',
    'Realtime data visualization',
  ],
  workingStyle: [
    'Start with the user problem',
    'Make the system understandable',
    'Test the behavior that matters',
  ],
  currentGoals: [
    'Ship a useful open-source accessibility tool',
    'Contribute practical patterns back to the community',
  ],
  projectStories: [
    'A component laboratory exploring keyboard navigation, focus management, and inclusive interaction patterns.',
    'A local-first writing space that keeps project decisions searchable without adding process overhead.',
    'A collection of focused command-line utilities that remove friction from everyday development work.',
    'An interactive environment for making streaming data behavior visible and easier to reason about.',
  ],
  collaborationPitch:
    'Have a complex product problem? Let’s turn it into something clear, useful, and memorable.',
};
