# E05: Lab 비교 뷰

## 목표

각 Lab에서 프리셋들을 **드롭다운 선택**이 아닌 **나란히 비교**하는 방식으로 전환

**예외**: Playground는 드롭다운 선택 → 프리뷰 방식 유지

## 현재 vs 목표

### 현재: 단일 선택

```
┌────────────────────────────────────┐
│  Style Lab                         │
│  ┌──────────────┐                  │
│  │ Minimal    ▼ │  ← 드롭다운      │
│  └──────────────┘                  │
│                                    │
│  ┌──────────┐ ┌──────────┐         │
│  │ shadow-sm│ │ shadow-md│         │
│  └──────────┘ └──────────┘         │
└────────────────────────────────────┘
```

### 목표: 나란히 비교 (PaletteLab, StyleLab, FontLab)

```
┌──────────────────────────────────────────────────────┐
│  Style Lab                                           │
├──────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │ Minimal         │  │ Neumorphism     │            │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │            │
│  │ │ shadow-sm   │ │  │ │ shadow-sm   │ │            │
│  │ └─────────────┘ │  │ └─────────────┘ │            │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │            │
│  │ │ shadow-md   │ │  │ │ shadow-md   │ │            │
│  │ └─────────────┘ │  │ └─────────────┘ │            │
│  └─────────────────┘  └─────────────────┘            │
└──────────────────────────────────────────────────────┘
```

---

## 각 Lab별 설계

### 1. PaletteLab - 배색 비교

**비교 대상**: default, vivid, pastel, monochrome, earth

```
┌─────────────────────────────────────────────────────────────────┐
│  Palette Lab - 배색 비교                                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │ Default   │ │ Vivid     │ │ Pastel    │ │ Monochrome│        │
│  │           │ │           │ │           │ │           │        │
│  │ primary   │ │ primary   │ │ primary   │ │ primary   │        │
│  │ ████████  │ │ ████████  │ │ ████████  │ │ ████████  │        │
│  │ 50→900    │ │ 50→900    │ │ 50→900    │ │ 50→900    │        │
│  │           │ │           │ │           │ │           │        │
│  │ secondary │ │ secondary │ │ secondary │ │ secondary │        │
│  │ ████████  │ │ ████████  │ │ ████████  │ │ ████████  │        │
│  │           │ │           │ │           │ │           │        │
│  │ accent    │ │ accent    │ │ accent    │ │ accent    │        │
│  │ ████████  │ │ ████████  │ │ ████████  │ │ ████████  │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

**클릭 시 DetailPanel**:
- 팔레트 이름
- 기본 색상 정의 (primary, secondary, accent, sub HEX 값)
- 확장된 스케일 전체 (50~900)

---

### 2. StyleLab - GUI 스타일 비교

**비교 대상**: minimal, neumorphism (추후 glassmorphism, brutalism 추가)

```
┌─────────────────────────────────────────────────────────────────┐
│  Style Lab - GUI 스타일 비교                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ Shadow Comparison ]                                          │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │ Minimal                 │  │ Neumorphism             │       │
│  │ ┌───────────┐           │  │ ┌───────────┐           │       │
│  │ │ shadow-sm │           │  │ │ shadow-sm │           │       │
│  │ └───────────┘           │  │ └───────────┘           │       │
│  │ ┌───────────┐           │  │ ┌───────────┐           │       │
│  │ │ shadow-md │           │  │ │ shadow-md │           │       │
│  │ └───────────┘           │  │ └───────────┘           │       │
│  │ ┌───────────┐           │  │ ┌───────────┐           │       │
│  │ │ shadow-lg │           │  │ │ shadow-lg │           │       │
│  │ └───────────┘           │  │ └───────────┘           │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
│                                                                 │
│  [ Component Comparison ]                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │ Minimal                 │  │ Neumorphism             │       │
│  │ [  Primary  ]           │  │ [  Primary  ]           │       │
│  │ [ Secondary ]           │  │ [ Secondary ]           │       │
│  │ ┌───────────────┐       │  │ ┌───────────────┐       │       │
│  │ │ Card content  │       │  │ │ Card content  │       │       │
│  │ └───────────────┘       │  │ └───────────────┘       │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**클릭 시 DetailPanel**:
- 스타일 이름
- Shadow 정의 (sm, md, lg, xl, inset 값)
- Border 설정
- Surface/States 설명

---

### 3. FontLab - 타이포그래피 (기존 유지 + 개선)

FontLab은 현재 구조 유지 (text styles 목록 → 클릭 시 상세)

**추가 개선**:
- Font Family 비교 섹션: Sans vs Mono 나란히

