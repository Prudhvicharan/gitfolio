import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const deployment = JSON.parse(
  readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')
);
const headers = Object.fromEntries(
  deployment.headers[0].headers.map(
    ({ key, value }: { key: string; value: string }) => [key, value]
  )
);
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: { headers },
});
