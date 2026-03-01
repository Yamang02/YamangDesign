# E01: 헤더 레이아웃 재구성

## 개요

AI_Portfolio 스타일의 2분할 레이아웃을 적용하고, "야망디자인" 브랜딩을 추가합니다. E02에서는 **방안 A: 2단계 아이콘 네비게이션**으로 진행합니다.

## 선행 작업 (완료)

- [x] **Griun PolSensibility 폰트** 디자인시스템 추가 (`--ds-font-display`)
- [x] `src/styles/fonts.css` @font-face 설정
- [x] `src/tokens/primitives/typography.ts` fontFamily.display 추가

## 현재 상태

```tsx
// Navigation.tsx 현재 구조
<nav className={navClasses}>
  <section className={styles.left}>
    <span className={styles.brandText}>Yamang Design</span>
  </section>
  <section className={styles.center}>
    {centerContent}  // NavDropdown들
  </section>
  <section className={styles.right}>
    <Select ... />   // 테마 토글
    <button ... />   // 컬러 에디터 버튼
    {colorEditorOpen && <ColorPicker />}  // 인라인 패널
  </section>
</nav>
```

## 목표 상태

```tsx
// 새로운 Header 구조 (구현됨)
<header className={styles.header}>
  <div className={styles.container}>
    <button className={styles.logo} onClick={onLogoClick}>야망디자인</button>
    <nav className={styles.nav}>{children}</nav>
  </div>
</header>
```

## 작업 항목

### 1. 헤더 컴포넌트 구조 변경

**파일:** `src/components/Header/Header.tsx` (신규)

```tsx
interface HeaderProps {
  children?: React.ReactNode;  // 네비게이션 아이템 슬롯
}

export function Header({ children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          야망디자인
        </Link>
        <nav className={styles.nav}>
          {children}
        </nav>
      </div>
    </header>
  );
}
```

### 2. 스타일링 (AI_Portfolio 참조)

**파일:** `src/components/Header/Header.module.css`

```css
.header {
  position: sticky;
  top: 0;
  background-color: var(--ui-bg-base);
  border-bottom: 1px solid var(--ui-border-default);
  z-index: var(--ds-z-sticky);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--ds-spacing-6);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: var(--ds-font-display);
  font-size: var(--ds-text-xl);
  font-weight: 700;
  color: var(--ui-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.logo:hover {
  color: var(--ds-color-primary-600);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
}
```

### 3. 로고 폰트 설정 ✅ 완료

Griun PolSensibility 폰트 사용 (AI_Portfolio 헤더와 동일). 디자인시스템에 `--ds-font-display` 토큰으로 등록됨:

- `src/styles/fonts.css`: @font-face 선언
- `src/tokens/primitives/typography.ts`: fontFamily.display
- 로고에서는 `font-family: var(--ds-font-display)` 사용

### 4. 기존 Navigation 마이그레이션 ✅ 완료

- `Navigation`에 `asSlot` prop 추가: Header children으로 center+right만 렌더
- `App.tsx`: `<Header><Navigation asSlot ... /></Header>` 구조로 교체
- E02에서 Navigation → IconNav 전환 시 Header children만 교체

## 체크리스트

- [x] Header 컴포넌트 생성
- [x] Header.module.css 스타일링
- [x] Griun PolSensibility 폰트 설정 (디자인시스템 `--ds-font-display`)
- [x] 로고 클릭 시 홈 이동 기능 (onLogoClick)
- [x] 기존 Navigation과 병행 (asSlot으로 Header children에 통합)
- [x] 반응형 기본 구조 (높이 64px, 패딩)

## 디자인 결정

### 로고 폰트
- **Griun PolSensibility** (AI_Portfolio 헤더와 동일)
- 토큰: `var(--ds-font-display)`
- 폴백: Cormorant Garamond, Noto Serif KR, Georgia, serif

### 네비게이션 (E02)
- **방안 A: 2단계 아이콘 네비게이션** 확정
- `[야망디자인]  [Pages▾] [Components] [Labs▾] [⚙️설정]`

### 색상 정책
- 배경: `var(--ui-bg-base)` (현재 디자인 시스템 유지)
- 텍스트: `var(--ui-text-primary)` (현재 유지)
- 보더: `var(--ui-border-default)` (현재 유지)
- **AI_Portfolio 색상을 가져오지 않음** - 현재 시스템 토큰 활용

### 높이 및 간격
- 헤더 높이: 64px (AI_Portfolio와 동일)
- 최대 너비: 1280px (AI_Portfolio와 동일)
- 좌우 패딩: `var(--ds-spacing-6)` (24px)

## 참조 파일

- AI_Portfolio Header: `AI_PortFolio/frontend/src/main/widgets/header/ui/Header.tsx`
- 현재 Navigation: `src/components/Navigation/Navigation.tsx`
