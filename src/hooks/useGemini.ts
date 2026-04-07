import { GoogleGenAI } from '@google/genai';
import type { GithubUser, GithubRepo, AIContent } from '../types';
import { extractLanguages } from './useGithub';

// Preference order for model selection (shorter/exact names match what ListModels returns)
const MODEL_PREFERENCE = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

const buildPrompt = (user: GithubUser, repos: GithubRepo[], jobTitle: string): string => {
  const langs = extractLanguages(repos).slice(0, 10).join(', ');
  const repoDetails = repos
    .slice(0, 6)
    .map((r) => `• "${r.name}" [${r.language || '?'}] ⭐${r.stargazers_count} — ${r.description || 'no description'} | topics: ${r.topics?.join(', ') || 'none'}`)
    .join('\n');

  return `You are a world-class technical copywriter crafting an elite GitHub profile README for a developer.
Study every detail and generate content that feels personal, specific, and impressive — NOT generic.

=== DEVELOPER DATA ===
Name: ${user.name || user.login}
GitHub handle: @${user.login}
Job title: ${jobTitle || user.bio || 'Software Engineer'}
GitHub bio: ${user.bio || 'Not provided'}
Location: ${user.location || 'Unknown'}
Company: ${user.company || 'Unknown'}
Followers: ${user.followers} | Public repos: ${user.public_repos}
Primary languages from repos: ${langs}

Top repositories (analyze these deeply for tech stack inference):
${repoDetails}

=== YOUR TASK ===
Output ONLY a raw JSON object — no markdown, no code fences, no explanation.

{
  "tagline": "A punchy 6-10 word phrase capturing their developer identity. NOT generic — must reference their actual tech or domain. Example: 'Engineering intelligent UIs, one pixel at a time'",

  "aboutMe": "3-4 sentences in THIRD PERSON (as a professional bio, like 'John is a...'). Reference their ACTUAL repo names, technologies, and what problems they solve. Make it feel like a senior dev's LinkedIn summary. Impressive and specific.",

  "quote": "An original, memorable 1-2 sentence coding philosophy quote that feels like THEY wrote it. Poetic, fresh, NOT a famous quote. Must reference their tech domain.",

  "funFacts": [
    "Fun fact 1 — witty, specific, max 12 words, references actual repo or skill",
    "Fun fact 2 — different angle, maybe a habit or preference",
    "Fun fact 3 — aspirational or funny, based on their trajectory"
  ],

  "skills": [
    "List every technology inferred from their repos, bio, languages, and topics.",
    "Include: programming languages, frameworks, libraries, databases, cloud tools, DevOps tools, testing tools.",
    "Use exact standard names like: React, Node.js, TypeScript, MongoDB, Docker, AWS, Tailwind CSS, Express.js, PostgreSQL, Git.",
    "Include 25-35 items. Be comprehensive — analyze repo topics and descriptions for hidden tech."
  ],

  "dreamProject": "2-3 sentences about an ambitious project they'd build based on their actual skills and interests.",

  "currentlyLearning": "What they're likely learning next given their repos and trajectory. 2-3 short sentences.",

  "typingLines": [
    "Line 1: Their job title — short, punchy (max 40 chars). Example: 'Full Stack Engineer'",
    "Line 2: A passion statement, max 45 chars. Example: 'Building scalable web apps'",
    "Line 3: A technology statement, max 45 chars. Example: 'React · Node.js · TypeScript'",
    "Line 4: An action statement, max 45 chars. Example: 'Open Source Contributor'",
    "Line 5: A fun/personality line, max 45 chars. Example: 'Coffee → Code → Repeat ☕'"
  ]
}

CRITICAL RULES:
- aboutMe MUST be in first person ("I am...", NOT "${user.name || user.login} is...")
- typingLines MUST be SHORT (max 45 characters each) — they scroll in a typing animation
- skills MUST include frameworks and tools, not just languages
- Reference actual repo names like "${repos[0]?.name || 'their repos'}" in the aboutMe
- Make it sound like a HUMAN wrote it, not an AI`;
};

/** Returns exact model names from the API (e.g. "gemini-2.0-flash") */
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

