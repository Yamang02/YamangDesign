# E08: Lab 레이아웃 시스템

## 목표

페이지, 컴포넌트, Lab(Palette/Style/Font)을 체계적으로 관리하는 레이아웃 시스템을 구축한다.
Navigation을 확장하여 카테고리 기반 탐색을 지원하고, 시스템 UI와 쇼케이스 UI를 명확히 분리한다.

---

## 현재 문제점

### 1. 페이지 분류 체계 부재
```
현재: Landing | Palette | Style | Playground | Components
     (목적별 구분 없이 flat하게 나열)
```

### 2. 레이아웃 재사용 어려움
- PaletteLab, StyleLab이 각자 레이아웃 구현
- 공통 패턴 (타이틀, 섹션, 카드) 중복

### 3. Navigation 확장성 부족
- 페이지 추가 시 버튼만 늘어남
- 카테고리 개념 없음

### 4. UI 토큰 혼재
- 도구 UI와 쇼케이스 UI가 동일 토큰 사용
- 테마 변경 시 도구 UI까지 변경되어 혼란

---

## 목표 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                      Navigation (확장)                           │
├──────────────┬───────────────────────────────────┬──────────────┤
│   Brand      │     Category Navigation           │   Controls   │
│              │  [Pages ▼] [Components] [Labs ▼]  │  [🎨] [⚙️]  │
└──────────────┴───────────────────────────────────┴──────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Layout Wrapper                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Content Area                            │  │
│  │         (Page / Component / Lab Showcase)                  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              [Slide Panel - Detail]                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 레이아웃 유형 정의

### 1. Page Showcase Layout

> 완성된 페이지 데모 (Landing, Dashboard, CardGrid 등)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Page Title]                               [📋 Info] [</> Code]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      Full Page Preview                           │
│                  (현재 테마 조합 적용)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**특징:**
- 페이지 전체를 프리뷰
- 적용된 Palette × Style 조합 표시
- 콘텐츠는 `src/content/pages/` 에서 분리 관리

**디렉토리 구조:**
```
src/
├── pages/
│   └── showcase/
│       └── pages/
│           ├── LandingShowcase.tsx
│           ├── DashboardShowcase.tsx
│           └── CardGridShowcase.tsx
├── content/
│   └── pages/
│       ├── landing.ts      # Landing 페이지 콘텐츠
│       ├── dashboard.ts    # Dashboard 페이지 콘텐츠
│       └── card-grid.ts    # CardGrid 페이지 콘텐츠
```

---

### 2. Component Showcase Layout

> 컴포넌트 도구함 - 섹션/종류별 정리

```
┌─────────────────────────────────────────────────────────────────┐
│  Components                                      [Filter ▼]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ─ Form ─────────────────────────────────────────────────────   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Button  │ │  Input  │ │ Select  │ │Checkbox │               │
│  │ ○ ○ ○   │ │ [____]  │ │  [▼]    │ │ ☑ ☐    │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                  │
│  ─ Display ──────────────────────────────────────────────────   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│  │  Card   │ │  Badge  │ │  Icon   │                           │
│  │ ┌─────┐ │ │ [tag]   │ │   ★     │                           │
│  │ └─────┘ │ └─────────┘ └─────────┘                           │
│  └─────────┘                                                    │
│                                                                  │
│  ─ Feedback ─────────────────────────────────────────────────   │
│  ┌─────────┐ ┌─────────┐                                        │
│  │ Tooltip │ │  Toast  │                                        │
│  │  💬     │ │  📢     │                                        │
│  └─────────┘ └─────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**특징:**
- **섹션별 그룹**: Form, Display, Feedback, Navigation, Layout
- **도구함 느낌**: 그리드 카드, 균일한 크기
- **통일된 레이블**: 컴포넌트명만 표시, 변형은 시각적으로
- **클릭 시 상세**: Variant, Size, State 인터랙티브 조절

**컴포넌트 카드 구조:**
```tsx
<ComponentCard name="Button">
  {/* 미니 프리뷰 - variant 3개 정도 */}
  <Button variant="primary" size="sm">A</Button>
  <Button variant="secondary" size="sm">A</Button>
  <Button variant="ghost" size="sm">A</Button>
