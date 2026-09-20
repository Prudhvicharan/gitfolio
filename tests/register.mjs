import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Resolve the application's extensionless TypeScript imports for Node's test runner.
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && context.parentURL) {
    const url = new URL(specifier, context.parentURL);
    if (existsSync(fileURLToPath(url) + '.ts')) return next(url.href + '.ts', context);
    if (existsSync(fileURLToPath(url) + '/index.ts')) return next(url.href + '/index.ts', context);
  }
  return next(specifier, context);
}});
