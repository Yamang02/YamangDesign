# 페이지 구조 설계

## 개요

다양한 레이아웃 페이지를 지원하기 위한 폴더 구조.

---

## 페이지 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| **layouts** | 레이아웃 데모 페이지 | 랜딩, 카드그리드, 관리자, 아티클 |
| **showcase** | 컴포넌트 쇼케이스 | Exhibition (현재) |

---

## 폴더 구조

```
src/
├── pages/
│   ├── index.ts                    # 모든 페이지 export
│   │
│   ├── layouts/                    # 레이아웃 데모 페이지들
│   │   ├── index.ts
│   │   ├── Landing/                # 랜딩 페이지 (현재 Demo)
│   │   │   ├── Landing.tsx
│   │   │   ├── Landing.styles.ts
│   │   │   └── index.ts
│   │   ├── CardGrid/               # 카드형 그리드 페이지
│   │   │   ├── CardGrid.tsx
│   │   │   ├── CardGrid.styles.ts
│   │   │   └── index.ts
│   │   ├── Dashboard/              # 관리자/대시보드 페이지
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.styles.ts
│   │   │   └── index.ts
│   │   └── Article/                # 아티클/블로그 페이지
│   │       ├── Article.tsx
│   │       ├── Article.styles.ts
│   │       └── index.ts
│   │
│   └── showcase/                   # 컴포넌트 쇼케이스
│       ├── index.ts
│       └── Components/             # 컴포넌트 전시 (현재 Exhibition)
│           ├── Components.tsx
│           ├── Components.styles.ts
│           └── index.ts
```

---

## 네비게이션 구조

```
[Yamang Design]     [Layouts ▼] [Components]     [Colors] [Theme ▼]
                         │
                         ├── Landing
                         ├── Card Grid
                         ├── Dashboard
                         └── Article
```

- **Layouts**: 드롭다운으로 여러 레이아웃 선택
- **Components**: 컴포넌트 쇼케이스 페이지

---

## 마이그레이션 (완료)

- [x] `pages/Demo` → `pages/layouts/Landing`
- [x] `pages/Exhibition` → `pages/showcase/Components`
- [x] App.tsx에서 페이지 라우팅 업데이트
- [x] Navigation centerContent 업데이트
- [x] 기존 폴더 삭제

---

## PageName 타입

```typescript
// 레이아웃 페이지
type LayoutPage = 'landing' | 'card-grid' | 'dashboard' | 'article';

// 쇼케이스 페이지
type ShowcasePage = 'components';

// 전체 페이지
type PageName = LayoutPage | ShowcasePage;
```
