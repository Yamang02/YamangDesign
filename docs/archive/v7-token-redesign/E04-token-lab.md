# E04: Token Lab 구축

## 목표

토큰 계층 전체(Global → Alias → 컴포넌트 사용처)를 직관적으로 탐색할 수 있는
Token Lab 페이지를 구축한다.

---

## 페이지 구조

```
/token-lab

├── Section 1: Global Tokens
│   ├── Color Scales      - primary/secondary/accent/neutral/sub 스케일 시각화
│   ├── Spacing           - 4px 기반 스케일 표
│   ├── Typography        - fontSize/fontWeight/lineHeight 표
│   ├── Borders           - radius/width 표
│   └── Motion            - duration/easing 표
│
├── Section 2: Alias Tokens
│   ├── Background        - bg.* 색상 스와치 + 참조 스케일 표시
│   ├── Text              - text.* 색상 스와치 + 참조 스케일 표시
│   ├── Border            - border.* 색상 스와치 + 참조 스케일 표시
│   ├── Action            - action.* 3색 × 3상태 그리드
│   ├── Feedback          - error/warning/success/info 세트
│   └── Elevation         - shadow 단계별 미리보기
│
└── Section 3: Component Inspector
    ├── 컴포넌트 선택 탭   - Button / Input / Card / Badge
    ├── 사용 토큰 목록     - 역할별 alias token 이름 + 현재 값
    └── 라이브 프리뷰      - 현재 팔레트/테마 적용된 실제 컴포넌트
```

---

## 핵심 UX: 참조 추적

### Alias Token 카드 (Section 2)

```
┌─────────────────────────────────────┐
│ ■ --ds-color-action-primary-default │
│                                     │
│  현재 값:  #6366F1                   │
│  참조:     primary-500               │
│  사용처:   Button(primary bg)         │
│            Badge(primary bg)         │
└─────────────────────────────────────┘
```

팔레트가 바뀌면 현재 값이 실시간으로 업데이트된다.

### Global Token 카드 (Section 1)

```
┌─────────────────────────────────────┐
│ ■ --ds-color-primary-500            │
│                                     │
│  값:  #6366F1                        │
│  참조됨: action-primary-default      │
│          border-focus               │
└─────────────────────────────────────┘
```

---

## 구현 계획

### 데이터 소스

토큰 값은 `getComputedStyle(document.documentElement)`로 실시간 읽기.
컴포넌트별 사용 토큰 목록은 E03에서 작성한 목록을 상수로 관리.

```ts
// src/constants/component-tokens.ts

export const componentTokenMap = {
  Button: {
    'primary bg':       '--ds-color-action-primary-default',
    'primary bg hover': '--ds-color-action-primary-hover',
    'text on action':   '--ds-color-text-on-action',
    // ...
  },
  Input: {
    'bg':             '--ds-color-bg-surface',
    'border':         '--ds-color-border-default',
    'border focus':   '--ds-color-border-focus',
    'error border':   '--ds-color-feedback-error-border',
    // ...
  },
  // ...
} as const;
```

### 페이지 파일 위치

```
src/pages/layouts/TokenLab/
├── index.ts
├── TokenLab.tsx
├── TokenLab.module.css
├── sections/
│   ├── GlobalSection.tsx       - color scales, spacing, typo...
│   ├── AliasSection.tsx        - semantic 색상 카드
│   └── ComponentInspector.tsx  - 컴포넌트 탭 + 토큰 목록
└── components/
    ├── TokenCard.tsx            - 개별 토큰 카드
    ├── ColorSwatch.tsx          - 색상 미리보기
    └── ScaleBadge.tsx           - "primary-500" 참조 뱃지
```

### 네비게이션 추가

```
현재: PaletteLab / StyleLab / FontLab / Playground
목표: PaletteLab / StyleLab / FontLab / TokenLab / Playground
```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/pages/layouts/TokenLab/` | 신설 |
| `src/constants/component-tokens.ts` | 신설 |
| `src/pages/layouts/index.ts` | TokenLab export 추가 |
| `src/pages/index.ts` | TokenLab export 추가 |
| `src/components/Header/` | 네비게이션 항목 추가 |
