# E02: 아이콘 시스템 (Nucleo + Material Icons)

## 목적

이모지 기반 아이콘을 SVG 아이콘 시스템으로 교체.
Nucleo와 Material Icons 통합 사용.

---

## 현재 상태

```tsx
// 이모지로 아이콘 표현
<button>🔲 Minimal</button>
<button>🎨 Colors</button>
<span>✕</span>
```

- 일관성 없음
- 크기/색상 제어 어려움
- 디자인 시스템과 맞지 않음

---

## 목표 상태

```tsx
<Icon name="palette" library="material" size={20} />
<Icon name="sun" library="nucleo" size={24} color="var(--ds-color-text-primary)" />
```

---

## 태스크

### T02-1: Icon 컴포넌트 설계

**파일 구조:**
```
src/components/Icon/
├── Icon.tsx
├── Icon.types.ts
├── Icon.styles.ts
├── icons/
│   ├── nucleo.ts      # Nucleo SVG paths
│   └── material.ts    # Material SVG paths
└── index.ts
```

**Props 인터페이스:**
```typescript
type IconLibrary = 'nucleo' | 'material';

interface IconProps {
  name: string;
  library?: IconLibrary;  // 기본값: 'material'
  size?: number | 'sm' | 'md' | 'lg';  // 16, 20, 24
  color?: string;  // CSS 변수 또는 HEX
  className?: string;
  title?: string;  // 접근성
}
```

---

### T02-2: 아이콘 레지스트리

**필수 아이콘 목록:**

| 용도 | 아이콘명 | 라이브러리 |
|------|----------|------------|
| 테마 (Minimal) | `square` | material |
| 테마 (Neumorphism) | `circle` | material |
| 팔레트 | `palette` | material |
| 닫기 | `close` | material |
| 체크 | `check` | material |
| 저장 | `save` | material |
| 삭제 | `delete` | material |
| 추가 | `add` | material |
| 드롭다운 화살표 | `chevron-down` | material |
| 해/달 (라이트/다크) | `sun` / `moon` | nucleo |
| 설정 | `settings` | material |
| 메뉴 | `menu` | material |

---

### T02-3: SVG 최적화

**원칙:**
- viewBox 통일: `0 0 24 24`
- stroke 기반 vs fill 기반 구분
- currentColor 사용으로 색상 상속

**구조:**
```typescript
// icons/material.ts
export const materialIcons: Record<string, string> = {
  'palette': 'M12 3c-4.97 0-9 4.03-9 9s4.03...',
  'close': 'M19 6.41L17.59 5 12 10.59...',
  // ...
};
```

---

### T02-4: Icon 컴포넌트 구현

```tsx
export function Icon({
  name,
  library = 'material',
  size = 'md',
  color = 'currentColor',
  title,
}: IconProps) {
  const icons = library === 'nucleo' ? nucleoIcons : materialIcons;
  const path = icons[name];

  const sizeValue = typeof size === 'number'
    ? size
    : { sm: 16, md: 20, lg: 24 }[size];

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill={color}
      role="img"
      aria-label={title}
    >
      <path d={path} />
    </svg>
  );
}
```

---

### T02-5: 기존 이모지 교체

| 위치 | 현재 | 변경 |
|------|------|------|
| Navigation 테마 토글 | 🔲 / 🔘 | `<Icon name="square" />` / `<Icon name="circle" />` |
| Navigation 컬러 버튼 | 🎨 | `<Icon name="palette" />` |
| 컬러 에디터 닫기 | ✕ | `<Icon name="close" />` |

---

### T02-6: Exhibition 페이지에 Icon 섹션 추가

- 모든 아이콘 그리드 표시
- 크기별 비교
- 색상 변경 데모

---

## 완료 기준

- [ ] Icon 컴포넌트 구현 완료
- [ ] Nucleo, Material 아이콘 12개 이상 등록
- [ ] 기존 이모지 모두 Icon으로 교체
- [ ] 3가지 size 지원 (sm, md, lg)
- [ ] color prop으로 CSS 변수 지원
- [ ] Exhibition에 Icon 섹션 추가
- [ ] 접근성 (role, aria-label) 적용

---

## 예상 파일 변경

| 파일 | 변경 |
|------|------|
| `src/components/Icon/*` | 신규 |
| `src/components/Navigation/Navigation.tsx` | 수정 |
| `src/pages/Exhibition/Exhibition.tsx` | 수정 |
| `src/components/index.ts` | 수정 |
