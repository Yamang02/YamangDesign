# P04: Lab 프리뷰 Surface 계층 시각화

## 목표

PaletteLab과 TokenLab에서 surface 계층(surfaceLow / surface / surfaceHigh)을 시각적으로 확인할 수 있는 프리뷰를 제공한다. 팔레트 선택 시 카드 배경·텍스트·컴포넌트가 어떻게 보이는지 즉시 평가할 수 있어야 한다.

## 구현 상세

### 1. TokenLab: surface 토큰 표시

기존 Shell 그룹의 배경(bg) 카테고리 테이블에 `surfaceLow`, `surfaceHigh` 행이 자동으로 추가된다 (P02에서 CSS 변수가 생성되므로). categories.json 또는 토큰 추출 로직에서 새 키를 인식하면 별도 작업 없이 반영.

### 2. PaletteLab: Surface 계층 프리뷰 카드

팔레트 상세(DetailPanel)에 surface 계층 시각화 섹션 추가:

```
┌─ Surface 계층 ────────────────────────┐
│                                        │
│  ┌── surfaceLow ────────────────────┐  │
│  │                                  │  │
│  │  ┌── surface ──────────────────┐ │  │
│  │  │  본문 텍스트 예시           │ │  │
│  │  │  Secondary 텍스트           │ │  │
│  │  │  ┌── surfaceHigh ────────┐  │ │  │
│  │  │  │  선택/호버 상태       │  │ │  │
│  │  │  └───────────────────────┘  │ │  │
│  │  └─────────────────────────────┘ │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌── elevated ──────────────────────┐  │
│  │  모달/드롭다운 예시             │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

중첩 카드로 surface 계층 간 대비를 시각적으로 보여준다. 각 레벨에 `--ds-color-text-primary`와 `--ds-color-text-secondary`를 사용하여 텍스트 가독성도 함께 평가.

### 변경 파일

- `src/app/content/labs/token-lab/categories.json` — surfaceLow/surfaceHigh 토큰 키 추가 (필요시)
- `src/app/pages/labs/PaletteLab/PaletteLab.tsx` — surface 계층 프리뷰 섹션 추가
- `src/app/pages/labs/PaletteLab/PaletteLab.module.css` — 프리뷰 스타일

## 체크리스트

- [x] TokenLab에서 bg-surface-low, bg-surface-high 토큰이 표시되는지 확인
- [x] PaletteLab DetailPanel에 surface 계층 프리뷰 섹션 추가
- [x] 프리뷰에서 surfaceLow → surface → surfaceHigh 중첩 레이아웃 구현
- [x] 각 surface 레벨에 텍스트 샘플(primary/secondary) 배치
- [x] elevated 영역 프리뷰 포함
- [x] 다양한 팔레트로 전환 시 surface tint 차이가 시각적으로 확인되는지 검증
