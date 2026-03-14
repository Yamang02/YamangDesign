/**
 * base 경로에 맞춰 manifest.json 생성 (GitHub Pages 배포용)
 * VITE_BASE_PATH가 없으면 /YamangDesign/ 사용
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const base = process.env.VITE_BASE_PATH || '/YamangDesign/';
const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'favicons');

const manifest = {
  name: '야망디자인',
  short_name: '야망디자인',
  description: '디자인 시스템 라이브러리',
  start_url: base,
  display: 'browser',
  background_color: '#FFFFFF',
  theme_color: '#FFFFFF',
  icons: [
    { src: `${base}favicons/android-chrome-192x192.png`, sizes: '192x192', type: 'image/png' },
    { src: `${base}favicons/android-chrome-512x512.png`, sizes: '512x512', type: 'image/png' },
  ],
};

writeFileSync(join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
