# P03: 레이어 분리

## 목표

도메인 타입 파일에 혼재된 상태(state) 개념을 분리하고,
고립된 `SystemColorPreset`을 `SemanticMapping`과 연결하며,
`SiteStyle.defaults`를 `ThemeProvider`의 실제 초기값으로 연결한다.

## 구현 상세

### 1. PaletteSelection을 상태 레이어로 분리

**현재**: `PaletteSelection` discriminated union이 `src/palettes/types.ts`에 도메인 타입들과 혼재.

**이유**: `PaletteSelection`은 "사용자가 무엇을 선택했는가"라는 **UI 상태**다. 도메인 레이어(`palettes/`)가 아닌 상태 레이어에 속한다.

**변경**:
```
src/palettes/types.ts    PaletteSelection 제거
src/state/types.ts       PaletteSelection 이동 (신규 파일)
```

`src/state/` 디렉토리를 신설하고, UI 상태 관련 타입들을 여기서 관리:
```
src/state/
  types.ts          PaletteSelection, 기타 UI 상태 타입
  palette-selection.ts   (현재 utils/palette-selection.ts에서 이동)
```

`utils/palette-selection.ts`의 `savePaletteSelection`, `loadPaletteSelection` 등 persistence 함수도 `state/palette-selection.ts`로 이동.

### 2. SystemColorPreset과 SemanticMapping 연결

**현재**: `SemanticMapping.feedback`의 error/warning/success/info 색상이 `default-mappings.ts`에 하드코딩된 hex값으로 존재. `SystemColorPreset`과 무관하게 동작.

**문제**: `ThemeProvider`에서 `systemPreset`을 바꿔도 SemanticMapping의 feedback 색상은 그대로.

**변경**:
- `defaultSemanticMappings`의 feedback 슬롯을 `ScaleReference` 또는 `SystemColorPreset` 참조로 교체 가능하도록 확장
- `createPalette()` 또는 `buildTokenSet()`에서 `systemPreset`을 옵셔널 파라미터로 받아 feedback 색상에 반영
- `SystemColorPreset`의 `{color}.50` → feedback.bg, `{color}.500` → feedback.border, `{color}.700` → feedback.text 매핑 적용

```ts
// buildTokenSet 시그니처 확장
function buildTokenSet(
  palette: PaletteDefinition,
  style: StyleDefinition,
  options?: { systemPreset?: SystemColorPreset }
): ThemeTokenSet
```

### 3. SiteStyle.defaults를 ThemeProvider 초기값으로 연결

**현재**: `src/config/site-style.ts`에 `defaults: { palette: 'default', style: 'minimal', bgStrategy: 'light' }`가 선언되어 있지만, `ThemeProvider`는 이를 읽지 않고 각자 하드코딩.

**변경**:
```ts
// ThemeProvider.tsx
import { siteStyle } from '../config/site-style';

// initialStyleName 기본값
initialStyleName = initialTheme ?? siteStyle.defaults.style,

// loadPaletteSelection fallback
return loadPaletteSelection() ?? createPresetSelection(siteStyle.defaults.palette);
```

`siteStyle`이 앱 전체의 기본값 단일 소스(SOT)가 된다.

## 체크리스트

- [ ] `src/state/` 디렉토리 신설
- [ ] `PaletteSelection` 타입을 `palettes/types.ts` → `state/types.ts`로 이동
- [ ] `utils/palette-selection.ts` → `state/palette-selection.ts`로 이동
- [ ] 이동 후 import 경로 전체 업데이트
- [ ] `buildTokenSet`에 `systemPreset` 옵셔널 파라미터 추가
- [ ] `defaultSemanticMappings`의 feedback 하드코딩 hex를 `SystemColorPreset` 기반으로 교체
- [ ] `ThemeProvider`에서 `systemPreset` 변경 시 feedback 색상에 반영되는지 확인
- [ ] `ThemeProvider` 초기값을 `siteStyle.defaults`에서 읽도록 변경
- [ ] TypeScript 컴파일 오류 없음 확인
- [ ] systemPreset 전환(default ↔ muted) 시 feedback 색상 변경 확인
