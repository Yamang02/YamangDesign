# E02: 아이콘 기반 네비게이션 구현

## 개요

복잡한 드롭다운 메뉴를 AI_Portfolio 스타일의 아이콘 네비게이션으로 전환하되, 디자인 시스템의 더 복잡한 메뉴 구조를 수용합니다.

## 문제 분석

### 현재 메뉴 구조

```
Pages (드롭다운)
├── Landing
├── Dashboard
└── Card Grid

Components (단일 링크)

Labs (드롭다운)
├── Palette Lab
├── Style Lab
├── Font Lab
└── Playground
```

### AI_Portfolio 메뉴 구조

```
[🌙테마] [|] [👤프로필] [📁프로젝트] [📄글] [💬챗봇] [⚙️설정]
```
- 모두 단일 페이지 링크
- 드롭다운 없음

### 차이점
- YamangDesign: 3개 카테고리, 7개 하위 페이지
- AI_Portfolio: 6개 단일 링크

## 제안 솔루션

### 방안 A: 하이브리드 아이콘 네비게이션 (권장)

```
[야망디자인]     [🏠Pages▾] [📦Components] [🧪Labs▾] | [⚙️설정]
```

- 서브메뉴가 있는 항목: 아이콘 + 텍스트 + 드롭다운 인디케이터
- 단일 페이지: 아이콘만 또는 아이콘 + 텍스트
- 설정: 분리된 아이콘 버튼

**장점:**
- 기존 메뉴 구조 유지
- AI_Portfolio 스타일 적용
- 확장성 있음

### 방안 B: 완전 평탄화

```
[야망디자인]     [🏠] [📊] [📋] [📦] [🎨] [✏️] [🔤] [🎮] | [⚙️]
```
- 모든 페이지를 개별 아이콘으로 표시
- 8개 아이콘 (너무 많음)

**단점:**
- 아이콘이 너무 많아 복잡함
- 카테고리 구분 없음

### 방안 C: 그룹화된 아이콘 버튼

```
[야망디자인]     [Pages] [Labs] | [⚙️]
                   │       │
                   ▼       ▼
            ┌─────────┐  ┌──────────┐
            │ Landing │  │ Palette  │
            │ Dash    │  │ Style    │
            │ Cards   │  │ Font     │
            └─────────┘  │ Play     │
                         └──────────┘
```
- Components를 Pages에 통합
- 2개의 주요 카테고리만 표시

## 선택: 방안 A 구현

### 컴포넌트 구조

```
src/components/Header/
├── Header.tsx
├── Header.module.css
├── HeaderNav.tsx           # 네비게이션 컨테이너
├── HeaderNavItem.tsx       # 단일 아이콘 버튼
├── HeaderNavDropdown.tsx   # 드롭다운 메뉴 아이템
└── HeaderSettingsButton.tsx # 설정 버튼
```

### HeaderNavItem

```tsx
interface HeaderNavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  tooltip?: string;
  active?: boolean;
}

export function HeaderNavItem({ icon, label, to, tooltip, active }: HeaderNavItemProps) {
  return (
    <Tooltip content={tooltip || label}>
      <Link
        to={to}
        className={clsx(styles.navItem, active && styles.active)}
      >
        <span className={styles.icon}>{icon}</span>
      </Link>
    </Tooltip>
  );
}
```

### HeaderNavDropdown

```tsx
interface HeaderNavDropdownProps {
  icon: React.ReactNode;
  label: string;
  items: Array<{
    label: string;
    to: string;
    icon?: React.ReactNode;
  }>;
  active?: boolean;
}

export function HeaderNavDropdown({ icon, label, items, active }: HeaderNavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropdown}>
      <button
        className={clsx(styles.dropdownTrigger, active && styles.active)}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
        <ChevronDown className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {items.map(item => (
            <Link key={item.to} to={item.to} className={styles.dropdownItem}>
              {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 스타일링

```css
/* HeaderNav.module.css */
.navItem {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--ds-radius-md);
  color: var(--ui-text-secondary);
  transition: all 0.2s ease;
}

.navItem:hover {
  background-color: var(--ui-bg-hover);
  color: var(--ui-text-primary);
}

.navItem.active {
  color: var(--ds-color-primary-600);
  background-color: var(--ds-color-primary-50);
}

.dropdownTrigger {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-1);
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  border-radius: var(--ds-radius-md);
  color: var(--ui-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdownTrigger:hover {
  background-color: var(--ui-bg-hover);
  color: var(--ui-text-primary);
}

.dropdownMenu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: var(--ds-spacing-1);
  padding: var(--ds-spacing-2);
  background-color: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border-default);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ui-shadow-lg);
  min-width: 180px;
  z-index: var(--ds-z-dropdown);
}

.dropdownItem {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  border-radius: var(--ds-radius-sm);
  color: var(--ui-text-primary);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.dropdownItem:hover {
  background-color: var(--ui-bg-hover);
}
```

### 메뉴 설정

```tsx
// src/config/header-nav.ts
export const headerNavConfig = {
  pages: {
    icon: <Home />,
    label: 'Pages',
    items: [
      { label: 'Landing', to: '/landing', icon: <FileText /> },
      { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard /> },
      { label: 'Card Grid', to: '/card-grid', icon: <Grid /> },
    ],
  },
  components: {
    icon: <Package />,
    label: 'Components',
    to: '/components',
  },
  labs: {
    icon: <FlaskConical />,
    label: 'Labs',
    items: [
      { label: 'Palette Lab', to: '/labs/palette', icon: <Palette /> },
      { label: 'Style Lab', to: '/labs/style', icon: <Brush /> },
      { label: 'Font Lab', to: '/labs/font', icon: <Type /> },
      { label: 'Playground', to: '/labs/playground', icon: <Play /> },
    ],
  },
};
```

## 체크리스트

- [x] HeaderNavItem 컴포넌트 구현
- [x] HeaderNavDropdown 컴포넌트 구현
- [x] HeaderSettingsButton 구현 (E03 전역 설정 모달과 연결 예정)
- [x] 드롭다운 외부 클릭 시 닫기
- [x] 키보드 네비게이션 (Escape)
- [x] 현재 경로 기반 active 상태
- [x] 기존 Icon 컴포넌트 사용 (material/nucleo)
- [x] 툴팁 통합

## 아이콘 라이브러리

**권장: Lucide React**
- 경량, 트리쉐이킹 지원
- 일관된 스타일
- AI_Portfolio와 유사한 느낌

```bash
npm install lucide-react
```

```tsx
import { Home, Package, FlaskConical, Settings } from 'lucide-react';
```

## 참조

- [Lucide Icons](https://lucide.dev/icons/)
- AI_Portfolio HeaderIconButton: `AI_PortFolio/frontend/src/design-system/components/Button/HeaderIconButton.tsx`