/** Sort available models by preference order */
const pickBestModels = (available: string[]): string[] => {
  const preferred: string[] = [];
  const rest: string[] = [];

  // First add models that match our preference list (in preference order)
  for (const pref of MODEL_PREFERENCE) {
    const match = available.find(a => a === pref || a.startsWith(pref + '-') || a === pref + '-latest');
    if (match && !preferred.includes(match)) preferred.push(match);
  }

  // Then add remaining available models we haven't tried
  for (const a of available) {
    if (!preferred.includes(a)) rest.push(a);
  }

  return [...preferred, ...rest];
};

const makeUserFriendlyError = (err: any, availableModels: string[], triedModels: string[]): string => {
  const msg: string = err?.message || String(err);

  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    const isZeroLimit = msg.includes('limit: 0') || msg.includes('"limit":0') || msg.includes('limit\":0');
    if (isZeroLimit) {
      return [
        `Your API key has 0 free-tier quota for this model.`,
        availableModels.length > 0
          ? `Your key can see: ${availableModels.slice(0, 4).join(', ')} — but all have 0 quota.`
          : '',
        `This happens when a project has billing enabled but the specific model's free tier is not active.`,
        `Fix: Go to aistudio.google.com → Create a brand new project → Create a new API key → Use THAT key here.`,
      ].filter(Boolean).join(' ');
    }
    return 'Rate limit hit. Please wait 1 minute and try again.';
  }

  if (msg.includes('400') || msg.includes('API_KEY_INVALID')) {
    return 'Invalid API key. Make sure you copied the complete key from aistudio.google.com/app/apikey.';
  }

  if (msg.includes('403')) {
    return 'API key lacks permission. Make sure the Gemini API is enabled for your project.';
  }

  if (triedModels.length >= 2 && availableModels.length > 0) {
    return [
      `Tried ${triedModels.length} models (${triedModels.slice(0, 3).join(', ')}...) but all failed.`,
      `Your key can see ${availableModels.length} models but none accepted requests.`,
      `This is a quota issue. Try: Get a new key from a fresh AI Studio project (no billing needed).`,
    ].join(' ');
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

  log('Analyzing your GitHub profile...', 'info');
  await new Promise(r => setTimeout(r, 300));
  log(`Found ${repos.length} repositories to analyze...`, 'info');

  // Discover which models this key actually has access to
  log('Discovering available models for your key...', 'info');
  const availableModels = await listAvailableModels(apiKey);

  if (availableModels.length === 0) {
    log('Could not list models — will try defaults directly...', 'warning');
  } else {
    log(`Key has access to ${availableModels.length} models.`, 'success');
  }

  // Build an ordered list using EXACT model names from the API
  const modelsToTry = availableModels.length > 0
    ? pickBestModels(availableModels)
    : MODEL_PREFERENCE;

  log(`Will try: ${modelsToTry.slice(0, 3).join(', ')}${modelsToTry.length > 3 ? '...' : ''}`, 'info');
  log('Sending your profile to Gemini...', 'ai');

  const prompt = buildPrompt(user, repos, jobTitle);
  const triedModels: string[] = [];
  let lastError: any;

  for (const modelName of modelsToTry) {
    triedModels.push(modelName);
    try {
      log(`→ Trying ${modelName}`, 'ai');

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const text = response.text ?? '';
      if (!text) throw new Error('Empty response from model');

      log('AI response received! Parsing content...', 'ai');
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
      log('Bio generated ✓', 'success');
      log('Tagline crafted ✓', 'success');
      log('Fun facts written ✓', 'success');
      log('README content ready 🚀', 'success');
      return parsed;

    } catch (err: any) {
      lastError = err;
      const msg: string = err?.message || '';

      // Hard stops — no point trying more models
      if (msg.includes('API_KEY_INVALID') || msg.includes('400')) break;
      if (msg.includes('403')) break;

      // Quota with limit:0 — all models on this key will have same issue
      const isZeroLimit = msg.includes('limit: 0') || msg.includes('"limit":0') || msg.includes('limit\":0');
      if (isZeroLimit) break;

      // Model not available → try next
      log(`  ✗ ${modelName} not available`, 'warning');
      continue;
    }
  }

  throw new Error(makeUserFriendlyError(lastError, availableModels, triedModels));
};
