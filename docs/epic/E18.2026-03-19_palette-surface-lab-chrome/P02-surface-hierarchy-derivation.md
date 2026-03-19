# P02: Surface 계층 타입 및 자동 파생

## 목표

`SemanticMapping`의 `bg` 필드에 `surfaceLow` / `surfaceHigh`를 추가하고, `resolvePalette()` 단계에서 neutral + primary tint를 혼합하여 surface 레벨을 pre-compute한다.

## 구현 상세

### 1. colorMix 유틸 추가

`src/shared/utils/color.ts`에 두 색상을 비율로 혼합하는 함수 추가:

```ts
/** 두 hex 색상을 ratio(0~1) 비율로 혼합. ratio=0이면 base, ratio=1이면 mix */
export function colorMix(base: string, mix: string, ratio: number): string
```

RGB 채널별 선형 보간. 기존 `lighten`/`darken`과 동일한 hex 입출력 패턴.

### 2. SemanticMapping bg 확장

`src/domain/palettes/types.ts`의 `SemanticMapping.bg`와 `SemanticColors.bg`에 추가:

```ts
bg: {
  base: string | ScaleReference;
  subtle: string | ScaleReference;
  surfaceLow: string | ScaleReference;   // 신규: 섹션 배경, 사이드바
  surface: string | ScaleReference;       // 기존: 카드/컨테이너
  surfaceHigh: string | ScaleReference;   // 신규: 선택 카드, 호버
  surfaceBrand: string | ScaleReference;  // 기존 유지
  elevated: string | ScaleReference;
  muted: string | ScaleReference;
};
```

### 3. resolveSemanticMapping 확장

`src/domain/palettes/mapping/resolve.ts`의 `resolveSemanticMapping()`에서 `surfaceLow`, `surfaceHigh` 해석 추가.

### 4. CSS 변수 출력 확장

`src/domain/themes/token-set.ts`에서 `--ds-color-bg-surface-low`, `--ds-color-bg-surface-high` 변수 생성 추가.

### 변경 파일

- `src/shared/utils/color.ts` — `colorMix()` 함수 추가
- `src/shared/utils/color.test.ts` — colorMix 테스트
- `src/domain/palettes/types.ts` — SemanticMapping.bg, SemanticColors.bg 확장
- `src/domain/palettes/mapping/resolve.ts` — resolveSemanticMapping, resolveColorValue 확장
- `src/domain/themes/token-set.ts` — CSS 변수 키 추가

## 체크리스트

- [x] `colorMix(base, mix, ratio)` 유틸 함수 구현 및 테스트
- [x] `SemanticMapping.bg`에 `surfaceLow`, `surfaceHigh` 필드 추가
- [x] `SemanticColors.bg`에 `surfaceLow`, `surfaceHigh` 필드 추가
- [x] `resolveSemanticMapping()`에서 새 필드 해석
- [x] `token-set.ts`에서 `--ds-color-bg-surface-low`, `--ds-color-bg-surface-high` 출력
- [x] 기존 테스트(`e17-style-expressiveness.test.ts` 등) 통과 확인
