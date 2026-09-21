import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isProfileRepository,
  selectRecommendedRepositories,
} from '../src/utils/repositories.ts';

const repo = (name, values = {}) => ({
  id: name.length + Math.random(),
  name,
  full_name: `octocat/${name}`,
  html_url: `https://github.com/octocat/${name}`,
  description: null,
  stargazers_count: 0,
  language: null,
  forks_count: 0,
  fork: false,
  topics: [],
  updated_at: '2020-01-01T00:00:00Z',
  ...values,
});

test('profile repository is identified case-insensitively and excluded by default', () => {
  const profile = repo('OctoCat', {
    description: 'My profile README',
    stargazers_count: 100,
    language: 'TypeScript',
  });
  const project = repo('useful-project', { description: 'A useful tool' });
  assert.equal(isProfileRepository(profile, 'octocat'), true);
  assert.deepEqual(selectRecommendedRepositories([profile, project], 'octocat'), [project]);
});

test('default selection favors described, recent, original repositories with evidence', () => {
  const selected = selectRecommendedRepositories(
    [
      repo('empty'),
      repo('fork', { fork: true, description: 'A fork', stargazers_count: 50 }),
      repo('strong', {
        description: 'A complete application',
        language: 'TypeScript',
        topics: ['accessibility', 'developer-tools'],
        updated_at: new Date().toISOString(),
      }),
    ],
    'octocat',
    2
  );
  assert.equal(selected[0].name, 'strong');
  assert.equal(selected[1].name, 'empty');
});
