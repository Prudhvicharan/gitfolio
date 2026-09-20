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
    const typing = image(
        EXTRA_WIDGETS.typingSvg(
          lines,
          TYPING_FONTS[seed % TYPING_FONTS.length],
          TYPING_COLORS[seed % TYPING_COLORS.length]
        ),
        'Animated profile introduction',
        'width="600" height="50"'
      );
    if (typing) add(`<div align="center">\n${typing}\n</div>`);
  }
  if (sections.aboutCode) {
    const about = [sections.header ? '## About me' : `<div align="center">\n<h1>Hi, I'm ${text(name)}</h1>${content?.tagline ? `\n<p><strong>${text(content.tagline)}</strong></p>` : ''}\n</div>`];
    if (sections.header && content?.tagline) about.push(`### ${text(content.tagline)}`);
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
    const badge = (label: string, url: string, logo: string, color: string) =>
      `<a href="${htmlAttribute(url)}"><img src="https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${htmlAttribute(label)}" /></a>`;
    const links = [badge('GitHub', `https://github.com/${encodeURIComponent(user.login)}`, 'github', '181717')];
    for (const [label, input] of [
      ['LinkedIn', socialLinks.linkedin],
      ['Twitter / X', socialLinks.twitter],
      ['Portfolio', socialLinks.portfolio],
    ] as const) {
      const url = safeUrl(input);
      if (url)
        links.push(badge(label, url, label === 'LinkedIn' ? 'linkedin' : label === 'Portfolio' ? 'googlechrome' : 'x', label === 'LinkedIn' ? '0A66C2' : '111827'));
    }
    if (
      socialLinks.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socialLinks.email)
    )
      links.push(badge('Email', `mailto:${encodeURIComponent(socialLinks.email)}`, 'gmail', 'B91C1C'));
    add(`## Connect\n\n<p align="left">${links.join(' ')}</p>`);
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
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    add(
      `## At a glance\n\n<table><tr><td align="center"><strong>${user.public_repos}</strong><br/><sub>PUBLIC REPOSITORIES</sub></td><td align="center"><strong>${user.followers}</strong><br/><sub>FOLLOWERS</sub></td><td align="center"><strong>${stars}</strong><br/><sub>SELECTED REPO STARS</sub></td><td align="center"><strong>${forks}</strong><br/><sub>SELECTED REPO FORKS</sub></td></tr></table>`
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
    const languages = extractLanguages(repos).slice(0, 5);
    const originals = repos.filter((repo) => !repo.fork).length;
    const summary = [
      `**${repos.length}** featured repositories`,
      `**${originals}** original projects`,
      languages.length ? `Working across **${languages.map(text).join(', ')}**` : '',
    ].filter(Boolean);
    add(`## Public work snapshot\n\n${summary.join(' · ')}`);
  }
  if (sections.topRepos && repos.length) {
    const cells = repos.map((repo) => {
      const url = `https://github.com/${encodeURIComponent(user.login)}/${encodeURIComponent(repo.name)}`;
      const meta = [repo.language, `${repo.stargazers_count} ★`, repo.fork ? 'Fork' : null].filter(Boolean).join(' · ');
      return `<td width="50%" valign="top"><h3><a href="${htmlAttribute(url)}">${htmlAttribute(repo.name)}</a></h3><p>${htmlAttribute(repo.description || 'Explore the repository and its source code.')}</p><sub>${htmlAttribute(meta)}</sub></td>`;
    });
    const rows: string[] = [];
    for (let index = 0; index < cells.length; index += 2)
      rows.push(`<tr>${cells[index]}${cells[index + 1] || '<td></td>'}</tr>`);
    add(`## Selected work\n\n<table>${rows.join('')}</table>`);
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
