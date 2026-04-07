import type { GithubUser, GithubRepo } from '../types';

export const useGithub = () => {
  const fetchProfile = async (username: string): Promise<{ user: GithubUser; repos: GithubRepo[] } | null> => {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error('GitHub user not found. Check the username and try again.');
      if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Please wait a minute and try again.');
      throw new Error(`GitHub API error: ${userRes.status}`);
    }

    const user: GithubUser = await userRes.json();
    const allRepos: GithubRepo[] = repoRes.ok ? await repoRes.json() : [];

    const repos = allRepos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8);

    return { user, repos };
  };

  return { fetchProfile };
};

export const extractLanguages = (repos: GithubRepo[]): string[] => {
  const langCount: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);
};

// Comprehensive skill → skillicons.dev key mapping
// Covers languages, frameworks, databases, cloud, devops, and tools
export const SKILL_TO_ICON: Record<string, string> = {
  // Languages
  TypeScript: 'ts', JavaScript: 'js', Python: 'py', Java: 'java',
  'C#': 'cs', 'C++': 'cpp', 'C': 'c', Go: 'go', Rust: 'rust',
  Ruby: 'ruby', PHP: 'php', Swift: 'swift', Kotlin: 'kotlin',
  Dart: 'dart', HTML: 'html', 'HTML5': 'html', CSS: 'css', 'CSS3': 'css',
  Shell: 'bash', Bash: 'bash', Scala: 'scala', 'R': 'r',
  Lua: 'lua', Haskell: 'haskell', Elixir: 'elixir', Clojure: 'clojure',
  Perl: 'perl', MATLAB: 'matlab', Assembly: 'assembly',

  // Frontend Frameworks & Libraries
  React: 'react', 'React.js': 'react', ReactJS: 'react',
  'Next.js': 'nextjs', NextJS: 'nextjs', 'Next': 'nextjs',
  Vue: 'vue', 'Vue.js': 'vue', VueJS: 'vue',
  Angular: 'angular', AngularJS: 'angular',
  Svelte: 'svelte', SvelteKit: 'svelte',
  'Solid.js': 'solidjs', SolidJS: 'solidjs',
  Remix: 'remix', Astro: 'astro', Nuxt: 'nuxtjs', 'Nuxt.js': 'nuxtjs',
  'Tailwind CSS': 'tailwind', TailwindCSS: 'tailwind', Tailwind: 'tailwind',
  Bootstrap: 'bootstrap', 'Material UI': 'materialui', MUI: 'materialui',
  Redux: 'redux', GraphQL: 'graphql', 'Three.js': 'threejs', ThreeJS: 'threejs',
  jQuery: 'jquery', 'Styled Components': 'styledcomponents',

  // Backend Frameworks
  'Node.js': 'nodejs', NodeJS: 'nodejs', Node: 'nodejs',
  Express: 'express', 'Express.js': 'express', ExpressJS: 'express',
  'Nest.js': 'nestjs', NestJS: 'nestjs', Nest: 'nestjs',
  Django: 'django', Flask: 'flask', FastAPI: 'fastapi',
  Spring: 'spring', 'Spring Boot': 'spring',
  Laravel: 'laravel', Rails: 'rails', 'Ruby on Rails': 'rails',
  'ASP.NET': 'dotnet', '.NET': 'dotnet', Dotnet: 'dotnet',
  Bun: 'bun', Deno: 'deno', Fiber: 'go',

  // Databases
  MongoDB: 'mongodb', PostgreSQL: 'postgres', Postgres: 'postgres',
  MySQL: 'mysql', SQLite: 'sqlite', Redis: 'redis',
  Firebase: 'firebase', Supabase: 'supabase', PlanetScale: 'planetscale',
  Prisma: 'prisma', 'SQL Server': 'sqlserver', Cassandra: 'cassandra',
  Elasticsearch: 'elasticsearch', DynamoDB: 'dynamodb',

  // Cloud & Infrastructure
  AWS: 'aws', 'Amazon Web Services': 'aws', GCP: 'gcp',
  'Google Cloud': 'gcp', Azure: 'azure',
  Docker: 'docker', Kubernetes: 'kubernetes', 'K8s': 'kubernetes',
  Vercel: 'vercel', Netlify: 'netlify', Heroku: 'heroku',
  Terraform: 'terraform', Ansible: 'ansible', Jenkins: 'jenkins',
  Nginx: 'nginx', Apache: 'apache',

  // Tools & DevOps
  Git: 'git', GitHub: 'github', GitLab: 'gitlab', Bitbucket: 'bitbucket',
  Linux: 'linux', Ubuntu: 'ubuntu', Debian: 'debian',
  VSCode: 'vscode', 'Visual Studio Code': 'vscode',
  Figma: 'figma', Photoshop: 'photoshop', Illustrator: 'illustrator',
  Postman: 'postman', Webpack: 'webpack', Vite: 'vite', Babel: 'babel',
  Jest: 'jest', Vitest: 'vitest', Cypress: 'cypress',

  // AI / ML
  TensorFlow: 'tensorflow', PyTorch: 'pytorch',
  Pandas: 'pandas', NumPy: 'numpy', OpenCV: 'opencv',
  'Scikit-learn': 'sklearn', Jupyter: 'jupyter',

  // Mobile
  'React Native': 'react', Flutter: 'flutter', Expo: 'expo',
  Xcode: 'xcode', 'Android Studio': 'androidstudio',
};

/** Convert an array of skill/language names to a skillicons.dev icon list */
export const skillsToIconKeys = (skills: string[]): string => {
  const seen = new Set<string>();
  const icons: string[] = [];

  for (const skill of skills) {
    // Exact match first
    let key = SKILL_TO_ICON[skill];
    if (!key) {
      // Case-insensitive fallback
      const lower = skill.toLowerCase();
      const found = Object.entries(SKILL_TO_ICON).find(
        ([k]) => k.toLowerCase() === lower
      );
      key = found?.[1] ?? '';
    }
    if (key && !seen.has(key)) {
      seen.add(key);
      icons.push(key);
    }
  }

  return icons.slice(0, 20).join(',') || 'ts,js,py,react,nodejs';
};

/** Legacy: map just repo languages (used as fallback) */
export const langsToSkillIcons = (langs: string[]): string =>
  skillsToIconKeys(langs);
