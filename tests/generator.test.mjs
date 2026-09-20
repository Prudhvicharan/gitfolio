import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateReadme,
  generateSnakeWorkflow,
} from '../src/utils/generateMarkdown.ts';
import {
  EMPTY_CONTENT,
  PRESETS,
  validateAIContent,
  safeUrl,
} from '../src/utils/content.ts';
import { fetchProfile, normalizeUsername } from '../src/hooks/useGithub.ts';
const user = {
  login: 'example',
  name: 'Example',
  bio: null,
  followers: 0,
  public_repos: 0,
  created_at: '2020-01-01',
};
const config = {
  userData: user,
  repos: [],
  sections: { ...PRESETS.animated, trophies: true },
  socialLinks: {},
  aiContent: null,
  theme: 'radical',
  headerStyle: 'wave',
  headerColor: 'gradient',
  jobTitle: '',
  creativeSeed: 0.5,
};
test('empty accounts receive no invented skills, achievements or availability', () => {
  const md = generateReadme(config);
  assert.doesNotMatch(
    md,
    /Pull Shark|Starstruck|hireable|Open to work|skillicons/
  );
  assert.equal(md, generateReadme(config));
});
test('all section switches are authoritative, including links', () => {
  assert.equal(
    generateReadme({
      ...config,
      socialLinks: { linkedin: 'https://linkedin.com/in/example' },
      sections: Object.fromEntries(
        Object.keys(config.sections).map((k) => [k, false])
      ),
    }),
    ''
  );
});
test('untrusted profile values are escaped and unsafe URLs omitted', () => {
  const md = generateReadme({
    ...config,
    userData: {
      ...user,
      name: '<iframe src="https://evil.test"></iframe>',
      bio: '[click](javascript:alert(1))',
    },
    socialLinks: { portfolio: 'javascript:alert(1)' },
  });
  assert.doesNotMatch(md, /<iframe|\[Portfolio\]/);
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('https://user:pass@example.com'), null);
  assert.equal(safeUrl('example.com'), 'https://example.com/');
});
test('malformed AI objects are rejected at the boundary', () => {
  assert.throws(() => validateAIContent({ ...EMPTY_CONTENT, aboutMe: {} }));
  assert.throws(() => validateAIContent({ ...EMPTY_CONTENT, skills: [42] }));
  assert.deepEqual(validateAIContent(EMPTY_CONTENT), EMPTY_CONTENT);
});
test('snake is opt-in and its workflow includes account and write permissions', () => {
  assert.doesNotMatch(
    generateReadme({
      ...config,
      sections: { ...config.sections, snake: true },
    }),
    /github-snake/
  );
  const workflow = generateSnakeWorkflow('example');
  assert.match(workflow, /github_user_name: example/);
  assert.match(workflow, /contents: write/);
  assert.match(workflow, /github_token:/);
});
test('username normalization rejects path and query injection', () => {
  assert.equal(normalizeUsername(' @octocat '), 'octocat');
  for (const value of ['https://github.com/x', 'x?admin=1', 'a--b', '-x'])
    assert.throws(() => normalizeUsername(value));
});
test('repository failure remains visible rather than pretending the account is empty', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) =>
    url.includes('/repos?')
      ? new Response('', { status: 503 })
      : Response.json(user);
  try {
    const result = await fetchProfile('example');
    assert.match(result.warning, /incomplete/);
    assert.equal(result.user.login, 'example');
  } finally {
    globalThis.fetch = original;
  }
});
test('pagination retains older repositories and forks for user selection', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    if (!url.includes('/repos?'))
      return Response.json({ ...user, public_repos: 101 });
    return Response.json(
      url.endsWith('page=1')
        ? Array.from({ length: 100 }, (_, id) => ({
            id,
            name: `repo-${id}`,
            stargazers_count: 0,
            fork: false,
          }))
        : [{ id: 101, name: 'older', stargazers_count: 100, fork: true }]
    );
  };
  try {
    const result = await fetchProfile('example');
    assert.equal(calls, 3);
    assert.equal(result.repos.length, 101);
    assert.equal(result.repos[0].name, 'older');
  } finally {
    globalThis.fetch = original;
  }
});

