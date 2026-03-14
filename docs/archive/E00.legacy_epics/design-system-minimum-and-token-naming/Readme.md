# Epic E01: Design System 최소 구성 정비 및 토큰 네이밍

## 목표

디자인 시스템 “최소 구성” 기준(Design Tokens, Typography, Spacing, Component Spec, Motion)에 맞춰 현재 구현을 점검하고, 토큰 네이밍 컨벤션을 정의한 뒤 AGENT.md에 룰로 반영한다.

## 배경 / 맥락

- 디자인 시스템은 “스타일 모음집”이 아니라 **토큰 → 파운데이션 → 컴포넌트 → 패턴** 구조와 **토큰 3-tier(Global → Alias → 컴포넌트 참조)** 가 명확해야 확장 가능하다.
- 현재 프로젝트는 Global/Alias 구조와 대부분의 토큰이 구현되어 있으나, **토큰 이름 규칙**이 문서화되어 있지 않고, **컴포넌트/페이지 CSS 일부에서 hex 직접 사용** 등 원칙 위반이 있다.
- AI/에이전트가 코드를 생성·수정할 때 일관되게 토큰을 쓰려면 **AGENT.md에 토큰 네이밍 및 스타일 룰**이 명시되어야 한다.

## 특이점

- **토큰 네이밍**: `--ds-{category}-{sub}-{name}` 형식과 category별 허용 이름을 정리해, 신규 토큰 추가 시 혼선을 줄인다.
- **AGENT.md**: 기존 “CSS 변수만 사용” 룰을 유지하면서, **토큰 이름 패턴**과 **hex 사용 금지 예외(정의부만)** 를 추가한다.
- Phase 순서: 점검(갭 정리) → 네이밍 정의 → 룰 반영. 구현(hex 제거 등)은 별도 이슈/Phase로 둘 수 있다.

## Phase 목록

- [P01: 디자인 시스템 최소 구성 점검](./P01-design-system-minimum-audit.md)
- [P02: 토큰 네이밍 컨벤션 정의](./P02-token-naming-convention.md)
- [P03: AGENT.md 룰 추가](./P03-agent-md-rules.md)
- [P04: hex 직접 사용 제거(토큰 교체)](./P04-hex-to-token-replacement.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료

## 완료

아카이브일: 2026-03-14