</ComponentCard>
```

---

### 3. Lab Layout (공통)

> Palette, Style, Font 등 디자인 요소 탐색

```
┌─────────────────────────────────────────────────────────────────┐
│                        Lab Title                                 │
│                   (Lab 종류 부제목)                               │
├─────────────────────────────────────────────────────────────────┤
│  ─────────────────────── Section 1 ───────────────────────────  │
│                     Sub Title                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  ─────────────────────── Section 2 ───────────────────────────  │
│                     Sub Title                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │                           │
│  └─────────┘ └─────────┘ └─────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 카드 클릭
┌─────────────────────────────────────────────────────────────────┐
│                                              │ Detail Panel    ││
│                                              │                 ││
│                                              │ • 상세 정보      ││
│                                              │ • 적용 예시      ││
│                                              │ • 토큰 값       ││
│                                              │                 ││
└──────────────────────────────────────────────┴─────────────────┘
```

**공통 요소:**
- 타이틀: 중앙 정렬
- 섹션: 서브타이틀 + 카드 그리드
- 구분선: 섹션 사이 시각적 분리
- 세부설명 패널: 슬라이드 또는 모달

**Lab별 특화:**

| Lab | 특화 섹션 |
|-----|----------|
| **PaletteLab** | 컬러 스케일, 대비 검사, 접근성 |
| **StyleLab** | 그림자 프리뷰, 표면 효과, 상태 |
| **FontLab** | Text Styles, Semantic 매핑, 적용 예시 |
| **Playground** | Palette × Style × Font 조합 실험 |

---

### FontLab 상세 (E05 Typography 연계)

> E05에서 정의된 Text Styles를 시각적으로 탐색

```
┌─────────────────────────────────────────────────────────────────┐
│                         Font Lab                                 │
│                   Typography Explorer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ─────────────────── Text Styles ────────────────────────────   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ display-lg                                               │   │
│  │ The quick brown fox jumps over the lazy dog             │   │
│  │ 4xl · bold · tight                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ heading-1                                                │   │
│  │ The quick brown fox jumps over the lazy dog             │   │
│  │ 2xl · semibold · snug                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ... (body-lg, body-md, caption, label, code 등)                │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  ─────────────────── Semantic Mapping ───────────────────────   │
│                                                                  │
│  ┌───────────────┬───────────────┬───────────────┐             │
│  │ page-title    │ card-title    │ button        │             │
│  │ → display-md  │ → heading-2   │ → label       │             │
│  │               │               │               │             │
│  │ Section Title │ Card Header   │ [ Button ]    │             │
│  └───────────────┴───────────────┴───────────────┘             │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  ─────────────────── Type Scale ─────────────────────────────   │
│                                                                  │
│  xs ──── sm ──── md ──── lg ──── xl ──── 2xl ──── 3xl ──── 4xl │
│  12px    14px    16px    18px    20px    24px     30px    36px  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**FontLab 섹션 구성:**

| 섹션 | 내용 | 인터랙션 |
|------|------|----------|
| **Text Styles** | 11개 스타일 카드 | 클릭 시 상세 패널 |
| **Semantic Mapping** | 용도별 매핑 시각화 | 컴포넌트 미니 프리뷰 |
| **Type Scale** | fontSize 스케일 시각화 | 비교 뷰 |
| **Font Families** | Sans, Mono 비교 | 토글 전환 |

---

## Navigation 확장

### 현재
```tsx
<Navigation centerContent={
  <>
    <Button>Landing</Button>
    <Button>Palette</Button>
    <Button>Style</Button>
    <Button>Playground</Button>
    <Button>Components</Button>
  </>
} />
```

### 목표: 아이콘 + 툴팁 + 드롭다운

```
┌─────────────────────────────────────────────────────────────────┐
│  [Yamang]     [layers] [widgets] [science]    [palette] [cog]   │
│                  ↓        ↓         ↓                           │
│               hover    hover     hover                          │
│              "Pages"  "Comp"    "Labs"                          │
│                  ↓        ↓         ↓                           │
│               click    click     click                          │
│             dropdown  (단일)   dropdown                          │
└─────────────────────────────────────────────────────────────────┘
```

### 아이콘 매핑

| 카테고리 | 아이콘 | 라이브러리 | 툴팁 | 드롭다운 항목 |
|----------|--------|------------|------|---------------|
| **Pages** | `layers` | Nucleo | "Page Showcase" | Landing, Dashboard, CardGrid |
| **Components** | `widgets` | Material | "Components" | (단일 페이지, 드롭다운 없음) |
| **Labs** | `science` | Material | "Design Labs" | Palette, Style, Font, Playground |

### 드롭다운 내 아이콘

