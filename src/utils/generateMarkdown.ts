// import type { GeneratorConfig } from '../types';
// import { extractLanguages, skillsToIconKeys } from '../hooks/useGithub';

// const SECTION_GIFS: Record<string, string> = {
//   coding: 'https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif',
//   thinking: 'https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif',
//   working: 'https://media.giphy.com/media/LMt9638dO8dftAjtco/giphy.gif',
// };

// const encodeUrl = (text: string) =>
//   encodeURIComponent(text.trim()).replace(/%20/g, '+').replace(/'/g, '%27').replace(/[()]/g, '');

// // Enforce max char length on typing lines so they don't overflow the SVG
// const sanitizeTypingLine = (line: string) =>
//   encodeUrl(line.replace(/"/g, '').replace(/Line \d+:.*/i, '').trim().slice(0, 50));

// export const generateReadme = (config: GeneratorConfig): string => {
//   const { theme, headerStyle, headerColor, socialLinks, sections, aiContent, userData: user, repos, jobTitle } = config;
//   if (!user) return '';

//   const displayName = user.name || user.login;
//   const langs = extractLanguages(repos);

//   // Skill icons: prefer AI's rich skills list, fall back to repo languages
//   const skillSource = aiContent?.skills?.length
//     ? aiContent.skills
//     : langs;
//   const skillIconKeys = skillsToIconKeys(skillSource);

//   // Typing lines: sanitize each to max 50 chars, no formatting instructions
//   const typingLines = aiContent?.typingLines?.length
//     ? aiContent.typingLines
//         .map(l => l.replace(/Line \d+:.*?['"]/i, '').replace(/['"]/g, '').trim())
//         .filter(l => l.length > 2 && l.length < 80)
//         .map(sanitizeTypingLine)
//         .join(';')
//     : [
//         encodeUrl(jobTitle || 'Software Engineer'),
//         encodeUrl(displayName + ' · GitHub'),
//         encodeUrl('Open Source Enthusiast'),
//         encodeUrl('Let\'s build something great!'),
//       ].join(';');

//   // Header color resolution
//   const bannerColor = headerColor.includes(':')
//     ? 'auto:' + headerColor
//     : headerColor.replace('#', '');

//   let md = '';

//   // ─── WAVE BANNER ────────────────────────────────────────────────────────────
//   if (sections.header) {
//     md += `<img width="100%" src="https://capsule-render.vercel.app/api?type=${headerStyle}&color=${bannerColor}&height=220&section=header&text=${encodeUrl(displayName)}&fontSize=52&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=${encodeUrl(jobTitle || user.bio || 'Full Stack Developer')}&descAlignY=58&descSize=22" />\n\n`;
//   }

//   // ─── VISITOR COUNTER + SOCIAL ────────────────────────────────────────────────
//   md += `<div align="center">\n`;
//   md += `  <img src="https://komarev.com/ghpvc/?username=${user.login}&label=Profile+Views&color=blueviolet&style=flat-square" alt="profile views" />\n`;
//   if (user.followers) {
//     md += `  <img src="https://img.shields.io/github/followers/${user.login}?label=Followers&style=flat-square&color=blue&labelColor=1a1a2e" alt="followers" />\n`;
//   }
//   md += `</div>\n\n`;

//   // ─── TYPING ANIMATION ────────────────────────────────────────────────────────
//   if (sections.typing) {
//     md += `<div align="center">\n`;
//     md += `  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=2800&pause=900&color=6366F1&center=true&vCenter=true&multiline=false&width=600&height=50&lines=${typingLines}" alt="Typing SVG" />\n`;
//     md += `</div>\n\n---\n\n`;
//   }

//   // ─── SOCIAL BADGES ───────────────────────────────────────────────────────────
//   if (sections.socialBadges) {
//     const badges: string[] = [];
//     if (socialLinks.linkedin)
//       badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${socialLinks.linkedin})`);
//     if (socialLinks.twitter || user.twitter_username)
//       badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${socialLinks.twitter || 'https://twitter.com/' + user.twitter_username})`);
//     if (socialLinks.portfolio || user.blog)
//       badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF6B6B?style=for-the-badge&logo=safari&logoColor=white)](${socialLinks.portfolio || user.blog})`);
//     if (socialLinks.email || user.email)
//       badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socialLinks.email || user.email})`);
//     if (badges.length) {
//       md += `<div align="center">\n\n${badges.join('\n')}\n\n</div>\n\n`;
//     }
//   }

