# P02: domain/ 레이어 구성

## 목표

`src/domain/` 디렉토리를 만들고 도메인 코드를 이동한다.
완료 후 `domain/` 안의 모든 파일은 React/브라우저 의존성을 갖지 않는다.

## 구현 상세

### 이동 목록

| 현재 경로 | 신규 경로 | 비고 |
|---|---|---|
| `src/palettes/` | `src/domain/palettes/` | 디렉토리 통째로 이동 |
| `src/themes/` | `src/domain/themes/` | 디렉토리 통째로 이동 |
| `src/tokens/` | `src/domain/tokens/` | 디렉토리 통째로 이동 |
| `src/styles/presets/` | `src/domain/styles/presets/` | `.ts` 파일만 |
| `src/styles/types.ts` | `src/domain/styles/types.ts` | |
| `src/styles/index.ts` | `src/domain/styles/index.ts` | |
| `src/constants/palette-definitions.ts` | `src/domain/constants/palette-definitions.ts` | |
| `src/constants/palette-scales.ts` | `src/domain/constants/palette-scales.ts` | |
| `src/constants/semantic-presets.ts` | `src/domain/constants/semantic-presets.ts` | |
| `src/constants/theme-presets.ts` | `src/domain/constants/theme-presets.ts` | |
| `src/constants/component-tokens.ts` | `src/domain/constants/component-tokens.ts` | |

### 흡수 (파일 이동 + 내용 통합)

| 현재 경로 | 신규 경로 | 비고 |
|---|---|---|
| `src/utils/palette.ts` | `src/domain/palettes/` 내부 | 적절한 파일로 통합 |
| `src/utils/system-colors.ts` | `src/domain/tokens/` 내부 | 적절한 파일로 통합 |

### 분리 (파일 내용 분할)

**`src/constants/lab-presets.ts`**
- 데이터 부분 (preset 정의 값) → `src/domain/constants/lab-presets.ts`
- CSS var 생성 함수 부분 → `src/domain/styles/lab-presets.ts`

### 완료 기준

- `src/domain/` 내 모든 파일에 `import React`, `useState`, `useEffect`, `localStorage`, `document` 등이 없음
- TypeScript 컴파일 통과

## 체크리스트

- [ ] `src/domain/` 디렉토리 생성
- [ ] `palettes/`, `themes/`, `tokens/` 이동
- [ ] `styles/` `.ts` 파일 이동 (`domain/styles/`)
- [ ] `constants/` 도메인 파일 5개 이동 (`domain/constants/`)
- [ ] `utils/palette.ts` 흡수
- [ ] `utils/system-colors.ts` 흡수
- [ ] `constants/lab-presets.ts` 분리 후 각 위치로 이동
- [ ] TypeScript 컴파일 통과
