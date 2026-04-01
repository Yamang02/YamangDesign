# Epic E17: 디자인 사조 표현력 강화 및 비교 인프라

## 목표

디자인 사조(Style)별 토큰 표현력을 높이고, 사조-팔레트 간 관계를 메타데이터로 정의하며, Overview·토큰 표시를 데이터 중심으로 재구성하여 사조 연구·비교에 최적화된 시스템을 구축한다.

## 배경 / 맥락

[20-style-system-review.md](../../design/20-style-system-review.md) 분석 결과, 현재 시스템의 세 가지 구조적 빈틈이 확인되었다.

1. **사조별 토큰 표현 부족** — radius, motion, typography가 전역 고정값이어서 Brutalism(0px radius, instant transition)과 Glassmorphism(16px+ radius, smooth transition)의 시각적 차이를 토큰으로 구분할 수 없다.
2. **사조-팔레트 결합 정보 부재** — Glassmorphism + light bgStrategy처럼 효과가 소멸하는 조합에 대한 경고·추천 메커니즘이 없다.
3. **Overview·토큰 표시의 정적 구조** — Lab 페이지의 Overview가 하드코딩된 텍스트 중심이며, 토큰 목록이 카테고리 자동 분류 외에 정렬·필터·비교 기능을 제공하지 않는다.

## 특이점

- **Palette ⊥ Style 직교성 유지가 대원칙.** 사조별 팔레트 제약은 "경고/추천"으로만 표현하고, 조합 자체를 차단하지 않는다.
- `createVars()` 훅을 활용하면 `StyleDefinition` 인터페이스 변경 없이 radius·motion 오버라이드를 구현할 수 있다. 인터페이스 확장보다 관례 확립을 우선한다.
- Overview 데이터 소스는 기존 `StyleDefinition`, `PaletteDefinition`, `ThemeTokenSet`에서 직접 추출한다. 별도 데이터 레이어를 만들지 않는다.

## 전체적인 리뷰
교차검토 결과, 문서들은 큰 방향성은 일관되지만 실행 정확도를 좌우하는 “계약(Contract)”과 “파이프라인(Pipeline)”이 몇 군데에서 문서만으로는 고정되지 않았다.

1. `createVars()`의 “키 네이밍/단위/인자 계약”과 CSS 변수 주입 전개 순서가 확정되어야 P01과 P04의 동작이 모두 일치한다.
2. `bgStrategy`의 값 스펙(예: `dark`/`light`/`colored`가 의미하는 실제 조건)과 경고 UI의 소유처가 명확해야 P02가 흔들리지 않는다.
3. P05의 diff 로직은 “어떤 스코프(스택)에서 어떤 값들을 비교하는가”가 P06의 스코프 주입 방식과 직접 결합된다. DOM 조회 방식(`getComputedStyle`)만으로는 비교가 완결되기 어려울 수 있다.
4. P06는 CSS 변수 스코프 격리 전략이 “컴포넌트가 변수만으로 스타일을 결정하는가”에 달려 있다. `data-` 속성/selector 의존이 있으면 패널 단위로 동일 조건을 맞춰야 한다.
5. 런타임 추출(특히 P04)은 토큰/스타일 규모가 커질 때 재계산 비용이 생긴다. 메모이제이션/캐싱 정책의 가이드가 필요하다.

이 항목들은 각 Phase에 “검증 체크리스트” 형태로 반영한다.

## Phase 목록

- [P01: 사조별 토큰 오버라이드](./P01-style-scoped-token-override.md) — createVars로 radius·motion 사조별 주입
- [P02: 스타일 메타데이터 및 팔레트 어피니티](./P02-style-metadata-palette-affinity.md) — StyleDefinition 메타데이터, bgStrategy 제약
- [P03: 역사적 팔레트 프리셋](./P03-historical-palette-presets.md) — 사조별 대표 배색 프리셋 추가
- [P04: 데이터 중심 Overview 재구성](./P04-data-driven-overview.md) — Lab Overview를 토큰 데이터에서 동적 생성
- [P05: 토큰 표시·정렬 UX 개선](./P05-token-display-sort.md) — 카테고리 그룹핑, 정렬, 필터, diff 하이라이트
- [P06: 사이드바이사이드 비교 뷰](./P06-side-by-side-comparison.md) — 동일 컴포넌트를 복수 사조로 나란히 비교

## 상태

- [x] P01 완료
- [x] P02 완료 (StyleMetadata + bgStrategy 경고)
- [x] P03 완료 (historical 카테고리/프리셋 등록)
- [x] P04 완료 (StyleLab·PaletteLab·TokenLab Overview 데이터 동적 생성)
- [x] P05 완료 (TokenLab: 검색/정렬/접기 UI + StyleLab Token Diff)
- [x] P06 완료

## 테스트 반영

- E17 회귀 방지 테스트를 `src/domain/themes/e17-style-expressiveness.test.ts`에 추가했다.
- 검증 범위: P01(`createVars` 핵심 키), P02(`bgStrategy` 선호/비호환 규칙), P03(`historical` registry 및 추천 스타일 유효성), P05(TokenLab alias 토큰 ↔ `semanticVars` 키 정합성).
- 테스트 작성 과정에서 alias 토큰 키 오타(`--ds-color-bg-surfaceBrand`)를 `--ds-color-bg-surface-brand`로 수정했다.
- 검증 결과: `npm run test` 통과 (전체 테스트 green).

## Backlog
에픽 완료 이후(또는 Phase 문서에서 “검증/정합성 확정”이 남았을 때) 이어서 다룰 개선·정리 “후보”를 모읍니다.

실제 백로그 아이디어/메모 문서는 `docs/epic/backlog/`에서 상태(`triage/incubating/proposed/selected/archived`)로 관리합니다: `docs/epic/backlog/README.md`

- 검토 중에 사용자가 “넘어가자”라고 하면, 그 내용을 백로그에 1~3줄로 “간단 메모”만 남기고 에픽/Phase 문서에는 승격 전까지 자세한 구현·스펙을 넣지 않습니다.
- 승격(선정)되면, 그때 에픽 내부의 Phase 문서/체크리스트로만 구체화합니다.

## 완료
아카이브일: 2026-04-01
