# Epic E27: Audit Remediation — Layer Boundaries & Quality Hardening

## 목표

- E26 P04~P08에서 기록된 **레이어 역방향 import**가 해소되거나, 허용 계약이 `shared`/앱 브리지로 명확히 분리된다.
- **디자인 토큰** 정책(아트 페이지 리터럴 vs 프리셋)이 문서·검사 스크립트와 정합하고, 신규 토큰 추가 시 따를 **단일 체크리스트**가 존재한다.
- **테스트**가 E26 P07 품질 점검에서 식별된 우선 영역(`app/components`, 주요 labs·페이지)에 대해 smoke/상호작용 수준으로 보강된다(P03).
- **`npm audit`** moderate/high 이슈가 해소되거나, 호환 불가 시 **Accepted 근거**가 에픽에 기록된다.
- **프로세스** 문서(GC-01 브랜치 패턴, 프로젝트 티어 한 줄)가 실제 사용과 맞거나, 문서에 실제 패턴이 명시된다.
- **색·크기 리터럴 검사**가 ESLint + Stylelint + **통합된 리터럴 스크립트**로 단일 `npm run lint` 진입점을 갖는다(P06).
- **CC-05 Code Hygiene**(주석 위치·공식 문서 이전·미사용 코드)이 E26 P06 점검 및 basis와 정합한다(P07).

## 배경 / 맥락

### 현재 상태

- E26에서 P04~P08 **점검만** 수행했고, 역방향 import·토큰 하드코딩·테스트 갭·audit 이슈 등은 백로그 E27-B0001로 정리됨.
- E26 P04 아키텍처 점검: domain→app, shared theme 타입 등 기록.
- E26 P07 품질/보안: 테스트 갭, npm audit 등 기록.

### 문제

- 점검 결과가 **코드·의존성·문서**에 반영되지 않으면 AR/TC/SC 기준과의 괴리가 유지된다.
- 범위가 넓어 **Phase 단위**로 쪼개 검증해야 한다.

## 특이점

- **근거 문서:** 구현 판단은 E26 P04~P08 및 본 에픽 Phase 문서를 우선한다.
- **대형 훅 분리**는 범위가 크면 P07 이후 후속으로 쪼갤 수 있다. **CC-05**는 본 에픽 **P07**에서 다룬다(승격 원본: 백로그 E28-B0001).
- **depcheck**는 path alias 오탐이 있으므로, 미사용 패키지 제거는 **수동 검토**만 한다.
- **P06:** TS 색 리터럴은 ESLint 단독 대신 **`check-runtime-literals.js` 유지** + `lint`에 편입. Stylelint 규칙 대량 강화는 후속.

## Phase 목록

- [P01: 레이어 경계·테마 계약](./P01.layer-boundaries-theme-contracts.md)
- [P02: 디자인 토큰·거버넌스](./P02.design-tokens-governance.md)
- [P03: 테스트 보강](./P03.tests-smoke-interaction.md)
- [P04: 의존성·audit](./P04.dependencies-audit-remediation.md)
- [P05: 프로세스·문서 정렬](./P05.process-documentation-alignment.md)
- [P06: 색·크기 리터럴 검사 — ESLint + Stylelint 이관](./P06.lint-color-literals-eslint-stylelint.md)
- [P07: CC-05 Code Hygiene — 주석·미사용 코드](./P07.cc-05-code-hygiene.md)

## 상태

- [x] P01 완료 ([P01](./P01.layer-boundaries-theme-contracts.md))
- [x] P02 완료 ([P02](./P02.design-tokens-governance.md))
- [x] P03 완료 ([P03](./P03.tests-smoke-interaction.md)) *(smoke 1건; 추가 테스트는 후속 가능)*
- [x] P04 완료 ([P04](./P04.dependencies-audit-remediation.md))
- [x] P05 완료 ([P05](./P05.process-documentation-alignment.md))
- [x] P06 완료 ([P06](./P06.lint-color-literals-eslint-stylelint.md))
- [x] P07 완료 ([P07](./P07.cc-05-code-hygiene.md))

## 백로그 연결

- 승격 원본: E27-B0001 (`status: selected`), E28-B0001 → **본 에픽 P07**로 편입 (`status: selected`).
