# P03: 시맨틱 매핑 시스템

## 개요

컬러 스케일 → 시맨틱 토큰 매핑을 프리셋별로 정의하고, bgStrategy 기본 매핑과 오버라이드를 지원합니다.

## 작업 항목

### 1. 타입 정의 (types.ts)

- [x] `SemanticMapping` 인터페이스
- [x] `ScaleReference` 인터페이스
- [x] `PaletteDefinition.semanticMapping?: SemanticMapping` 추가

### 2. 기본 매핑 정의

**파일:** `src/palettes/strategies/default-mappings.ts` (신규)

- [x] `defaultSemanticMappings: Record<BgStrategy, SemanticMapping>`
- [x] light, colored, dark 각 전략별 매핑 정의

### 3. 매핑 해석 로직

**파일:** `src/palettes/mapping/resolve.ts` (신규)

- [x] `resolveColorValue(value, scales)` - ScaleReference 또는 직접 색상 → string
- [x] `resolveSemanticMapping(mapping, scales)` → SemanticColors
- [x] (선택) `getMergedMapping(base, custom)` - 부분 오버라이드 지원

### 4. createPalette 업데이트

**파일:** `src/palettes/index.ts`

- [x] strategyFn 호출 제거. 항상 resolve 경로만 사용
- [x] `getMergedMapping(baseMapping, definition.semanticMapping)` → `resolveSemanticMapping` 적용
- [x] semanticMapping 없으면 defaultSemanticMappings[bgStrategy] 사용

### 5. strategy 파일 제거

- [x] `light-bg.ts`, `colored-bg.ts`, `dark-bg.ts` 삭제
- [x] default-mappings.ts 생성 시 기존 strategy 로직을 ScaleReference 형태로 이전

### 6. 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `palettes/index.ts` | createPalette resolve 경로로 통일, strategy import 제거 |
| `strategies/light-bg.ts` 등 | 삭제 |

### 7. 기술적 고려

- **부분 오버라이드**: lodash 미사용. `deepmerge` 패키지 또는 1~2 depth용 직접 구현
- **Fallback**: 존재하지 않는 scale/step 참조 시 경고 + 안전한 fallback
- **성능**: `resolveSemanticMapping` 메모이제이션 적용 권장

## 의존성

- 선행: P01, P02
- 후행: P04 (ScaleSelectionModal에서 매핑 편집)

---

## 특이사항 검토 (2026-03-01)

### 1. ScaleReference와 sub 스케일

- **sub 항상 포함 (2026-03-01 적용)**: Primary 제외 secondary, accent, neutral, sub 모두 일관된 Auto 파생
- `GeneratedScales.sub`는 **항상 존재**: `resolvePalette`에서 `sub ?? deriveSub(primary)` 적용
- ScaleReference `scale: 'sub'` 사용 시 fallback 불필요

### 2. text.inverse

- `SemanticColors`/`SemanticMapping`에 `inverse` 없음
- `combine.ts`에서 별도 계산: `palette.bgStrategy === 'dark' ? text.primary : '#FFFFFF'`
- P03에서 inverse 관련 변경 없음 (기존 로직 유지)

### 3. Action colors

- Action(primary/secondary/accent 500/600/700)은 semanticMapping 범위 밖
- `generateActionColors(palette.scales)`가 scales 직접 사용
- P03 영향 없음

### 4. 부분 오버라이드 병합

- `deepmerge`/lodash 패키지 없음 → 1~2 depth shallow merge **직접 구현**
- `getMergedMapping(base, override)`: category(bg/text/border) 단위 shallow merge

### 5. ColorUsageDiagram

- 현재 "light-bg 기준" 하드코딩, palette/theme props 없음
- P03에서는 변경 없음. P04에서 bgStrategy 연동 및 매핑 편집 UI 연동 예정

### 6. strategies/index.ts

- `palettes/index.ts`만 strategies 직접 import (개별 파일)
- strategy 파일 삭제 시 `strategies/index.ts`도 함께 제거
