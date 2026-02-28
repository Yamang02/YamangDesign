# E05: Lab 비교 뷰

## 목표

각 Lab에서 프리셋들을 **드롭다운 선택**이 아닌 **나란히 비교**하는 방식으로 전환

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

### 목표: 나란히 비교

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

## 각 Lab별 비교 뷰 설계

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

### 4. Playground - 조합 매트릭스

**현재**: Palette × Style 드롭다운 선택
**목표**: 주요 조합을 매트릭스로 표시

```
┌─────────────────────────────────────────────────────────────────┐
│  Playground - Palette × Style 조합                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              │ Minimal          │ Neumorphism      │            │
│  ────────────┼──────────────────┼──────────────────┤            │
│  Default     │ [Button] [Card]  │ [Button] [Card]  │            │
│  ────────────┼──────────────────┼──────────────────┤            │
│  Vivid       │ [Button] [Card]  │ [Button] [Card]  │            │
│  ────────────┼──────────────────┼──────────────────┤            │
│  Pastel      │ [Button] [Card]  │ [Button] [Card]  │            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**선택적 필터**: 특정 Palette/Style만 보기 (체크박스)

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

## 체크리스트

- [ ] ComparisonCard 컴포넌트 생성
- [ ] ComparisonCard CSS 스타일
- [ ] PaletteLab 비교 뷰 적용
- [ ] StyleLab 비교 뷰 적용
- [ ] FontLab Font Family 비교 섹션 추가
- [ ] Playground 매트릭스 뷰 적용
- [ ] DetailPanel 연동 (각 Lab)
- [ ] 반응형 그리드 처리
