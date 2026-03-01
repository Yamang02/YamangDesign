# P02: 프리셋 정리 및 마이그레이션

## 개요

**Default만 남기고 모든 프리셋(vivid, pastel, monochrome, earth)을 제거합니다.** Default는 브랜드 기준으로 이미 확정되어 있으며, monochrome 등은 별도로 유지할 필요가 없습니다.

## 마이그레이션 기준

- **유지**: `default` 프리셋 1개 (브랜드 기반)
- **제거**: `vivid`, `pastel`, `monochrome`, `earth` 전부 삭제

## 작업 항목

### 1. Default 프리셋 마이그레이션

- [ ] `default.ts` → `default/default.ts` 이동
- [ ] 메타데이터 추가 (`metadata` 필드)
- [ ] `default/index.ts` 생성

### 2. 불필요한 프리셋 제거

- [ ] `vivid.ts` 삭제
- [ ] `pastel.ts` 삭제
- [ ] `monochrome.ts` 삭제
- [ ] `earth.ts` 삭제

### 3. Export 구조 업데이트

**파일:** `src/palettes/presets/index.ts`

- [ ] default만 export
- [ ] registry export 추가

**파일:** `src/palettes/index.ts`

- [ ] vivid, pastel, monochrome, earth export 제거

### 4. PaletteName 타입 축소

**파일:** `src/palettes/types.ts`

- [ ] `PaletteName`에서 `vivid`, `pastel`, `monochrome`, `earth` 제거
- [ ] `'default' | 'custom'` 또는 확장 가능한 구조로 변경

### 5. 관련 파일 업데이트

| 파일 | 변경 내용 |
|------|----------|
| `constants/palette-definitions.ts` | themePresets에서 제거된 프리셋 삭제, default만 유지 |
| `constants/lab-presets.ts` | comparisonPresets.palettes 업데이트 |
| `themes/presets.ts` | palettePresets = themePresets (자동 반영) |

### 6. 영향받는 컴포넌트

| 컴포넌트 | 영향 |
|----------|------|
| `ColorPicker` | themePresets 사용 → default만 남음 |
| `GlobalSettingsModal` | themePresets → YAMANG_PRESETS 옵션 축소 |
| `useGlobalSettings` | themePresets 참조 |
| `PaletteLab` | 비교 목록 축소 |
| `LabOverview.module.css` | monochrome 관련 주석 제거 (브랜드/기본값 기준으로 수정) |

### 7. 하위 호환성

**제거되는 Export:**
- `vividPalette`, `pastelPalette`, `monochromePalette`, `earthPalette`

**주의:** `LabOverview.module.css` 등에 monochrome 관련 주석이 있으면 default/브랜드 기준으로 수정

## 의존성

- 선행: P01
- 후행: P03, P04
