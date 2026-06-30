import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['index.html', 'manifest.webmanifest', 'src/app.js', 'src/games.js', 'src/scoring.js', 'src/styles.css'];
await Promise.all(requiredFiles.map((file) => access(file)));
const html = await readFile('index.html', 'utf8');
for (const asset of ['src/app.js', 'src/styles.css', 'manifest.webmanifest']) {
  if (!html.includes(asset)) throw new Error(`index.html does not reference ${asset}`);
}
console.log(`Build check passed for ${requiredFiles.length} app files.`);
