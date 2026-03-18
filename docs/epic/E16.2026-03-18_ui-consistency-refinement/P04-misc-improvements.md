# P04: 기타 개선

## 목표
감사 과정에서 발견된 소규모 개선 사항을 정리하여 코드 품질을 높인다.

## 구현 상세

### Tooltip 토큰화
Tooltip.module.css의 하드코딩 색상(`#FFFFFF`, `rgba(0,0,0,0.85)`)을
`--shell-*` 또는 `--ds-*` 토큰으로 전환.

**변경 파일:**
- `src/app/components/Tooltip/Tooltip.module.css`

### ComponentDetailModal 프리뷰 복원 점검
모달 body에 프리뷰 콘텐츠가 표시될 경우,
`[data-context="preview"]` 토큰 복원이 필요한지 확인하고 필요 시 추가.

**변경 파일:**
- `src/app/components/ComponentDetailModal/ComponentDetailModal.module.css`
- `src/app/components/ComponentDetailModal/ComponentDetailModal.tsx` (필요 시)

### LabLayout subtitle prop 완전 제거
P02에서 모든 사용처의 subtitle을 제거한 뒤,
LabLayout 컴포넌트 자체에서 `subtitle` prop, 관련 렌더링 로직, CSS를 삭제.

**변경 파일:**
- `src/app/layouts/LabLayout/LabLayout.tsx`
- `src/app/layouts/LabLayout/LabLayout.module.css`

## 체크리스트
- [x] Tooltip.module.css 하드코딩 fallback 제거 (shell-variables.css에 이미 정의됨)
- [x] ComponentDetailModal 프리뷰 복원 필요 여부 확인 (이미 올바름, 수정 불필요)
- [x] LabLayout에서 subtitle prop, 렌더링 로직, CSS 완전 제거
