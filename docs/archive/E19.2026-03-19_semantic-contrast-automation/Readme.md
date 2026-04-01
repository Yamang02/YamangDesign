# Epic E19: Semantic Contrast Automation

## 목표

`text.onAction` 단일 토큰을 제거하고 `onActionPrimary / onActionSecondary / onActionAccent` 세 토큰으로 교체한다. 각 토큰은 대응하는 action 배경색의 luminance를 WCAG 공식으로 계산해 자동 결정되며, 항상 4.5:1 이상의 대비를 보장한다. 아울러 `text.muted` 스텝 참조를 상향해 낮은 대비 문제를 수정한다.

## 배경 / 맥락

시맨틱 매핑의 `text.onAction`이 `action.primary / secondary / accent` 세 버튼 배경 모두에 단일 값으로 사용되어 왔다. secondary·accent 색상이 밝은 노랑·라임·골드 계열일 때 흰 텍스트를 그대로 올려 WCAG AA(4.5:1) 기준을 심각하게 위반하는 케이스가 발견됐다.

- Swiss Monochrome: accent = `#FFFFFF` → 1:1 (완전 불가시)
- Memphis Pop: secondary = `#FFD700` → ~1.4:1
- Bauhaus Classic: secondary = `#F5C518` → ~1.6:1
- SpringCreamSoda01: accent = `#C2D95C` → ~1.6:1
- Art Deco Gold: primary = `#C5A55A` → ~2.4:1

추가로 `text.muted`가 `neutral[500]`(베이스 색 그대로)을 참조해 Art Deco Gold처럼 neutral이 밝은 프리셋에서 ~1.1:1이 되는 문제도 함께 수정한다.

## 특이점

- `text.onAction` CSS 변수(`--ds-color-text-on-action`) 및 타입 필드를 **완전히 제거**. Deprecated 없음.
- 자동 계산 기본값은 흰/검 중 contrast ratio가 높은 쪽. 프리셋이 `semanticMapping.text.onActionPrimary` 등을 명시하면 contrast ≥ 4.5:1 검증 후 사용, 실패 시 자동 계산으로 폴백.
- `token-set.ts`의 `inverse: expanded.semantic.text.onAction` alias 제거.
- `text.muted` 스텝: `neutral[500]` → `neutral[700]` (light/colored), `neutral[400]` → `neutral[300]` (dark).

## Phase 목록

- [P01: WCAG 유틸 함수 추가](./P01-wcag-utils.md)
- [P02: 타입 + Resolution 레이어 변경](./P02-type-and-resolution.md)
- [P03: Token emit + CSS 변수 변경](./P03-token-emit-css-vars.md)
- [P04: 소비자 전수 업데이트 + text.muted 수정](./P04-consumers-and-muted.md)
- [P05: TokenLab 커버리지 보완](./P05-tokenlab-coverage.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료

## 완료
아카이브일: 2026-04-01
