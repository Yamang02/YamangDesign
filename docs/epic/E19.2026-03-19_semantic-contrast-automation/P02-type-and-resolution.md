# P02: 타입 + Resolution 레이어 변경

## 목표

`SemanticMapping.text` 및 `SemanticColors.text`에서 `onAction`을 제거하고 `onActionPrimary / onActionSecondary / onActionAccent`로 교체한다. `resolveSemanticMapping`에서 각 action 배경색을 기반으로 세 토큰을 자동 계산한다.

## 구현 상세

**수정 파일:**
- `src/domain/palettes/types.ts`
- `src/domain/palettes/mapping/resolve.ts`

### `types.ts` 변경

```ts
// SemanticMappingText
interface SemanticMappingText {
  primary: SemanticMappingValue
  secondary: SemanticMappingValue
  muted: SemanticMappingValue
  // 제거: onAction
  // 추가 (선택적 override):
  onActionPrimary?: SemanticMappingValue
  onActionSecondary?: SemanticMappingValue
  onActionAccent?: SemanticMappingValue
}

// SemanticColorsText
interface SemanticColorsText {
  primary: string
  secondary: string
  muted: string
  // 제거: onAction
  onActionPrimary: string
  onActionSecondary: string
  onActionAccent: string
}
```

### `resolve.ts` 변경

`resolveSemanticMapping`에서 action 배경색을 먼저 resolve한 뒤 `computeOnActionColor` 호출:

```ts
const actionPrimaryBg = resolve(mapping.action.primary.default)
const actionSecondaryBg = resolve(mapping.action.secondary.default)
const actionAccentBg = resolve(mapping.action.accent.default)

text: {
  primary: resolve(mapping.text.primary),
  secondary: resolve(mapping.text.secondary),
  muted: resolve(mapping.text.muted),
  onActionPrimary: computeOnActionColor(
    actionPrimaryBg,
    mapping.text.onActionPrimary ? resolve(mapping.text.onActionPrimary) : undefined
  ),
  onActionSecondary: computeOnActionColor(
    actionSecondaryBg,
    mapping.text.onActionSecondary ? resolve(mapping.text.onActionSecondary) : undefined
  ),
  onActionAccent: computeOnActionColor(
    actionAccentBg,
    mapping.text.onActionAccent ? resolve(mapping.text.onActionAccent) : undefined
  ),
}
```

### 기존 프리셋 데이터 정리

`semanticMapping.text.onAction`을 명시한 프리셋(OrientalChineseRestaurant01 등)에서 해당 필드 제거. 필요한 경우 `onActionPrimary` 등으로 이전.

**수정 대상 프리셋 파일:**
- `src/domain/palettes/presets/pop/OrientalChineseRestaurant01.ts`
- `src/domain/palettes/strategies/default-mappings.ts` (lightMapping, coloredMapping, darkMapping에서 `text.onAction` 제거)

## 체크리스트

- [ ] `types.ts` — `SemanticMappingText.onAction` 제거, `onActionPrimary/Secondary/Accent` 선택적 필드 추가
- [ ] `types.ts` — `SemanticColorsText.onAction` 제거, `onActionPrimary/Secondary/Accent` 필수 필드 추가
- [ ] `resolve.ts` — `resolveSemanticMapping`에서 action 배경색 3개 resolve 후 `computeOnActionColor` 호출
- [ ] `default-mappings.ts` — `lightMapping / coloredMapping / darkMapping`의 `text.onAction` 필드 제거
- [ ] `OrientalChineseRestaurant01.ts` — `text.onAction` 제거 (auto-compute로 대체, 필요 시 `onActionPrimary` 명시)
- [ ] `resolve.test.ts` — 기존 `onAction` 관련 테스트 수정, 새 세 토큰 검증 테스트 추가
- [ ] TypeScript 컴파일 오류 없음 확인 (`pnpm tsc --noEmit`)
