# P01: 브레이크포인트 토큰

## 목표

디자인 시스템 도메인에 브레이크포인트 토큰을 정의하고, CSS 변수로 emit한다.
이후 모든 반응형 작업(크롬, 레이아웃, 랩)이 이 토큰을 기준으로 미디어 쿼리를 작성한다.

## 구현 상세

**접근 방법:**
- `src/domain/tokens/global/`에 `breakpoints.ts` 추가 (grid.ts 패턴 참고)
- 토큰명: `ds-breakpoint-sm`, `ds-breakpoint-md`, `ds-breakpoint-lg`, `ds-breakpoint-xl`
- 값: sm=480px, md=768px, lg=1024px, xl=1280px (조정 가능)
- `src/domain/tokens/global/index.ts`에서 export

**변경 파일:**
- CREATE `src/domain/tokens/global/breakpoints.ts`
- MODIFY `src/domain/tokens/global/index.ts` — breakpoints export 추가

## 체크리스트

> **이미 완료됨**: `src/domain/tokens/global/grid.ts`에 `breakpoints` 상수가 이미 정의되어 있고 (sm=480px, md=768px, lg=1024px, xl=1440px), `index.ts`에서 re-export 중. 별도 파일 생성 불필요.

- [x] breakpoints 토큰 정의 (sm/md/lg/xl 4단계) — `grid.ts`에 존재
- [x] `index.ts`에서 breakpoints export — `export * from './grid'` 포함
- [x] TypeScript 상수로 접근 가능 (`breakpoints.md` 등)
- [ ] CSS 변수로 emit (미사용, 미디어 쿼리는 JS 상수값 직접 참조)
