# Epic E31: Main Landing Korean Content & Entry Alignment

## 목표
- 헤더 로고 클릭 시 진입점이 `main`으로 일관되게 연결된다.
- `Main` 페이지 섹션별 메시지가 한국어 기준으로 제품 정체성과 정보 우선순위를 명확히 전달한다.
- 카피 변경 시 DS 토큰/레이아웃 구조를 깨지 않고 `main-content.ts` 단일 소스에서 유지보수할 수 있다.

## 배경 / 맥락
### 현재 상태
- 기본 진입 페이지는 `main`으로 이미 전환되어 있고, 로고 클릭 핸들러도 `main`을 가리키는 상태다.
- `Main` 구조(히어로, 모듈 그리드, 스포트라이트)는 완성되어 있으나 문구는 영문 중심이었다.
- 콘텐츠 랜딩(`Landing`)은 별도 페이지로 유지해야 한다.

### 문제
- 실제 서비스 랜딩으로 쓰기에는 기존 카피 톤이 프로젝트 맥락(디자인 연구/실험/구현 허브)을 충분히 반영하지 못했다.
- 섹션별 문구 전략(무엇을 먼저 강조할지)에 대한 기준이 문서화되어 있지 않았다.

## 특이사항
- `Landing` 페이지는 교체 대상이 아니며, `Main`만 사이트 고유 랜딩으로 운영한다.
- 카피 소스는 `src/app/content/main-content.ts`를 단일 진실원으로 유지한다.
- 라우팅/네비게이션 id는 기존 `PageName` 및 `nav-categories`와 정합성을 유지한다.

## Phase 목록
- [P01: logo-main-entry-alignment](./P01.logo-main-entry-alignment.md)
- [P02: main-korean-copy-strategy](./P02.main-korean-copy-strategy.md)

## 상태
- [x] P01 완료
- [x] P02 완료