//   // ─── ABOUT ME ────────────────────────────────────────────────────────────────
//   if (sections.aboutCode) {
//     md += `## 💫 About Me\n\n`;
//     md += `<img align="right" width="280" src="${SECTION_GIFS.coding}" alt="Coding GIF" />\n\n`;

//     // AI written bio (should be third person)
//     if (aiContent?.aboutMe) {
//       md += `${aiContent.aboutMe.trim()}\n\n`;
//     }

//     // Code block summary
//     const techList = (aiContent?.skills?.length ? aiContent.skills.slice(0, 10) : langs.slice(0, 6))
//       .map(s => `"${s}"`)
//       .join(', ');
//     const currentlyLearning = aiContent?.currentlyLearning?.replace(/^[^a-zA-Z]*/, '').trim() || 'Always exploring new technologies';
//     const funFact0 = aiContent?.funFacts?.[0] || 'I debug with console.log and I\'m not ashamed';

//     md += `\`\`\`typescript\nconst ${user.login.replace(/[^a-zA-Z0-9_]/g, '_')} = {\n`;
//     md += `  name:     "${displayName}",\n`;
//     if (jobTitle) md += `  role:     "${jobTitle}",\n`;
//     if (user.location) md += `  location: "${user.location}",\n`;
//     if (user.company) md += `  company:  "${user.company}",\n`;
//     md += `  techStack: [${techList}],\n`;
//     md += `  learning:  "${currentlyLearning}",\n`;
//     md += `  funFact:   "${funFact0}",\n`;
//     md += `  hireable:  true,\n`;
//     md += `};\n\`\`\`\n\n`;

//     // AI quote
//     if (aiContent?.quote) {
//       md += `<br/>\n\n<div align="center">\n\n> 💭 *"${aiContent.quote.trim()}"*\n\n</div>\n\n`;
//     }
//   }

//   // ─── TECH STACK & SKILLS ─────────────────────────────────────────────────────
//   if (sections.skillIcons) {
//     md += `## 🛠️ Tech Stack & Skills\n\n`;
//     md += `<div align="center">\n\n`;
//     md += `[![Skills](https://skillicons.dev/icons?i=${skillIconKeys}&theme=dark&perline=12)](https://skillicons.dev)\n\n`;

//     // Also show text badges for skills that don't have icons
//     if (aiContent?.skills?.length && aiContent.skills.length > 6) {
//       md += `</div>\n\n`;
//       // Shields.io text badges for additional context  
//       const techCategories = [
//         { label: 'Frontend', keywords: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'HTML', 'CSS', 'TypeScript', 'JavaScript', 'Tailwind'] },
//         { label: 'Backend', keywords: ['Node.js', 'Express', 'Django', 'FastAPI', 'Flask', 'Spring', 'NestJS'] },
//         { label: 'Database', keywords: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'SQLite', 'Supabase'] },
//         { label: 'DevOps & Cloud', keywords: ['Docker', 'AWS', 'GCP', 'Azure', 'Vercel', 'Kubernetes', 'Jenkins', 'Git'] },
//       ];

//       const categorizedBadges = techCategories
//         .map(cat => {
//           const matched = aiContent.skills.filter(s => cat.keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
//           if (!matched.length) return '';
//           return `**${cat.label}:** ${matched.map(s => `\`${s}\``).join(' · ')}`;
//         })
//         .filter(Boolean)
//         .join('  \n');

//       if (categorizedBadges) {
//         md += `<div align="left">\n\n${categorizedBadges}\n\n</div>\n\n`;
//       }
//     } else {
//       md += `</div>\n\n`;
//     }
//   }

//   // ─── FUN FACTS ───────────────────────────────────────────────────────────────
//   if (sections.funFacts && aiContent?.funFacts?.length) {
//     md += `## ⚡ Fun Facts & More\n\n`;
//     md += `<img align="right" width="220" src="${SECTION_GIFS.thinking}" alt="Thinking GIF" />\n\n`;
//     aiContent.funFacts.forEach(fact => {
//       md += `- 🎯 ${fact.trim()}\n`;
//     });
//     if (aiContent.dreamProject) {
//       md += `- 🚀 **Dream Project:** ${aiContent.dreamProject.trim()}\n`;
//     }
//     md += `\n<br clear="right"/>\n\n`;
//   }

