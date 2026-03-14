# P01 점검 결과 요약

디자인 시스템 최소 구성 5가지 + 토큰 3-tier 기준 점검 요약.

## 구현됨

| 항목 | 상태 |
|------|------|
| Design Tokens (Color, Typography, Spacing, Radius, Shadow, Z-index, Motion) | ✅ global + ThemeProvider 주입 |
| Typography System (scale, text style, semantic 역할) | ✅ text-styles + semantic 매핑 |
| Spacing System (4px 그리드) | ✅ `--ds-spacing-*` |
| Button/Input/Card (Variant, Size, State) | ✅ 타입·CSS 정의 |
| Interaction/Motion (duration, easing, transition 레시피) | ✅ motion.ts + transitions.css |
| 토큰 구조 (Global → Alias → 컴포넌트 var 참조) | ✅ 문서·구현 일치 |

## 갭·주의

- **컴포넌트 스펙 문서화**: Button/Input/Card 스펙이 코드/타입에만 있고, 별도 “스펙 문서”는 없음.
- **hex 직접 사용**: `GlobalSettingsModal.module.css`, `Tooltip.module.css`, `ColorPicker.module.css`, `Input.module.css`(fallback) 등 — 토큰으로 교체 권장.
- **타이포 변수 혼용**: `--ds-text-{style}-size` vs `--ds-text-xs` 등 원시만 쓰는 참조 구분 정리 필요.
- **elevation**: 원시 `elevation` 객체는 있으나 `--ds-elevation-*`로 root 주입 여부는 테마 조합에 따라 다를 수 있음.

## 위반 위치 (hex 등)

- `src/components/GlobalSettings/GlobalSettingsModal.module.css`
- `src/components/Tooltip/Tooltip.module.css`
- `src/components/ColorPicker/ColorPicker.module.css`
- 기타: `docs/design/` 또는 프로젝트 검색으로 “#” + 6자 hex 패턴 검색 시 추가 확인 가능.
