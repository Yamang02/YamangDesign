# P06: 사이드바이사이드 비교 뷰

## 목표

동일 컴포넌트(Button, Card, Input 등)를 2~4개 사조로 나란히 렌더링하여 시각적 차이를 즉시 비교할 수 있는 전용 뷰를 제공한다.

## 구현 상세

### 접근 방법: 격리된 CSS 변수 스코프

현재 CSS 변수는 `:root`에 단일 세트로 주입된다. 사이드바이사이드 비교를 위해서는 **동일 DOM에 복수 스타일 스코프**가 공존해야 한다.

기존 `ComparisonCard`가 이미 `styleVars`를 인라인 스타일로 주입하는 패턴을 가지고 있다. 이를 확장하여, 각 비교 패널에 해당 사조의 전체 `ThemeTokenSet`을 인라인 주입한다.

```tsx
// 비교 패널 하나
<div style={flattenTokenSet(buildThemeAndTokenSet(palette, stylePresets.brutalism).tokenSet)}>
  <Button variant="primary">Button</Button>
  <Card>Card</Card>
  <Input placeholder="Input" />
</div>
```

CSS 변수의 상속 특성상, 부모 `div`에 주입된 변수가 자식 컴포넌트에서 `var(--ds-*)`로 참조된다. `:root` 값을 오버라이드한다.

### 비교 뷰 UI 구성

```
┌─ 스타일 비교 ──────────────────────────────────────────┐
│ 팔레트: [SpringCreamSoda01 ▾]   컴포넌트: [전체 ▾]      │
│                                                        │
│ ┌─ Minimal ─────┐ ┌─ Neumorphism ──┐ ┌─ Brutalism ────┐│
│ │ [Button]      │ │ [Button]       │ │ [Button]       ││
│ │ [Card]        │ │ [Card]         │ │ [Card]         ││
│ │ [Input]       │ │ [Input]        │ │ [Input]        ││
│ └───────────────┘ └────────────────┘ └────────────────┘│
│                                                        │
│ ┌─ 토큰 Diff (Minimal 기준) ──────────────────────────┐│
│ │ --ds-radius-md    8px    12px   0      16px         ││
│ │ --ds-shadow-md    soft   raised hard   glass        ││
│ │ --ds-border-width 1px    0      3px    1px          ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### 표시 컴포넌트 목록

기존 Build 페이지의 Atoms에서 사용하는 컴포넌트를 재사용한다.

| 컴포넌트 | 비교에서 보여줄 variant/상태 |
|----------|---------------------------|
| Button | primary, secondary, ghost |
| Card | 기본 + elevation 변화 |
| Input | default, focus 상태 |
| Badge | primary, accent |
| Avatar | 기본 |

### 배치 위치

StyleLab 내에 새 섹션으로 추가하거나, 별도 탭으로 구성한다. 기존 StyleLab의 "Component Comparison" 섹션이 이미 유사한 역할을 하고 있으므로, 이를 확장하는 방향이 자연스럽다.

### 변경 파일

- `src/app/pages/labs/StyleLab/` — 비교 뷰 섹션 추가 (또는 기존 Component Comparison 확장)
- `src/app/layouts/LabLayout/ComparisonCard/` — 전체 ThemeTokenSet 주입 지원 확장
- (필요 시) 비교 대상 스타일 선택 상태 관리

### 주의사항

- 비교 패널 수가 4개일 때 화면 폭에 따라 2×2 그리드로 전환 (반응형)
- 각 패널의 CSS 변수가 서로 간섭하지 않도록 인라인 스타일 스코프 확인
- P05의 토큰 diff 기능과 연동하여 비교 뷰 하단에 diff 테이블 표시

## 체크리스트

- [ ] 비교 뷰에 표시할 스타일 2~4개 선택 UI 구현
- [ ] 각 비교 패널에 해당 스타일의 ThemeTokenSet을 인라인 CSS 변수로 주입
- [ ] Button, Card, Input 등 주요 컴포넌트가 각 패널에서 해당 사조의 스타일로 렌더링 확인
- [ ] 비교 뷰 하단에 선택된 사조 간 토큰 diff 테이블 표시
- [ ] 반응형 레이아웃 (4패널 → 2×2) 구현
- [ ] 팔레트 변경 시 모든 패널이 동일 팔레트로 갱신되는지 확인
