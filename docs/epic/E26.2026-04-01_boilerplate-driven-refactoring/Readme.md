# Epic E26: Boilerplate-Driven Refactoring

## 목표
- vibe_boilerplate의 공통 skill 체계가 YamangDesign에 이식되어 있고, 프로젝트 특화 skill이 분리 관리된다
- 로컬 SonarQube 스캔 결과 Critical/Major/Minor 이슈가 모두 해소되어 clean 상태이다
- 코드가 vibe_boilerplate basis 규칙(CC, CN, AR)에 부합하며, 기존 테스트가 통과한다
- SonarQube가 커버하지 못하는 basis 영역(아키텍처, 디자인 토큰, 코드 컨벤션, 품질/보안, 프로세스/문서)이 체계적으로 점검되어 위반 사항이 기록되어 있다

## 배경 / 맥락

### 현재 상태
- YamangDesign은 domain/app/shared 3-layer 구조, CSS variable 기반 토큰 시스템, 24+ 컴포넌트를 가진 React 디자인 시스템 POC
- `AGENT.md` + `ai/rules.yaml`로 agent 규칙을 관리하며, `yamang-art-*` skill이 프로젝트 특화로 존재
- 로컬 SonarQube 서버는 있으나 YamangDesign 프로젝트는 미연결 상태
- SonarCloud 기반 `sonar-issues.json`(E25)이 존재하나 로컬 SonarQube 기준으로 재스캔 필요

### 문제
- vibe_boilerplate에 정립된 공통 skill/basis 규칙이 YamangDesign에 적용되지 않아 프로젝트 간 워크플로우가 불일치
- 코드 품질 이슈가 체계적으로 분류·추적되지 않음
- 프로젝트 특화 규칙(토큰 정책, 컴포넌트 구조)과 공통 규칙의 경계가 불명확

## 특이점
- **Basis 문서는 이식하지 않음 (A 제외):** vibe_boilerplate의 docs/basis/를 참조만 하고, YamangDesign에 복제하지 않는다
- **Skill 동기화 전략:** 공통 skill 상단에 `source: vibe_boilerplate@E26` 출처를 표기하고, 업데이트 시 diff 기반 수동 반영
- **프로젝트 특화 skill 관리:** boilerplate에 `templates/project-stack.tmpl.md` 템플릿을 작성하고, YamangDesign은 이를 기반으로 `yamang-design-stack.md` 생성
- **SonarQube:** 기존 SonarCloud 결과는 참고용, 로컬 SonarQube 결과를 기준으로 삼음
- **리팩토링 깊이:** 프로젝트 규모가 크지 않으므로 Minor까지 전부 수정 (C 수준)
- **P04~P08은 점검(audit) 전용:** 위반 사항을 발견·기록하되, 코드 수정은 하지 않는다. 수정이 필요하면 별도 에픽 또는 백로그로 승격한다
- **프론트엔드 전용 제외 항목:** AR-03(백엔드), DS-01(DB), SC-02(인증/인가), SC-04(API 보안), PT-01(도메인 모델링 패턴)은 해당 없음으로 제외

## Phase 목록
- [P01: SonarQube 연결 및 이슈 분류](./P01.sonarqube-scan-and-triage.md)
- [P02: Skill 이식 및 Agent 체계 전환](./P02.skill-migration-and-agent-setup.md)
- [P03: 코드 리팩토링](./P03.code-refactoring.md)
- [P04: 아키텍처 점검](./P04.architecture-audit.md)
- [P05: 디자인 토큰 점검](./P05.design-token-audit.md)
- [P06: 코드 컨벤션 점검](./P06.code-convention-audit.md)
- [P07: 품질/보안 점검](./P07.quality-security-audit.md)
- [P08: 프로세스/문서 점검](./P08.process-documentation-audit.md)

## 상태
- [x] P01 완료
- [x] P02 완료
- [ ] P03 완료 (진행 중: `S6759` 전량 해소(`96 -> 0`), `npm run build` / `npm run lint` 확인, 로컬 SonarQube `total=125 (BLOCKER 0, CRITICAL 0, MAJOR 58, MINOR 60, INFO 7)`)
- [ ] P04 완료
- [ ] P05 완료
- [ ] P06 완료
- [ ] P07 완료
- [ ] P08 완료
