import { GoogleGenAI } from '@google/genai';
import type { GithubUser, GithubRepo, AIContent } from '../types';
import { extractLanguages } from './useGithub';
import { detectArchetype } from '../utils/creativeAssets';

// Model preference order — most reliable free-tier models FIRST.
// IMPORTANT: more specific names must come BEFORE shorter prefixes so
// pickBestModels doesn't accidentally match "gemini-2.0-flash-lite-001"
// to the "gemini-2.0-flash" slot (leaving the lite slot empty).
// gemini-2.5 requires billing; 2.0-flash-lite / 1.5-flash are free tier.
const MODEL_PREFERENCE = [
  'gemini-2.0-flash-lite',   // most reliable free-tier; specific name first
  'gemini-2.0-flash',        // free tier
  'gemini-1.5-flash',        // free tier (may not exist in newer projects)
  'gemini-1.5-pro',          // free tier with limits
  'gemini-2.5-flash',        // requires billing
  'gemini-2.5-pro',          // requires billing
];

const buildPrompt = (user: GithubUser, repos: GithubRepo[], jobTitle: string): string => {
  const langs      = extractLanguages(repos).slice(0, 10);
  const archetype  = detectArchetype(langs, repos);
  const joinYear   = new Date(user.created_at).getFullYear();
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const repoDetails = repos.slice(0, 8).map(r =>
    `• "${r.name}" [${r.language || '?'}] ⭐${r.stargazers_count} — ${r.description || 'no description'} | forks: ${r.forks_count} | topics: ${r.topics?.slice(0,4).join(', ') || 'none'}`
  ).join('\n');

  return `You are a world-class technical copywriter specializing in GitHub profile branding.
Your job: generate deeply personalized, impressive, SPECIFIC content for a GitHub profile README.
Do NOT be generic. Every sentence must reference something real from the data below.

=== DEVELOPER PROFILE ===
Name:          ${user.name || user.login}
GitHub:        @${user.login}
Job title:     ${jobTitle || user.bio || 'Software Engineer'}
GitHub bio:    ${user.bio || 'Not provided'}
Location:      ${user.location || 'Unknown'}
Company:       ${user.company || 'Independent'}
Followers:     ${user.followers} | Following: ${user.following}
Public repos:  ${user.public_repos}
Total stars:   ${totalStars}
GitHub since:  ${joinYear} (${new Date().getFullYear() - joinYear} years)
Archetype:     ${archetype}
Top languages: ${langs.join(', ')}

Top repositories (study these deeply):
${repoDetails}

=== OUTPUT FORMAT ===
Return ONLY a raw JSON object. No markdown fences. No preamble. No trailing text.

{
  "tagline": "6-10 words. Punchy. References their ACTUAL tech/domain. NOT generic. Example: 'Architecting distributed systems, one commit at a time'",

  "aboutMe": "3-5 sentences in FIRST PERSON (I am...). Be specific: name their top repos, biggest tech, what year they joined GitHub, their total stars. Sound like a senior dev's portfolio bio — confident, technical, human. Avoid buzzwords like 'passionate' or 'love to code'.",

  "quote": "An ORIGINAL 1-2 sentence philosophy they'd actually say. NOT a famous quote. Something that feels like it came from their specific experience. Reference their domain.",

  "funFacts": [
    "Specific fact 1 — references an actual repo or skill they have. Max 15 words. Witty.",
    "Specific fact 2 — personality or habit angle. Max 15 words.",
    "Specific fact 3 — aspirational or humorous. Max 15 words. References their stack."
  ],

  "skills": [
    "Complete technology list inferred from repos, bio, languages, and topics.",
    "Include languages, frameworks, databases, cloud, devops, testing, design tools.",
    "Use exact standard names: React, Node.js, TypeScript, PostgreSQL, Docker, AWS, etc.",
    "Minimum 20 items, maximum 35. Be comprehensive — read repo topics carefully."
  ],

  "dreamProject": "2-3 sentences. An ambitious project they'd logically build given their actual stack and interests. Specific, not generic.",

  "currentlyLearning": "1-2 sentences. What they're logically leveling up in given their current repos. Natural progression.",

  "typingLines": [
    "Their role — short, punchy (max 40 chars)",
    "Their main tech (max 40 chars, e.g. 'React · TypeScript · Node.js')",
    "Something they build or a domain (max 40 chars)",
    "A personality line (max 40 chars, e.g. 'Coffee → Code → Ship ☕')",
    "An achievement or aspiration (max 40 chars)"
  ]
}

RULES:
- aboutMe MUST be first person: "I am...", "I build...", "I've spent..."
- Reference at least 2 actual repo names from the list above
- typingLines MUST be ≤ 45 characters each (they scroll in a tiny SVG)
- skills MUST include non-language tools (frameworks, cloud, DevOps)
- No em-dashes in JSON strings (use regular dash)
- No single quotes in JSON strings (use double)
- The output must be valid JSON parseable by JSON.parse()`;
};

const listAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => (m.name as string).replace('models/', ''));
  } catch {
    return [];
  }
};

const pickBestModels = (available: string[]): string[] => {
  const preferred: string[] = [];
  for (const pref of MODEL_PREFERENCE) {
    const match = available.find(a => a === pref || a.startsWith(pref + '-') || a === pref + '-latest');
    if (match && !preferred.includes(match)) preferred.push(match);
  }
  const rest = available.filter(a => !preferred.includes(a));
  return [...preferred, ...rest];
};

const makeUserFriendlyError = (err: any, availableModels: string[], triedModels: string[]): string => {
  const msg: string = err?.message || String(err);
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    const isZeroLimit = msg.includes('limit: 0') || msg.includes('"limit":0');
    if (isZeroLimit) {
      return `Some models had 0 free quota (usually newer models like 2.5 that require billing). \
Tried ${triedModels.length} models. If all failed, get a fresh API key from a new AI Studio project at aistudio.google.com.`;
    }
    return 'Rate limit hit. Please wait 1 minute and try again.';
  }
  if (msg.includes('400') || msg.includes('API_KEY_INVALID')) {
    return 'Invalid API key. Copy the complete key from aistudio.google.com/app/apikey.';
  }
  if (msg.includes('403')) {
    return 'API key lacks permission. Make sure the Gemini API is enabled for your project.';
  }
  if (triedModels.length >= 2 && availableModels.length > 0) {
    return `Tried ${triedModels.length} models (${triedModels.slice(0, 3).join(', ')}) but all failed. Get a fresh key from aistudio.google.com.`;
  }
  return msg.length > 300 ? msg.slice(0, 300) + '...' : msg;
};

export const generateAIContent = async (
  apiKey: string,
  user: GithubUser,
  repos: GithubRepo[],
  jobTitle: string,
  onLog?: (msg: string, type?: string) => void
): Promise<AIContent> => {
  const log = (msg: string, type = 'info') => onLog?.(msg, type);

  log('Initializing Gemini AI...', 'info');
  const ai = new GoogleGenAI({ apiKey });

  log(`Analyzing @${user.login}'s GitHub profile...`, 'info');
  await new Promise(r => setTimeout(r, 200));
  log(`Found ${repos.length} repositories · ${repos.reduce((s, r) => s + r.stargazers_count, 0)} total stars`, 'info');

  log('Discovering available models...', 'info');
  const availableModels = await listAvailableModels(apiKey);
  if (availableModels.length === 0) {
    log('Could not list models — trying defaults...', 'warning');
  } else {
    log(`Key has access to ${availableModels.length} models.`, 'success');
  }

  const modelsToTry = availableModels.length > 0
    ? pickBestModels(availableModels)
    : MODEL_PREFERENCE;

  log(`Trying: ${modelsToTry.slice(0, 3).join(', ')}...`, 'info');
  log('Sending to Gemini for creative writing...', 'ai');

  const prompt = buildPrompt(user, repos, jobTitle);
  const triedModels: string[] = [];
  let lastError: any;

  for (const modelName of modelsToTry) {
    triedModels.push(modelName);
    try {
      log(`→ ${modelName}`, 'ai');

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const text = response.text ?? '';
      if (!text) throw new Error('Empty response from model');

      log('Response received! Parsing...', 'ai');
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      let parsed: AIContent;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('AI returned unexpected format. Please try again.');
        parsed = JSON.parse(jsonMatch[0]);
      }

      log(`✓ Model: ${modelName}`, 'success');
      log('Tagline crafted ✓', 'success');
      log('Bio written ✓', 'success');
      log('Fun facts generated ✓', 'success');
      log('Skills mapped ✓', 'success');
      log('README content ready 🚀', 'success');
      return parsed;

    } catch (err: any) {
      lastError = err;
      const msg: string = err?.message || '';
      // Only hard-stop if the key itself is invalid — all other errors try next model
      if (msg.includes('API_KEY_INVALID')) break;
      if (msg.includes('403') && msg.includes('API_KEY')) break;
      // 0-free-quota means billing required on THIS model — always try next
      const isZeroLimit = msg.includes('limit: 0') || msg.includes('"limit":0') || msg.includes('0 free quota');
      if (isZeroLimit) {
        log(`  ✗ ${modelName}: no free quota (billing required) — trying next...`, 'warning');
        continue;
      }
      log(`  ✗ ${modelName} unavailable — trying next...`, 'warning');
      continue;
    }
  }

  throw new Error(makeUserFriendlyError(lastError, availableModels, triedModels));
};