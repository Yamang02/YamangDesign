# P03: root-docs-migration

## 목표

`docs/` 루트에 산발적으로 있는 문서들을 에픽 체계에 맞게 정리한다.

## 구현 상세

- `EPIC-PALETTE-SELECTION.md` → `docs/archive/palette-selection/Readme.md`
- `FEATURES.md` → 내용 검토 후 `docs/design/`으로 이동 또는 신규 에픽 생성
- `TUTORIAL.md` → `docs/design/TUTORIAL.md`로 이동 (참조 문서 유지)

## 체크리스트

- [ ] `EPIC-PALETTE-SELECTION.md` 내용 확인
- [ ] `docs/archive/palette-selection/` 디렉토리 생성
- [ ] `EPIC-PALETTE-SELECTION.md` → `docs/archive/palette-selection/Readme.md` 이동
- [ ] `FEATURES.md` 내용 확인 → 처리 방향 결정 (design/ 유지 or 새 에픽)
- [ ] `TUTORIAL.md` → `docs/design/TUTORIAL.md` 이동
- [ ] 이동된 파일들의 내부 링크 확인 및 수정
- [ ] Commit: `chore(docs): migrate root docs to epic structure`
