/**
 * ai/rules.yaml → 각 툴별 설정 파일 생성
 *
 * Usage: node ai/generate.js
 *
 * 의존성 없음 - 간단한 YAML 파싱 내장
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 간단한 YAML 파싱 (ignore 섹션만 추출)
function parseIgnoreSection(yaml) {
  const lines = yaml.split('\n');
  const ignores = [];
  let inIgnoreSection = false;

  for (const line of lines) {
    if (line.startsWith('ignore:')) {
      inIgnoreSection = true;
      continue;
    }
    if (inIgnoreSection) {
      if (line.match(/^\S/) && !line.startsWith('#')) {
        break; // 다른 섹션 시작
      }
      const match = line.match(/^\s+-\s+(.+)/);
      if (match) {
        ignores.push(match[1].trim());
      }
    }
  }
  return ignores;
}

const yamlContent = readFileSync(join(__dirname, 'rules.yaml'), 'utf8');
const ignorePatterns = parseIgnoreSection(yamlContent);

// .claudeignore 생성
function generateClaudeignore() {
  const content = [
    '# Auto-generated from ai/rules.yaml',
    '# Do not edit directly - run: node ai/generate.js',
    '',
    ...ignorePatterns
  ].join('\n');

  writeFileSync(join(ROOT, '.claudeignore'), content);
  console.log('Generated: .claudeignore');
}

// .cursorignore 생성 (동일 포맷)
function generateCursorignore() {
  const content = [
    '# Auto-generated from ai/rules.yaml',
    '# Do not edit directly - run: node ai/generate.js',
    '',
    ...ignorePatterns
  ].join('\n');

  writeFileSync(join(ROOT, '.cursorignore'), content);
  console.log('Generated: .cursorignore');
}

// 실행
generateClaudeignore();
generateCursorignore();

console.log('\nDone. Policy files generated from ai/rules.yaml');
