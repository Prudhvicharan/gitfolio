import type { GithubRepo } from '../types';

export function isProfileRepository(repo: GithubRepo, username: string): boolean {
  return repo.name.toLowerCase() === username.toLowerCase();
}

function updatedTime(repo: GithubRepo): number {
  const value = repo.updated_at ? Date.parse(repo.updated_at) : 0;
  return Number.isFinite(value) ? value : 0;
}

function repositoryScore(repo: GithubRepo, referenceTime: number): number {
  const ageDays = repo.updated_at
    ? Math.max(0, (referenceTime - updatedTime(repo)) / 86_400_000)
    : Number.POSITIVE_INFINITY;
  const recency = Number.isFinite(ageDays)
    ? Math.max(0, 180 - Math.min(180, ageDays))
    : 0;
  return (
    (repo.fork ? 0 : 500) +
    (repo.description?.trim() ? 180 : 0) +
    recency +
    Math.min(repo.topics?.length || 0, 8) * 24 +
    Math.min(Math.log2((repo.stargazers_count || 0) + 1) * 45, 180) +
    (repo.language ? 60 : 0)
  );
}

export function rankRepositories(
  repos: GithubRepo[],
  username: string,
  referenceTime = Date.now()
): GithubRepo[] {
  return repos
    .filter((repo) => !isProfileRepository(repo, username))
    .sort(
      (a, b) =>
        repositoryScore(b, referenceTime) - repositoryScore(a, referenceTime) ||
        updatedTime(b) - updatedTime(a) ||
        b.stargazers_count - a.stargazers_count ||
        a.name.localeCompare(b.name)
    );
}

export function selectRecommendedRepositories(
  repos: GithubRepo[],
  username: string,
  limit = 6,
  referenceTime = Date.now()
): GithubRepo[] {
  return rankRepositories(repos, username, referenceTime).slice(0, limit);
}
