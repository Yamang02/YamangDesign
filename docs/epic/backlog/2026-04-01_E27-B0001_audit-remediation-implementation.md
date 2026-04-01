---
id: E27-B0001
title: E26 점검 후속 — 레이어·토큰·품질 보강 (구현 에픽 후보)
tags: [e26-followup, architecture, tokens, testing, security, backlog]
status: selected
owner: TBD
createdAt: 2026-04-01
relatedEpic: E27.2026-04-01_audit-remediation-layer-quality
---

## 한 줄 요약

E26 P04~P08에서 **코드 수정 없이 기록만** 한 항목을 바탕으로, **모범사례에 가깝게** 정리하고 테스트·보안 스냅샷을 개선하는 **구현 전용 에픽** 후보.

## 근거 (점검 문서 링크)

| 출처 | 핵심 이슈 |
|------|-----------|
| [P04 아키텍처](../E26.2026-04-01_boilerplate-driven-refactoring/P04.architecture-audit.md) | `domain → @app` 역방향 import, `shared/@types/theme.d.ts → @domain`, barrel 우회 샘플 |
| [P05 디자인 토큰](../E26.2026-04-01_boilerplate-driven-refactoring/P05.design-token-audit.md) | `app/pages/art/**` HEX/rgba 하드코딩 다수 vs DS 정책; 단일 신규 토큰 체크리스트 문서 없음 |
| [P06 코드 컨벤션](../E26.2026-04-01_boilerplate-driven-refactoring/P06.code-convention-audit.md) | 대형 훅 오케스트레이션·계산 혼재 가능; 인라인 `//` 주석 다수(CC-05 엄격 시) |
| [P07 품질/보안](../E26.2026-04-01_boilerplate-driven-refactoring/P07.quality-security-audit.md) | 레이어별 테스트 갭; `npm audit` high/mod 이슈; 키보드 a11y 심화 미실행 |
| [P08 프로세스/문서](../E26.2026-04-01_boilerplate-driven-refactoring/P08.process-documentation-audit.md) | 브랜치 네이밍 GC-01 불일치; 프로젝트 티어·용어집 분산 |

## 후보 범위 (에픽 승격 시 쪼개기 가능)

### A. 아키텍처 (우선순위 높음)

- **Theme 브리지:** `ThemeProvider` 및 domain 쪽 `@app` 의존을 줄이기 — 앱 레이어 래퍼, 또는 공유 계약 타입을 `shared`/전용 `contracts` 모듈로 이동 ([P04 권장 후속](../E26.2026-04-01_boilerplate-driven-refactoring/P04.architecture-audit.md)).
- **`shared/@types/theme.d.ts`:** `@domain/constants/theme-presets` 의존 제거 방안 (`PaletteName` 경계 정리).

### B. 디자인 토큰

- **아트 페이지:** 의도적 색 유지 vs 토큰/프리셋 이전 중 정책 결정 후, `check:literals`·스토리북 등과 정렬 ([P05](../E26.2026-04-01_boilerplate-driven-refactoring/P05.design-token-audit.md)).
- **거버넌스:** 신규 토큰 체크리스트를 `docs/design` 또는 스킬에 **한 페이지**로 추가 (문서만이면 소규모).

### C. 코드 품질·테스트

- **테스트:** `app/components`, 주요 labs·페이지에 **smoke/상호작용** 테스트 추가 우선순위 목록 ([P07](../E26.2026-04-01_boilerplate-driven-refactoring/P07.quality-security-audit.md)).
- **CC:** 대형 훅 분리·순수 함수 추출은 **별도 태스크**로 쪼개기.

### D. 보안·의존성

- **`npm audit fix`** 적용 및 회귀 테스트 (P07 스냅샷: `brace-expansion`, `flatted`, `picomatch` transitive).
- depcheck는 path alias 오탐 — **수동**으로 미사용 패키지 검토만.

### E. 프로세스 (낮음)

- **브랜치 네이밍:** `feat/E##/P##-*` 정렬 또는 문서에 실제 사용 패턴 명시.
- **프로젝트 티어(S/M/L)** 한 줄 선언(README 또는 `docs/design`).
- **백로그 인덱스:** `docs/epic/backlog/README.md` 운영 규칙과 이 아이템 연결 유지.

## 에픽으로 승격할 때 제안 제목 (예)

- `E27: Audit Remediation — Layer Boundaries & Quality Hardening` (범위는 grooming에서 조정)

## 비고

- 본 아이템은 **구현 스펙 확정 문서가 아님** (`docs/epic/backlog/README.md` 원칙). 승격 시 `docs/epic/E27.*/Readme.md`에서 Phase·목표를 확정한다.
- E26 P06에서 언급된 **CC-05**는 백로그 [E28-B0001](./2026-04-01_E28-B0001_code-comment-hygiene-cc05.md)를 거쳐 **E27 Phase 7**로 편입됨(`selected`). 구현은 에픽 E27의 Phase 7 문서에서만 관리한다.
