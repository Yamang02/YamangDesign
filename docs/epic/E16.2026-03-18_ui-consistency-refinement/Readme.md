# Epic E16: UI 일관성 정비

## 목표
전체 앱의 토큰 시맨틱 역할 일치, 레이아웃 패턴 통일, 불필요한 UI 요소 제거를 통해
디자인 시스템의 일관성과 품질을 높인다.

## 배경 / 맥락
E15까지의 작업으로 토큰 레이어 분리(shell/ds/sys)와 LabLayout 표준화가 완료되었으나,
일부 페이지에서 토큰 오용(DesignSettingsLab의 ds 토큰 사용), 레이아웃 불일치(디자인 세팅의 독자 TabBar),
불필요한 서브타이틀, 사용예시 등이 남아 있다. Context 페이지의 오버뷰/프리뷰도 정리가 필요하다.

## 특이점
- 레이어별 순차 접근: 토큰 감사를 먼저 완료한 뒤 UI/구조 변경을 진행하여 충돌 방지
- 앱 크롬은 `--shell-*`, 프리뷰 영역은 `--ds-*` 원칙 엄수
- 토큰의 시맨틱 역할과 컴포넌트 역할이 정확히 매칭되어야 함 (bg 토큰은 배경에, text 토큰은 텍스트에)
- Landing 등 데모 페이지는 별도 에픽에서 추가 예정이므로 이번 범위에서 제외

## Phase 목록
- [P01: 토큰 시맨틱 감사 및 정리](./P01-token-semantic-audit.md)
- [P02: 레이아웃 및 구조 변경](./P02-layout-structure.md)
- [P03: 콘텐츠 정리](./P03-content-cleanup.md)
- [P04: 기타 개선](./P04-misc-improvements.md)
- [P05: ComponentDetailModal 프리뷰 컨텍스트 복원](./P05-modal-preview-context.md)
- [P06: shell 토큰 네임스페이스 분리](./P06-shell-token-namespace-cleanup.md)

## 상태
- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [ ] P06 완료
