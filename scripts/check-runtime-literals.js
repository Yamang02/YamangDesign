import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'src', 'app'),
  path.join(ROOT, 'src', 'domain', 'themes'),
];
const EXTENSIONS = new Set(['.ts', '.tsx', '.css']);

const COLOR_LITERAL_RE = /#(?:[0-9a-fA-F]{3,8})\b|\brgba?\([^)\n]*\)|\bhsla?\([^)\n]*\)/g;
const PX_LITERAL_RE = /\b\d+(?:\.\d+)?px\b/g;
const includeSizeCheck = process.argv.includes('--with-size');

const IGNORE_LINE_RE = /(--[a-z0-9-]+\s*:|^\s*\/\*|^\s*\*|^\s*\/\/|https?:\/\/)/i;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
      continue;
    }
    if (!EXTENSIONS.has(path.extname(entry.name))) continue;
    if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) continue;
    yield full;
  }
}

function collectMatches(content, re) {
  const results = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (IGNORE_LINE_RE.test(line)) continue;
    const matches = line.match(re);
    if (!matches) continue;
    results.push({ line: i + 1, values: matches });
  }
  return results;
}

async function main() {
  const violations = [];

  for (const dir of TARGET_DIRS) {
    for await (const file of walk(dir)) {
      const content = await readFile(file, 'utf8');
      const colorHits = collectMatches(content, COLOR_LITERAL_RE);
      const pxHits = includeSizeCheck ? collectMatches(content, PX_LITERAL_RE) : [];
      if (colorHits.length === 0 && pxHits.length === 0) continue;

      violations.push({
        file: path.relative(ROOT, file).replaceAll('\\', '/'),
        colorHits,
        pxHits,
      });
    }
  }

  if (violations.length === 0) {
    console.log('OK: runtime literal check passed.');
    return;
  }

  console.error('FAIL: runtime literal(s) detected.\n');
  for (const item of violations) {
    console.error(`- ${item.file}`);
    for (const hit of item.colorHits) {
      console.error(`  [color] L${hit.line}: ${hit.values.join(', ')}`);
    }
    for (const hit of item.pxHits) {
      console.error(`  [size]  L${hit.line}: ${hit.values.join(', ')}`);
    }
    console.error('');
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