```
┌─────────────────────────────────────────────────────────────────┐
│  [ Font Families ]                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │ Sans                      │  │ Mono                      │   │
│  │                           │  │                           │   │
│  │ The quick brown fox       │  │ The quick brown fox       │   │
│  │ jumps over the lazy dog   │  │ jumps over the lazy dog   │   │
│  │                           │  │                           │   │
│  │ 0123456789                │  │ 0123456789                │   │
│  │ ABCDEFGHIJKLMNOPQRSTUVWXYZ│  │ ABCDEFGHIJKLMNOPQRSTUVWXYZ│   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Playground - 조합 선택 & 프리뷰 (드롭다운 유지)

**역할**: Palette × Style × Font 조합을 **선택**하고, 대표 컴포넌트로 **프리뷰**

다른 Lab들과 달리 **비교가 아닌 적용 확인** 목적

```
┌─────────────────────────────────────────────────────────────────┐
│  Playground - 조합 프리뷰                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ 조합 선택 ]                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Palette   ▼ │  │ Style     ▼ │  │ Font      ▼ │              │
│  │ Vivid       │  │ Minimal     │  │ Sans        │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│  [ Component Preview ]                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Typography                                             │    │
│  │  ─────────────────────────────────────────              │    │
│  │  Page Title                                             │    │
│  │  Section Title                                          │    │
│  │  Body text sample                                       │    │
│  │                                                         │    │
│  │  Buttons                                                │    │
│  │  ─────────────────────────────────────────              │    │
│  │  [ Primary ]  [ Secondary ]  [ Ghost ]                  │    │
│  │                                                         │    │
│  │  Form Elements                                          │    │
│  │  ─────────────────────────────────────────              │    │
│  │  ┌─────────────────────────────┐                        │    │
│  │  │ Input placeholder           │                        │    │
│  │  └─────────────────────────────┘                        │    │
│  │                                                         │    │
│  │  Card                                                   │    │
│  │  ─────────────────────────────────────────              │    │
│  │  ┌───────────────────────────────────────┐              │    │
│  │  │ Card Title                            │              │    │
│  │  │ Card content with the selected        │              │    │
│  │  │ combination applied.                  │              │    │
│  │  │                                       │              │    │
│  │  │ [ Action ]                            │              │    │
│  │  └───────────────────────────────────────┘              │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**대표 컴포넌트 구성**:
- Typography: Page/Section title, body text
- Buttons: Primary, Secondary, Ghost
- Form: Input
- Card: 제목 + 본문 + 액션 버튼

**DetailPanel**: 현재 적용된 조합 정보
- Palette 상세 (primary, secondary, accent 색상)
- Style 상세 (shadow, border 설정)
- Font 상세 (font-family)

---

## 공통 컴포넌트: ComparisonCard

```tsx
// src/layouts/LabLayout/ComparisonCard.tsx

interface ComparisonCardProps {
  title: string;
  /** CSS 변수 오버라이드 */
  styleVars?: Record<string, string>;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export function ComparisonCard({
  title,
  styleVars = {},
  children,
  onClick,
  selected
}: ComparisonCardProps) {
  return (
    <div
      className={clsx(styles.comparisonCard, selected && styles.selected)}
      style={styleVars}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <h3 className={styles.comparisonTitle}>{title}</h3>
      <div className={styles.comparisonContent}>
        {children}
      </div>
    </div>
  );
}
```

### CSS

```css
.comparisonCard {
  flex: 1;
  min-width: 240px;
  padding: var(--ds-spacing-5);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-radius-lg);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.comparisonCard[role='button'] {
  cursor: pointer;
}

.comparisonCard[role='button']:hover {
  border-color: var(--ds-color-border-default);
}

.comparisonCard.selected {
  border-color: var(--ds-color-border-focus);
  box-shadow: var(--ds-shadow-md);
}

.comparisonTitle {
  font-size: var(--ds-text-lg);
  font-weight: var(--ds-font-weight-semibold);
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-spacing-4) 0;
  padding-bottom: var(--ds-spacing-3);
  border-bottom: 1px solid var(--ds-color-border-subtle);
}

.comparisonContent {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-3);
}
```

---

## DetailPanel 연동

각 ComparisonCard 클릭 시 DetailPanel에 상세 정보 표시

```tsx
// PaletteLab.tsx 예시

const [selectedPalette, setSelectedPalette] = useState<PaletteName | null>(null);

return (
  <>
    <LabLayout title="Palette Lab">
      <LabSection title="Color Scales">
        <div className={styles.comparisonGrid}>
          {comparisonPresets.palettes.map((name) => (
            <ComparisonCard
              key={name}
              title={name}
              styleVars={getPaletteVariables(name)}
              onClick={() => setSelectedPalette(name)}
              selected={selectedPalette === name}
            >
              {/* Color swatches */}
            </ComparisonCard>
          ))}
        </div>
      </LabSection>
    </LabLayout>

    <DetailPanel
      open={!!selectedPalette}
      onClose={() => setSelectedPalette(null)}
      title={selectedPalette ?? ''}
    >
      {selectedPalette && <PaletteDetail name={selectedPalette} />}
    </DetailPanel>
  </>
);
```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/layouts/LabLayout/ComparisonCard.tsx` | 신규 - 비교용 카드 컴포넌트 |
| `src/layouts/LabLayout/LabLayout.module.css` | comparisonCard, comparisonGrid 스타일 추가 |
| `src/pages/layouts/PaletteLab/` | ComparisonCard 적용 + DetailPanel + PaletteDetail |
| `src/pages/layouts/StyleLab/` | ComparisonCard 적용 + DetailPanel + StyleDetail |
| `src/pages/layouts/FontLab/` | Font Families 섹션에 ComparisonCard 스타일 적용 |
| `src/pages/layouts/Playground/` | 드롭다운 선택 + Component Preview로 전환 |
| `src/constants/lab-content.ts` | combinationSelect, componentPreview 섹션 타이틀 추가 |

## 보완 사항 (구현 시 적용)

- **PaletteDetail/StyleDetail**: 명세 예시에서 참조하나 별도 정의 없음 → 각 Lab 내부에 인라인 상세 뷰로 구현
- **comparisonGrid**: `display: flex; flex-wrap: wrap; gap: var(--ds-spacing-6)` 로 반응형 처리
- **Playground Font**: Font 선택은 `fontFamilyLabels` (sans/mono) 사용, getThemeVariables는 Palette+Style만 지원

## 체크리스트

- [x] ComparisonCard 컴포넌트 생성
- [x] ComparisonCard CSS 스타일
- [x] PaletteLab 비교 뷰 적용
- [x] StyleLab 비교 뷰 적용
- [x] FontLab Font Family 비교 섹션 추가
- [x] Playground 대표 컴포넌트 프리뷰 구성
- [x] DetailPanel 연동 (PaletteLab, StyleLab)
- [x] 반응형 그리드 처리
