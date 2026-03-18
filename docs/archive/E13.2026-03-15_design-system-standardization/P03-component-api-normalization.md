# P03: 컴포넌트 API 정규화

## 목표
이벤트 핸들러 명명, open/close 패턴, className override, 접근성 속성이
모든 컴포넌트에서 일관된 규칙을 따르는 상태.

## 구현 상세

### 이벤트 핸들러 명명 규칙
| 상황 | 표준 이름 | 비고 |
|---|---|---|
| 값 변경 | `onChange` | 시그니처: `(value: T) => void` (이벤트 객체 X) |
| 닫기 | `onClose` | |
| 선택 | `onSelect` | onChange와 구분: 목록에서 항목 선택 시 |
| 일반 클릭 | `onClick` | 단순 클릭 액션 |
| 삭제 | `onDelete` | |
| 저장 | `onSave` | |
| 로고 클릭 | `onLogoClick` | Navigation 브랜드 클릭 |

직접 리네임 (내부 프로젝트, 외부 소비자 없음):
- `onSavePreset` → `onSave` (ColorPicker)
- `onLoadPreset` → `onSelect` (ColorPicker)
- `onDeletePreset` → `onDelete` (ColorPicker)
- `onLoad` → `onSelect` (PresetManager 내부 prop)
- `onBrandClick` → `onLogoClick` (Navigation)

### Open/Close 패턴 통일
**결정: prop-controlled 우선 원칙**
- 외부에서 제어 필요한 컴포넌트: `open: boolean` + `onClose: () => void`
- 완전 독립형 (Tooltip 등): 내부 state 허용, 단 `open` prop으로 외부 제어도 가능하게

정비 대상:
| 컴포넌트 | 현재 | 목표 |
|---|---|---|
| `Select` | 내부 state만 | `open?` + `onOpenChange?` (optional, controlled mode) |
| `Tooltip` | 내부 state만 | `open?` prop으로 외부 제어 가능하게 |

### className override 보완
- `Select` trigger: `triggerClassName?` prop 추가 (trigger div에 전달)

### 접근성 속성 통일 규칙
| 목적 | 표준 | 결정 |
|---|---|---|
| 비활성화 표시 | `data-disabled` (CSS) + `aria-disabled` (a11y) | 둘 다 유지 (dual approach) |
| 클릭 가능 div | `role="button"` + `tabIndex={0}` + `onKeyDown` | 완전 구현 |
| 숨김 아이콘 | `aria-hidden="true"` | 생략 금지 |
| 레이블 있는 아이콘 | `aria-label` | `title` 단독 사용 금지 |

참고: `data-disabled`는 CSS 스타일링 훅으로 유지하되, `aria-disabled`도 함께 제공하여 접근성 보장.

### Card 키보드 접근성 (clickable 시)
```tsx
// onClick이 있는 Card
<div
  role="button"
  tabIndex={0}
  aria-disabled={disabled || undefined}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }}
>
```

### Select API 추가
```ts
open?: boolean           // controlled open state
onOpenChange?: (open: boolean) => void  // controlled callback
triggerClassName?: string  // trigger div className override
```

### Tooltip API 추가
```ts
open?: boolean  // undefined = uncontrolled (내부 state), boolean = controlled
```

### 구현 전략: component-by-component
각 컴포넌트를 독립적으로 완결하여 커밋. 순서:
1. ColorPicker (이벤트 핸들러 리네임)
2. Navigation (이벤트 핸들러 리네임)
3. Select (open/onOpenChange/triggerClassName 추가)
4. Tooltip (open prop 추가)
5. Button (aria-disabled 추가)
6. Card (role/tabIndex/aria-disabled/onKeyDown 추가)

## 체크리스트
- [x] 이벤트 핸들러 명명 규칙 최종 확정
- [x] ColorPicker: `onSavePreset` → `onSave`, `onLoadPreset` → `onSelect`, `onDeletePreset` → `onDelete`
- [x] Navigation: `onBrandClick` → `onLogoClick`
- [x] Select: `open` / `onOpenChange` / `triggerClassName` optional prop 추가
- [x] Tooltip: `open` prop으로 외부 제어 지원
- [x] Button: `aria-disabled={disabled || undefined}` 추가
- [x] Card: `role="button"` + `tabIndex={0}` + `aria-disabled` + `onKeyDown` (Enter/Space) 추가
- [x] `data-disabled` + `aria-disabled` dual 적용 확인 (Card, Button)