//   // ─── GITHUB TROPHIES ─────────────────────────────────────────────────────────
//   if (sections.trophies) {
//     md += `## 🏆 GitHub Trophies\n\n`;
//     md += `<div align="center">\n\n`;
//     md += `<img src="https://github-profile-trophy.vercel.app/?username=${user.login}&theme=${theme}&no-frame=true&no-bg=false&row=1&column=7&margin-w=8&margin-h=8" alt="trophies" />\n\n`;
//     md += `</div>\n\n`;
//   }

//   // ─── GITHUB STATS ────────────────────────────────────────────────────────────
//   if (sections.stats || sections.streak || sections.languages) {
//     md += `## 📊 GitHub Statistics\n\n`;
//     md += `<div align="center">\n\n`;

//     if (sections.stats && sections.streak) {
//       md += `<img src="https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=${theme}&hide_border=true&bg_color=0D1117&include_all_commits=true&count_private=true&rank_icon=github" height="180" alt="stats" />\n`;
//       md += `<img src="https://streak-stats.demolab.com?user=${user.login}&theme=${theme}&hide_border=true&background=0D1117&stroke=6366f1&ring=a855f7&fire=22d3ee" height="180" alt="streak" />\n\n`;
//     } else if (sections.stats) {
//       md += `<img src="https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=${theme}&hide_border=true&bg_color=0D1117&include_all_commits=true&count_private=true" height="180" alt="stats" />\n\n`;
//     } else if (sections.streak) {
//       md += `<img src="https://streak-stats.demolab.com?user=${user.login}&theme=${theme}&hide_border=true&background=0D1117" height="180" alt="streak" />\n\n`;
//     }

//     if (sections.languages) {
//       md += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&layout=compact&theme=${theme}&hide_border=true&bg_color=0D1117&langs_count=12&card_width=400" height="165" alt="top languages" />\n\n`;
//     }

//     md += `</div>\n\n`;
//   }

//   // ─── ACTIVITY GRAPH ──────────────────────────────────────────────────────────
//   if (sections.activityGraph) {
//     md += `## 📈 Contribution Activity\n\n`;
//     md += `<div align="center">\n\n`;
//     md += `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&bg_color=0d1117&color=6366f1&line=a855f7&point=22d3ee&area=true&hide_border=true&area_color=6366f120" alt="activity graph" width="100%"/>\n\n`;
//     md += `</div>\n\n`;
//   }

//   // ─── TOP PROJECTS ────────────────────────────────────────────────────────────
//   if (sections.topRepos && repos.length > 0) {
//     md += `## 🚀 Featured Projects\n\n`;
//     md += `<div align="center">\n\n`;
//     repos.slice(0, 6).forEach(repo => {
//       md += `<a href="${repo.html_url}">\n  <img src="https://github-readme-stats.vercel.app/api/pin/?username=${user.login}&repo=${repo.name}&theme=${theme}&hide_border=true&bg_color=0D1117&title_color=6366f1&icon_color=a855f7" />\n</a>\n`;
//     });
//     md += `\n</div>\n\n`;
//   }

//   // ─── SNAKE ANIMATION ─────────────────────────────────────────────────────────
//   if (sections.snake) {
//     md += `## 🐍 My Contribution Snake\n\n`;
//     md += `<div align="center">\n\n`;
//     md += `<img src="https://raw.githubusercontent.com/${user.login}/${user.login}/output/github-snake-dark.svg" alt="Snake animation" />\n\n`;
//     md += `> **Setup:** Add [this GitHub Action](https://github.com/Platane/snk) to your profile repo to generate your snake animation automatically.\n\n`;
//     md += `</div>\n\n`;
//   }

//   // ─── FOOTER ──────────────────────────────────────────────────────────────────
//   md += `---\n\n`;
//   md += `<div align="center">\n\n`;
//   if (aiContent?.tagline) {
//     md += `### ✨ "${aiContent.tagline}"\n\n`;
//   }
//   md += `*${displayName} · ${user.public_repos} repos · ${user.followers} followers*\n\n`;
//   md += `</div>\n\n`;

//   if (sections.header) {
//     md += `<img width="100%" src="https://capsule-render.vercel.app/api?type=${headerStyle}&color=${bannerColor}&height=120&section=footer" />\n`;
//   }

//   return md;
// };
// ============================================================
//  generateMarkdown.ts  (rewritten)
//  Every profile gets a unique, creative README.
//  Sections, layouts, GIFs, code-block styles, dividers and
//  colour palettes are chosen based on the developer's actual
//  archetype so no two outputs look the same.
// ============================================================

