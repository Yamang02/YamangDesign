# Epic E07: Code Cleanup & Directory Restructure

## 목표

E03~E06을 거치며 누적된 데드코드를 제거하고,
소스 디렉토리 구조를 네비게이션 3축(Labs / Build / Context)과 완전히 일치시킨다.
E08 UX 작업의 기반이 되는 정리 에픽.

## 배경 / 맥락

E06 완료 후 네비게이션은 Labs / Build / Context로 재편되었으나,
소스 디렉토리는 `src/pages/layouts/` (Labs), `src/pages/showcase/` (Build) 로 남아 있어
코드와 UI 용어가 불일치한다. 또한 E03~E04에서 교체된 테마 파일들
(`themes/minimal/`, `themes/neumorphism/`, `styles/ui-variables.css`)이
git D 상태로 미삭제 잔존하고 있다.

## 특이점

- 디렉토리 리네임은 전체 import 경로에 영향을 주므로 P02에서 일괄 처리
- `src/pages/context/`는 이미 네비게이션 축과 일치하므로 변경 없음
- P03의 네이밍 정리는 상수/타입 내 `layouts` 문자열 참조 및 dead export만 대상

## Phase 목록

- [P01: 데드코드 삭제](./P01.dead-code-removal.md)
- [P02: 디렉토리 재편](./P02.directory-restructure.md)
- [P03: 상수·타입 네이밍 정리](./P03.naming-cleanup.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
