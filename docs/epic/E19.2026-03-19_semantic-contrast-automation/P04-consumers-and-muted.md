# P04: 소비자 전수 업데이트 + text.muted 수정

## 목표

`--ds-color-text-on-action` CSS 변수 사용처를 전수 탐색해 각 버튼 variant에 맞는 새 변수로 교체한다. `--ds-color-text-inverse` 참조도 제거한다. 아울러 `default-mappings.ts`의 `text.muted` 스텝 참조를 상향한다.

## 구현 상세

### CSS 변수 소비자 교체

`--ds-color-text-on-action` 참조처를 아래 규칙으로 교체:

| 컨텍스트 | 교체 대상 |
|---|---|
| Primary 버튼 텍스트 | `--ds-color-text-on-action-primary` |
| Secondary 버튼 텍스트 | `--ds-color-text-on-action-secondary` |
| Accent 버튼 텍스트 | `--ds-color-text-on-action-accent` |
| 컨텍스트가 불명확한 경우 | `--ds-color-text-on-action-primary` (기본) |

**탐색 대상 파일 패턴:**
- `src/**/*.module.css`
- `src/**/*.css`
- `src/**/*.tsx` (인라인 스타일 또는 theme 객체 참조)

**예상 주요 수정 파일:**
- `src/app/components/Button/Button.module.css`
- `src/app/components/Badge/Badge.module.css`
- 기타 `text-on-action` 또는 `text.onAction` 참조 컴포넌트

### `theme.colors.text.onAction` JS 참조 교체

TypeScript 소비자에서 `theme.colors.text.onAction` 또는 `colors.text.onAction`으로 접근하는 코드를 `onActionPrimary / onActionSecondary / onActionAccent`로 교체.

### `text.muted` 스텝 수정

**수정 파일:** `src/domain/palettes/strategies/default-mappings.ts`

```ts
// light
text.muted: { scale: 'neutral', step: 700 }  // 500 → 700

// colored
text.muted: { scale: 'neutral', step: 700 }  // 600 → 700

// dark
text.muted: { scale: 'neutral', step: 300 }  // 400 → 300
```

### 검증

수정 후 각 프리셋별로 문제가 됐던 케이스를 확인:
- Swiss Monochrome: `onActionAccent` → 흰/검 자동 선택 (흰 accent bg → 검정)
- Memphis Pop: `onActionSecondary` → 검정 (노란 bg)
- Art Deco Gold: `onActionPrimary` → 검정 (금색 bg), `text.muted` → neutral[700] 확인

## 체크리스트

- [ ] `grep -r "text-on-action"` 로 CSS 변수 참조 전수 탐색
- [ ] `grep -r "text\.onAction\|textOnAction\|text-inverse"` 로 JS/TS 참조 전수 탐색
- [ ] `Button.module.css` — variant별 적절한 새 변수로 교체
- [ ] `Badge.module.css` 및 기타 컴포넌트 — 참조 교체
- [ ] JS/TS 소비자 — `theme.colors.text.onAction` 참조 교체
- [ ] `default-mappings.ts` — `text.muted` 스텝 수정 (light·colored: 700, dark: 300)
- [ ] TypeScript 컴파일 오류 없음 확인 (`pnpm tsc --noEmit`)
- [ ] 빌드 통과 확인 (`pnpm build`)
- [ ] 문제가 됐던 프리셋 6개의 action 버튼 대비 시각적으로 확인
