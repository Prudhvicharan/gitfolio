import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, EMPTY_CONTENT } from '../src/utils/content.ts';
import { assessExportQuality } from '../src/utils/readiness.ts';

const config = {
  userData: {
    login: 'example',
    id: 1,
    name: 'Example',
    bio: null,
    public_repos: 1,
    followers: 0,
  },
  repos: [],
  sections: PRESETS.balanced,
  socialLinks: {},
  aiContent: null,
  theme: 'radical',
  headerStyle: 'wave',
  headerColor: '#312E81',
  jobTitle: '',
};

test('export quality warns without blocking an incomplete honest draft', () => {
  const result = assessExportQuality(config, '## About me\n');
  assert.equal(result.items.find((item) => item.label === 'Profile imported').complete, true);
  assert.equal(result.items.find((item) => item.label === 'Bio completed').complete, false);
  assert.match(result.issues.join(' '), /About Me section is empty/);
  assert.match(result.issues.join(' '), /No featured repositories/);
});

test('export quality catches suspicious links, weak projects, and raw escapes', () => {
  const result = assessExportQuality(
    {
      ...config,
      socialLinks: { portfolio: 'javascript:alert(1)' },
      repos: [{
        id: 1,
        name: 'empty',
        full_name: 'example/empty',
        html_url: 'https://github.com/example/empty',
        description: null,
        stargazers_count: 0,
        language: null,
        forks_count: 0,
        fork: false,
        topics: [],
      }],
      aiContent: { ...EMPTY_CONTENT, aboutMe: 'I build useful software.' },
      jobTitle: 'Developer',
    },
    'Visible\\. artifact'
  );
  assert.match(result.issues.join(' '), /lack a description/);
  assert.match(result.issues.join(' '), /contact links/);
  assert.match(result.issues.join(' '), /escaping artifact/);
});
