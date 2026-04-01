import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
/** Art Reference Gallery: 실험적 색·질감 허용 — yamang-design-stack SKILL.md 정책 */
const ART_GALLERY_REL = ['src', 'app', 'pages', 'art'].join('/');
const TARGET_DIRS = [
  path.join(ROOT, 'src', 'app'),
  path.join(ROOT, 'src', 'domain', 'themes'),
];

function isUnderArtGallery(filePath) {
  const rel = path.relative(ROOT, filePath).replaceAll('\\', '/');
  return rel.startsWith(`${ART_GALLERY_REL}/`);
}
const EXTENSIONS = new Set(['.ts', '.tsx', '.css']);

const COLOR_LITERAL_RE = /#(?:[0-9a-fA-F]{3,8})\b|\brgba?\([^)\n]*\)|\bhsla?\([^)\n]*\)/g;
const PX_LITERAL_RE = /\b\d+(?:\.\d+)?px\b/g;
const includeSizeCheck = process.argv.includes('--with-size');

const IGNORE_LINE_RE = /(--[a-z0-9-]+\s*:|^\s*\/\*|^\s*\*|^\s*\/\/|https?:\/\/)/i;

/**
 * `.ts`/`.tsx` 한 줄에서, offset 위치가 문자열 리터럴(' " `) 안인지.
 * `looksLikeColor`의 `startsWith('rgb(')` 같은 코드가 색 오탐 나지 않게 함.
 */
function isOffsetInsideStringLiteral(line, offset) {
  let mode = 'code';
  let templateExprDepth = 0;
  for (let i = 0; i < offset && i < line.length; i += 1) {
    const c = line[i];
    const next = line[i + 1];
    if (mode === 'code') {
      if (c === "'") {
        mode = 's';
        continue;
      }
      if (c === '"') {
        mode = 'd';
        continue;
      }
      if (c === '`') {
        mode = 't';
        continue;
      }
      continue;
    }
    if (mode === 's') {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if (c === "'") {
        mode = 'code';
        continue;
      }
      continue;
    }
    if (mode === 'd') {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if (c === '"') {
        mode = 'code';
        continue;
      }
      continue;
    }
    if (mode === 't') {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if (c === '$' && next === '{') {
        mode = 'texpr';
        templateExprDepth = 1;
        i += 1;
        continue;
      }
      if (c === '`') {
        mode = 'code';
        continue;
      }
      continue;
    }
    if (mode === 'texpr') {
      if (c === '{') templateExprDepth += 1;
      else if (c === '}') {
        templateExprDepth -= 1;
        if (templateExprDepth === 0) mode = 't';
      }
      continue;
    }
  }
  return mode === 's' || mode === 'd' || mode === 't';
}

function collectColorMatches(content, ext) {
  const useStringFilter = ext === '.ts' || ext === '.tsx';
  const re = new RegExp(COLOR_LITERAL_RE.source, 'g');
  const results = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (IGNORE_LINE_RE.test(line)) continue;

    const values = [];
    re.lastIndex = 0;
    let m = re.exec(line);
    while (m !== null) {
      if (!useStringFilter || !isOffsetInsideStringLiteral(line, m.index)) {
        values.push(m[0]);
      }
      m = re.exec(line);
    }
    if (values.length > 0) {
      results.push({ line: i + 1, values });
    }
  }
  return results;
}

function collectPxMatches(content) {
  const results = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (IGNORE_LINE_RE.test(line)) continue;
    const matches = line.match(PX_LITERAL_RE);
    if (!matches) continue;
    results.push({ line: i + 1, values: matches });
  }
  return results;
}

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

async function main() {
  const violations = [];

  for (const dir of TARGET_DIRS) {
    for await (const file of walk(dir)) {
      if (isUnderArtGallery(file)) continue;
      const content = await readFile(file, 'utf8');
      const ext = path.extname(file);
      const colorHits = collectColorMatches(content, ext);
      const pxHits = includeSizeCheck ? collectPxMatches(content) : [];
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
