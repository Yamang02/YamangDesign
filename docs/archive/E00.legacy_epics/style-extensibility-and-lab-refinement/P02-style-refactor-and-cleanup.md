# P02: 기존 스타일 리팩토링 + 레거시 제거

## 목표

P01에서 확립한 새 `StyleDefinition` 인터페이스에 맞춰 기존 3개 스타일(minimal, neumorphism,
brutalism)을 리팩토링한다. `StyleName` 타입에서 제거된 경우를 반영하고, 더 이상 사용되지 않는
레거시 파일(`createMinimalTheme`, `createNeumorphismTheme`)을 제거한다.

## 구현 상세

### `src/styles/presets/minimal.ts`

```ts
export const minimalStyle: StyleDefinition = {
  name: 'minimal',

  elevation: {
    create: () => ({
      0: 'none',
      1: '0 1px 2px rgba(0,0,0,0.05)',
      2: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      3: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
      4: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      inset: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    }),
  },

  stroke: {
    width: '1px',
    style: 'solid',
    colorStrategy: 'palette',
  },
};
```

### `src/styles/presets/neumorphism.ts`

```ts
export const neumorphismStyle: StyleDefinition = {
  name: 'neumorphism',

  elevation: {
    create: ({ bgColor }) => {
      const light = lighten(bgColor, 15);
      const dark  = darken(bgColor, 15);
      return {
        0: 'none',
        1: `3px 3px 6px ${dark}, -3px -3px 6px ${light}`,
        2: `6px 6px 12px ${dark}, -6px -6px 12px ${light}`,
        3: `10px 10px 20px ${dark}, -10px -10px 20px ${light}`,
        4: `15px 15px 30px ${dark}, -15px -15px 30px ${light}`,
        inset: `inset 4px 4px 8px ${dark}, inset -4px -4px 8px ${light}`,
      };
    },
  },

  stroke: {
    width: '0px',
    style: 'none',
    colorStrategy: 'transparent',
  },
};
```

### `src/styles/presets/brutalism.ts`

```ts
export const brutalismStyle: StyleDefinition = {
  name: 'brutalism',

  elevation: {
    create: ({ bgColor }) => {
      const dark = darken(bgColor, 25);
      return {
        0: 'none',
        1: `4px 4px 0 ${dark}`,
        2: `6px 6px 0 ${dark}`,
        3: `8px 8px 0 ${dark}`,
        4: `12px 12px 0 ${dark}`,
        inset: `inset 2px 2px 0 ${dark}`,
      };
    },
  },

  stroke: {
    width: '3px',
    style: 'solid',
    colorStrategy: 'palette',
  },
};
```

### `ResolvedStyle` 하위 호환 매핑

기존 코드가 `style.shadows.sm` / `style.shadows.md` 형태로 접근하는 곳이 있다면,
`createStyle`에서 `ElevationScale → shadows` 하위 호환 매핑 제공:

```ts
// createStyle 반환 시
shadows: {
  none:  resolved.elevation[0],
  sm:    resolved.elevation[1],
  md:    resolved.elevation[2],
  lg:    resolved.elevation[3],
  xl:    resolved.elevation[4],
  inset: resolved.elevation.inset,
}
```

이후 `--ds-shadow-sm` CSS 변수는 elevation[1] 값을 가리킨다. 컴포넌트 CSS 변경 없음.

### 레거시 제거

다음 파일/export 삭제:

| 대상 | 이유 |
|---|---|
| `src/themes/minimal/tokens.ts` | `combineTheme` → `StyleDefinition` 경로로 대체됨 |
| `src/themes/neumorphism/tokens.ts` | 동일 |
| `src/themes/minimal/index.ts` | `createMinimalTheme` export 진입점 |
| `src/themes/neumorphism/index.ts` | `createNeumorphismTheme` export 진입점 |
| `src/themes/index.ts`의 관련 export | `createMinimalTheme`, `createNeumorphismTheme` |

삭제 전 `grep`으로 참조 확인 후 제거.

## 체크리스트

- [ ] `minimal.ts` — 새 인터페이스로 리팩토링
- [ ] `neumorphism.ts` — 새 인터페이스로 리팩토링
- [ ] `brutalism.ts` — 새 인터페이스로 리팩토링
- [ ] `createStyle` 내 `ElevationScale → shadows` 하위 호환 매핑 확인
- [ ] `--ds-shadow-*` CSS 변수 값이 이전과 동일한지 확인
- [ ] 레거시 파일(`themes/minimal/tokens.ts`, `themes/neumorphism/tokens.ts`) 삭제
- [ ] 레거시 export(`createMinimalTheme`, `createNeumorphismTheme`) 제거
- [ ] TypeScript 빌드 오류 없음 확인
- [ ] 브라우저에서 minimal / neumorphism / brutalism 스타일 시각 확인
