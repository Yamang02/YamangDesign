# Epic E11: Domain Model Restructure

## 목표

프로젝트 핵심 도메인(팔레트·스타일·토큰)의 개념 구조를 정비한다.
누락된 Aggregate(`ThemeTokenSet`)를 도입하여 컬러 누수 버그를 수정하고,
혼란스러운 용어를 업계 표준에 맞게 리뉴얼하며, 레이어 경계를 명확히 한다.
최종적으로 데드코드와 deprecated API를 제거해 유지보수성을 높인다.

## 배경 / 맥락

Build > Atoms 페이지에서 Palette 드롭다운을 "Default"로 설정해도 전역 테마(예: 봄빛 크림소다)의 컬러 토큰이 프리뷰에 섞여 들어오는 버그가 발견됐다.

근본 원인: CSS 변수를 생성하는 경로가 두 곳으로 나뉘어 있고, 그 출력 집합이 불일치한다.
- `ThemeProvider.injectCSSVariables` → scale + semantic + style 변수 전체를 `:root`에 주입
- `getThemeVariables` → semantic 변수만 생성 → inline style에 적용

이 격차는 기능이 확장될수록 벌어지는 구조적 문제다. 단순 픽스로는 재발을 막을 수 없다.

추가로, 여러 에픽을 거치며 누적된 용어 혼란(`ExternalPalette`, `ExpandedPalette`, `ThemeName` 등)과 레이어 경계 침범(`PaletteSelection`이 도메인 타입 파일에 혼재), deprecated API 잔재가 코드 이해를 어렵게 한다.

## 특이점

- **ThemeTokenSet은 Value Object다.** Palette+Style 조합이 내보내는 `--ds-*` 변수 전체를 표현하는 불변 집합. 상태가 아니라 계산 결과물.
- **Phase 2는 행동 변경 없는 rename만.** 타입/이름 변경이 많지만 런타임 동작은 동일해야 한다. TypeScript 컴파일 통과가 완료 기준.
- **Phase 4는 CSS 모듈 감사.** 컴포넌트가 실제로 쓰는 `--ds-*` 변수와 `ThemeTokenSet`이 생성하는 변수 집합을 대조한다. 누락된 변수는 추가하거나 제거 중 하나를 선택해야 한다.
- **Phase 5에서 deprecated API 제거 시 ThemeContext 소비자 전수 확인 필요.** `useTheme()`을 쓰는 컴포넌트가 deprecated 필드에 의존하고 있을 수 있다.

## 사후 발견 이슈 (P01~P05 완료 후)

P01~P05 완료 후 코드 검토에서 두 가지 구조적 문제가 추가 확인됐다.

### 1. 빌드 페이지 프리뷰 테마 누수 (재발)

P01에서 `getThemeVariables`의 출력 집합을 `ThemeTokenSet`으로 통일하여 누수를 수정했으나,
`ThemeProvider`에 `-global` 앨리어스 메커니즘이 도입되면서 새로운 누수 경로가 생겼다.

`ThemeProvider`는 `:root`에 `--ds-*-global` 앨리어스 변수(예: `--ds-color-bg-base-global`)를 추가 주입한다.
빌드 페이지 `getThemeVariables`는 base `--ds-*` 변수만 반환하고 **`-global` 앨리어스는 포함하지 않는다**.
컴포넌트 CSS가 `--ds-*-global` 변수를 참조하면 inline style로는 오버라이드 불가 →
선택된 프리뷰 팔레트와 무관하게 `:root`의 전역 테마 색상이 프리뷰에 흘러든다.

추가로 `getThemeVariables`는 `appliedSettings.semanticMapping` 오버라이드를 반영하지 않아,
전역 설정에서 시맨틱 매핑을 커스터마이즈한 경우 프리뷰와 실제 전역 테마가 다르게 렌더링된다.

→ **P06에서 해결**

### 2. constants/utils 레이어 분리 미완

P03에서 `PaletteSelection`을 `state/` 레이어로 이동했지만,
`constants/`와 `utils/`는 도메인 코드와 앱 레이어 코드가 여전히 혼재한다.

| 파일 | 문제 |
|---|---|
| `constants/lab-presets.ts` | CSS var 생성 함수(앱)와 도메인 preset 조회가 동일 파일에 존재 |
| `constants/build-content.ts` 외 3개 | 페이지별 콘텐츠 상수가 도메인 상수와 같은 디렉토리에 위치 |
| `utils/palette-selection.ts` | P03에서 deprecated re-export 스텁으로만 남아 완전 제거 가능 |
| `utils/component-mapping-storage.ts` | 앱/인프라(localStorage CRUD)가 domain utils와 혼재 |
| `utils/yamang-export.ts` | 앱 레이어 유틸이 domain utils와 혼재 |
| `template/palette-preset.template.ts` | 레이어 소속 모호, 팔레트 도메인으로 이동 적절 |

→ **P07에서 해결**

## Phase 목록

- [P01: ThemeTokenSet 도입 & 컬러 누수 수정](./P01-theme-token-set.md)
- [P02: 용어 리뉴얼](./P02-terminology-renewal.md)
- [P03: 레이어 분리](./P03-layer-separation.md)
- [P04: CSS 변수 감사](./P04-css-variable-audit.md)
- [P05: 리팩토링 & 정리](./P05-refactoring-cleanup.md)
- [P06: 빌드 프리뷰 테마 격리 수정](./P06-build-preview-theme-isolation.md)
- [P07: constants/utils 레이어 완성](./P07-constants-utils-layer-cleanup.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [x] P06 완료
- [x] P07 완료 (시각적 검증 항목 제외)

## 완료
아카이브일: 2026-03-17
