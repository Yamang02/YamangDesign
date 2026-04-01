# P05: 런타임 literal 0건 및 팔레트/매핑 정비

## 목표

런타임 경로(`src/app/**`, `src/domain/**`)에서 하드코딩 literal(color/size/shadow/blur)을 즉시 0건으로 만들고, 컬러 팔레트 형식-스케일 생성-시맨틱 매핑을 단일 규칙으로 통합한다.

## 구현 상세

### 분류 정책

- `EXCEPTION`은 사용하지 않는다.
- `KEEP`은 비런타임 경로(템플릿/테스트 fixture/문서 예시)로만 제한한다.
- 런타임 경로에서 발견되는 literal은 모두 `TOKENIZE` 대상으로 처리한다.

### 토큰 스키마 보강

- 색상: 데모/다이어그램 영역까지 literal 없이 표현할 수 있도록 `--ds-color-demo-*` 계열 추가
- 치수/간격/라운드: 산재된 px 값을 `--ds-size-*`, `--ds-space-*`, `--ds-radius-*`로 정규화
- 보더/포커스/섀도/블러: fallback literal 제거를 위해 관련 토큰 확장

### 팔레트/스케일/시맨틱 매핑 단일화

- 입력 팔레트 스키마(`primary/secondary/accent/sub/neutral`)는 유지
- 출력은 항상 `scale + semantic` 동시 생성
- 스케일 생성 알고리즘은 단일 함수로 고정(수동 스케일 하드코딩 금지)
- 컴포넌트는 `--ds-color-*`만 소비하고, 어떤 값을 넣을지는 매핑 레이어에서만 결정

### 검증 강제

- 런타임 경로에서 hex/rgb/hsl/px literal을 탐지하는 검증 스크립트 추가
- 1건이라도 탐지되면 CI 실패
- 팔레트 생성/시맨틱 매핑 결과는 회귀 테스트(스냅샷 또는 동등한 고정 검증)로 보호
- 현재 `check:literals`는 color literal 강제, `check:literals:with-size`는 size(px) 포함 확장 점검용으로 운영

### 변경 파일

- `src/shared/styles/variables.css`
- `src/shared/styles/shell-variables.css`
- `src/domain/themes/**`
- `src/app/components/ComponentCard/ComponentCard.module.css`
- `src/app/layouts/LabLayout/TokenValueRow.module.css`
- `src/app/components/ComponentInspector/ComponentInspectorPanel.module.css`
- `src/app/pages/labs/StyleLab/StyleLab.module.css`
- `src/app/layouts/LabLayout/LabToc.tsx`
- `scripts/check-runtime-literals.js`
- `package.json` (검증 명령 연결)

## 체크리스트

- [x] 런타임 literal 금지 정책 확정 (`EXCEPTION` 미사용)
- [x] 런타임 경로 literal 인벤토리 작성 및 치환 우선순위 확정
- [x] color/size/space/radius/border/focus/shadow/blur 토큰 보강
- [x] `src/app/**` literal 제거 완료
- [x] `src/domain/**` literal 제거 완료 (팔레트 원본 입력 제외)
- [x] 팔레트 스케일 생성 로직 단일화
- [x] 시맨틱 매핑 규칙 단일화 (bg/text/border/action/surface/status)
- [x] literal 탐지 검증 스크립트 및 CI 실패 규칙 연결
- [x] 회귀 테스트 추가/갱신

## 검증 결과

- `npm run check:literals` 통과
- `npm run check:literals:with-size` 통과
- `LabLayout`의 `IntersectionObserver` `rootMargin`을 유효 단위(`%`)로 보정하여 런타임 에러 제거
