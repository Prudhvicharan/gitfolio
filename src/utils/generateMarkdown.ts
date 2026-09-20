import type { GeneratorConfig } from '../types';
import { extractLanguages, skillsToIconKeys } from '../hooks/useGithub';
import { EXTRA_WIDGETS, TYPING_COLORS, TYPING_FONTS } from './creativeAssets';
import { htmlAttribute, markdownText, safeUrl } from './content';

export function generateSnakeWorkflow(username: string): string {
  const login = username.replace(/[^a-zA-Z0-9-]/g, '');
  return `name: Generate contribution snake\non:\n  schedule:\n    - cron: '0 0 * * *'\n  workflow_dispatch:\npermissions:\n  contents: write\njobs:\n  generate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: Platane/snk@v3\n        with:\n          github_user_name: ${login}\n          github_token: \${{ secrets.GITHUB_TOKEN }}\n          outputs: |\n            dist/github-snake.svg\n            dist/github-snake-dark.svg?palette=github-dark\n      - uses: crazy-max/ghaction-github-pages@v4\n        with:\n          target_branch: output\n          build_dir: dist\n        env:\n          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n`;
}

export const generateReadme = (config: GeneratorConfig): string => {
  const {
    userData: user,
    repos,
    sections,
    aiContent: content,
    theme,
    socialLinks,
    jobTitle,
    headerStyle,
    headerColor,
  } = config;
  if (!user) return '';
  const parts: string[] = [];
  const name = user.name || user.login;
  const text = markdownText;
  const image = (url: string, alt: string, attrs = '') =>
    config.disabledWidgetUrls?.includes(url)
      ? ''
      : `<img src="${htmlAttribute(url)}" alt="${htmlAttribute(alt)}" ${attrs} />`;
  const add = (value: string) => {
    if (value.trim()) parts.push(value);
  };
  const skills = content ? content.skills : extractLanguages(repos);
  const seed = Math.abs(Math.floor((config.creativeSeed ?? 0.5) * 10000));
  if (sections.header) {
    const styles = {
      wave: 'waving',
      venom: 'venom',
      slice: 'slice',
      cylinder: 'cylinder',
      shark: 'shark',
    };
    const color = headerColor.replace('#', '');
    add(
      image(
        EXTRA_WIDGETS.capsuleHeader(
          encodeURIComponent(name),
          encodeURIComponent(jobTitle || ''),
          styles[headerStyle],
          color,
          200,
          'fadeIn'
        ),
        `${name} profile banner`,
        'width="100%" height="200"'
      )
    );
  }
  if (sections.typing) {
    const lines = (
      content?.typingLines.length
        ? content.typingLines
        : [name, jobTitle].filter(Boolean)
    )
      .map((line) => encodeURIComponent(line.slice(0, 45)))
      .join(';');
    add(
      image(
        EXTRA_WIDGETS.typingSvg(
          lines,
          TYPING_FONTS[seed % TYPING_FONTS.length],
          TYPING_COLORS[seed % TYPING_COLORS.length]
        ),
        'Animated profile introduction',
        'width="600" height="50"'
      )
    );
  }
  if (sections.aboutCode) {
    const about = [`# Hi, I'm ${text(name)}`];
    const bio = content ? content.aboutMe : user.bio;
    if (bio) about.push(text(bio));
    if (jobTitle) about.push(`**Focus:** ${text(jobTitle)}`);
    if (user.location) about.push(`**Based in:** ${text(user.location)}`);
    if (skills.length)
      about.push(`**Technologies:** ${skills.map(text).join(' · ')}`);
    if (content?.currentlyLearning)
      about.push(`**Currently learning:** ${text(content.currentlyLearning)}`);
    if (config.openToWork) about.push('**Open to work:** Yes');
    if (content?.quote) about.push(`> ${text(content.quote)}`);
    add(about.join('\n\n'));
  }
  if (sections.socialBadges) {
    const links = [
      `[GitHub](https://github.com/${encodeURIComponent(user.login)})`,
    ];
    for (const [label, input] of [
      ['LinkedIn', socialLinks.linkedin],
      ['Twitter / X', socialLinks.twitter],
      ['Portfolio', socialLinks.portfolio],
    ] as const) {
      const url = safeUrl(input);
      if (url)
        links.push(
          `[${label}](${url.replace(/[()]/g, (char) => encodeURIComponent(char))})`
        );
    }
    if (
      socialLinks.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socialLinks.email)
    )
      links.push(`[Email](mailto:${encodeURIComponent(socialLinks.email)})`);
    add(`## Connect\n\n${links.join(' · ')}`);
  }
  if (sections.skillIcons) {
    const keys = skillsToIconKeys(skills);
    const widget = keys
      ? image(EXTRA_WIDGETS.skillIcons(keys), `Skills: ${skills.join(', ')}`)
      : '';
    if (widget) add(`## Skills\n\n${widget}`);
  }
  if (sections.funFacts && content) {
    const notes = content.funFacts.map((fact) => `- ${text(fact)}`);
    if (content.dreamProject)
      notes.push(`- **I'd like to build:** ${text(content.dreamProject)}`);
    if (notes.length) add(`## Personal notes\n\n${notes.join('\n')}`);
  }
  if (sections.trophies) {
    add(
      `## Profile facts\n\n- Public repositories: ${user.public_repos}\n- Followers: ${user.followers}\n- Stars across the ${repos.length} selected repositories: ${repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}`
    );
  }
  const stats: string[] = [];
  if (sections.stats)
    stats.push(
      image(
        EXTRA_WIDGETS.stats(user.login, theme),
        'GitHub statistics',
        'height="180"'
      )
    );
  if (sections.streak)
    stats.push(
      image(
        EXTRA_WIDGETS.streak(user.login, theme),
        'GitHub contribution streak',
        'height="180"'
      )
    );
  if (sections.languages)
    stats.push(
      image(
        EXTRA_WIDGETS.topLangs(user.login, theme),
        'Repository language statistics',
        'height="165"'
      )
    );
  if (stats.some(Boolean))
    add(`## GitHub statistics\n\n${stats.filter(Boolean).join('\n')}`);
  if (sections.activityGraph) {
    const graph = image(
      EXTRA_WIDGETS.activityGraph(user.login),
      'Public contribution activity',
      'width="100%"'
    );
    if (graph) add(`## Contribution activity\n\n${graph}`);
  }
  if (sections.topRepos && repos.length) {
    add(
      `## Selected projects\n\n${repos
        .map((repo) => {
          const url = `https://github.com/${encodeURIComponent(user.login)}/${encodeURIComponent(repo.name)}`;
          return `### [${text(repo.name)}](${url})\n\n${repo.description ? text(repo.description) + '\n\n' : ''}${repo.language ? text(repo.language) + ' · ' : ''}${repo.stargazers_count} stars${repo.fork ? ' · Fork' : ''}`;
        })
        .join('\n\n')}`
    );
  }
  if (sections.snake && config.snakeReady) {
    const snake = image(
      EXTRA_WIDGETS.snake(user.login),
      'Contribution snake animation',
      'width="100%"'
    );
    if (snake) add(`## Contribution snake\n\n${snake}`);
  }
  return parts.length ? `${parts.join('\n\n')}\n` : '';
};
