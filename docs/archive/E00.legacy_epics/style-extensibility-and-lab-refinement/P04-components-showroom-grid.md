# P04: Components 쇼룸 그리드

## 목표

Components 페이지를 "잘 진열된 전시장" 형태로 개선한다. 수직 선형 나열 대신 elevation이 있는
2D 그리드로 컴포넌트 카드를 배치하고, 카드 클릭 시 DetailPanel에서 전체 variant와 토큰 정보를
확인할 수 있게 한다. LabLayout에 탭 모드 prop을 추가해 다른 Lab에서도 재사용 가능하게 한다.

## 구현 상세

### ComponentCard 스펙

각 컴포넌트를 나타내는 독립 카드 컴포넌트. 두 영역으로 구성:

```
┌─────────────────────────────┐
│ Badge             5 variants│  ← 헤더: 이름 + variant 수
├─────────────────────────────┤
│                             │
│  ○ Primary  ○ Outline  ○…  │  ← 프리뷰: 대표 variant 2~3개
│                             │
└─────────────────────────────┘
```

- 카드 자체는 `elevation 1` (shadow-sm). hover 시 `elevation 2` (shadow-md) 로 올라옴
- 프리뷰 영역에 `data-context="preview"` 적용 (P03 격리 구조 활용)
- 클릭 가능 (`role="button"`, keyboard accessible)

```tsx
interface ComponentCardProps {
  id: ShowcaseSectionId;
  title: string;
  variantCount: number;
  preview: React.ReactNode;   // 대표 variant 2~3개
  onClick: () => void;
}
```

### 그리드 레이아웃

```css
.showcaseGrid {
  display: grid;
  /* auto-fill: 빈 열도 공간 차지 → 카드가 항상 고정 너비 유지 (전시장 느낌) */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--ds-spacing-6);
}
```

컴포넌트 수가 늘어나도 그리드가 자동으로 열 수를 조절.
`minmax(300px, 1fr)` — 기존 Components 그리드와 동일한 최소 너비로 통일.

### DetailPanel 확장

현재 DetailPanel은 토큰 정보(`ComponentDetail`)만 표시.
클릭 시 두 섹션으로 확장:

1. **Variants** (상단): 기존 Components 페이지의 전체 variant showcase 콘텐츠
2. **Tokens** (하단): 기존 `ComponentDetail` 토큰 목록

**레이아웃 결정: 스크롤 가능한 단일 패널 (위아래 배치)**
Variants → Tokens 순서로 세로 배치. 탭 방식은 정보 밀도가 낮고 토큰과 컴포넌트를 동시에 볼 수 없어서 제외.

### LabLayout 탭 모드 (`navigationMode` prop)

```tsx
export interface LabLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showToc?: boolean;
  tocItems?: TocItem[] | TocItemTree[];
  /** 기본값: 'scroll'. 'tab'이면 TOC 대신 탭 바 렌더 */
  navigationMode?: 'scroll' | 'tab';
}
```

`navigationMode="tab"` 일 때:
- TOC 사이드바 대신 상단 탭 바 렌더
- `activeTab` 상태를 LabLayout 내부에서 관리
- 선택된 탭 ID를 children에 context로 전달하거나, 탭 ID를 기반으로 렌더링 필터링

Components 페이지는 `navigationMode="tab"`을 쓰지 않고 직접 그리드를 구현.
`navigationMode="tab"`은 FontLab 등 다른 Lab에서 활용 가능하도록 준비.

### Components.tsx 변경 방향

기존: 모든 섹션 수직 나열
변경: `ComponentCard` 그리드 + `DetailPanel`에 전체 콘텐츠 이관

```tsx
export function Components() {
  const [selected, setSelected] = useState<ShowcaseSectionId | null>(null);

  return (
    <>
      <LabLayout title="Components" showToc={false}>
        <div className={styles.showcaseGrid}>
          <ComponentCard
            id="badge"
            title="Badge"
            variantCount={5}
            preview={<BadgePreview />}
            onClick={() => setSelected('badge')}
          />
          {/* ... */}
        </div>
      </LabLayout>

      <DetailPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? showcaseSections[selected] : ''}
      >
        {selected && <ComponentShowcase id={selected} />}
      </DetailPanel>
    </>
  );
}
```

`ComponentShowcase`는 기존 각 섹션 콘텐츠(full variant + ComponentDetail)를 감싼 컴포넌트.

## 체크리스트

- [ ] `ComponentCard` 컴포넌트 신규 작성 (헤더 + 프리뷰 영역, `data-context="preview"` 적용)
- [ ] `Components.module.css` — `showcaseGrid` 스타일 추가 (`auto-fill, minmax(300px, 1fr)`)
- [ ] `ComponentShowcase` 컴포넌트 신규 작성 — 기존 섹션 콘텐츠를 이 컴포넌트로 추출
- [ ] `ComponentShowcase` — Variants(상단) + Tokens(하단) 단일 스크롤 패널 레이아웃
- [ ] `DetailPanel` — `ComponentShowcase` 수용 확인 (높이, 오버플로 스크롤)
- [ ] `Components.tsx` — 그리드 구조로 리팩토링 (`showToc={false}`)
- [ ] `LabLayout.tsx` — `navigationMode` prop 추가 (탭 모드 인프라, Components에선 미사용)
- [ ] `LabLayout.module.css` — 탭 바 스타일 추가
- [ ] 컴포넌트 추가 시 그리드 자동 확장 확인
- [ ] 카드 hover elevation (shadow-sm → shadow-md), 클릭 → DetailPanel 동작 확인
- [ ] 반응형 확인 (`minmax(300px, 1fr)` 로 모바일에서 1열 자동 축소)
