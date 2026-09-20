// Optional QA tools live outside the application dependency graph. See REVIEW.md.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
export const qaRoot = process.env.GITFOLIO_QA_ROOT || '/tmp/gitfolio-qa';
export const qaRequire = createRequire(resolve(qaRoot, 'package.json'));
export const { chromium } = qaRequire('playwright');
export const AxeBuilder = qaRequire('@axe-core/playwright').default;
export const baseURL = process.env.GITFOLIO_QA_URL || 'http://127.0.0.1:4173/';
const output = process.env.GITFOLIO_QA_OUTPUT || join(qaRoot, 'artifacts');
mkdirSync(output, { recursive: true });
export const artifactPath = (name) => join(output, name);
