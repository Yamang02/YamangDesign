# E04: DetailPanel 위치 수정

## 목표

DetailPanel이 Navigation 아래 컨텐츠 영역에만 표시되도록 수정

## 현재 문제

```css
.detailPanel {
  position: fixed;
  top: 0;           /* ← 문제: 전체 뷰포트 기준 */
  height: 100vh;    /* ← 문제: 네비게이션 포함 */
}
```

```
┌─────────────────────────────────────┬────────┐
│  Navigation                         │ Detail │ ← 네비게이션 위에 겹침
├─────────────────────────────────────┤ Panel  │
│                                     │        │
│  Content Area                       │        │
│                                     │        │
└─────────────────────────────────────┴────────┘
```

## 목표 상태

```
┌─────────────────────────────────────────────────┐
│  Navigation                                     │
├─────────────────────────────────────┬───────────┤
│                                     │  Detail   │
│  Content Area                       │  Panel    │
│                                     │           │
└─────────────────────────────────────┴───────────┘
```

## 설계

### 1. Navigation 높이 CSS 변수 정의

```css
/* src/index.css 또는 src/styles/ui-variables.css */

:root {
  --nav-height: 56px;  /* Navigation 실제 높이 */
}
```

### 2. DetailPanel CSS 수정

```css
/* src/components/DetailPanel/DetailPanel.module.css */

.detailPanel {
  position: fixed;
  top: var(--nav-height, 56px);                    /* 수정 */
  right: 0;
  width: 320px;
  max-width: 90vw;
  height: calc(100vh - var(--nav-height, 56px));   /* 수정 */
  background-color: var(--ui-bg-elevated);
  border-left: 1px solid var(--ui-border-default);
  box-shadow: var(--ui-shadow-lg);
  transform: translateX(100%);
  transition: transform 200ms var(--ds-ease-productive);
  z-index: var(--ds-z-overlay);
  display: flex;
  flex-direction: column;
}
```

### 3. Navigation 높이 동기화 (선택사항)

Navigation 높이가 동적으로 변할 수 있다면:

```tsx
// src/components/Navigation/Navigation.tsx

import { useRef, useEffect } from 'react';

export function Navigation({ ... }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      document.documentElement.style.setProperty('--nav-height', `${height}px`);
    }
  }, []);

  return (
    <nav ref={navRef} className={styles.navigation}>
      {/* ... */}
    </nav>
  );
}
```

## 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/styles/ui-variables.css` | `--nav-height` 변수 추가 |
| `src/components/DetailPanel/DetailPanel.module.css` | `top`, `height` 수정 |

## 체크리스트

- [ ] `--nav-height` CSS 변수 정의
- [ ] DetailPanel CSS 수정
- [ ] 다양한 뷰포트 크기에서 테스트
- [ ] 스크롤 동작 확인
- [ ] 열림/닫힘 애니메이션 정상 동작 확인
