/**
 * E12: import 경로 수정 스크립트
 * 새 3계층 구조(domain/app/shared)에 맞게 cross-layer import를 alias로 교체
 */
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.resolve(__dirname, '../src');

// 어떤 top-level dir가 어떤 layer에 속하는지
const DOMAIN_DIRS = new Set(['palettes', 'themes', 'tokens', 'styles', 'constants']);
const APP_DIRS = new Set(['components', 'pages', 'layouts', 'hooks', 'state', 'config', 'content', 'infra']);
const SHARED_DIRS = new Set(['utils', '@types', 'assets']);

function getLayer(topDir) {
  if (DOMAIN_DIRS.has(topDir)) return 'domain';
  if (APP_DIRS.has(topDir)) return 'app';
  if (SHARED_DIRS.has(topDir)) return 'shared';
  return null;
}

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // This file's layer (domain, app, or shared)
  const relToSrc = path.relative(SRC, filePath).replaceAll('\\', '/');
  const parts = relToSrc.split('/');

  // parts[0] is the layer dir (domain, app, shared) or a root file
  const layerDir = parts[0]; // 'domain', 'app', 'shared', or file like 'App.tsx'
  const isInNewLayer = ['domain', 'app', 'shared'].includes(layerDir);

  if (!isInNewLayer) return content; // Skip root files and old dirs

  // Replace import paths
  let updated = content;

  // Pattern: from '../../xxx/...' where xxx is a recognizable directory
  // We need to find relative imports and check if they cross layers
  updated = updated.replaceAll(
    /from '(\.\.[-\w./@]+)'/g,
    (match, importPath) => {
      // Only process relative paths (start with ..)
      if (!importPath.startsWith('..')) return match;

      // Compute what directory the import resolves to (first path component after dots)
      const normalized = importPath.replace(/^(\.\.\/)+/, '');
      const firstDir = normalized.split('/')[0];

      const targetLayer = getLayer(firstDir);
      if (!targetLayer) return match; // Unknown dir, leave as-is

      // If target layer is different from current layer, use alias
      if (targetLayer !== layerDir) {
        const rest = normalized.substring(firstDir.length); // e.g., '/index' or '/ThemeContext'
        return `from '@${targetLayer}/${firstDir}${rest}'`;
      }

      return match;
    }
  );

  return updated;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const fixed = fixImportsInFile(fullPath);
      if (fixed !== original) {
        fs.writeFileSync(fullPath, fixed, 'utf8');
        console.log(`Fixed: ${path.relative(SRC, fullPath)}`);
      }
    }
  }
}

// Process new layer directories
['domain', 'app', 'shared'].forEach(layer => {
  const layerDir = path.join(SRC, layer);
  if (fs.existsSync(layerDir)) {
    walkDir(layerDir);
  }
});

console.log('Done.');
