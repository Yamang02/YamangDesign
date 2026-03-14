# P01: `--ui-*` 토큰 라이트 기본값 전환

## 목표

`ui-variables.css`의 `:root` `--ui-*` 기본값을 다크에서 라이트로 전환한다.
기존 `[data-ui-light]`의 값을 `:root`로 승격하고, `[data-ui-light]` 셀렉터를 제거한다.

## 구현 상세

- `:root`의 `--ui-bg-*`, `--ui-text-*`, `--ui-border-*`, `--ui-shadow-*` 값을
  현재 `[data-ui-light]` 블록의 값으로 교체
- `[data-ui-light]` 셀렉터 블록 제거 (`:root`와 동일해지므로)
- `[data-ui]`의 DS 토큰 오버라이드 매핑은 그대로 유지 (값이 라이트로 바뀌었을 뿐)
- `--ui-shadow-*`도 라이트 기준 값으로 교체 (현재 `[data-ui-light]` 값 사용)
- **오버레이/툴팁**: `--ui-overlay`, `--ui-tooltip-bg`, `--ui-tooltip-text`는 라이트 크롬에서도 딤·툴팁 가독성을 위해 어두운 값 유지 권장 (현재 `:root` 값 유지 또는 미세 조정). 툴팁은 포탈 시 `document.body` 하위에서 `:root` 토큰을 참조함.
- **제거 시점**: `[data-ui-light]` 블록 제거 전에, 해당 셀렉터를 쓰는 컴포넌트(GlobalSettingsModal, ScaleSelectionModal, SemanticMappingModal)가 `data-ui`로 이미 전환되어 있어야 함. 그렇지 않으면 해당 모달이 DS 오버라이드를 받지 못함. P03의 `data-ui-light` → `data-ui` 변경을 P01과 동일 PR에서 진행하거나, P01 직전에 완료할 것.

### 변경 전후 주요 값

| 토큰 | 현재 (다크) | 변경 후 (라이트) |
|---|---|---|
| `--ui-bg-base` | `#1a1a1a` | `#ffffff` |
| `--ui-bg-surface` | `#2d2d2d` | `#f1f3f5` |
| `--ui-bg-elevated` | `#3d3d3d` | `#ffffff` |
| `--ui-text-primary` | `#ffffff` | `#1a1a1a` |
| `--ui-text-secondary` | `#ffffff` | `#6b7280` |
| `--ui-text-muted` | `#a8a8a8` | `#d1d5db` |
| `--ui-border-default` | `#404040` | `#e5e7eb` |

## 체크리스트

- [ ] `ui-variables.css` `:root` 블록을 `[data-ui-light]` 값으로 교체
- [ ] `--ui-overlay`, `--ui-tooltip-bg`, `--ui-tooltip-text` 검토 (라이트 크롬에서 가독성 유지 여부)
- [ ] `data-ui-light` 사용처가 `data-ui`로 전환된 상태에서만 `[data-ui-light]` 셀렉터 블록 제거 (P03 선행 또는 동시 진행)
- [ ] 시각적 회귀 없는지 헤더/푸터/랩/모달/툴팁 전체 확인