| 항목 | 아이콘 | 라이브러리 |
|------|--------|------------|
| Palette | `palette` | Material |
| Style | `auto-awesome` | Material |
| Font | `text-fields` | Material |
| Playground | `tune` | Material |

### NavItem 구조

```tsx
interface NavCategory {
  id: string;
  icon: string;                              // 아이콘 이름
  iconLibrary?: 'material' | 'nucleo';       // 아이콘 라이브러리 (기본: material)
  tooltip: string;                           // 호버 시 표시
  items?: NavItem[];                         // 드롭다운 항목 (없으면 단일 페이지)
}

interface NavItem {
  id: string;
  label: string;
  icon?: string;          // 드롭다운 내 아이콘 (선택)
}

const navCategories: NavCategory[] = [
  {
    id: 'pages',
    icon: 'layers',
    iconLibrary: 'nucleo',
    tooltip: 'Page Showcase',
    items: [
      { id: 'landing', label: 'Landing' },
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'card-grid', label: 'Card Grid' },
    ],
  },
  {
    id: 'components',
    icon: 'widgets',
    iconLibrary: 'material',
    tooltip: 'Components',
    // items 없음 → 단일 페이지
  },
  {
    id: 'labs',
    icon: 'science',
    iconLibrary: 'material',
    tooltip: 'Design Labs',
    items: [
      { id: 'palette', label: 'Palette', icon: 'palette' },
      { id: 'style', label: 'Style', icon: 'auto-awesome' },
      { id: 'font', label: 'Font', icon: 'text-fields' },
      { id: 'playground', label: 'Playground', icon: 'tune' },
    ],
  },
];
```

### Playground 위치 결정

**Labs의 마지막 단계로 배치:**

```
[Labs ▼]
  ├─ Palette      → 색상 탐색
  ├─ Style        → GUI 스타일 탐색
  ├─ Font         → 타이포그래피 탐색
  └─ Playground   → 조합 실험 (최종 단계)
```

**이유:**
1. **논리적 흐름**: 개별 학습(Palette/Style/Font) → 조합 실험(Playground)
2. **Labs 완결성**: 탐색 + 실험이 한 카테고리에서 완료
3. **구분 명확**: Components는 "사용", Labs는 "학습/실험"

### 드롭다운 동작

```tsx
interface NavDropdownProps {
  category: NavCategory;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (itemId: string) => void;
  activeItem?: string;
}

function NavDropdown({ category, isOpen, onToggle, onSelect, activeItem }: NavDropdownProps) {
  return (
    <div className={styles.navDropdown}>
      {/* 트리거 버튼 */}
      <Tooltip content={category.tooltip}>
        <button
          className={clsx(styles.navTrigger, isOpen && styles.open)}
          onClick={category.items ? onToggle : () => onSelect(category.id)}
        >
          <Icon name={category.icon} library={category.iconLibrary ?? 'material'} size="sm" />
          {category.items && <Icon name="expand-more" size="sm" />}
        </button>
      </Tooltip>

      {/* 드롭다운 메뉴 */}
      {category.items && isOpen && (
        <div className={styles.dropdownMenu}>
          {category.items.map(item => (
            <button
              key={item.id}
              className={clsx(styles.dropdownItem, activeItem === item.id && styles.active)}
              onClick={() => onSelect(item.id)}
            >
              {item.icon && <Icon name={item.icon} size="sm" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 스타일 가이드

> **토큰 매핑**: E07 ui-variables.css 기준. `[data-ui]` 내에서는 `--ds-*`가 `--ui-*` 색상으로 override됨.
> spacing/radius는 `--ds-spacing-*`, `--ds-radius-*` 사용. 색상은 `--ui-*` 사용.

```css
/* 루트 메뉴: 아이콘만 */
.navTrigger {
  padding: var(--ds-spacing-2);
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ui-text-secondary);
  transition: all 150ms ease;
}

.navTrigger:hover {
  background: var(--ui-bg-surface);
  color: var(--ui-text-primary);
}

.navTrigger.active {
  color: var(--ui-action-primary);
}

/* 드롭다운 메뉴 */
.dropdownMenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border-default);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ui-shadow-md);
  padding: var(--ds-spacing-1);
}

.dropdownItem {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  border-radius: var(--ds-radius-sm);
  width: 100%;
  text-align: left;
}

.dropdownItem:hover {
  background: var(--ui-bg-surface);
}

