# E06: Site Style 정의

> **핵심 구현 완료** (2025-02) — SlidePanel, CodeModal, GuidedTour 미구현

## 목표

디자인 시스템과 별개로, **이 사이트(YamangDesign)만의 스타일 선호도**를 정의한다.

---

## 개념

```
┌─────────────────────────────────────────────────────────┐
│                  Design System                          │
│  (Palette, Style, Typography - 범용적, 재사용 가능)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Site Style                            │
│  (이 사이트의 선호도, 기본값, UX 패턴)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Final Experience                      │
└─────────────────────────────────────────────────────────┘
```

**디자인 시스템**: 어떤 프로젝트에서든 사용 가능한 범용 컴포넌트/토큰
**Site Style**: 이 사이트에서 어떤 조합을 선호하고, 어떻게 사용자를 안내할지

---

## 이 사이트의 스타일 선호도

### UI 철학

| 원칙 | 설명 |
|------|------|
| **Minimal UI** | 불필요한 장식 최소화, 콘텐츠 중심 |
| **Tooltip 기반 안내** | 인라인 설명 대신 호버/포커스 시 툴팁으로 안내 |
| **점진적 노출** | 기본은 단순하게, 필요 시 상세 정보 제공 |
| **연구 친화적** | 배색/스타일 탐색이 편한 UI |

---

## Site Style 설정

```typescript
// config/site-style.ts

export const siteStyle = {
  /** UI 밀도 */
  uiDensity: 'minimal' as const,  // 'minimal' | 'comfortable' | 'compact'

  /** 사용자 안내 방식 */
  guidance: {
    /** 기본 안내 방식 */
    default: 'tooltip' as const,  // 'tooltip' | 'inline' | 'none'

    /** 툴팁 표시 지연 (ms) */
    tooltipDelay: 300,

    /** 복잡한 기능에는 인라인 힌트 허용 */
    allowInlineForComplex: true,
  },

  /** 기본 테마 설정 */
  defaults: {
    palette: 'default' as const,
    style: 'minimal' as const,
    bgStrategy: 'light' as const,
  },

  /** 레이아웃 */
  layout: {
    /** 최대 콘텐츠 너비 */
    maxContentWidth: '1200px',

    /** 기본 간격 스케일 */
    spacingScale: 'normal' as const,  // 'tight' | 'normal' | 'relaxed'
  },

  /** 인터랙션 */
  interaction: {
    /** 애니메이션 선호도 */
    animation: 'subtle' as const,  // 'none' | 'subtle' | 'expressive'

    /** 포커스 표시 방식 */
    focusIndicator: 'ring' as const,  // 'ring' | 'outline' | 'background'
  },
} as const;

export type SiteStyle = typeof siteStyle;
```

---

## Minimal UI 가이드라인

### DO (권장)

```
┌─────────────────────────────────────┐
│  Color Picker                       │
│  ┌─────────────────────────────┐   │
│  │  [#6366F1]  ← 단순한 입력     │   │
│  └─────────────────────────────┘   │
│                     ℹ️ (hover시 상세) │
└─────────────────────────────────────┘
```

- 레이블은 간결하게
- 부가 설명은 툴팁으로
- 빈 공간 활용

### DON'T (지양)

```
┌─────────────────────────────────────┐
│  Primary Color                      │
│  Enter your primary brand color     │
│  in hexadecimal format (#RRGGBB).   │
│  This color will be used for        │
│  buttons, links, and key actions.   │
│  ┌─────────────────────────────┐   │
│  │  [#6366F1]                   │   │
│  └─────────────────────────────┘   │
│  ✓ Valid hex color                  │
└─────────────────────────────────────┘
```

- 과도한 인라인 설명
- 불필요한 상태 메시지
- 시각적 노이즈

---

## Tooltip 가이드 시스템

### 툴팁 유형

```typescript
// 1. 기본 힌트 툴팁
<Tooltip content="색상을 입력하세요">
  <Input placeholder="#RRGGBB" />
</Tooltip>

// 2. 상세 설명 툴팁 (필요 시)
<Tooltip
  content={
    <>
      <strong>Primary Color</strong>
      <p>브랜드의 주요 색상입니다.</p>
      <p>버튼, 링크 등에 사용됩니다.</p>
    </>
  }
>
  <InfoIcon />
</Tooltip>

// 3. 인터랙티브 가이드 (복잡한 기능)
<GuidedTooltip
  steps={[
    { target: 'input', content: '색상을 입력하세요' },
    { target: 'preview', content: '미리보기가 업데이트됩니다' },
  ]}
/>
```

### 툴팁 위치 규칙

| 요소 | 기본 위치 | 이유 |
|------|-----------|------|
| Input | top | 입력 시 가리지 않도록 |
| Button | top | 클릭 영역 방해 안 함 |
| Icon | right | 아이콘 옆에 자연스럽게 |
| 긴 콘텐츠 | bottom | 콘텐츠 위 공간 확보 |

---

## 적용 예시

### ColorPicker (현재 vs 목표)

**현재:**
```tsx
<div className="color-picker">
  <label>Primary Color</label>
  <p className="description">
    Enter your primary brand color...
  </p>
  <input type="text" />
  <div className="preview" />
</div>
```

**Site Style 적용 후:**
```tsx
<div className="color-picker">
  <Tooltip content="브랜드의 주요 색상">
    <label>Primary</label>
  </Tooltip>
  <input type="text" placeholder="#RRGGBB" />
  <Tooltip content="이 색상이 버튼, 링크 등에 적용됩니다">
    <div className="preview" />
  </Tooltip>
</div>
```

