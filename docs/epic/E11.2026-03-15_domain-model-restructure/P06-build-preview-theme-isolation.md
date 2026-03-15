# P06: 빌드 프리뷰 테마 격리 수정

## 목표

빌드 페이지(Atoms/Components) 프리뷰 영역에서 선택한 팔레트·스타일이
전역 테마 누수 없이 완전하게 적용되도록 한다.

## 배경

P01에서 `getThemeVariables`의 출력 집합을 `ThemeTokenSet`으로 통일해
컬러 누수를 구조적으로 해결했다. 그러나 이후 `ThemeProvider`에
`-global` 앨리어스 메커니즘이 추가되면서 새로운 누수 경로가 생겼다.

### -global 앨리어스란

`ThemeProvider`는 `:root`에 CSS 변수를 주입할 때 모든 `--ds-*` 변수에 대해
`--ds-*-global` 앨리어스도 함께 생성한다 (`ThemeProvider.tsx:155-157`):

```ts
const globalAliasVars = Object.fromEntries(
  Object.entries(paletteStyleVars).map(([k, v]) => [`${k}-global`, v])
);
```

이 앨리어스의 의도: 특정 컴포넌트(예: 헤더, 네비게이션)가
내부 테마 스코프 변경에 관계없이 항상 전역 테마 색상을 참조할 수 있도록 한다.

### LabLayout CSS 복원 메커니즘

`LabLayout.module.css`의 `[data-shell] [data-context="preview"]` 규칙은
shell 내부의 preview 영역에 전역 테마 변수를 복원한다:

```css
[data-shell] [data-context="preview"] {
  --ds-color-bg-base: var(--ds-color-bg-base-global, #FFFFFF);
  --ds-surface-backdrop: var(--ds-surface-backdrop-global, none);
  --ds-surface-bg-alpha: var(--ds-surface-bg-alpha-global, 1);
  --ds-filter: var(--ds-filter-global, none);
  /* ...총 15개 변수... */
}
```

이 규칙의 의도는 Lab 페이지(PaletteLab 등)에서 전역 테마를 보여주는 것이다.

### 실제 누수 경로 (CSS cascade 분석 결과)

`getThemeVariables`가 반환하는 inline style은 CSS attribute selector보다
specificity가 높아(inline > attribute selector) 오버라이드가 가능하다.

그러나 `minimal` 스타일처럼 `material`/`filter`/`spatial` 슬롯이 없는 경우,
`extractStyleVars`가 `--ds-surface-backdrop` 등 surface 변수를 **아예 출력하지 않았다**.
inline style에 해당 변수가 없으면 LabLayout CSS 규칙이 이겨서 전역 값이 누수된다.

```
시나리오: 전역 = glassmorphism, 빌드 프리뷰 = minimal 선택
→ extractStyleVars(minimal) → {} (surface vars 없음)
→ getThemeVariables inline style에 --ds-surface-backdrop 없음
→ LabLayout CSS: --ds-surface-backdrop = var(--ds-surface-backdrop-global)
                                        = blur(12px) (glassmorphism 값)
→ 프리뷰에 glassmorphism blur 누수
```

컴포넌트 CSS 모듈에서 `-global` 변수를 직접 참조하는 곳은 없었다.
누수 원인은 `-global` 직접 참조가 아니라 `extractStyleVars`의 누락이었다.

## 구현 상세

### 수정 위치: `src/styles/index.ts` `extractStyleVars`

surface/filter/spatial 변수를 슬롯 존재 여부와 관계없이 항상 기본값 포함 출력:

```ts
export function extractStyleVars(
  def: StyleDefinition,
  bgColor: string
): Record<string, string> {
  const vars: Record<string, string> = {
    '--ds-surface-backdrop': def.material?.backdropFilter ?? 'none',
    '--ds-surface-bg-alpha': def.material?.backgroundAlpha !== undefined
      ? String(def.material.backgroundAlpha) : '1',
    '--ds-surface-texture': def.material?.backgroundImage ?? 'none',
    '--ds-surface-blend': def.material?.backgroundBlendMode ?? 'normal',
    '--ds-filter': def.filter?.element ?? 'none',
    '--ds-perspective': def.spatial?.perspective ?? 'none',
    '--ds-transform-style': def.spatial?.transformStyle ?? 'flat',
  };
  const custom = def.createVars?.({ bgColor }) ?? {};
  return { ...vars, ...custom };
}
```

이 수정으로:
- `minimal` 스타일 → `--ds-surface-backdrop: none` 등 명시적 기본값 출력
- `glassmorphism` 스타일 → `--ds-surface-backdrop: blur(12px)` 출력 (기존과 동일)
- inline style specificity가 LabLayout CSS를 이겨 선택한 스타일이 정확히 반영됨

### appliedSettings 반영 여부

빌드 페이지 프리뷰의 목적은 "이 팔레트+스타일 조합이 어떻게 보이는가"이므로
`appliedSettings.semanticMapping`을 반영하지 않는 것이 적절하다 (옵션 A 유지).
전역 설정과 빌드 프리뷰는 서로 다른 관점을 제공한다.

## 체크리스트

- [x] `grep -rn "\-\-ds-.*-global" src/components/` 실행하여 참조 목록 작성
  → 컴포넌트 CSS 모듈에서 `-global` 직접 참조 없음. `LabLayout.module.css`에만 존재.
- [x] `extractStyleVars` 수정: surface/filter/spatial 변수 항상 기본값 포함 출력 (`src/styles/index.ts`)
- [x] `getThemeVariables`에 `-global` 앨리어스 추가 불필요 (CSS cascade로 충분)
- [ ] Atoms 프리뷰에서 Default / 봄빛 크림소다 / Oriental 팔레트 전환 시 완전한 색상 교체 확인
- [ ] Minimal / Neumorphism / Brutalism / Glassmorphism 스타일 전환 시 surface 변수 교체 확인
- [ ] 전역 테마가 봄빛 크림소다인 상태에서 빌드 프리뷰 Default 선택 시 누수 없음 확인
- [ ] 전역 테마가 glassmorphism인 상태에서 빌드 프리뷰 minimal 선택 시 blur 누수 없음 확인
- [ ] TypeScript 컴파일 오류 없음 확인
