export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  twitter_username: string | null;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  fork: boolean;
  topics: string[];
}

export type ThemeId = 'radical' | 'tokyonight' | 'dracula' | 'github_dark' | 'onedark' | 'nord' | 'catppuccin_mocha';
export type HeaderStyle = 'wave' | 'venom' | 'slice' | 'cylinder' | 'shark';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  email?: string;
}

export interface SectionToggles {
  header: boolean;
  typing: boolean;
  socialBadges: boolean;
  aboutCode: boolean;
  stats: boolean;
  streak: boolean;
  languages: boolean;
  activityGraph: boolean;
  trophies: boolean;
  skillIcons: boolean;
  topRepos: boolean;
  snake: boolean;
  funFacts: boolean;
}

export interface AIContent {
  tagline: string;
  aboutMe: string;
  quote: string;
  funFacts: string[];
  skills: string[];
  dreamProject: string;
  currentlyLearning: string;
  typingLines: string[];
}

export interface GeneratorConfig {
  theme: ThemeId;
  headerStyle: HeaderStyle;
  headerColor: string;
  socialLinks: SocialLinks;
  sections: SectionToggles;
  aiContent: AIContent | null;
  userData: GithubUser | null;
  repos: GithubRepo[];
  jobTitle: string;
  /** Stable seed per profile — used to lock in GIF/emoji/divider picks so style
   *  changes in Step 2 don't scramble them. User can explicitly refresh via
   *  "Try Different Style" button. */
  creativeSeed?: number;
}
