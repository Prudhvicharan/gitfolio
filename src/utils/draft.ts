import type { AIContent, GeneratorConfig, GithubRepo } from '../types';
import { PRESETS, validateAIContent } from './content';
export const DRAFT_KEY = 'gitfolio_draft_v1';
export interface Draft { config: GeneratorConfig; availableRepos: GithubRepo[]; }
export function readDraft(): Draft | null {
  try { return parseDraft(localStorage.getItem(DRAFT_KEY)); } catch { return null; }
}
export function parseDraft(raw: string | null): Draft | null {
  if (!raw || raw.length > 2_000_000) return null;
  try {
    const value = JSON.parse(raw);
    const c = value.config;
    const user = c?.userData;
    if (value.version !== 1 || !user || typeof user.login !== 'string' || !/^[a-z\d-]{1,39}$/i.test(user.login) || typeof user.public_repos !== 'number' || typeof user.followers !== 'number') return null;
    for (const key of ['name','bio','location','company','blog','email','twitter_username']) if (user[key] != null && typeof user[key] !== 'string') return null;
    const validRepo = (repo: GithubRepo) => repo && typeof repo.id === 'number' && typeof repo.name === 'string' && typeof repo.stargazers_count === 'number' && (repo.description == null || typeof repo.description === 'string') && (repo.language == null || typeof repo.language === 'string') && Array.isArray(repo.topics) && repo.topics.every(t=>typeof t==='string');
    if (!Array.isArray(value.availableRepos) || !value.availableRepos.every(validRepo) || !Array.isArray(c.repos) || !c.repos.every(validRepo)) return null;
    if (!['radical','tokyonight','dracula','github_dark','onedark','nord','catppuccin_mocha'].includes(c.theme) || !['wave','venom','slice','cylinder','shark'].includes(c.headerStyle)) return null;
    if (typeof c.headerColor !== 'string' || typeof c.jobTitle !== 'string' || !c.socialLinks || Object.values(c.socialLinks).some(v=>typeof v!=='string')) return null;
    if (!c.sections || Object.keys(PRESETS.balanced).some(key=>typeof c.sections[key]!=='boolean')) return null;
    const content: AIContent | null = c.aiContent ? validateAIContent(c.aiContent) : null;
    return {config:{ userData:user, repos:c.repos, theme:c.theme, headerStyle:c.headerStyle, headerColor:c.headerColor, sections:c.sections, socialLinks:c.socialLinks, jobTitle:c.jobTitle, aiContent:content, creativeSeed:typeof c.creativeSeed==='number'?c.creativeSeed:0.5, openToWork:c.openToWork===true, snakeReady:c.snakeReady===true, disabledWidgetUrls:Array.isArray(c.disabledWidgetUrls)?c.disabledWidgetUrls.filter((v: unknown)=>typeof v==='string'):[] },availableRepos:value.availableRepos};
  } catch { return null; }
}
export function writeDraft(draft: Draft): boolean {
  try {localStorage.setItem(DRAFT_KEY,JSON.stringify({version:1,...draft}));return true;} catch {return false;}
}
export function clearDraft(): void { try {localStorage.removeItem(DRAFT_KEY);} catch { /* Storage can be unavailable. */ } }
export function clearLegacyKey(): void { try {localStorage.removeItem('gitfolio_gemini_key');} catch { /* Never read a legacy credential. */ } }
