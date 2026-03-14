# Epic E02: Style Extensibility and Lab Refinement

## 목표

스타일 시스템을 다양한 시각적 실험(glassmorphism, 유화, 3D 등)을 수용할 수 있는 구조로 확장하고,
Lab UI를 테마 변경으로부터 격리하며, Components 페이지를 전시장 형태의 그리드로 개선한다.

## 배경 / 맥락

E01에서 토큰 네이밍 컨벤션과 시스템 최솟값을 정립했다. 이후 새 스타일을 추가하려는 시도에서
구조적 한계가 드러났다. 글라스모피즘 적용 시 `backdrop-filter`, `background-opacity` 같은
값을 넣을 슬롯이 `StyleDefinition`에 없어서 포기해야 했다.

현재 `StyleDefinition`은 `createShadows`(box-shadow)와 `border`(width/style) 두 가지만
다룬다. CSS 시각 효과 범주(재질, 필터, 공간)는 아예 모델링되지 않았고, 필드명도 CSS 구현
용어 그대로라 개념 레이어가 불분명하다.

Lab UI는 `--lab-bg-surface: #ffffff` 하드코딩으로 부분적으로 보호되지만, 테마가 바뀌면
텍스트 색상·보더 등 Lab 자체 UI가 영향을 받는다. 프리뷰 영역과 Lab UI가 명확히 분리되지
않은 상태다.

Components 페이지는 컴포넌트가 추가될수록 수직으로 선형 누적되는 구조라 가시성이 떨어진다.

## 특이점

### StyleDefinition 재설계

`createShadows` / `border` → `elevation` / `stroke` 으로 개념 재명명.
CSS 효과 범주에 따라 `material`, `filter`, `spatial` 슬롯 신설.
완전히 새로운 효과는 `createVars` escape hatch로 처리.

복잡한 스타일(3D 카드 플립, 유화 텍스처 pseudo-element)은 CSS 변수만으로 표현이 불가능하다.
이 경우 ThemeProvider가 `data-style` 속성을 `<html>`에 이미 설정하고 있으므로,
`[data-style="3d"]` CSS 셀렉터 방식을 병행한다.

`themes/minimal/tokens.ts`, `themes/neumorphism/tokens.ts`의 레거시 함수
(`createMinimalTheme`, `createNeumorphismTheme`)는 현재 `combineTheme` 경로로
대체되어 있으므로 이번 에픽에서 제거한다.

### Lab 테마 독립성

완전한 CSS 격리는 별도 ThemeProvider 중첩이 필요해 프리뷰 영역의 테마 컨텍스트 접근이
복잡해진다. `[data-context="lab"]` CSS 변수 고정 방식이 더 단순하고 명확하다.
프리뷰 영역은 `[data-context="preview"]`로 고정값을 해제해 글로벌 테마를 다시 받는다.

### Components 그리드

"전시장" 컨셉 유지. 탭 방식은 콘텐츠를 숨겨 전시 느낌을 잃는다.
각 컴포넌트가 `ComponentCard`(elevation이 있는 카드)로 표현되고,
카드 클릭 시 `DetailPanel`이 열려 전체 variant + 토큰 정보를 제공한다.
LabLayout에 `navigationMode="tab"` prop을 추가해 다른 Lab에도 탭 모드를 재사용 가능하게 한다.

### Lab 페이지 일관성

모든 Lab 페이지(Palette Lab, Style Lab, Font Lab, **Token Lab**, Components)는 **LabLayout**을 사용한다.  
→ `data-context="lab"` 하에서 테마 독립성과 공통 구조(TOC/헤더)를 유지한다.

## Phase 목록

- [P01: StyleDefinition 인터페이스 재설계](./P01-style-definition-redesign.md)
- [P02: 기존 스타일 리팩토링 + 레거시 제거](./P02-style-refactor-and-cleanup.md)
- [P03: Lab 테마 독립성](./P03-lab-theme-isolation.md)
- [P04: Components 쇼룸 그리드](./P04-components-showroom-grid.md)
- [P05: Components 그리드 정제 및 상세 모달](./P05-components-grid-refinement-and-modal.md)
- [P06: Token Lab에 LabLayout 사용](./P06-token-lab-lab-layout.md)
- [P07: Token Display 가시성·공간 개선](./P07-token-display-visibility.md)
- [P08: DetailPanel 수치 가시성 수정](./P08-detail-panel-text-contrast.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [x] P06 완료
- [x] P07 완료
- [x] P08 완료

## 완료

아카이브일: 2026-03-14
