# P01: 디자인 시스템 최소 구성 점검

## 목표

“디자인 시스템 최소 구성” 5가지(Design Tokens, Typography System, Spacing System, Component Specification, Interaction/Motion)와 토큰 3-tier 구조 관점에서 현재 구현 상태를 정리하고, 갭·위반 사항을 문서화한다.

## 구현 상세

### 점검 기준

1. **Design Tokens**: Color, Typography, Spacing, Radius, Shadow, Z-index, Motion(duration, easing) — 원자 단위 정의 및 CSS 변수 주입 여부
2. **Typography System**: Font family, scale, line height, weight, Text style, Semantic 역할 매핑
3. **Spacing System**: 4px/8px 그리드, `--ds-spacing-*` 일관 사용
4. **Component Specification**: Button, Input, Card 등 Variant / Size / State 정의 및 문서화
5. **Interaction / Motion**: duration, easing, hover/focus, transition 규칙
6. **토큰 구조**: Global(원시) → Alias(의미) → 컴포넌트가 var()로 참조

### 산출물

- 에픽 디렉토리 내 또는 `docs/design/` 에 **점검 결과 문서** 작성
  - 구현됨 / 부분 구현 / 미구현 항목 표
  - hex 직접 사용 등 원칙 위반 위치 목록(파일·라인 또는 요약)
- 이 문서(P01)의 체크리스트에 “점검 완료” 기록

### 참고

- `src/tokens/global/`, `src/tokens/typography/`, `src/tokens/ui/`
- `src/themes/ThemeProvider.tsx` (변수 주입)
- `docs/design/17-token-3tier-reference.md`

## 체크리스트

- [x] Design Tokens 7종(Color, Typography, Spacing, Radius, Shadow, Z-index, Motion) 점검 완료
- [x] Typography System(scale, text style, semantic) 점검 완료
- [x] Spacing System 점검 완료
- [x] Button/Input/Card 스펙(Variant, Size, State) 점검 완료
- [x] Motion/Transition 점검 완료
- [x] 토큰 3-tier(Global/Alias/참조) 일치 여부 점검 완료
- [x] hex/직접 값 위반 목록 정리
- [x] 점검 결과를 문서로 저장
