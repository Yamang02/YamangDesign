# P04: LabLayout `data-context="lab"` → `data-ui` 통합

## 목표

`LabLayout`이 `data-context="lab"` 대신 `data-ui` attribute를 사용하도록 전환한다.
`LabLayout.module.css`의 `[data-context="lab"]` 오버라이드 블록을 제거하고,
`[data-ui]`의 DS 토큰 매핑이 Lab UI를 올바르게 커버하도록 한다.

## 구현 상세

- `LabLayout.tsx`의 최상위 div: `data-context="lab"` → `data-ui` (또는 병행 후 전환)
- `LabLayout.module.css`의 `[data-context="lab"]` 블록 제거
  - 이 블록이 오버라이드하던 `--ds-color-*` 값들이 이제 `[data-ui]`에서 커버됨
- `data-context="preview"` 내부의 테마 복원 로직:
  - 현재: `[data-context="lab"] [data-context="preview"]` 셀렉터로 글로벌 테마 복원
  - 변경: `[data-ui] [data-context="preview"]`로 셀렉터 업데이트
- **Surface 토큰 이관**: `LabLayout.module.css`의 `[data-context="lab"]` 블록에는 `--ds-surface-backdrop`, `--ds-surface-bg-alpha`, `--ds-surface-texture`, `--ds-surface-blend`, `--ds-filter`, `--ds-perspective`, `--ds-transform-style` 등이 정의되어 있음. 이 블록 제거 시 위 토큰들이 없어지면 뉴모피즘 등 테마 전환 시 Lab 내부에 스타일이 새어 나올 수 있음. `ui-variables.css`의 `[data-ui]` 블록에 동일한 고정값을 추가할지 검토하고, 필요 시 이관한다.
- Lab 페이지(PaletteLab, StyleLab, FontLab, TokenLab, Components) 시각적 회귀 확인

## 체크리스트

- [ ] `LabLayout.tsx` — `data-context="lab"` → `data-ui`
- [ ] `LabLayout.module.css` — `[data-context="lab"]` 오버라이드 블록 제거
- [ ] Surface 토큰(`--ds-surface-*` 등) 필요 시 `ui-variables.css`의 `[data-ui]`에 추가
- [ ] `LabLayout.module.css` — preview 복원 셀렉터 업데이트 (`[data-ui] [data-context="preview"]`)
- [ ] 전체 Lab 페이지 시각 확인 (UI 크롬, 프리뷰 영역 모두)
