# P01: StyleDefinition 인터페이스 재설계

## 목표

`StyleDefinition`을 CSS 시각 효과 범주 기반으로 재설계한다. 기존 `createShadows` / `border`를
`elevation` / `stroke`로 개념 재명명하고, `material` / `filter` / `spatial` / `createVars`
슬롯을 추가한다. ThemeProvider가 새 슬롯을 읽어 CSS 변수로 주입하도록 연동한다.

## 구현 상세

### 새 StyleDefinition 인터페이스 (`src/styles/types.ts`)

```ts
/**
 * 기존 코드의 shadow 키(none/sm/md/lg/xl/inset)를 의미 기반 레벨로 재명명.
 * 기존 키와 1:1 대응: none→0, sm→1, md→2, lg→3, xl→4, inset→inset
 * P02에서 createStyle이 { none, sm, md, lg, xl, inset } 형태의 하위 호환 매핑을 제공.
 */
export interface ElevationScale {
  0: string;    // none (그림자 없음)
  1: string;    // sm
  2: string;    // md
  3: string;    // lg
  4: string;    // xl
  inset: string;
}

export interface StyleDefinition {
  name: StyleName;

  /** 깊이감 / 부유감 (기존 createShadows → elevation 재명명) */
  elevation: {
    create: (context: { bgColor: string }) => ElevationScale;
  };

  /** 경계선 처리 (기존 border → stroke 재명명) */
  stroke: {
    width: string;
    style: string;
    colorStrategy: 'palette' | 'transparent' | 'fixed';
    image?: string;        // border-image
    fixedColor?: string;   // colorStrategy === 'fixed' 일 때
  };

  /** 표면 재질: 투명도, 블러, 텍스처 */
  material?: {
    backdropFilter?: string;       // 'blur(12px)'
    backgroundAlpha?: number;      // 0 ~ 1 (배경 투명도)
    backgroundImage?: string;      // 'url(texture.png)'
    backgroundBlendMode?: string;  // 'multiply'
  };

  /** CSS filter 효과 */
  filter?: {
    element?: string;              // 'saturate(0.8) contrast(1.1) sepia(0.2)'
  };

  /** 3D / 공간 효과 */
  spatial?: {
    perspective?: string;          // '800px'
    transformStyle?: string;       // 'preserve-3d'
  };

  /** Escape hatch: 위 슬롯으로 표현 불가한 임의의 CSS 변수.
   *  변수명은 --ds- 접두사 사용을 권장하지만 강제하지 않음. */
  createVars?: (context: { bgColor: string }) => Record<string, string>;
}

/**
 * 기존 StyleDefinition에 있던 surface / states 필드는 이번 재설계에서 제거.
 * - surface: { default, interactive, active } — 문서용 메타데이터였고 CSS 미주입
 * - states: { hover, active } — 동일한 이유로 미사용
 * 새 구조에서는 각 효과 슬롯(material, filter, spatial)이 실제 CSS 변수로 주입됨.
 */

/** ThemeProvider가 주입하는 최종 CSS 변수 집합 */
export interface ResolvedStyle {
  name: StyleName;
  shadows: ElevationScale;    // 하위 호환: 기존 shadows 키 유지
  border: {
    width: string;
    style: string;
  };
  vars: Record<string, string>;  // 신규 슬롯에서 생성된 모든 CSS 변수
}
```

### CSS 변수 네이밍 규칙 (신규 슬롯)

| 슬롯 | CSS 변수 | 기본값 (fallback) |
|---|---|---|
| `material.backdropFilter` | `--ds-surface-backdrop` | `none` |
| `material.backgroundAlpha` | `--ds-surface-bg-alpha` | `1` |
| `material.backgroundImage` | `--ds-surface-texture` | `none` |
| `material.backgroundBlendMode` | `--ds-surface-blend` | `normal` |
| `filter.element` | `--ds-filter` | `none` |
| `spatial.perspective` | `--ds-perspective` | `none` |
| `spatial.transformStyle` | `--ds-transform-style` | `flat` |

### `createStyle` 함수 수정 (`src/styles/index.ts`)

새 슬롯을 순회해 CSS 변수 맵을 생성하는 `extractStyleVars` 헬퍼 추가:

```ts
function extractStyleVars(
  def: StyleDefinition,
  bgColor: string
): Record<string, string> {
  const vars: Record<string, string> = {};

  if (def.material) {
    if (def.material.backdropFilter)
      vars['--ds-surface-backdrop'] = def.material.backdropFilter;
    if (def.material.backgroundAlpha !== undefined)
      vars['--ds-surface-bg-alpha'] = String(def.material.backgroundAlpha);
    if (def.material.backgroundImage)
      vars['--ds-surface-texture'] = def.material.backgroundImage;
    if (def.material.backgroundBlendMode)
      vars['--ds-surface-blend'] = def.material.backgroundBlendMode;
  }

  if (def.filter?.element)
    vars['--ds-filter'] = def.filter.element;

  if (def.spatial) {
    if (def.spatial.perspective)
      vars['--ds-perspective'] = def.spatial.perspective;
    if (def.spatial.transformStyle)
      vars['--ds-transform-style'] = def.spatial.transformStyle;
  }

  const custom = def.createVars?.({ bgColor }) ?? {};
  return { ...vars, ...custom };
}
```

### ThemeProvider 연동 (`src/themes/ThemeProvider.tsx`)

`useEffect` 내 CSS 주입 블록에 `style.vars` 추가:

```ts
injectCSSVariables({
  ...primitiveCSSVars,
  ...paletteScaleVars,
  ...themeCSSVars,      // 기존: colors, shadows, border
  ...style.vars,        // 신규: material, filter, spatial, createVars
  ...stateLayerVars,
  ...typographyVars,
});
```

### 컴포넌트 CSS 소비 방식

기존 컴포넌트 CSS는 변경 없음. 신규 슬롯 변수는 opt-in:

```css
/* Card, Surface 계열 컴포넌트가 선택적으로 소비 */
.card {
  backdrop-filter: var(--ds-surface-backdrop, none);
  background-image: var(--ds-surface-texture, none);
  filter: var(--ds-filter, none);
}
```

P02에서 기존 스타일 리팩토링 시 함께 적용.

## 체크리스트

- [ ] `src/styles/types.ts` — `ElevationScale` (숫자 키 0-4 + inset) 추가
- [ ] `src/styles/types.ts` — `StyleDefinition` 재정의 (elevation/stroke/material/filter/spatial/createVars)
- [ ] `src/styles/types.ts` — 기존 `surface`, `states` 필드 제거
- [ ] `src/styles/types.ts` — `ResolvedStyle` 업데이트 (`vars` 필드 추가)
- [ ] `src/styles/index.ts` — `extractStyleVars` 헬퍼 추가
- [ ] `src/styles/index.ts` — `createStyle` 반환값에 `vars` 포함
- [ ] `src/themes/ThemeProvider.tsx` — `style.vars` CSS 주입 연동
- [ ] TypeScript 빌드 오류 없음 확인 (`tsc --noEmit`)
