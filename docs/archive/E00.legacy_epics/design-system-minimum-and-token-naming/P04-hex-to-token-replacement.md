# P04: hex 직접 사용 제거(토큰 교체)

## 목표

P01 점검에서 확인한 컴포넌트·페이지 CSS 내 hex/rgb 직접 사용을 토큰(`var(--ds-*)`, `var(--ui-*)`)으로 교체하여, AGENT.md 스타일 원칙을 코드베이스에 반영한다.

## 배경

- [P01 점검 결과 요약](./P01-audit-summary.md)의 "위반 위치" 목록 기준.
- [18. Token Naming Reference](../../design/18-token-naming-reference.md) 및 [AGENT.md](../../../AGENT.md) Styling / Design Tokens & Naming 준수.

## 구현 상세

### 대상 파일 (P01 산출물 기준)

- `src/components/GlobalSettings/GlobalSettingsModal.module.css`
- `src/components/Tooltip/Tooltip.module.css`
- `src/components/ColorPicker/ColorPicker.module.css`
- `src/components/Input/Input.module.css` (fallback 등)
- 기타: SemanticMappingModal, ScaleSelectionModal, ScaleStepGrid, ScaleSelectorPanel, HeaderNav, NavDropdown, ThemeSearchBar, ColorUsageDiagram (오버레이/fallback/브랜드 tint 등)

### 작업 원칙

1. **교체**: hex/rgb/named color → 의미에 맞는 `var(--ds-color-*)` 또는 `var(--ui-*)`.
2. **신규 토큰**: 기존 토큰으로 매핑 불가 시 Global/Alias 구조와 [토큰 네이밍 레퍼런스](../../design/18-token-naming-reference.md)에 맞춰 추가 후 교체.
3. **예외 유지**: 토큰·프리셋 **정의** 파일 내부 원시값은 그대로 둠.

### 참고

- `docs/design/17-token-3tier-reference.md` — 사용 가능한 alias 목록
- `src/tokens/`, `src/themes/ThemeProvider.tsx` — 기존 토큰 정의

## 체크리스트

- [x] GlobalSettingsModal.module.css hex → 토큰 교체
- [x] Tooltip.module.css hex → 토큰 교체
- [x] ColorPicker.module.css hex → 토큰 교체
- [x] Input.module.css fallback 등 hex → 토큰 교체
- [x] 기타 파일 hex/rgb 검색 후 교체 (SemanticMappingModal, ScaleSelectionModal, ScaleStepGrid, ScaleSelectorPanel, HeaderNav, NavDropdown, ThemeSearchBar, ColorUsageDiagram)
- [x] 교체 후 시각/기능 회귀 확인 (CSS 변경만 적용; 빌드 실패는 기존 TS 이슈)
