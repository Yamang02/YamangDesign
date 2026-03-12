# Epic E01: doc-restructure

## 목표

기존에 산발적으로 관리되던 docs 파일들을 epic/phase 체계로 통합한다.
v7까지 사용하던 `docs/v7-token-redesign/` 패턴을 마무리하고,
`docs/epic/` 중심의 표준 워크플로우를 확립한다.

## 배경 / 맥락

- v2~v6: `docs/archive/{버전}/` 구조로 관리
- v7: `docs/v7-token-redesign/` (epic-overview.md + E01~E04.md) — 완료됨
- 루트에 `FEATURES.md`, `EPIC-PALETTE-SELECTION.md`, `TUTORIAL.md` 등 산발 문서 존재
- 이번부터 `docs/epic/E##.날짜_이름/` 구조로 통일

## 특이점

- v7 문서는 이미 구현 완료 → 내용 변경 없이 archive로 이동
- `TUTORIAL.md`는 에픽이 아닌 참조 문서 → `docs/design/`에 유지
- `FEATURES.md` 처리 방향은 P03 실행 시 내용 보고 결정

## Phase 목록

- [P01: v7-archive](./P01-v7-archive.md)
- [P02: epic-structure-setup](./P02-epic-structure-setup.md)
- [P03: root-docs-migration](./P03-root-docs-migration.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