.dropdownItem.active {
  background: rgba(99, 102, 241, 0.15);  /* accent subtle */
  color: var(--ui-action-primary);
}
```

### NavDropdown 구현 참고사항

- **Icon prop**: `library` 사용 (Icon 컴포넌트와 동일). `expand-more`는 `size="sm"` 사용 (xs 미지원).
- **외부 클릭 닫기**: `useEffect` + `document.addEventListener('click', ...)` 또는 ref 기반 클릭아웃 처리 권장.
- **키보드 접근성**: Escape로 닫기, 드롭다운 열림 시 포커스 트랩 고려.

---

## UI 토큰 분리 (E07 연계)

### 문제
```tsx
// 현재: 테마 변경 시 Navigation도 변경됨
<Navigation style={{ background: 'var(--ds-color-bg-base)' }} />
```

### 해결: data 속성 기반 분리

```tsx
// Navigation - System UI
<nav data-ui>
  {/* --ui-* 토큰 사용 */}
</nav>

// Showcase Area - Design System
<main data-showcase>
  {/* --ds-* 토큰 사용, 테마 반영 */}
</main>
```

### UI 영역 정의

| 영역 | 토큰 | 테마 영향 | 예시 |
|------|------|-----------|------|
| **System UI** | `--ui-*` | 없음 (고정) | Navigation, SlidePanel, Controls |
| **Showcase** | `--ds-*` | 있음 (동적) | Page Preview, Component Demo |

### 토글 컨트롤 (선택적)

```
┌──────────────────────────────────┐
│  Preview Mode: [🎨 Themed] [⚙️ System]  │
└──────────────────────────────────┘
```

- **Themed**: 쇼케이스에 현재 테마 적용
- **System**: 쇼케이스도 시스템 UI 토큰 사용 (디버깅용)

---

## 공통 컴포넌트

### 1. LabLayout

```tsx
interface LabLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function LabLayout({ title, subtitle, children }: LabLayoutProps) {
  return (
    <div className={styles.labLayout}>
      <header className={styles.labHeader}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className={styles.labContent}>
        {children}
      </div>
    </div>
  );
}
```

### 2. LabSection

```tsx
interface LabSectionProps {
  title: string;
  children: React.ReactNode;
  withDivider?: boolean;  // 섹션 위 구분선
}

function LabSection({ title, children, withDivider = true }: LabSectionProps) {
  return (
    <>
      {withDivider && <hr className={styles.sectionDivider} />}
      <section className={styles.labSection}>
        <h2>{title}</h2>
        <div className={styles.sectionContent}>
          {children}
        </div>
      </section>
    </>
  );
}
```

### 3. LabCard

```tsx
interface LabCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

