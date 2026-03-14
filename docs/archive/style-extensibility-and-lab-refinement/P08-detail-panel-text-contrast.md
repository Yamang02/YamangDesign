# P08: DetailPanel 수치 가시성 수정

## 목표

StyleLab의 사이드 DetailPanel 내 shadow 수치 등 텍스트가 어두운 패널 배경에서 잘 보이도록 고친다.

## 배경

`DetailPanel`의 배경은 `--ui-bg-elevated: #3d3d3d` (다크). 그러나 패널 내부 콘텐츠(`StyleDetail`)는 `--ds-color-text-muted`를 사용하며, `.panelContent`에 `data-ui` attribute가 없어 `--ui-*` 값을 상속받지 못한다. 결과적으로 팔레트 테마의 `--ds-color-text-muted` 값이 어두운 배경 위에서 대비가 부족해 수치가 거의 보이지 않는다 (대비비 ~1.4:1).

## 구현 상세

### 1. `DetailPanel.tsx`

`.panelContent` div에 `data-ui` attribute 추가 → 내부 모든 `--ds-color-text-*` 토큰이 `--ui-text-*` 값으로 자동 오버라이드됨.

### 2. `ui-variables.css`

`--ui-text-muted: #707070` → `#a8a8a8` 으로 밝게 조정 → `#3d3d3d` 배경 기준 대비비 ~1.4:1 → ~2.8:1로 개선.

## 체크리스트

- [x] `DetailPanel.tsx` — `.panelContent` div에 `data-ui` 추가
- [x] `ui-variables.css` — `--ui-text-muted` 값 `#707070` → `#a8a8a8`
