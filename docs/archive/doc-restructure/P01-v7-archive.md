# P01: v7-archive

## 목표

`docs/v7-token-redesign/`을 `docs/archive/v7-token-redesign/`으로 이동하여
완료된 v7 에픽을 공식 아카이브한다.

## 구현 상세

- 이동 대상: `docs/v7-token-redesign/` 전체 (epic-overview.md + E01~E04.md)
- 이동 위치: `docs/archive/v7-token-redesign/`
- 내용 변경 없음 (파일 이동만)
- 이동 후 `docs/v7-token-redesign/`에 대한 내부 링크가 있다면 수정

## 체크리스트

- [x] `docs/archive/v7-token-redesign/` 디렉토리 생성
- [x] `docs/v7-token-redesign/` 전체 이동
- [x] `docs/design/17-token-3tier-reference.md`의 v7 링크 확인 및 수정
- [x] `docs/TUTORIAL.md` 등 루트 문서의 v7 링크 확인 및 수정
- [x] `git mv` 또는 이동 후 git 추적 확인
- [x] Commit: `chore(docs): archive v7-token-redesign epic`
