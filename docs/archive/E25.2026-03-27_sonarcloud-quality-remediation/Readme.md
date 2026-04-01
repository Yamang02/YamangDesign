# Epic E25: SonarCloud Quality Remediation

## 목표

SonarCloud에서 보고된 정적 분석 이슈를 체계적으로 감축해 코드 품질 기준을 안정화한다.
우선 빈도와 영향도가 높은 규칙부터 정리하고, 접근성/안전성 관련 이슈를 우선 해결한다.

## 배경 / 맥락

현재 `sonar-issues.json` 기준으로 총 385개 이슈가 존재한다.
대부분 CODE_SMELL이지만 BUG/VULNERABILITY도 포함되어 있어, 규칙별 일괄 대응과 검증 루틴이 필요하다.

## 특이점

- **우선순위 기준**: `CRITICAL` + `BUG`/`VULNERABILITY` + 발생 빈도 상위 규칙 순서로 처리
- **일괄 수정 전략**: `readonly props`, 중첩 삼항, 불필요 assertion, 중복 import 등 반복 패턴을 먼저 정리
- **접근성 분리 대응**: 키보드 접근성/interactive semantics 이슈는 UI 회귀를 막기 위해 별도 Phase에서 검증
- **완료 기준 명확화**: 각 Phase마다 Sonar 재수집 스냅샷으로 감소량 확인

## Phase 목록

- [P01: 이슈 베이스라인 확정 + 우선순위 수립](./P01.issue-baseline-and-priority.md)
- [P02: 타입스크립트 반복 패턴 일괄 정리](./P02.typescript-high-frequency-rules.md)
- [P03: 접근성(A11y) 규칙 대응](./P03.accessibility-remediation.md)
- [P04: 스크립트/CSS/잔여 이슈 정리 + 검증](./P04.script-css-tail-cleanup.md)

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
- [ ] P04 완료

## 완료
아카이브일: 2026-04-01

P02~P04 Phase 전용 마크다운은 작성되지 않았고, 에픽 상태 체크박스는 미완료로 남아 있다. Sonar 품질 정리는 후속 에픽·백로그에서 이어간다.
