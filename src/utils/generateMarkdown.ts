import type { GeneratorConfig } from '../types';
import { extractLanguages, skillsToIconKeys } from '../hooks/useGithub';

const SECTION_GIFS: Record<string, string> = {
  coding: 'https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif',
  thinking: 'https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif',
  working: 'https://media.giphy.com/media/LMt9638dO8dftAjtco/giphy.gif',
};

const encodeUrl = (text: string) =>
  encodeURIComponent(text.trim()).replace(/%20/g, '+').replace(/'/g, '%27').replace(/[()]/g, '');

// Enforce max char length on typing lines so they don't overflow the SVG
const sanitizeTypingLine = (line: string) =>
  encodeUrl(line.replace(/"/g, '').replace(/Line \d+:.*/i, '').trim().slice(0, 50));

export const generateReadme = (config: GeneratorConfig): string => {
  const { theme, headerStyle, headerColor, socialLinks, sections, aiContent, userData: user, repos, jobTitle } = config;
  if (!user) return '';

  const displayName = user.name || user.login;
  const langs = extractLanguages(repos);

  // Skill icons: prefer AI's rich skills list, fall back to repo languages
  const skillSource = aiContent?.skills?.length
    ? aiContent.skills
    : langs;
  const skillIconKeys = skillsToIconKeys(skillSource);

  // Typing lines: sanitize each to max 50 chars, no formatting instructions
  const typingLines = aiContent?.typingLines?.length
    ? aiContent.typingLines
        .map(l => l.replace(/Line \d+:.*?['"]/i, '').replace(/['"]/g, '').trim())
        .filter(l => l.length > 2 && l.length < 80)
        .map(sanitizeTypingLine)
        .join(';')
    : [
        encodeUrl(jobTitle || 'Software Engineer'),
        encodeUrl(displayName + ' · GitHub'),
        encodeUrl('Open Source Enthusiast'),
        encodeUrl('Let\'s build something great!'),
      ].join(';');

  // Header color resolution
  const bannerColor = headerColor.includes(':')
    ? 'auto:' + headerColor
    : headerColor.replace('#', '');

  let md = '';

  // ─── WAVE BANNER ────────────────────────────────────────────────────────────
  if (sections.header) {
    md += `<img width="100%" src="https://capsule-render.vercel.app/api?type=${headerStyle}&color=${bannerColor}&height=220&section=header&text=${encodeUrl(displayName)}&fontSize=52&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=${encodeUrl(jobTitle || user.bio || 'Full Stack Developer')}&descAlignY=58&descSize=22" />\n\n`;
  }

  // ─── VISITOR COUNTER + SOCIAL ────────────────────────────────────────────────
  md += `<div align="center">\n`;
  md += `  <img src="https://komarev.com/ghpvc/?username=${user.login}&label=Profile+Views&color=blueviolet&style=flat-square" alt="profile views" />\n`;
  if (user.followers) {
    md += `  <img src="https://img.shields.io/github/followers/${user.login}?label=Followers&style=flat-square&color=blue&labelColor=1a1a2e" alt="followers" />\n`;
  }
  md += `</div>\n\n`;

  // ─── TYPING ANIMATION ────────────────────────────────────────────────────────
  if (sections.typing) {
    md += `<div align="center">\n`;
    md += `  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=2800&pause=900&color=6366F1&center=true&vCenter=true&multiline=false&width=600&height=50&lines=${typingLines}" alt="Typing SVG" />\n`;
    md += `</div>\n\n---\n\n`;
  }

  // ─── SOCIAL BADGES ───────────────────────────────────────────────────────────
  if (sections.socialBadges) {
    const badges: string[] = [];
    if (socialLinks.linkedin)
      badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${socialLinks.linkedin})`);
    if (socialLinks.twitter || user.twitter_username)
      badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${socialLinks.twitter || 'https://twitter.com/' + user.twitter_username})`);
    if (socialLinks.portfolio || user.blog)
      badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF6B6B?style=for-the-badge&logo=safari&logoColor=white)](${socialLinks.portfolio || user.blog})`);
    if (socialLinks.email || user.email)
      badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socialLinks.email || user.email})`);
    if (badges.length) {
      md += `<div align="center">\n\n${badges.join('\n')}\n\n</div>\n\n`;
    }
  }

  // ─── ABOUT ME ────────────────────────────────────────────────────────────────
  if (sections.aboutCode) {
    md += `## 💫 About Me\n\n`;
    md += `<img align="right" width="280" src="${SECTION_GIFS.coding}" alt="Coding GIF" />\n\n`;

    // AI written bio (should be third person)
    if (aiContent?.aboutMe) {
      md += `${aiContent.aboutMe.trim()}\n\n`;
    }

    // Code block summary
    const techList = (aiContent?.skills?.length ? aiContent.skills.slice(0, 10) : langs.slice(0, 6))
      .map(s => `"${s}"`)
      .join(', ');
    const currentlyLearning = aiContent?.currentlyLearning?.replace(/^[^a-zA-Z]*/, '').trim() || 'Always exploring new technologies';
    const funFact0 = aiContent?.funFacts?.[0] || 'I debug with console.log and I\'m not ashamed';

    md += `\`\`\`typescript\nconst ${user.login.replace(/[^a-zA-Z0-9_]/g, '_')} = {\n`;
    md += `  name:     "${displayName}",\n`;
    if (jobTitle) md += `  role:     "${jobTitle}",\n`;
    if (user.location) md += `  location: "${user.location}",\n`;
    if (user.company) md += `  company:  "${user.company}",\n`;
    md += `  techStack: [${techList}],\n`;
    md += `  learning:  "${currentlyLearning}",\n`;
    md += `  funFact:   "${funFact0}",\n`;
    md += `  hireable:  true,\n`;
    md += `};\n\`\`\`\n\n`;

    // AI quote
    if (aiContent?.quote) {
      md += `<br/>\n\n<div align="center">\n\n> 💭 *"${aiContent.quote.trim()}"*\n\n</div>\n\n`;
    }
  }

  // ─── TECH STACK & SKILLS ─────────────────────────────────────────────────────
  if (sections.skillIcons) {
    md += `## 🛠️ Tech Stack & Skills\n\n`;
    md += `<div align="center">\n\n`;
    md += `[![Skills](https://skillicons.dev/icons?i=${skillIconKeys}&theme=dark&perline=12)](https://skillicons.dev)\n\n`;

    // Also show text badges for skills that don't have icons
    if (aiContent?.skills?.length && aiContent.skills.length > 6) {
      md += `</div>\n\n`;
      // Shields.io text badges for additional context  
      const techCategories = [
        { label: 'Frontend', keywords: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'HTML', 'CSS', 'TypeScript', 'JavaScript', 'Tailwind'] },
        { label: 'Backend', keywords: ['Node.js', 'Express', 'Django', 'FastAPI', 'Flask', 'Spring', 'NestJS'] },
        { label: 'Database', keywords: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'SQLite', 'Supabase'] },
        { label: 'DevOps & Cloud', keywords: ['Docker', 'AWS', 'GCP', 'Azure', 'Vercel', 'Kubernetes', 'Jenkins', 'Git'] },
      ];

      const categorizedBadges = techCategories
        .map(cat => {
          const matched = aiContent.skills.filter(s => cat.keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
          if (!matched.length) return '';
          return `**${cat.label}:** ${matched.map(s => `\`${s}\``).join(' · ')}`;
        })
        .filter(Boolean)
        .join('  \n');

      if (categorizedBadges) {
        md += `<div align="left">\n\n${categorizedBadges}\n\n</div>\n\n`;
      }
    } else {
      md += `</div>\n\n`;
    }
  }

  // ─── FUN FACTS ───────────────────────────────────────────────────────────────
  if (sections.funFacts && aiContent?.funFacts?.length) {
    md += `## ⚡ Fun Facts & More\n\n`;
    md += `<img align="right" width="220" src="${SECTION_GIFS.thinking}" alt="Thinking GIF" />\n\n`;
    aiContent.funFacts.forEach(fact => {
      md += `- 🎯 ${fact.trim()}\n`;
    });
    if (aiContent.dreamProject) {
      md += `- 🚀 **Dream Project:** ${aiContent.dreamProject.trim()}\n`;
    }
    md += `\n<br clear="right"/>\n\n`;
  }

  // ─── GITHUB TROPHIES ─────────────────────────────────────────────────────────
  if (sections.trophies) {
    md += `## 🏆 GitHub Trophies\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="https://github-profile-trophy.vercel.app/?username=${user.login}&theme=${theme}&no-frame=true&no-bg=false&row=1&column=7&margin-w=8&margin-h=8" alt="trophies" />\n\n`;
    md += `</div>\n\n`;
  }

  // ─── GITHUB STATS ────────────────────────────────────────────────────────────
  if (sections.stats || sections.streak || sections.languages) {
    md += `## 📊 GitHub Statistics\n\n`;
    md += `<div align="center">\n\n`;

    if (sections.stats && sections.streak) {
      md += `<img src="https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=${theme}&hide_border=true&bg_color=0D1117&include_all_commits=true&count_private=true&rank_icon=github" height="180" alt="stats" />\n`;
      md += `<img src="https://streak-stats.demolab.com?user=${user.login}&theme=${theme}&hide_border=true&background=0D1117&stroke=6366f1&ring=a855f7&fire=22d3ee" height="180" alt="streak" />\n\n`;
    } else if (sections.stats) {
      md += `<img src="https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=${theme}&hide_border=true&bg_color=0D1117&include_all_commits=true&count_private=true" height="180" alt="stats" />\n\n`;
    } else if (sections.streak) {
      md += `<img src="https://streak-stats.demolab.com?user=${user.login}&theme=${theme}&hide_border=true&background=0D1117" height="180" alt="streak" />\n\n`;
    }

    if (sections.languages) {
      md += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&layout=compact&theme=${theme}&hide_border=true&bg_color=0D1117&langs_count=12&card_width=400" height="165" alt="top languages" />\n\n`;
    }

    md += `</div>\n\n`;
  }

  // ─── ACTIVITY GRAPH ──────────────────────────────────────────────────────────
  if (sections.activityGraph) {
    md += `## 📈 Contribution Activity\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&bg_color=0d1117&color=6366f1&line=a855f7&point=22d3ee&area=true&hide_border=true&area_color=6366f120" alt="activity graph" width="100%"/>\n\n`;
    md += `</div>\n\n`;
  }

  // ─── TOP PROJECTS ────────────────────────────────────────────────────────────
  if (sections.topRepos && repos.length > 0) {
    md += `## 🚀 Featured Projects\n\n`;
    md += `<div align="center">\n\n`;
    repos.slice(0, 6).forEach(repo => {
      md += `<a href="${repo.html_url}">\n  <img src="https://github-readme-stats.vercel.app/api/pin/?username=${user.login}&repo=${repo.name}&theme=${theme}&hide_border=true&bg_color=0D1117&title_color=6366f1&icon_color=a855f7" />\n</a>\n`;
    });
    md += `\n</div>\n\n`;
  }

  // ─── SNAKE ANIMATION ─────────────────────────────────────────────────────────
  if (sections.snake) {
    md += `## 🐍 My Contribution Snake\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="https://raw.githubusercontent.com/${user.login}/${user.login}/output/github-snake-dark.svg" alt="Snake animation" />\n\n`;
    md += `> **Setup:** Add [this GitHub Action](https://github.com/Platane/snk) to your profile repo to generate your snake animation automatically.\n\n`;
    md += `</div>\n\n`;
  }

  // ─── FOOTER ──────────────────────────────────────────────────────────────────
  md += `---\n\n`;
  md += `<div align="center">\n\n`;
  if (aiContent?.tagline) {
    md += `### ✨ "${aiContent.tagline}"\n\n`;
  }
  md += `*${displayName} · ${user.public_repos} repos · ${user.followers} followers*\n\n`;
  md += `</div>\n\n`;

  if (sections.header) {
    md += `<img width="100%" src="https://capsule-render.vercel.app/api?type=${headerStyle}&color=${bannerColor}&height=120&section=footer" />\n`;
  }

  return md;
};
