# Epic E32: Admin Shell (Ant-free) — 타 어드민 레이아웃 참고

## 목표
- 타 어드민 레이아웃(셸·네비·헤더·콘텐츠·대표 블록)을 참고해, YamangDesign에서 **Ant Design 의존 없이** `var(--ds-*)`·`var(--ui-*)`와 CSS Module로 재현할 수 있는 범위가 정의·구현된다.
- **antd는 의존성에 추가하지 않는다.** 참조는 정보 구조·간격·인터랙션 스펙 수준이며, 구현은 Yamang 스택으로 새로 짠다.
- 검증 가능한 진입점(예: Lab 또는 데모 라우트)에서 **어드민 셸과 대표 UI 블록**이 테마(팔레트·스타일) 전환에 맞게 렌더되는 것을 확인할 수 있다.

## 배경 / 맥락
### 현재 상태
- YamangDesign는 `ThemeTokenSet`·`--ds-*`·`--ui-*` 중심 토큰과 `src/app/components`의 기초 컴포넌트(`Button`, `Input`, `Select` 등)를 갖추고 있다.
- 참고한 타 어드민 구현은 Ant Design 5·차트 라이브러리·인라인 스타일·전역 `.ant-*` 보정에 기대며, 토큰·린트 정책은 Yamang과 동일하지 않다.

### 문제
- Admin 제품의 레이아웃·컴포넌트 패턴을 디자인 소스에 반영하려면 **코드 복사가 아닌 스펙 기반 재구현**과 **토큰 매핑**이 필요하다.

## 특이점
- 문서 본문에는 저장소 URL·외부 경로 마크다운 링크를 두지 않는다 (DC-05).
- Ant 소스·Less·`.ant-*` 클래스를 그대로 가져오지 않는다. 시각·동작은 스펙으로 정리한 뒤 Yamang에서 구현한다.
- 고난도 위젯(가상 스크롤 테이블, 복합 DatePicker 등)은 범위를 Phase에서 명시적으로 자르거나, 후속 Phase에서 헤드리스 UI·최소 의존성 등 **별도 결정**으로 기록한다.
- 브랜치: 본 에픽은 `epic/E32-admin-shell-reference`를 사용한다. Phase 작업은 `feat/E32/P##-…` 형태로 추적한다 (GC-01).

## Phase 목록
- [P01: scope-and-token-mapping](./P01.scope-and-token-mapping.md)
- [P02: token-and-admin-atoms-foundation](./P02.token-and-admin-atoms-foundation.md)
- [P03: admin-shell-layout](./P03.admin-shell-layout.md)
- [P04: composite-blocks-and-entrypoint](./P04.composite-blocks-and-entrypoint.md)

## 상태
- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료

## 후속 Phase (예정)
다음은 P01 산출을 기준으로 확정/운영한다.
- **P02 (토큰/atoms 정렬)**: P01에서 기존 atoms 확장 항목이 4개 이상으로 확인되어 독립 Phase로 생성했다.
- **P03 (Admin 셸 레이아웃)**: 신규 레이아웃 블록이 3개(사이드바·헤더·콘텐츠)로 확인되어 독립 Phase를 유지한다.
- **P04 (복합 블록+검증 진입점)**: 테이블/필터/모달 등 복합 블록과 검증 진입점(데모 라우트 또는 Lab)은 같은 Phase에서 완결한다.

## Phase 확정 규칙
- P01 체크리스트 5개가 모두 `[x]`가 되면, P01 문서의 블록/토큰 표를 근거로 P02를 생성한다.
- 분할 조건에 걸리지 않으면 P02에서 P03/P04 범위를 흡수해도 되지만, **검증 진입점 산출물은 반드시 마지막 활성 Phase 목표·체크리스트에 명시**한다.