function LabCard({ children, onClick, selected }: LabCardProps) {
  return (
    <div
      className={clsx(styles.labCard, selected && styles.selected)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
```

### 4. DetailPanel (SlidePanel)

```tsx
interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function DetailPanel({ open, onClose, title, children }: DetailPanelProps) {
  return (
    <aside className={clsx(styles.detailPanel, open && styles.open)}>
      <header>
        <h3>{title}</h3>
        <button onClick={onClose}>
          <Icon name="close" />
        </button>
      </header>
      <div className={styles.panelContent}>
        {children}
      </div>
    </aside>
  );
}
```

### 5. ComponentCard

```tsx
interface ComponentCardProps {
  name: string;
  category: 'form' | 'display' | 'feedback' | 'navigation' | 'layout';
  children: React.ReactNode;  // 미니 프리뷰
  onClick?: () => void;
}

function ComponentCard({ name, children, onClick }: ComponentCardProps) {
  return (
    <div className={styles.componentCard} onClick={onClick}>
      <div className={styles.preview}>
        {children}
      </div>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
```

---

## 디렉토리 구조 (제안)

```
src/
├── layouts/                      # 레이아웃 컴포넌트
│   ├── LabLayout/
│   │   ├── LabLayout.tsx
│   │   ├── LabSection.tsx
│   │   ├── LabCard.tsx
│   │   └── index.ts
│   ├── ComponentShowcase/
│   │   ├── ComponentShowcase.tsx
│   │   ├── ComponentCard.tsx
│   │   └── index.ts
│   └── PageShowcase/
│       └── PageShowcase.tsx
│
├── components/
│   ├── Navigation/              # 확장된 Navigation
│   │   ├── Navigation.tsx
│   │   ├── NavDropdown.tsx      # 드롭다운 메뉴
│   │   └── ...
│   ├── DetailPanel/             # 슬라이드 패널
│   │   └── DetailPanel.tsx
│   └── ...
│
├── pages/
│   ├── labs/                    # Lab 페이지들
│   │   ├── PaletteLab/
│   │   ├── StyleLab/
│   │   ├── FontLab/
│   │   └── Playground/
│   ├── showcase/
│   │   ├── components/          # 컴포넌트 쇼케이스
│   │   │   └── Components.tsx
│   │   └── pages/               # 페이지 쇼케이스
│   │       ├── LandingShowcase.tsx
│   │       └── ...
│   └── index.ts
│
├── content/                     # 페이지 콘텐츠 데이터
│   └── pages/
│       ├── landing.ts
│       └── ...
```

---

## 작업 항목

### Phase 1: 공통 레이아웃 컴포넌트 ✅

- [x] `LabLayout` 컴포넌트 생성
- [x] `LabSection` 컴포넌트 생성
- [x] `LabCard` 컴포넌트 생성
- [x] `DetailPanel` 슬라이드 패널 생성
- [x] 스타일: 중앙정렬, 구분선, 카드 그리드

### Phase 2: Navigation 확장 ✅

- [x] 아이콘 기반 루트 메뉴 (`Icon` + `Tooltip`)
- [x] `NavDropdown` 컴포넌트 추가
- [x] `navCategories` 설정 정의
- [x] 카테고리 기반 라우팅 구조
- [ ] 모바일 대응 (햄버거 메뉴) - 추후

### Phase 3: 기존 Lab 마이그레이션 ✅

- [x] `PaletteLab` → `LabLayout` 사용
- [x] `StyleLab` → `LabLayout` 사용
- [x] `Playground` → `LabLayout` 사용 (Labs 마지막 단계)

### Phase 4: FontLab 신규 생성 ✅

- [x] `FontLab` 페이지 생성
- [x] Text Styles 섹션 (11개 스타일 카드)
- [x] Semantic Mapping 섹션 (용도별 시각화)
- [x] Type Scale 섹션 (fontSize 비교)
- [x] E05 Typography 토큰 연동

### Phase 5: 컴포넌트 쇼케이스 개선

- [ ] `ComponentCard` 컴포넌트 - 추후
- [ ] 섹션별 그룹핑 (Form, Display, Feedback) - 추후
- [ ] 인터랙티브 상세 패널 - 추후

### Phase 6: 페이지 쇼케이스

- [ ] `PageShowcase` 레이아웃 - 추후
- [ ] 콘텐츠 분리 (`src/content/pages/`) - 추후
- [ ] Landing 콘텐츠 마이그레이션 - 추후

### Phase 7: UI 토큰 분리 적용 ✅

- [x] E07 연계: `data-ui` / `data-showcase` 적용
- [x] Navigation에 `--ui-*` 토큰 적용
- [x] 쇼케이스 영역에 `--ds-*` 토큰 유지

---

## 완료 기준

- [x] `LabLayout` 공통 컴포넌트로 4개 Lab 페이지 통합 (Palette, Style, Font, Playground)
- [x] Navigation: 아이콘 + 툴팁 + 드롭다운 구조
- [x] FontLab 페이지 생성 (E05 Typography 시각화)
- [ ] 컴포넌트 쇼케이스에 섹션별 그룹핑 적용 (추후)
- [x] `DetailPanel` 동작 확인 (FontLab Text Styles 카드 클릭 시)
- [x] 시스템 UI / 쇼케이스 UI 토큰 분리 적용
- [x] 빌드 통과

---

## 구현 시 참고사항 (2025-02 검토 반영)

1. **페이지 범위**: Dashboard, CardGrid는 Phase 6에서 placeholder 또는 추후 구현. 우선 Landing만 PageShowcase로 마이그레이션.
2. **UI 토큰**: `[data-ui]` 내 NavDropdown 스타일은 `--ui-bg-*`, `--ui-text-*`, `--ui-border-*`, `--ui-action-*` 사용. spacing/radius는 `--ds-spacing-*`, `--ds-radius-*` 사용.
3. **드롭다운**: 외부 클릭 시 닫기, Escape 키 닫기 구현 권장.
4. **디렉토리**: 현재 `pages/layouts/`에 Landing, PaletteLab 등 존재. E08 제안 구조와 병행하며 기존 exports 유지.

---

## 참고

- [E06: Site Style 정의](./E06-site-style.md) - Minimal UI 철학
- [E07: UI 네임스페이스 분리](./E07-ui-namespace.md) - 토큰 분리 상세
- 현재 Navigation: [Navigation.tsx](../../../src/components/Navigation/Navigation.tsx)
