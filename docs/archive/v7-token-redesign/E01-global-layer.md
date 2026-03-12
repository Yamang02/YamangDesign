# E01: Global Layer 재편

## 목표

`tokens/primitives/`를 `tokens/global/`로 완전히 이전하고,
shadow 원시값을 `elevation.ts`로 분리하여 레이어 역할을 명확화한다.

---

## 변경 내용

### 1. 폴더 이름 변경 (Breaking)

```
src/tokens/primitives/  →  src/tokens/global/
```

모든 primitive 토큰 파일을 `global/`로 이동하고,
`primitives/` 폴더 및 관련 export는 제거한다.

### 2. elevation.ts 신설

현재 shadow 원시값은 각 테마 파일(`styles/presets/minimal.ts` 등)에 인라인으로 정의되어 있다.
이를 global 레이어로 끌어올려 재사용 가능하게 분리한다.

```ts
// src/tokens/global/elevation.ts

/**
 * Elevation: shadow 원시값
 * 테마(minimal/neumorphism/brutalism)가 이 값을 조합해서 alias 생성
 */
export const elevation = {
  none:   'none',
  sm:     '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md:     '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:     '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:     '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inset:  'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export type ElevationKey = keyof typeof elevation;
```

### 3. index.ts 업데이트

```ts
// src/tokens/global/index.ts
export * from './spacing';
export * from './typography';
export * from './borders';
export * from './sizes';
export * from './motion';
export * from './transition';
export * from './elevation';  // 신설
```

| 파일 | 변경 내용 |
|------|-----------|
| `src/tokens/global/` | primitive 토큰 파일 전체 이전 + `elevation.ts` 신설 |
| `src/tokens/primitives/` | 폴더 및 export 삭제 (하위호환 제거) |
| `src/tokens/index.ts` | `./primitives` → `./global` export 대상 변경 |
| `src/themes/ThemeProvider.tsx` | primitive import 경로를 `../tokens/global`로 변경 |
| `src/styles/presets/*.ts` | (필요 시) elevation alias 사용을 위한 import 추가 |
| 기타 `tokens/primitives` import 전체 | `tokens/global` 경로로 일괄 수정 |

### 마이그레이션 가이드

1. 코드베이스 전체에서 `tokens/primitives` import를 검색한다.
2. 아래 규칙으로 경로를 치환한다.
   - `../tokens/primitives/spacing` → `../tokens/global/spacing`
   - `../tokens/primitives/typography` → `../tokens/global/typography`
   - `../tokens/primitives/borders` → `../tokens/global/borders`
   - `../tokens/primitives/sizes` → `../tokens/global/sizes`
   - `../tokens/primitives/motion` → `../tokens/global/motion`
   - `../tokens/primitives/transition` → `../tokens/global/transition`
   - `../tokens/primitives/system-colors` → `../tokens/global/system-colors`
   - `../tokens/primitives/neutral-presets` → `../tokens/global/neutral-presets`
3. 모든 사용처가 마이그레이션되면 `src/tokens/primitives/` 폴더를 삭제한다.
