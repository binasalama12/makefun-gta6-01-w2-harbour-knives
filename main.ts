import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const sourceRoot = resolve(
  process.env.MAKEFUN_BOT_DIR || dirname(fileURLToPath(import.meta.url)),
);
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(outputDir, { recursive: true });
cpSync(resolve(sourceRoot, 'game'), resolve(outputDir, 'game'), { recursive: true });
cpSync(resolve(sourceRoot, 'screenshots'), resolve(outputDir, 'screenshots'), {
  recursive: true,
});

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
const dossierPath = resolve(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossier);
console.log(`Wrote dossier: ${dossierPath}`);
