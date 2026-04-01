# Epic Backlog 운영 규칙

## 목적
`docs/epic/backlog/`는 “새 에픽을 뽑기 위한 아이디어(탐색/정리/선정 후보)”를 한곳에 모아두는 디렉토리입니다.
여기서 구현/스펙이 확정되는 문서를 만들기보다는, 아이디어의 근거와 범위만 안정적으로 기록하고 에픽으로 승격될 때만 구체 문서를 생성합니다.

## 핵심 원칙(버전 불일치 방지)
1. **아이디어 문서는 단일 소스(One record)**로 유지합니다. 같은 아이디어를 여러 버전의 백로그 문서로 복제하지 않습니다.
2. 백로그 문서의 콘텐츠를 “자유롭게 계속 수정”하지 않고, 상태가 전환될 때만 최소 변경합니다.
3. 에픽으로 승격되면 **백로그 문서는 `selected`(또는 `archived`)로 고정**하고, 이후 스펙/결정은 에픽 문서에서만 관리합니다.
4. 백로그 문서 ↔ 에픽 문서 사이에는 **링크만 유지**합니다(복사 금지).

## 파일 네이밍 규칙
- 형식: `YYYY-MM-DD_<short-id>_<short-title>.md`
- 예: `2026-03-19-E17-style-token-diff-ux.md`

## 문서 헤더 템플릿
모든 백로그 아이디어 문서는 첫 부분에 아래 키를 포함합니다.

```md
---
id: E17-B0001
title: Token Diff UX 개선
tags: [style, token, diff]
status: triage | incubating | proposed | selected | archived
owner: (이름/역할)
createdAt: YYYY-MM-DD
relatedEpic: E17.2026-03-19_style-expressiveness (없으면 공란)
---
```

## 상태(Status) 정의와 운영 흐름
- `triage`: 아이디어 후보(아직 범위가 거칠 수 있음). 최소 근거/가설만 적습니다.
- `incubating`: 추가 조사/견해 정리 단계. 다만 스펙 확정(구현 디테일)은 금지합니다.
- `proposed`: 다음 grooming 때 에픽 승격 후보로 제시됨.
- `selected`: 실제 에픽으로 승격됨. 이후 내용 수정은 링크/상태 메타만.
- `archived`: 폐기/연기. 이후 다시 살릴 때는 새 백로그 아이템을 만들지 말고 `incubating`으로 롤백만 고려합니다(가능하면).

## 운영 방법(주기/체크)
- “선정 주기”마다(예: 1~2주 또는 월 1회) `status=proposed/triage`만 리뷰합니다.
- 리뷰 때마다 백로그 아이템은 아래 중 하나로만 상태 전환합니다.
  - triage → incubating/proposed
  - incubating → proposed/selected
  - proposed → selected/archived
- 상태 전환 후에는 백로그 문서의 본문을 크게 바꾸지 않습니다.

## 에픽 Readme Backlog 섹션과의 연결
`docs/epic/<epic>/Readme.md`의 Backlog 섹션은 “이미 해당 에픽에서 확정된 이후 Phase/후속 과제 목록”으로 유지합니다.
즉,
- `docs/epic/backlog/` : 다음 에픽으로 뽑기 위한 아이디어 저장소
- `docs/epic/<epic>/Readme.md` : 해당 에픽 내부에서 이어질 구체 백로그

승격된 에픽 예: [E27 Audit Remediation](../E27.2026-04-01_audit-remediation-layer-quality/Readme.md) (백로그 [E27-B0001](./2026-04-01_E27-B0001_audit-remediation-implementation.md)).

후속 아이디어(에픽 밖): 인라인 주석·CC-05 위생 — [E28-B0001](./2026-04-01_E28-B0001_code-comment-hygiene-cc05.md).

