# P01: WCAG 유틸 함수 추가

## 목표

WCAG 2.1 기준의 상대 휘도(relative luminance)와 대비 비율(contrast ratio) 계산 함수, 그리고 action 배경색으로부터 최적 텍스트 색을 결정하는 `computeOnActionColor`를 `color.ts`에 추가한다.

## 구현 상세

**수정 파일:** `src/shared/utils/color.ts`

### 추가 함수

```ts
/** sRGB 채널 선형화 (WCAG 2.1 공식) */
function linearize(c: number): number

/** WCAG 상대 휘도 (0~1) */
export function getRelativeLuminance(hex: string): number

/** WCAG 대비 비율 (1~21) */
export function getContrastRatio(fg: string, bg: string): number

/**
 * action 배경색에 대해 WCAG 4.5:1을 보장하는 텍스트 색 반환.
 * hint가 주어지고 4.5:1을 통과하면 hint 사용, 실패하면 흰/검 중 더 높은 쪽 반환.
 */
export function computeOnActionColor(bgColor: string, hint?: string): string
```

**테스트 파일:** `src/shared/utils/color.test.ts`에 추가
- `getRelativeLuminance('#FFFFFF')` → 1.0
- `getRelativeLuminance('#000000')` → 0.0
- `getContrastRatio('#FFFFFF', '#000000')` → 21
- `computeOnActionColor('#FFD700')` → `'#000000'` (노랑에 흰색은 contrast 부족)
- `computeOnActionColor('#1A3C8F')` → `'#FFFFFF'` (어두운 네이비에 흰색 통과)
- `computeOnActionColor('#1A3C8F', '#FFFFCC')` → hint가 4.5:1 통과하면 hint 반환

## 체크리스트

- [ ] `getRelativeLuminance` 구현 및 `#FFFFFF`→1.0, `#000000`→0.0 검증
- [ ] `getContrastRatio` 구현 및 `#FFFFFF`/`#000000` 쌍 → 21:1 검증
- [ ] `computeOnActionColor` 구현 — hint 없을 때 흰/검 자동 선택
- [ ] `computeOnActionColor` — hint 있고 contrast ≥ 4.5:1이면 hint 반환, 실패 시 자동 선택 검증
- [ ] `color.test.ts` 테스트 추가 및 통과 확인
- [ ] `src/shared/utils/index.ts`에 새 함수 export 추가
