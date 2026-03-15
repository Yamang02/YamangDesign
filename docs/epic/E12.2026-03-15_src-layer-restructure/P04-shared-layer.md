# P04: shared/ 레이어 구성

## 목표

`src/shared/` 디렉토리를 만들고 계층 지식 없는 범용 코드를 이동한다.
완료 후 `shared/` 안의 파일은 `domain/`도 `app/`도 import하지 않는다.

## 구현 상세

### 이동 목록

| 현재 경로 | 신규 경로 | 비고 |
|---|---|---|
| `src/utils/clsx.ts` | `src/shared/utils/clsx.ts` | |
| `src/utils/css.ts` | `src/shared/utils/css.ts` | |
| `src/utils/css-structured.ts` | `src/shared/utils/css-structured.ts` | |
| `src/utils/color.ts` | `src/shared/utils/color.ts` | 순수 색상 연산 |
| `src/utils/index.ts` | `src/shared/utils/index.ts` | export 정리 |
| `src/styles/*.css` | `src/shared/styles/` | 전역 CSS 파일들 |
| `src/@types/` | `src/shared/@types/` | |
| `src/assets/` | `src/shared/assets/` | |

### CSS 파일 목록 (shared/styles/로 이동)

- `fonts.css`
- `reset.css`
- `shell-variables.css`
- `sys-variables.css`
- `transitions.css`
- `variables.css`

### 정리

P02, P03 완료 후 `src/utils/`에 남은 파일이 없어야 한다.
이 Phase 완료 시 `src/utils/` 디렉토리가 삭제된다.

### 완료 기준

- `src/utils/` 디렉토리 삭제됨
- `src/styles/` 디렉토리에 `.ts` 파일 없음 (P02에서 이동) + `.css` 파일 없음 (이 Phase에서 이동) → 디렉토리 삭제됨
- `shared/` 내 파일 중 `domain/` 또는 `app/` import 없음
- TypeScript 컴파일 통과

## 체크리스트

- [ ] `src/shared/` 디렉토리 생성
- [ ] `utils/` 순수 함수 파일 4개 이동 (`clsx`, `css`, `css-structured`, `color`)
- [ ] `shared/utils/index.ts` export 정리
- [ ] `styles/*.css` 파일들 `shared/styles/`로 이동
- [ ] `@types/` → `shared/@types/`로 이동
- [ ] `assets/` → `shared/assets/`로 이동
- [ ] `src/utils/` 디렉토리 삭제
- [ ] `src/styles/` 디렉토리 삭제 (비어있음 확인 후)
- [ ] TypeScript 컴파일 통과
