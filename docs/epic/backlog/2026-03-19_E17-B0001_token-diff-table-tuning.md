---
id: E17-B0001
title: Token Diff 테이블 튜닝(성능/기준 UX)
tags: [style, token, diff, ui]
status: triage
owner: TBD
createdAt: 2026-03-19
relatedEpic: E17.2026-03-19_style-expressiveness
---

## 한 줄 메모
Token Diff 테이블이 동작한 뒤에, 학습 흐름을 방해하지 않도록 성능/기준 사조 선택 UX를 다듬을 필요가 있음.

## 후보(추후 확정)
- 성능: 토큰 diff 계산/렌더 비용 메모이제이션(특히 스타일/팔레트 변경 시)
- 기준 사조 UX: `selectedStyle`이 없을 때 base 스타일을 어떤 규칙으로 고정할지(사용자 기대값)
- 하이라이트/표시 정책: 어떤 셀을 강조할지(너무 많은 차이로 시각 노이즈가 생기지 않도록)

