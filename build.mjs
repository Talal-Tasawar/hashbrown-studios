// The deploy workflow runs `npm run build` and publishes ./dist.
// The site is a single self-contained page, so the build just copies it.
import { mkdirSync, copyFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
for (const file of ['index.html', '404.html', 'robots.txt', 'sitemap.xml']) copyFileSync(file, `dist/${file}`);
