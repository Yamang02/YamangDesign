# P02: 프리셋 정리 및 마이그레이션

## 개요

**Default만 남기고 모든 프리셋(vivid, pastel, monochrome, earth)을 제거합니다.** Default는 브랜드 기준으로 이미 확정되어 있으며, monochrome 등은 별도로 유지할 필요가 없습니다.

## 마이그레이션 기준

- **유지**: `default` 프리셋 1개 (브랜드 기반)
- **제거**: `vivid`, `pastel`, `monochrome`, `earth` 전부 삭제

## 작업 항목

### 1. Default 프리셋 마이그레이션

- [x] `default.ts` → `default/default.ts` 이동
- [x] 메타데이터 추가 (`metadata` 필드)
- [x] `default/index.ts` 생성

### 2. 불필요한 프리셋 제거

- [x] `vivid.ts` 삭제
- [x] `pastel.ts` 삭제
- [x] `monochrome.ts` 삭제
- [x] `earth.ts` 삭제

### 3. Export 구조 업데이트

**파일:** `src/palettes/presets/index.ts`

- [x] default만 export
- [x] registry export 유지

**파일:** `src/palettes/index.ts`

- [x] vivid, pastel, monochrome, earth export 제거

### 4. PaletteName 타입 축소

**파일:** `src/palettes/types.ts`

- [x] `PaletteName`에서 `vivid`, `pastel`, `monochrome`, `earth` 제거
- [x] `'default' | 'custom'`으로 변경

### 5. 관련 파일 업데이트

| 파일 | 변경 내용 |
|------|----------|
| `constants/palette-definitions.ts` | themePresets에서 제거된 프리셋 삭제, default만 유지 |
| `constants/lab-presets.ts` | comparisonPresets.palettes 업데이트 |
| `themes/presets.ts` | palettePresets = themePresets (자동 반영) |

### 6. 영향받는 컴포넌트

| 컴포넌트 | 영향 | 상태 |
|----------|------|------|
| `ColorPicker` | themePresets 사용 → default만 남음 | 자동 반영 |
| `GlobalSettingsModal` | themePresets → YAMANG_PRESETS 옵션 축소 | 자동 반영 |
| `useGlobalSettings` | themePresets 참조 | 자동 반영 |
| `PaletteLab` | comparisonPresets.palettes 축소 | 자동 반영 |
| `LabOverview.module.css` | monochrome 주석 → default/브랜드 기준으로 수정 | ✅ 완료 |

### 7. 하위 호환성

**제거되는 Export:**
- `vividPalette`, `pastelPalette`, `monochromePalette`, `earthPalette`

**주의:** `LabOverview.module.css` 등에 monochrome 관련 주석이 있으면 default/브랜드 기준으로 수정

## 특이사항 검토 (2026-03-01)

### 1. P01 현황
- `default/`, `natural/` 폴더 존재. `default/index.ts`는 `../default` re-export
- `registry.ts`는 `* as defaultThemes from './default/index'` 사용
- `ThemeCategory`, `ThemeMetadata`, `metadata` 필드 이미 반영됨

### 2. default 브랜드 컬러
- 현재 `default.ts`는 YamangDesign 그린 (#5F9070) 사용. 문서 예시(범용 블루)와 무관
- 마이그레이션 시 기존 색상값 그대로 유지

### 3. 영향 파일 (검증 완료)
- `palette-definitions.ts`: themePresets → default만 유지
- `lab-presets.ts`: comparisonPresets.palettes = Object.keys(palettePresets) → 자동 `['default']`
- `themes/presets.ts`: palettePresets = themePresets → 자동 반영
- ColorPicker, GlobalSettingsModal, useGlobalSettings: themePresets 기반 → default만 남음
- Playground: comparisonPresets.palettes[0] → 'default' (유효)

### 4. 하위호환성
- localStorage: StoredSettings에 palette(ExternalPalette)만 저장. paletteName 미저장 → vivid 등 이전 선택 시 색상값이 있으면 custom으로 처리 가능
- ThemeProvider: `palettePresets[x] ?? palettePresets.default`로 fallback → undefined 시 default 적용

### 5. LabOverview.module.css
- 주석: "monochrome 프리셋에서 복사" → "default/브랜드 기준"으로 수정
- CSS 변수값: 중립 회색 유지 (시각적 변경 없음)

### 6. Registry 구조
- default 이동 후: `default/index.ts` → `export { defaultPalette } from './default'` (동일 폴더 내)
- `registry.ts` import 경로 변경 불필요 (`./default/index` 유지)

## 의존성

- 선행: P01
- 후행: P03, P04
