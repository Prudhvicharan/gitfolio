import type { GeneratorConfig } from '../types';
import { extractLanguages, skillsToIconKeys } from '../hooks/useGithub';
import { EXTRA_WIDGETS, TYPING_COLORS, TYPING_FONTS } from './creativeAssets';
import { htmlAttribute, markdownText, safeUrl } from './content';

export function generateSnakeWorkflow(): string {
  return `name: GitHub Snake Game

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate contribution snake animations
        uses: Platane/snk@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark
            dist/ocean.gif?color_snake=orange&color_dots=#bfd6f6,#8dbdff,#64a1f4,#4b91f1,#3c7dd9
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Deploy to output branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: output
          force_orphan: true
          commit_message: "Update snake animation [skip ci]"
`;
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
  const layout = config.layout ?? 'studio';
  const title = (label: string, symbol: string) =>
    `## ${layout === 'aurora' ? `${symbol} ` : ''}${label}`;
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
    const about = [sections.header ? title(layout === 'aurora' ? 'The developer behind the code' : 'About me', '✦') : `<div align="center">\n<h1>Hi, I'm ${text(name)}</h1>${content?.tagline ? `\n<p><strong>${text(content.tagline)}</strong></p>` : ''}\n</div>`];
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
    if (layout === 'aurora' && content) {
      const safeCode = (value: string) => value.replace(/[`\r\n]/g, ' ').trim();
      const profile = [
        '```ts',
        'const developer = {',
        `  name: ${JSON.stringify(safeCode(name))},`,
        jobTitle ? `  role: ${JSON.stringify(safeCode(jobTitle))},` : '',
        content.focusAreas.length
          ? `  focus: ${JSON.stringify(content.focusAreas.map(safeCode))},`
          : '',
        skills.length
          ? `  toolkit: ${JSON.stringify(skills.slice(0, 8).map(safeCode))},`
          : '',
        content.currentlyLearning
          ? `  exploring: ${JSON.stringify(safeCode(content.currentlyLearning))},`
          : '',
        `  principle: ${JSON.stringify(safeCode(content.quote || 'Build with clarity and care.'))}`,
        '};',
        '```',
      ].filter(Boolean);
      add(profile.join('\n'));
    }
    if (content?.focusAreas.length) {
      add(`${title('What I build', '◈')}\n\n${content.focusAreas.map((area) => `- ${text(area)}`).join('\n')}`);
    }
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
    add(`${title('Connect', '◎')}\n\n<p align="${layout === 'editorial' ? 'left' : 'center'}">${links.join(' ')}</p>`);
  }
  if (sections.skillIcons) {
    const keys = skillsToIconKeys(skills);
    const widget = keys
      ? image(EXTRA_WIDGETS.skillIcons(keys), `Skills: ${skills.join(', ')}`)
      : '';
    if (widget) add(`${title(layout === 'aurora' ? 'Technology constellation' : 'Tools & technologies', '⌘')}\n\n${layout === 'editorial' ? widget : `<p align="center">${widget}</p>`}`);
  }
  if (sections.funFacts && content) {
    const notes = content.funFacts.map((fact) => `- ${text(fact)}`);
    if (content.dreamProject)
      notes.push(`- **I'd like to build:** ${text(content.dreamProject)}`);
    if (notes.length) add(`${title(layout === 'aurora' ? 'Beyond the code' : 'Personal notes', '◇')}\n\n${notes.join('\n')}`);
    if (content.workingStyle.length)
      add(`${title('How I work', '→')}\n\n${content.workingStyle.map((item) => `- ${text(item)}`).join('\n')}`);
    if (content.currentGoals.length)
      add(`${title('Now and next', '↗')}\n\n${content.currentGoals.map((item) => `- ${text(item)}`).join('\n')}`);
  }
  if (sections.trophies) {
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const forks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    add(
      `${title('At a glance', '◆')}\n\n<table><tr><td align="center"><strong>${user.public_repos}</strong><br/><sub>PUBLIC REPOSITORIES</sub></td><td align="center"><strong>${user.followers}</strong><br/><sub>FOLLOWERS</sub></td><td align="center"><strong>${stars}</strong><br/><sub>SELECTED REPO STARS</sub></td><td align="center"><strong>${forks}</strong><br/><sub>SELECTED REPO FORKS</sub></td></tr></table>`
    );
  }
  if (sections.stats) {
    const originals = repos.filter((repo) => !repo.fork).length;
    const topics = [...new Set(repos.flatMap((repo) => repo.topics || []))].slice(0, 8);
    add(`${title('Engineering footprint', '▦')}\n\n<table><tr><td align="center"><strong>${originals}</strong><br/><sub>ORIGINAL BUILDS</sub></td><td align="center"><strong>${repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)}</strong><br/><sub>REPOSITORY FORKS</sub></td><td align="center"><strong>${extractLanguages(repos).length}</strong><br/><sub>PRIMARY LANGUAGES</sub></td><td align="center"><strong>${topics.length}</strong><br/><sub>PROJECT TOPICS</sub></td></tr></table>${topics.length ? `\n\n<sub>FOCUS SIGNALS</sub>\n\n${topics.map(text).join(' · ')}` : ''}`);
  }
  if (sections.languages && repos.length) {
    const counts = new Map<string, number>();
    repos.forEach((repo) => {
      if (repo.language)
        counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
    });
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    const rows = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([language, count]) => {
        const percentage = Math.round((count / total) * 100);
        const filled = Math.max(1, Math.round(percentage / 10));
        return `<tr><td><strong>${htmlAttribute(language)}</strong></td><td><code>${'█'.repeat(filled)}${'░'.repeat(10 - filled)}</code></td><td align="right">${percentage}%</td></tr>`;
      });
    if (rows.length)
      add(`${title('Language mix', '◒')}\n\n<table>${rows.join('')}</table>`);
  }
  const stats: string[] = [];
  if (sections.streak)
    stats.push(
      image(
        EXTRA_WIDGETS.streak(user.login, theme),
        'GitHub contribution streak',
        'height="180"'
      )
    );
  if (stats.some(Boolean))
    add(`${title('Contribution streak', '◫')}\n\n${stats.filter(Boolean).join('\n')}`);
  if (sections.activityGraph) {
    const languages = extractLanguages(repos).slice(0, 5);
    const originals = repos.filter((repo) => !repo.fork).length;
    const summary = [
      `**${repos.length}** featured repositories`,
      `**${originals}** original projects`,
      languages.length ? `Working across **${languages.map(text).join(', ')}**` : '',
    ].filter(Boolean);
    add(`${title('Public work snapshot', '◉')}\n\n${summary.join(' · ')}`);
  }
  if (sections.topRepos && repos.length) {
    if (layout === 'editorial') {
      add(`${title('Selected work', '◆')}\n\n${repos.map((repo, index) => {
        const url = `https://github.com/${encodeURIComponent(user.login)}/${encodeURIComponent(repo.name)}`;
        const story = content?.projectStories[index] || repo.description || 'Explore the repository and its source code.';
        return `### [${text(repo.name)}](${url})\n\n${text(story)}\n\n<sub>${text([repo.language, `${repo.stargazers_count} ★`].filter(Boolean).join(' · '))}</sub>`;
      }).join('\n\n---\n\n')}`);
    } else {
      const cells = repos.map((repo, index) => {
      const url = `https://github.com/${encodeURIComponent(user.login)}/${encodeURIComponent(repo.name)}`;
      const meta = [repo.language, `${repo.stargazers_count} ★`, repo.fork ? 'Fork' : null].filter(Boolean).join(' · ');
      const story = content?.projectStories[index] || repo.description || 'Explore the repository and its source code.';
      const topics = (repo.topics || []).slice(0, 3).join(' · ');
      return `<td width="50%" valign="top"><h3><a href="${htmlAttribute(url)}">${htmlAttribute(repo.name)}</a></h3><p>${htmlAttribute(story)}</p>${topics ? `<p><sub>${htmlAttribute(topics)}</sub></p>` : ''}<sub>${htmlAttribute(meta)}</sub></td>`;
      });
      const rows: string[] = [];
      for (let index = 0; index < cells.length; index += 2)
        rows.push(`<tr>${cells[index]}${cells[index + 1] || '<td></td>'}</tr>`);
      add(`${title(layout === 'aurora' ? 'Featured builds' : 'Selected work', '🚀')}\n\n<table>${rows.join('')}</table>`);
    }
  }
  if (sections.snake && config.snakeReady) {
    const snake = image(
      EXTRA_WIDGETS.snake(user.login),
      'Contribution snake animation',
      'width="100%"'
    );
    if (snake) add(`## Contribution snake\n\n${snake}`);
  }
  if (layout !== 'editorial' && parts.length) {
    add(`<div align="center">\n<br/>\n<strong>${text(content?.collaborationPitch || content?.quote || 'Thanks for visiting — let’s build something meaningful.')}</strong>\n<br/><br/>\n<a href="https://github.com/${encodeURIComponent(user.login)}">Explore my work on GitHub →</a>\n</div>`);
  }
  return parts.length ? `${parts.join('\n\n')}\n` : '';
};
