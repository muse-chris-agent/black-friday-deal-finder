// DealHound hand-in (Node 22, standard library only): the site is this
// directory's app/ folder, plain static files a browser opens at
// app/index.html (ES modules, CSS, no build step), its deals held in its own
// files: nothing it runs, styles or shows loads over the network, and each
// deal links out to its store. The program hands it in: it copies app/ and
// screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads (your screenshots, the
// first load's files and bytes, and your source), with the vendored make.fun
// library. Leave vendor/makefun-frontend.ts as it is: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Count the files a hand-in carries, so the summary can say what it holds.
function countFiles(dir) {
  let n = 0;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    n += name.isDirectory() ? countFiles(join(dir, name.name)) : 1;
  }
  return n;
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Hand-in sanity check: the site is nothing without its front page, and the
// judge reads screenshots, so refuse to hand in an empty set of either.
const appFiles = countFiles(join(out, 'app'));
const shotFiles = readdirSync(join(out, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (!existsSync(join(out, 'app', 'index.html')) || appFiles === 0 || shotFiles.length === 0) {
  throw new Error('DealHound hand-in is empty: app/index.html or screenshots/ is missing');
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// The dossier is the judge's summary of the entry: confirm it actually
// landed and is not empty before reporting the hand-in as done, and that it
// names every screenshot the hand-in carries.
const dossierBytes = statSync(dossierPath).size;
if (dossierBytes === 0) throw new Error('dossier.json was written empty');
const dossierText = readFileSync(dossierPath, 'utf8');
for (const shot of shotFiles) {
  if (!dossierText.includes(shot)) throw new Error(`dossier.json does not name screenshot ${shot}`);
}
if (!dossierText.includes('index.html')) throw new Error('dossier.json does not name app/index.html');
const appBytes = readdirSync(join(out, 'app')).reduce((n, f) => n + statSync(join(out, 'app', f)).size, 0);
console.log(`DealHound: ${appFiles} app files (${appBytes} bytes), ${shotFiles.length} screenshots -> ${out}`);
console.log(`DealHound: dossier ${dossierPath} (${dossierBytes} bytes), shots: ${shotFiles.join(', ')}`);
