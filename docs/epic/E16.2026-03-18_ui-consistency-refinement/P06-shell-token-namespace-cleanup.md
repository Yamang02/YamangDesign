# P06: shell 토큰 네임스페이스 분리

## 목표
`[data-shell]`에서 `--ds-color-*` / `--ds-shadow-*` 재정의를 제거하여
DS 컴포넌트가 어디서든 테마에 반응하도록 한다.
`--ds-*`는 design system 토큰, `--shell-*`는 앱 크롬 전용 고정 색상으로 역할을 분리한다.

## 배경 / 근본 원인

`shell-variables.css`의 `[data-shell]` 블록이 `--ds-color-*`를 `--shell-*` 값으로 재정의한다.
shell 크롬 컴포넌트들은 이미 `--shell-*`를 직접 참조하므로 이 오버라이드가 필요 없고,
오히려 `[data-shell]` 안에서 DS 컴포넌트(Badge, Button 등)가 테마 색상 대신 gray로 렌더링되는
부작용을 만들었다. E16 P05에서 복원 블록을 보완했지만, 토큰 추가 시마다 동기화가 필요한
유지보수 부채가 남는다.

## 특이점

`[data-shell]`의 surface 효과 억제 (`--ds-surface-backdrop`, `--ds-filter` 등)는 유효하다.
neumorphism/glassmorphism 테마 효과가 앱 크롬에 적용되지 않도록 막기 위함이므로 유지한다.
대신 `[data-context="preview"]` 복원 블록에서 색상 관련 항목만 제거하고 surface 복원은 남긴다.

## 구현 상세

### 1. shell-variables.css — `[data-shell]`에서 색상/그림자 오버라이드 제거

제거 대상 (shell 컴포넌트들이 이미 `--shell-*` 직접 사용):
- `--ds-color-bg-*` (4개)
- `--ds-color-text-*` (4개)
- `--ds-color-border-*` (4개)
- `--ds-color-action-primary-*` (3개)
- `--ds-focus-ring-color`
- `--ds-shadow-sm/md/lg`

유지 대상 (크롬에서 테마 시각 효과 차단):
- `--ds-surface-backdrop`, `--ds-surface-bg-alpha`, `--ds-surface-texture`, `--ds-surface-blend`
- `--ds-filter`, `--ds-perspective`, `--ds-transform-style`

### 2. LabLayout.module.css — 복원 블록에서 색상 항목 제거

색상 관련 복원 라인 제거 (`--ds-color-*`, `--ds-shadow-*`).
surface 효과 복원 라인은 유지 (preview 영역에서 neumorphism 등 표시 필요).

### 3. ComponentDetailModal.tsx — `data-context="preview"` 제거

색상 복원이 불필요해지므로 `data-context="preview"` attribute 제거.
(surface 효과가 모달 body에서 필요하다면 유지, 아니면 제거)

**변경 파일:**
- `src/shared/styles/shell-variables.css`
- `src/app/layouts/LabLayout/LabLayout.module.css`
- `src/app/components/ComponentDetailModal/ComponentDetailModal.tsx`

## 체크리스트
- [x] shell-variables.css: `[data-shell]`에서 `--ds-color-*` 16개 및 `--ds-shadow-*` 3개 제거
- [x] shell-variables.css: surface 효과 억제 7개 유지 확인
- [x] LabLayout.module.css: 복원 블록에서 색상/그림자 항목 제거, surface 복원만 유지
- [x] ComponentDetailModal.tsx: `data-context="preview"` 유지 (surface 효과 복원 목적)
- [ ] 크롬 컴포넌트(Header, Nav, Footer) 시각 확인 — neutral 유지
- [ ] DS 컴포넌트(Badge, Button) 프리뷰 영역에서 테마 색상 표시 확인