import type { GeneratorConfig } from '../types';
import { extractLanguages, skillsToIconKeys } from '../hooks/useGithub';
import {
  pick,
  detectArchetype, getGifsForArchetype,
  getCodeBlockStyle,
  TYPING_FONTS, TYPING_COLORS,
  SECTION_EMOJIS,
  FOOTER_QUOTES,
  DIVIDERS,
  EXTRA_WIDGETS,
  CODING_GIFS, THINKING_GIFS, WORKING_GIFS,
} from './creativeAssets';

// ─── Helpers ────────────────────────────────────────────────

const encodeUrl = (text: string) =>
  encodeURIComponent(text.trim())
    .replace(/%20/g, '+')
    .replace(/'/g, '%27')
    .replace(/[()]/g, '');

const sanitizeLine = (line: string, maxLen = 50) =>
  encodeUrl(
    line
      .replace(/"/g, '')
      .replace(/Line \d+:.*/i, '')
      .trim()
      .slice(0, maxLen)
  );

const divider = (style: keyof typeof DIVIDERS) => {
  const d = DIVIDERS[style];
  return d === '---' ? '\n---\n\n' : `\n<img src="${d}" width="100%" />\n\n`;
};

// ─── Seeded RNG (mulberry32) ─────────────────────────────────
// Produces stable picks for the same seed so style tweaks
// on Step 2 don't scramble GIFs/emojis/dividers.
function makeRng(seed: number) {
  let s = seed * 2_654_435_761 >>> 0;
  return function(): number {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4_294_967_296;
  };
}

function seededPick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ─── Main ────────────────────────────────────────────────────

export const generateReadme = (config: GeneratorConfig): string => {
  const {
    theme, headerStyle, headerColor, socialLinks,
    sections, aiContent, userData: user, repos, jobTitle,
    creativeSeed,
  } = config;
  if (!user) return '';

  // Stable seeded RNG — same picks for same seed, so style tweaks
  // on Step 2 don't scramble GIFs / emojis.
  const rng = makeRng(creativeSeed ?? Math.random());
  const sp = <T>(arr: T[]) => seededPick(arr, rng);

  const displayName  = user.name || user.login;
  const langs        = extractLanguages(repos);
  const archetype    = detectArchetype(langs, repos);
  const codeStyle    = getCodeBlockStyle(archetype);
  const archetypeGifs = getGifsForArchetype(archetype);

  // All creative choices are seeded and stable
  const typingFont   = sp(TYPING_FONTS);
  const typingColor  = sp(TYPING_COLORS);
  const divStyle     = sp(['colored', 'fire', 'wave', 'solar', 'cut'] as const);
  const mainGif      = sp(archetypeGifs);
  const sideGif      = sp([...THINKING_GIFS, ...WORKING_GIFS]);
  const footerGif    = sp(CODING_GIFS);
  const footerQuote  = sp(FOOTER_QUOTES);

  // Section emojis
  const emo = {
    about:    sp(SECTION_EMOJIS.about),
    tech:     sp(SECTION_EMOJIS.tech),
    stats:    sp(SECTION_EMOJIS.stats),
    projects: sp(SECTION_EMOJIS.projects),
    contact:  sp(SECTION_EMOJIS.contact),
    fun:      sp(SECTION_EMOJIS.fun),
    trophies: sp(SECTION_EMOJIS.trophies),
    activity: sp(SECTION_EMOJIS.activity),
    snake:    sp(SECTION_EMOJIS.snake),
  };

  // Skill icons
  const skillSource   = aiContent?.skills?.length ? aiContent.skills : langs;
  const skillIconKeys = skillsToIconKeys(skillSource);

  // Typing lines
  const typingLines = aiContent?.typingLines?.length
    ? aiContent.typingLines
        .map(l => l.replace(/Line \d+:.*?['"]/i, '').replace(/['"]/g, '').trim())
        .filter(l => l.length > 2 && l.length < 80)
        .map(l => sanitizeLine(l))
        .join(';')
    : [
        encodeUrl(jobTitle || 'Software Engineer'),
        encodeUrl(displayName),
        encodeUrl('Open Source Enthusiast'),
        encodeUrl("Let's build something great!"),
      ].join(';');

  // Header color
  const bannerColor = headerColor.includes(':')
    ? 'auto:' + headerColor
    : headerColor === 'gradient'
    ? 'gradient'
    : headerColor.replace('#', '');

  // ─────────────────────────────────────────────────────────
  // Header banner — fully deterministic from user's selection
  // NEVER random. The user chose it, it stays locked.
  // ─────────────────────────────────────────────────────────
  const HEADER_STYLE_PRESETS: Record<string, { capsuleType: string; animation: string; height: number }> = {
    wave:     { capsuleType: 'waving',   animation: 'twinkling', height: 220 },
    venom:    { capsuleType: 'venom',    animation: 'fadeIn',    height: 200 },
    slice:    { capsuleType: 'slice',    animation: 'twinkling', height: 200 },
    cylinder: { capsuleType: 'cylinder', animation: 'blinking',  height: 180 },
    shark:    { capsuleType: 'shark',    animation: 'twinkling', height: 200 },
  };
  const headerPreset = HEADER_STYLE_PRESETS[headerStyle] ?? HEADER_STYLE_PRESETS['wave'];
  const { capsuleType, animation: bannerAnimation, height: bannerHeight } = headerPreset;

  let md = '';

  // ──────────────────────────────────────────────────────────
  // 1. HEADER BANNER
  // ──────────────────────────────────────────────────────────
  if (sections.header) {
    md += `<img width="100%" src="${EXTRA_WIDGETS.capsuleHeader(
      encodeUrl(displayName),
      encodeUrl(jobTitle || user.bio || 'Full Stack Developer'),
      capsuleType,
      bannerColor,
      bannerHeight,
      bannerAnimation,
    )}" />\n\n`;
  }

  // ──────────────────────────────────────────────────────────
  // 2. VISITOR COUNTER + FOLLOWERS
  // ──────────────────────────────────────────────────────────
  // Visitor counter — always show; followers only if > 0; skip stars badge
  // (the dynamic stars URL often returns stale or zero results which looks bad)
  md += `<div align="center">\n`;
  md += `  <img src="${EXTRA_WIDGETS.profileViews(user.login)}" alt="profile views" />\n`;
  if (user.followers > 0) {
    md += `  <img src="${EXTRA_WIDGETS.followers(user.login)}" alt="followers" />\n`;
  }
  md += `</div>\n\n`;

  // ──────────────────────────────────────────────────────────
  // 3. TYPING ANIMATION
  // ──────────────────────────────────────────────────────────
  if (sections.typing) {
    md += `<div align="center">\n`;
    md += `  <img src="${EXTRA_WIDGETS.typingSvg(typingLines, typingFont, typingColor)}" alt="Typing SVG" />\n`;
    md += `</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 4. SOCIAL BADGES
  // ──────────────────────────────────────────────────────────
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
    // Always add GitHub link
    badges.push(`[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${user.login})`);

    if (badges.length) {
      md += `<div align="center">\n\n${badges.join('\n')}\n\n</div>\n\n`;
    }
  }

  // ──────────────────────────────────────────────────────────
  // 5. ABOUT ME  — flat layout (no tables + code fences mixed)
  // ──────────────────────────────────────────────────────────
  if (sections.aboutCode) {
    md += `## ${emo.about} About Me\n\n`;

    // GIF pinned to the right using align — but ONLY the GIF, nothing complex
    // alongside it so there's nothing to overflow.
    md += `<img align="right" width="260" src="${mainGif}" alt="Developer GIF" />\n\n`;

    // AI bio: short paragraph — stays beside the GIF naturally
    if (aiContent?.aboutMe) {
      // Keep bio to max 3 sentences so it fits beside the GIF
      const sentences = aiContent.aboutMe.trim().split(/(?<=[.!?])\s+/);
      const shortBio = sentences.slice(0, 3).join(' ');
      md += `${shortBio}\n\n`;
    }

    // Bullet-point highlights (no code fences — safe beside float)
    const skillSnippet = (aiContent?.skills?.length ? aiContent.skills.slice(0, 6) : langs.slice(0, 6)).join(' · ');
    const learning = aiContent?.currentlyLearning?.replace(/^[^a-zA-Z]*/, '').trim() || 'Always exploring new technologies';

    md += `- ${sp(['🔧','💻','⚡','🎯'])} **Tech:** ${skillSnippet}\n`;
    if (user.location) md += `- 🌍 **Location:** ${user.location}\n`;
    if (jobTitle) md += `- 🚀 **Role:** ${jobTitle}\n`;
    md += `- 🌱 **Learning:** ${learning}\n`;
    md += `- ⭐ **GitHub since:** ${new Date(user.created_at).getFullYear()}\n\n`;

    // Clear the float BEFORE the code block so code is always full-width
    md += `<br clear="right" />\n\n`;

    // Creative code block — full-width, no float context
    md += buildCodeBlock({
      style: codeStyle,
      username: user.login,
      displayName,
      jobTitle,
      location: user.location,
      company: user.company,
      skills: aiContent?.skills?.length ? aiContent.skills.slice(0, 10) : langs.slice(0, 6),
      learning,
      funFact: aiContent?.funFacts?.[0] || "I debug with console.log and I'm not ashamed",
      joinYear: new Date(user.created_at).getFullYear(),
      repos: user.public_repos,
      followers: user.followers,
    });

    // Quote block — full-width, centered
    if (aiContent?.quote) {
      md += `<div align="center">\n\n> ${sp(['💭', '✨', '⚡', '🧠', '🔥'])} *"${aiContent.quote.trim()}"*\n\n</div>\n\n`;
    }
  }

  md += divider(divStyle);

  // ──────────────────────────────────────────────────────────
  // 6. TECH STACK
  // ──────────────────────────────────────────────────────────
  if (sections.skillIcons) {
    md += `## ${emo.tech} Tech Stack & Skills\n\n`;
    md += `<div align="center">\n\n`;
    md += `[![My Skills](${EXTRA_WIDGETS.skillIcons(skillIconKeys)})](https://skillicons.dev)\n\n`;
    md += `</div>\n\n`;

    // Categorised text badges for rich skill display
    if (aiContent?.skills?.length && aiContent.skills.length > 5) {
      const categories = [
        { label: '🎨 Frontend',       kw: ['React','Next.js','Vue','Angular','Svelte','HTML','CSS','TypeScript','JavaScript','Tailwind','Redux','Three.js','Astro'] },
        { label: '⚙️ Backend',        kw: ['Node.js','Express','Django','FastAPI','Flask','Spring','NestJS','Go','Rust','PHP','Ruby','Rails','GraphQL','REST'] },
        { label: '🗄️ Database',       kw: ['MongoDB','PostgreSQL','MySQL','Redis','Firebase','SQLite','Supabase','DynamoDB','Cassandra','Prisma'] },
        { label: '☁️ Cloud & DevOps', kw: ['Docker','AWS','GCP','Azure','Vercel','Netlify','Kubernetes','Jenkins','Terraform','CI/CD','Git','Linux'] },
        { label: '🤖 AI & ML',        kw: ['TensorFlow','PyTorch','Pandas','NumPy','Scikit-learn','Jupyter','OpenCV','HuggingFace','LangChain'] },
        { label: '📱 Mobile',         kw: ['React Native','Flutter','Swift','Kotlin','Expo','Android','iOS'] },
      ];

      const rows = categories
        .map(cat => {
          const matched = aiContent.skills.filter(s =>
            cat.kw.some(k => s.toLowerCase().includes(k.toLowerCase()))
          );
          return matched.length
            ? `| ${cat.label} | ${matched.map(s => `\`${s}\``).join(' ')} |`
            : '';
        })
        .filter(Boolean);

      if (rows.length) {
        md += `<div align="left">\n\n| Category | Technologies |\n|---|---|\n${rows.join('\n')}\n\n</div>\n\n`;
      }
    }
  }

  md += divider(divStyle);

  // ──────────────────────────────────────────────────────────
  // 7. FUN FACTS  (with side GIF)
  // ──────────────────────────────────────────────────────────
  if (sections.funFacts && aiContent?.funFacts?.length) {
    md += `## ${emo.fun} Fun Facts\n\n`;

    // Fun facts as bullet list — full width, no table
    aiContent.funFacts.forEach(fact => {
      md += `- ${sp(['🎯','⚡','🔥','💡','🚀','🎲','🌙','☕','🦄'])} ${fact.trim()}\n`;
    });
    if (aiContent.dreamProject) {
      md += `\n**${sp(['🌟','🚀','💎','🔭'])} Dream Project:** ${aiContent.dreamProject.trim()}\n`;
    }
    if (aiContent.currentlyLearning) {
      md += `\n**${sp(['📚','🌱','🔬','⚗️'])} Currently Mastering:** ${aiContent.currentlyLearning.trim()}\n`;
    }
    md += `\n`;

    // GIF centered below the list — not beside it
    md += `<div align="center">\n\n<img src="${sideGif}" width="300" alt="GIF" />\n\n</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 8. GITHUB TROPHIES
  // ──────────────────────────────────────────────────────────
  if (sections.trophies) {
    md += `## ${emo.trophies} GitHub Trophies\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="${EXTRA_WIDGETS.trophy(user.login, theme)}" alt="trophies" />\n\n`;
    md += `</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 9. GITHUB STATISTICS
  // ──────────────────────────────────────────────────────────
  if (sections.stats || sections.streak || sections.languages) {
    md += `## ${emo.stats} GitHub Statistics\n\n`;
    md += `<div align="center">\n\n`;

    if (sections.stats) {
      md += `<img src="${EXTRA_WIDGETS.stats(user.login, theme)}" height="180" alt="GitHub Stats" />\n`;
    }
    if (sections.streak) {
      md += `<img src="${EXTRA_WIDGETS.streak(user.login, theme)}" height="180" alt="GitHub Streak" />\n`;
    }
    md += '\n';
    if (sections.languages) {
      md += `<img src="${EXTRA_WIDGETS.topLangs(user.login, theme)}" height="165" alt="Top Languages" />\n\n`;
    }

    // Profile summary cards (extra richness)
    md += `<img src="${EXTRA_WIDGETS.summaryCards(user.login, theme)}" alt="Profile Summary" width="100%" />\n\n`;
    md += `</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 10. ACTIVITY GRAPH
  // ──────────────────────────────────────────────────────────
  if (sections.activityGraph) {
    md += `## ${emo.activity} Contribution Activity\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="${EXTRA_WIDGETS.activityGraph(user.login)}" alt="Contribution Graph" width="100%" />\n\n`;
    md += `</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 11. FEATURED PROJECTS
  // ──────────────────────────────────────────────────────────
  if (sections.topRepos && repos.length > 0) {
    md += `## ${emo.projects} Featured Projects\n\n`;

    // Top 2 repos with rich description blocks
    const featured = repos.slice(0, 2);
    if (featured.length === 2) {
      md += `<table>\n<tr>\n`;
      featured.forEach(repo => {
        md += `<td width="50%" valign="top">\n\n`;
        md += `### ${pick(['🚀','⚡','🌟','🔥','💡'])} [${repo.name}](${repo.html_url})\n\n`;
        if (repo.description) md += `${repo.description}\n\n`;
        md += `**Stack:** \`${repo.language || 'Various'}\` · `;
        md += `⭐ ${repo.stargazers_count} · 🍴 ${repo.forks_count}\n\n`;
        md += `</td>\n`;
      });
      md += `</tr>\n</table>\n\n`;
    }

    // Rest as stat cards
    md += `<div align="center">\n\n`;
    repos.slice(0, 6).forEach(repo => {
      md += `<a href="${repo.html_url}">\n  <img src="${EXTRA_WIDGETS.repoCard(user.login, repo.name, theme)}" />\n</a>\n`;
    });
    md += `\n</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 12. SNAKE ANIMATION
  // ──────────────────────────────────────────────────────────
  if (sections.snake) {
    md += `## ${emo.snake} Contribution Snake\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="${EXTRA_WIDGETS.snake(user.login)}" alt="GitHub Snake Animation" />\n\n`;
    md += `<details>\n<summary>🛠️ How to set up your Snake animation</summary>\n\n`;
    md += `Create \`.github/workflows/snake.yml\` in your profile repo:\n\n`;
    md += `\`\`\`yaml\nname: Generate Snake\non:\n  schedule: [{cron: '0 0 * * *'}]\n  workflow_dispatch:\njobs:\n  generate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: Platane/snk@v3\n        with:\n          github_user_token: \${{ secrets.GITHUB_TOKEN }}\n          outputs: |\n            dist/github-snake.svg\n            dist/github-snake-dark.svg?palette=github-dark\n      - uses: crazy-max/ghaction-github-pages@v3\n        with:\n          target_branch: output\n          build_dir: dist\n        env:\n          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n\`\`\`\n\n`;
    md += `</details>\n\n`;
    md += `</div>\n\n`;
    md += divider(divStyle);
  }

  // ──────────────────────────────────────────────────────────
  // 13. FOOTER
  // ──────────────────────────────────────────────────────────
  md += `<div align="center">\n\n`;
  if (aiContent?.tagline) {
    md += `### ${sp(['✨','⚡','🌟','🔥'])} *"${aiContent.tagline}"*\n\n`;
  } else {
    md += `### ${sp(['✨','💫','⚡'])} *"${footerQuote}"*\n\n`;
  }

  // Animated footer GIF
  md += `<img src="${footerGif}" width="200" alt="Thanks for visiting" />\n\n`;
  md += `*Thanks for stopping by! ${sp(['🙏','👋','🤝','🚀','⭐'])} — ${displayName} · ${user.public_repos} repos · ${user.followers} followers*\n\n`;

  // Show interest in open source / hiring
  md += `![Open Source Love](https://img.shields.io/badge/Open%20Source-❤️-red?style=flat-square)\n`;
  md += `![Built with Love](https://img.shields.io/badge/Built%20with-☕%20%26%20Code-brown?style=flat-square)\n\n`;

  md += `</div>\n\n`;

  // Footer capsule banner
  if (sections.header) {
    md += `<img width="100%" src="${EXTRA_WIDGETS.capsuleFooter(capsuleType, bannerColor)}" />\n`;
  }

  return md;
};

// ─── Code Block Builder ──────────────────────────────────────

interface CodeBlockParams {
  style: 'typescript' | 'python' | 'yaml' | 'json' | 'bash';
  username: string;
  displayName: string;
  jobTitle?: string;
  location?: string | null;
  company?: string | null;
  skills: string[];
  learning: string;
  funFact: string;
  joinYear: number;
  repos: number;
  followers: number;
}

function buildCodeBlock(p: CodeBlockParams): string {
  const safeLogin = p.username.replace(/[^a-zA-Z0-9_]/g, '_');
  const skillList = p.skills.map(s => `"${s}"`).join(', ');

  switch (p.style) {

    case 'python':
      return `\`\`\`python\nclass ${safeLogin.charAt(0).toUpperCase() + safeLogin.slice(1)}:\n    name       = "${p.displayName}"\n    role       = "${p.jobTitle || 'Software Engineer'}"\n${p.location ? `    location   = "${p.location}"\n` : ''}${p.company ? `    company    = "${p.company}"\n` : ''}    tech_stack = [${skillList}]\n    learning   = "${p.learning}"\n    fun_fact   = "${p.funFact}"\n    github_since = ${p.joinYear}\n    open_to_work = True\n\n    def __init__(self):\n        self.coffee = float("inf")  # essential dependency\n        self.passion = "Building things that matter"\n\n    def greet(self):\n        return f"Hey! I'm {p.displayName}, nice to meet you 👋"\n\`\`\`\n\n`;

    case 'yaml':
      return `\`\`\`yaml\ndeveloper:\n  name: "${p.displayName}"\n  role: "${p.jobTitle || 'Software Engineer'}"${p.location ? `\n  location: "${p.location}"` : ''}${p.company ? `\n  company: "${p.company}"` : ''}\n  github_since: ${p.joinYear}\n  tech_stack:\n${p.skills.slice(0, 8).map(s => `    - ${s}`).join('\n')}\n  currently_learning: "${p.learning}"\n  fun_fact: "${p.funFact}"\n  open_to_work: true\n  contact:\n    github: "github.com/${p.username}"\n\`\`\`\n\n`;

    case 'json':
      return `\`\`\`json\n{\n  "name": "${p.displayName}",\n  "role": "${p.jobTitle || 'Software Engineer'}",${p.location ? `\n  "location": "${p.location}",` : ''}${p.company ? `\n  "company": "${p.company}",` : ''}\n  "github_since": ${p.joinYear},\n  "repos": ${p.repos},\n  "followers": ${p.followers},\n  "tech_stack": [${skillList}],\n  "currently_learning": "${p.learning}",\n  "fun_fact": "${p.funFact}",\n  "open_to_opportunities": true\n}\n\`\`\`\n\n`;

    case 'bash':
      return `\`\`\`bash\n$ whoami\n${p.username}\n\n$ cat profile.txt\nName:     ${p.displayName}\nRole:     ${p.jobTitle || 'Software Engineer'}${p.location ? `\nLocation: ${p.location}` : ''}${p.company ? `\nCompany:  ${p.company}` : ''}\nOn GitHub since ${p.joinYear}\n\n$ cat skills.json | jq '.stack'\n[${skillList}]\n\n$ echo "Currently learning: ${p.learning}"\n\n$ git log --oneline\n* Open to new opportunities ✓\n* ${p.funFact}\n\`\`\`\n\n`;

    case 'typescript':
    default:
      return `\`\`\`typescript\nconst ${safeLogin} = {\n  name:     "${p.displayName}",\n  role:     "${p.jobTitle || 'Software Engineer'}",${p.location ? `\n  location: "${p.location}",` : ''}${p.company ? `\n  company:  "${p.company}",` : ''}\n  techStack: [${skillList}],\n  learning:  "${p.learning}",\n  funFact:   "${p.funFact}",\n  since:     ${p.joinYear},\n  hireable:  true,\n} as const;\n\`\`\`\n\n`;
  }
}