---

## 컴포넌트 확장

### Tooltip 컴포넌트 요구사항

```typescript
interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;      // siteStyle.guidance.tooltipDelay 기본값
  maxWidth?: string;
  children: ReactElement;
}
```

### 선택적: GuidedTour 컴포넌트

복잡한 페이지(Playground 등)에서 단계별 안내:

```typescript
interface GuidedTourProps {
  steps: Array<{
    target: string;  // CSS selector
    content: ReactNode;
    position?: TooltipPosition;
  }>;
  onComplete?: () => void;
}
```

---

## 컴포넌트 쇼케이스 패턴

### 레이아웃 구조

```
┌─────────────────────────────────────────────────────────┐
│  Button                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │                                                 │  │
│   │   [ Button ]   [ Button ]   [ Button ]          │  │
│   │                                                 │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   variant ──────────────────────────────────────────   │
│   [ ● primary   ○ secondary   ○ ghost ]                │
│                                                         │
│   size ─────────────────────────────────────────────   │
│   [ ○ sm   ● md   ○ lg ]                               │
│                                                         │
│                              [ ℹ️ 상세 ]  [ </> 코드 ]  │
└─────────────────────────────────────────────────────────┘
```

### 정보 노출 계층

| 계층 | 표시 방식 | 내용 | 예시 |
|------|-----------|------|------|
| **1. 항상 보임** | 메인 영역 | 컴포넌트 데모 + Props 조절 | 버튼 3개 + variant/size 라디오 |
| **2. 호버** | 툴팁 | 짧은 힌트 | "주요 액션에 사용" |
| **3. 클릭** | 슬라이드 패널 | 상세 가이드라인, 사용 예시 | 언제 사용하는지, DO/DON'T |
| **4. 클릭** | 모달 | 코드 스니펫, 전체 Props API | 복사 가능한 코드 블록 |

### 버튼 레이블 규칙

**중립적 텍스트 사용:**
```
[ Button ]  [ Button ]  [ Button ]
```

- 변형 구분은 **시각적 스타일**로 충분
- Props 패널에서 `variant: primary` 등 명시
- "Primary", "Submit" 같은 기능/변형명 혼용 지양

### 컴포넌트 예시

```tsx
// ComponentShowcase.tsx
function ComponentShowcase({ name, children }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="showcase">
      <h2>{name}</h2>

      {/* 1. 데모 영역 - 항상 보임 */}
      <div className="demo-area">
        {children}
      </div>

      {/* 2. Props 조절 - 항상 보임 */}
      <PropsPanel />

      {/* 3. 액션 버튼 */}
      <div className="actions">
        <button onClick={() => setShowDetail(true)}>
          ℹ️ 상세
        </button>
        <button onClick={() => setShowCode(true)}>
          {'</>'} 코드
        </button>
      </div>

      {/* 4. 슬라이드 패널 - 상세 정보 */}
      <SlidePanel open={showDetail} onClose={() => setShowDetail(false)}>
        <Guidelines />
      </SlidePanel>

      {/* 5. 모달 - 코드 */}
      <Modal open={showCode} onClose={() => setShowCode(false)}>
        <CodeSnippet />
      </Modal>
    </section>
  );
}
```

---

## 작업 항목

### 1. Site Style 설정
- [x] `config/site-style.ts` 생성
- [x] 기본값 정의 (uiDensity, guidance, defaults, layout, interaction)

### 2. Tooltip 컴포넌트
- [x] Tooltip 컴포넌트 구현
- [x] Site Style의 `tooltipDelay`, `position` 연동

### 3. 쇼케이스 컴포넌트
- [ ] `ComponentShowcase` 래퍼 컴포넌트
- [ ] `PropsPanel` 컴포넌트
- [ ] `SlidePanel` 컴포넌트 (상세 정보용)
- [ ] `CodeModal` 컴포넌트 (코드 스니펫용)

### 4. 기존 컴포넌트 적용
- [ ] ColorPicker: 인라인 설명 → 툴팁 전환
- [ ] Select, Input: 힌트 툴팁 추가
- [ ] 연구 페이지: 적절한 툴팁 배치

### 5. 레이아웃 기본값
- [x] maxContentWidth (1200px) — 연구 페이지에 적용
- [ ] 간격 스케일 적용

### 6. (선택) GuidedTour
- [ ] Playground 페이지 가이드 투어

---

## Site Style vs Theme

| 구분 | Site Style | Theme (Palette × Style) |
|------|------------|-------------------------|
| 범위 | 이 사이트만 | 범용 디자인 시스템 |
| 변경 주체 | 개발자/디자이너 | 사용자 선택 가능 |
| 예시 | "툴팁 사용", "minimal UI" | "vivid 배색", "neumorphism" |
| 저장 | 코드에 고정 | 런타임 변경 가능 |

---

## 완료 기준

- [x] `siteStyle` 설정 정의
- [x] Tooltip 컴포넌트 구현 (siteStyle.guidance.tooltipDelay 연동)
- [ ] 최소 3개 컴포넌트에 Minimal UI 패턴 적용 (ColorPicker/Input/Select 툴팁화)
- [ ] 연구 페이지에서 툴팁 가이드 동작

---

## 참고

- Site Style은 **이 사이트의 UX 철학**을 코드로 표현한 것
- 디자인 시스템 컴포넌트는 범용적으로 유지, Site Style은 사용 방식만 가이드
- 추후 다른 프로젝트에서는 다른 Site Style 적용 가능
