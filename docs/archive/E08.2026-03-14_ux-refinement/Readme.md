# Epic E08: UX Refinement

## 목표

모달 UI 재평가, Service/Build 페이지 역할 명확화, Shell Overview 컴포넌트 인벤토리 노출, Token Lab UI를 다른 랩과 맞춘 테이블 구조로 정리함으로써 워크벤치 전반의 UX 의도를 명확히 한다.

## 배경 / 맥락

E06까지 구조를 갖췄으나 세부 UX에서 미해결 사항들이 남아 있다.
- 모달(GlobalSettings / SemanticMapping / ScaleSelection)에 불필요하거나 일관성 없는 UI 요소 존재
- Service > Component Set이 Build와 역할이 겹침
- Build 페이지가 테마와 무관하게 렌더되어 "다른 테마에서 어떻게 보이는가"를 탐구할 수 없음
- Shell > Overview가 추상 다이어그램에 그쳐 실제 Shell 구성 컴포넌트를 드러내지 않음

E07(Code Cleanup) 완료 후 진행.

## 특이점

### 모달 재평가 원칙

- **GlobalSettingsModal**: Style 옵션을 하드코딩 배열 대신 preset registry에서 동적 파생
- **SemanticMappingModal**: 좌/우 2패널(ScaleGrid | ColorUsageDiagram)로 단순화
- **ScaleSelectionModal**: 직접 HEX 입력 제거, scale/step 선택에 집중
- **ComponentDetailModal**: 사용처 감사 후 유지/통합 결정

### Service vs Build 역할 분리

```
Build   = 컴포넌트 구조 탐구 + 경량 theme Controls (Palette + Style)
Service = 실제 서비스 페이지 목업 (Landing / Dashboard / Article)
```

Service의 Component Set 섹션 제거. Build 상단에 Palette + Style 선택 Controls 추가.

### Shell Overview 방향

추상 다이어그램 → 실제 Shell 컴포넌트 인벤토리 카드.
각 카드: 컴포넌트명 + 담당 `--shell-*` 토큰 목록 + Live Preview 연동.

### Token Lab UI 정렬 (P05)

토큰 목록을 카드 그리드 대신 **테이블 구조**로 통일. Build의 Design tokens 테이블 패턴 및 다른 랩의 LabSection 일관성에 맞춘다.

## Phase 목록

- [P01: 모달 재평가](./P01.modal-audit.md)
- [P02: Service Context 재정의](./P02.service-context-redesign.md)
- [P03: Build theme 주입](./P03.build-theme-injection.md)
- [P04: Shell Overview 컴포넌트 인벤토리](./P04.shell-overview-inventory.md)
- [P05: Token Lab UI 정렬 (테이블 구조)](./P05.token-lab-table-ui.md)
## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료

## 완료
아카이브일: 2026-03-18
