# P01: 토큰 시맨틱 감사 및 정리

## 목표
전체 앱의 CSS 모듈에서 토큰이 시맨틱 역할에 맞게 사용되는지 감사하고,
오용을 수정하여 앱 크롬(`--shell-*`)과 프리뷰(`--ds-*`) 레이어를 명확히 분리한다.

## 구현 상세

### DesignSettingsLab 토큰 교체
비프리뷰 영역에서 `--ds-*` 토큰을 `--shell-*`로 교체:
- `DesignSettingsLab.module.css`: `.title`의 `--ds-color-text-primary` → `--shell-text-primary`
- 컴포넌트 매핑 테이블의 `--ds-color-bg-*`, `--ds-color-border-*` → `--shell-bg-*`, `--shell-border-*`

**변경 파일:**
- `src/app/pages/labs/DesignSettingsLab/DesignSettingsLab.module.css`

### Components.module.css 프리뷰 컨텍스트 점검
모달 프리뷰 영역의 토큰이 올바른 레이어를 사용하는지 확인 및 수정.

**변경 파일:**
- `src/app/pages/build/Components/Components.module.css`

### ServiceContext.module.css 프리뷰 경계 확인
프리뷰 영역(`[data-context="preview"]`)이 명확히 구분되는지 확인하고,
토큰 사용이 레이어에 맞는지 점검.

**변경 파일:**
- `src/app/pages/context/Service/ServiceContext.module.css`
- `src/app/pages/context/Service/ServiceContext.tsx` (필요 시)

## 체크리스트
- [x] DesignSettingsLab.module.css의 비프리뷰 영역 `--ds-*` → `--shell-*` 교체
- [x] Components.module.css 프리뷰 영역 토큰 컨텍스트 확인 및 수정 (이미 올바름, 수정 불필요)
- [x] ServiceContext.module.css 프리뷰 경계와 토큰 레이어 일치 확인 (`.previewTable th` 1건 수정)
- [x] 전체 앱에서 토큰 시맨틱 역할 매칭 검증 (bg→배경, text→텍스트, border→테두리, action→액션)
