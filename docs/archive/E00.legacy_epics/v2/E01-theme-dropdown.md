# E01: Select 컴포넌트 + 테마 드롭다운

## 목적

테마 전환을 토글 버튼에서 드롭다운으로 변경.
향후 테마 추가 시 확장 용이.

---

## 현재 상태

```tsx
// Navigation.tsx
<button onClick={() => setThemeName(themeName === 'minimal' ? 'neumorphism' : 'minimal')}>
  {themeName === 'minimal' ? '🔲 Minimal' : '🔘 Neumorphism'}
</button>
```

- 2개 테마만 지원
- 테마 추가 시 코드 수정 필요

---

## 목표 상태

```tsx
<Select
  value={themeName}
  onChange={setThemeName}
  options={[
    { value: 'minimal', label: 'Minimal' },
    { value: 'neumorphism', label: 'Neumorphism' },
    { value: 'glassmorphism', label: 'Glassmorphism' },  // 향후 추가
  ]}
/>
```

---

## 태스크

### T01-1: Select 컴포넌트 설계

**파일 구조:**
```
src/components/Select/
├── Select.tsx
├── Select.types.ts
├── Select.styles.ts
└── index.ts
```

**Props 인터페이스:**
```typescript
interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;  // 아이콘 시스템 연동 대비
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'ghost';
  fullWidth?: boolean;
}
```

**상태:**
- `isOpen`: 드롭다운 열림/닫힘
- `highlightedIndex`: 키보드 네비게이션용

---

### T01-2: Select 스타일 구현

**Variants:**

| Variant | 설명 |
|---------|------|
| outline | 테두리 있음 (기본) |
| filled | 배경색 채움 |
| ghost | 투명 배경 |

**Sizes:**

| Size | Height |
|------|--------|
| sm | 32px |
| md | 40px |
| lg | 48px |

**States:**
- default
- hover
- focus (열림 상태)
- disabled

---

### T01-3: Select 접근성

- `role="listbox"` / `role="option"`
- `aria-expanded`
- `aria-selected`
- 키보드: ↑↓ 이동, Enter 선택, Esc 닫기
- 외부 클릭 시 닫힘

---

### T01-4: Navigation에 통합

```tsx
// Navigation.tsx
const themeOptions = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

<Select
  value={themeName}
  onChange={(value) => setThemeName(value as ThemeName)}
  options={themeOptions}
  size="sm"
  variant="ghost"
/>
```

---

### T01-5: Exhibition 페이지에 Select 섹션 추가

- 모든 variants 표시
- 모든 sizes 표시
- disabled 상태 표시

---

## 완료 기준

- [ ] Select 컴포넌트 구현 완료
- [ ] 3가지 variant, 3가지 size 지원
- [ ] 키보드 접근성 완료
- [ ] Navigation의 테마 토글이 드롭다운으로 변경
- [ ] Exhibition에 Select 섹션 추가
- [ ] 타입 안전성 확보

---

## 예상 파일 변경

| 파일 | 변경 |
|------|------|
| `src/components/Select/*` | 신규 |
| `src/components/Navigation/Navigation.tsx` | 수정 |
| `src/pages/Exhibition/Exhibition.tsx` | 수정 |
| `src/components/index.ts` | 수정 (export 추가) |
