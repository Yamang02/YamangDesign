---
id: E28-B0001
title: 코드 주석·CC-05 Code Hygiene (basis 정합)
tags: [convention, cc-05, comments, backlog]
status: selected
owner: TBD
createdAt: 2026-04-01
relatedEpic: E27.2026-04-01_audit-remediation-layer-quality
---

## 한 줄 요약

basis **CC-05**는 “`//`를 `/* */`로 바꾸기”가 아니라, **CC-05-01·02**에 따라 **긴 맥락은 `docs/` 등 공식 문서**, **파일 단위 설명은 파일 상단 블록만**, **구현부 인라인에는 설명·why·단계 나열을 두지 않는다**는 뜻이다. E26 P06에서 지적된 ThemeProvider·labs·Icon 등 **설명용 인라인 주석**을 이 기준으로 **삭제·문서 이전·이름/구조로 치환**하는 후속 에픽/태스크 후보.

## 근거 (원문)

- 포팅 소스: `vibe_boilerplate/docs/basis/convention/coding/CC-05-code-hygiene.md` — CC-05-01(공식 문서), CC-05-02(설명은 파일 상단만), CC-05-03·04(미사용 코드·import).
- E26 P06 코드 컨벤션 점검 — 샘플 파일에 설명용 인라인 주석 다수.
- E27-B0001 표 — 동일 꼬리.

## 후보 범위

- 인라인 설명 제거 후 필요한 내용은 `docs/design` 등에 옮기고, 파일 상단에 **경로·앵커 한 줄**만 남길지 정리.
- 예외: 스택이 정한 **export 직상 JSDoc**, 도구용 `eslint-disable` / `NOSONAR` 한 줄, 부득이한 TODO+이슈 링크(CC-05-02 Exception).
- (별도) CC-05-03·04는 Sonar/ESLint로 기계 검출 가능 — 주석 작업과 병행 가능.

## 비고

**승격:** 별도 에픽이 아니라 **E27 Audit Remediation 에픽 Phase 7**(문서 파일명 `P07.cc-05-code-hygiene.md`)에서 구현·체크리스트를 관리한다. 이후 본문은 고정하고 스펙 변경은 에픽 문서만 수정한다.
