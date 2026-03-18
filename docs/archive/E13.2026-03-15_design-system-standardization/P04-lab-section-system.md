# P04: 랩 섹션 시스템 정의

## 목표
랩 페이지에서 반복되는 섹션 유형을 카탈로그로 정의하고,
각 유형의 구현 패턴(컴포넌트 조합)을 표준화한다.
새 랩 섹션을 추가할 때 "어떤 컴포넌트를 어떻게 쓰면 되는지"가 명확한 상태.

## 구현 상세

### 섹션 타입 카탈로그

| 타입 | 설명 | 사용 예 |
|---|---|---|
| **SelectionGrid** | 여러 preset 중 하나를 선택 | PaletteLab 브랜드 색상, FontLab 폰트 선택 |
| **ComparisonGrid** | A/B/C 시각적 비교 + 상세 패널 | StyleLab 그림자 비교, PaletteLab 시스템 색상 |
| **Inspector** | 구조화된 값 탐색 (트리+테이블) | TokenLab 토큰 인스펙터 |
| **Settings** | 값 입력/수정 폼 | DesignSettingsLab 탭 섹션들 |
| **Overview** | 요약 다이어그램/설명 | 각 랩 상단 LabOverview |

### 신규 공통 컴포넌트

**TabBar** (`src/app/layouts/LabLayout/TabBar.tsx`)
```tsx
interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}
```
LabLayout tab 모드와 DesignSettingsLab의 탭을 통일.

**ComparisonGrid** (`src/app/layouts/LabLayout/ComparisonGrid.tsx`)
```tsx
interface ComparisonGridProps {
  children: React.ReactNode;
  paletteVars?: Record<string, string>; // CSS vars → wrapper style로 주입 (cascade)
  className?: string;
}
```
`flex-wrap` 그리드 레이아웃 표준화. `paletteVars` 시 wrapper에 인라인으로 CSS 변수 주입.
`ComparisonCard`의 `styleVars`는 optional 유지 (개별 카드 차별화 케이스).

**DetailPanel 공통 블록** (3개, `src/app/layouts/LabLayout/` 내)
```tsx
// TokenValueRow: 토큰명 + 값 한 행 (FontLab, TokenLab에서 사용)
interface TokenValueRowProps {
  label: string;
  token?: string;   // "--ds-xxx" 코드 표시 (optional)
  value: string;
}

// ColorSwatchGrid: 색상 스케일 그리드 (PaletteLab)
interface ColorSwatchGridProps {
  swatches: { label: string; color: string }[];
}

// MetadataTable: key-value 테이블 (StyleLab, TokenLab)
interface MetadataTableProps {
  rows: { key: string; value: string }[];
  title?: string;
}
```

**HeaderNavItem display prop** (`src/app/components/Header/HeaderNavItem.tsx`)
```tsx
display?: 'icon+label' | 'icon-only' | 'label-only'  // default: 'icon+label'
```

### 구현 전략: 랩 단위 (공통 컴포넌트 먼저, 랩별 적용)

Step 1 (공통 컴포넌트 생성) → Step 2~6 (랩별 적용) 순서로 각 단계를 독립 커밋.

| Step | 대상 | 작업 내용 |
|---|---|---|
| 1 | 공통 컴포넌트 | TabBar, ComparisonGrid, TokenValueRow, ColorSwatchGrid, MetadataTable 신규 + HeaderNavItem display prop |
| 2 | PaletteLab | ComparisonGrid(paletteVars) + ColorSwatchGrid 적용 |
| 3 | StyleLab | ComparisonGrid + MetadataTable 적용 |
| 4 | TokenLab | ComparisonGrid + TokenValueRow + MetadataTable 적용 |
| 5 | FontLab | ComparisonGrid + TokenValueRow 적용 |
| 6 | DesignSettingsLab + LabLayout | TabBar 적용 |

## 체크리스트
- [x] 섹션 타입 카탈로그 5가지 최종 확정
- [x] HeaderNavItem display prop 추가
- [x] `TabBar` 컴포넌트 신규 생성
- [x] `ComparisonGrid` 컴포넌트 신규 생성
- [x] `TokenValueRow` / `ColorSwatchGrid` / `MetadataTable` 공통 블록 신규 생성
- [x] PaletteLab: ComparisonGrid + ColorSwatchGrid 적용
- [x] StyleLab: ComparisonGrid + MetadataTable 적용
- [x] TokenLab: ComparisonGrid + TokenValueRow + MetadataTable 적용
- [x] FontLab: ComparisonGrid + TokenValueRow 적용
- [x] DesignSettingsLab + LabLayout: TabBar 적용
