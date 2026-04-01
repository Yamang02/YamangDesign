# P03: Token emit + CSS 변수 변경

## 목표

`token-set.ts`와 `combine.ts`에서 `text.onAction` 참조를 제거하고 `onActionPrimary / onActionSecondary / onActionAccent`를 emit하도록 변경한다. CSS 변수 이름이 자동으로 변경된다.

## 구현 상세

**수정 파일:**
- `src/domain/themes/token-set.ts`
- `src/domain/themes/combine.ts`
- `src/shared/@types/theme.ts` (Theme 타입의 `colors.text` 변경)

### CSS 변수 변경

`flattenToCSSVars`가 camelCase → kebab-case 변환을 자동 처리하므로 구조 변경만으로 CSS var 이름이 변경된다.

| 제거되는 변수 | 추가되는 변수 |
|---|---|
| `--ds-color-text-on-action` | `--ds-color-text-on-action-primary` |
| `--ds-color-text-inverse` | `--ds-color-text-on-action-secondary` |
| | `--ds-color-text-on-action-accent` |

### `token-set.ts` 변경

`buildTokenSet` / `buildThemeAndTokenSet` 내 semanticVars 구성:

```ts
// Before
text: {
  ...expanded.semantic.text,
  inverse: expanded.semantic.text.onAction,  // 제거
}

// After
text: expanded.semantic.text  // onActionPrimary/Secondary/Accent 포함됨
```

### `combine.ts` 변경

`combineTheme`의 Theme 구성에서 동일하게 `inverse` alias 제거:

```ts
// Before
text: {
  ...palette.semantic.text,
  inverse: palette.semantic.text.onAction,  // 제거
}

// After
text: palette.semantic.text
```

### `theme.ts` 타입 변경

`Theme.colors.text`가 `SemanticColorsText`를 그대로 따르므로 타입 변경은 자동 반영됨. `inverse` 필드가 별도로 정의된 경우 제거.

## 체크리스트

- [ ] `token-set.ts` — `buildTokenSet`의 `inverse` alias 제거, `text` 구조를 `expanded.semantic.text` 그대로 사용
- [ ] `token-set.ts` — `buildThemeAndTokenSet`도 동일하게 수정
- [ ] `combine.ts` — `combineTheme`의 `inverse` alias 제거
- [ ] `shared/@types/theme.ts` — `Theme.colors.text` 타입에서 `inverse` 또는 `onAction` 잔여 필드 제거 확인
- [ ] `--ds-color-text-on-action` 및 `--ds-color-text-inverse` 변수가 emit되지 않는지 확인
- [ ] `--ds-color-text-on-action-primary/secondary/accent` 변수가 올바른 값으로 emit되는지 확인
- [ ] TypeScript 컴파일 오류 없음 확인 (`pnpm tsc --noEmit`)