test('removed widgets stay out of exported Markdown', () => {
  const md = generateReadme(config);
  const src = md.match(/src="([^"]+)"/)[1].replaceAll('&amp;', '&');
  assert.ok(
    !generateReadme({ ...config, disabledWidgetUrls: [src] }).includes(
      src.split('&')[0]
    )
  );
});

test('custom header gradients use the provider syntax without a random-color prefix', () => {
  const md = generateReadme({ ...config, headerColor: '0:3F3FFF,100:8B21F8' });
  assert.match(md, /color=0:3F3FFF,100:8B21F8/);
  assert.doesNotMatch(md, /color=auto:/);
});

test('review content, centered animation, and native work snapshot reach the export', () => {
  const md = generateReadme({
    ...config,
    sections: { ...config.sections, funFacts: true, typing: true, activityGraph: true },
    aiContent: {
      ...EMPTY_CONTENT,
      tagline: 'Building useful things',
      aboutMe: 'I build practical software.',
      quote: 'Make it useful.',
      funFacts: ['I enjoy small tools.'],
      dreamProject: 'An accessible developer assistant.',
      currentlyLearning: 'Accessibility testing',
      skills: ['TypeScript'],
      typingLines: ['Builder', 'Problem solver'],
    },
  });
  assert.match(md, /<div align="center">[\s\S]*readme-typing-svg/);
  assert.match(md, /Building useful things/);
  assert.match(md, /I enjoy small tools/);
  assert.match(md, /An accessible developer assistant/);
  assert.match(md, /## Public work snapshot/);
  assert.doesNotMatch(md, /github-profile-summary-cards\.vercel\.app/);
});

test('visual directions generate genuinely different compositions', () => {
  const content = {
    ...EMPTY_CONTENT,
    aboutMe: 'I build useful software.',
    skills: ['TypeScript', 'Python'],
    focusAreas: ['Developer tools', 'Accessible interfaces'],
    workingStyle: ['Start with the user problem'],
    currentGoals: ['Ship an open-source tool'],
  };
  const editorial = generateReadme({ ...config, layout: 'editorial', aiContent: content });
  const aurora = generateReadme({ ...config, layout: 'aurora', aiContent: content });
  assert.doesNotMatch(editorial, /const developer/);
  assert.match(aurora, /const developer/);
  assert.match(aurora, /Technology constellation/);
  assert.notEqual(editorial, aurora);
});

test('content security policy permits current providers and excludes unreliable stats hosts', async () => {
  const { readFile } = await import('node:fs/promises');
  const policy = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8')).headers[0].headers[0].value;
  assert.match(policy, /https:\/\/img\.shields\.io/);
  assert.doesNotMatch(policy, /github-readme-stats|eight-theta|activity-graph|summary-cards/);
});

test('statistics and language mix render without remote image services', () => {
  const repo = {
    id: 1,
    name: 'native-profile',
    description: 'A profile project',
    language: 'TypeScript',
    stargazers_count: 3,
    forks_count: 2,
    fork: false,
    topics: ['accessibility', 'developer-tools'],
  };
  const md = generateReadme({
    ...config,
    repos: [repo],
    sections: { ...config.sections, stats: true, languages: true, streak: false },
  });
  assert.match(md, /Engineering footprint/);
  assert.match(md, /Language mix/);
  assert.match(md, /TypeScript/);
  assert.doesNotMatch(md, /github-readme-stats/);
});

test('widget checks include only distinct HTTPS image URLs and decode query separators', async () => {
  const { widgetUrls } = await import('../src/utils/checkWidgets.ts');
  assert.deepEqual(
    widgetUrls(
      '<img src="https://example.com/a?a=1&amp;b=2" /><img src="https://example.com/a?a=1&amp;b=2" /><img src="javascript:alert(1)" />'
    ),
    ['https://example.com/a?a=1&b=2']
  );
});
