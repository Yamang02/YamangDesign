# P03: 컴포넌트 API 정규화

## 목표
이벤트 핸들러 명명, open/close 패턴, className override, 접근성 속성이
모든 컴포넌트에서 일관된 규칙을 따르는 상태.

## 구현 상세

### 이벤트 핸들러 명명 규칙 (결정 필요)
| 상황 | 표준 이름 | 비고 |
|---|---|---|
| 값 변경 | `onChange` | 시그니처: `(value: T) => void` (이벤트 객체 X) |
| 닫기 | `onClose` | |
| 선택 | `onSelect` | onChange와 구분: 목록에서 항목 선택 시 |
| 일반 클릭 | `onClick` | 단순 클릭 액션 |
| 삭제 | `onDelete` | |
| 저장 | `onSave` | |

현재 비표준 이름 → 교체 대상:
- `onBrandClick` → `onLogoClick` 또는 `onClick`
- `onSavePreset` → `onSave`
- `onLoadPreset` → `onSelect`
- `onDeletePreset` → `onDelete`

### Open/Close 패턴 통일
**결정: prop-controlled 우선 원칙**
- 외부에서 제어 필요한 컴포넌트: `open: boolean` + `onClose: () => void`
- 완전 독립형 (Tooltip 등): 내부 state 허용, 단 `open` prop으로 외부 제어도 가능하게

정비 대상:
| 컴포넌트 | 현재 | 목표 |
|---|---|---|
| `Select` | 내부 state만 | `open` + `onOpenChange` prop 추가 (optional) |
| `Tooltip` | 내부 state만 | `open` prop으로 외부 제어 가능하게 |

### className override 보완
- `Select` trigger: `className` prop 전달 불가 → 추가

### 접근성 속성 통일 규칙
| 목적 | 표준 | 금지 |
|---|---|---|
| 비활성화 표시 | `aria-disabled` | `data-disabled` (의미론적 용도로) |
| 클릭 가능 div | `role="button"` + `tabIndex={0}` | `data-clickable` 단독 사용 |
| 숨김 아이콘 | `aria-hidden="true"` | 생략 |
| 레이블 있는 아이콘 | `aria-label` | `title` 단독 사용 |

참고: `data-*` 속성은 CSS 스타일링 훅으로만 사용 (의미론적 접근성 용도 금지)

## 체크리스트
- [ ] 이벤트 핸들러 명명 규칙 최종 확정 (위 표 검토 후 확정)
- [ ] ColorPicker: `onSavePreset` → `onSave`, `onLoadPreset` → `onSelect`, `onDeletePreset` → `onDelete`
- [ ] Navigation: `onBrandClick` 이름 결정 및 변경
- [ ] Select: `open` / `onOpenChange` optional prop 추가
- [ ] Tooltip: `open` prop으로 외부 제어 지원
- [ ] Select trigger: `className` prop 지원 추가
- [ ] 전체 컴포넌트 aria 속성 감사 및 통일 (Button, Card, Select, Icon)
- [ ] `data-disabled` → `aria-disabled` 이전 (Card, Button)
- [ ] `role="button"` 사용 컴포넌트 `tabIndex={0}` 및 키보드 이벤트 확인
