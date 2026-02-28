# Epic v4: 배색-스타일 레이어 분리

## 개요

배색(Color Palette)과 GUI 스타일(Visual Style)을 독립된 레이어로 분리하여 자유롭게 조합 가능한 구조로 전환한다.
디자인 연구/레퍼런스 사이트로서 각 요소를 개별적으로 학습하고 조합할 수 있는 환경을 구축한다.

---

## 현재 문제점

### 테마가 배색과 스타일을 동시에 결정

```typescript
// ❌ 현재: Neumorphism 테마가 배경색 전략까지 강제
function createNeumorphismTheme(palette) {
  return {
    colors: {
      bg: { base: palette.sub }  // 스타일이 배경색을 결정
    },
    shadows: { ... }
  };
}
```

**문제:**
- "Neumorphism + 흰색 배경" 조합 불가
- "Minimal + 컬러풀 배경" 조합 불가
- 배색 연구와 스타일 연구를 분리해서 할 수 없음

---

## 목표 아키텍처

```
┌───────────────────────────────────────────────────────────────────┐
│                          조합 시스템                                │
│          Palette × Style × Typography = Final Theme               │
└───────────────────────────────────────────────────────────────────┘
           ↑                    ↑                    ↑
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Palette Layer  │   │  Style Layer    │   │ Typography Layer│
│  (배색)          │   │  (GUI 스타일)    │   │  (타이포그래피)  │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ • 색상 정의      │   │ • 그림자 처리    │   │ • Text Styles   │
│ • 배경색 전략    │   │ • 표면 효과      │   │ • Scale 조합    │
│ • 대비 규칙      │   │ • 경계선 스타일  │   │ • Semantic 매핑 │
│                 │   │ • 상태 표현 방식 │   │                 │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ Vivid, Pastel,  │   │ Minimal,        │   │ (테마 독립)      │
│ Monochrome...   │   │ Neumorphism...  │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                       Site Style Layer                            │
│               (디자인 시스템 위에 적용되는 사이트 전용 스타일)          │
├───────────────────────────────────────────────────────────────────┤
│ • UI 스타일 선호도 (Minimal UI, 툴팁 기반 가이드)                    │
│ • 레이아웃 기본값                                                   │
│ • 인터랙션 패턴                                                     │
└───────────────────────────────────────────────────────────────────┘
```

---

## 레이어 정의

### Palette Layer (배색)

| 속성 | 설명 |
|------|------|
| `colors.primary` | 주조색 스케일 |
| `colors.secondary` | 보조색 스케일 |
| `colors.accent` | 강조색 스케일 |
| `colors.sub` | 서브/중립색 스케일 |
| `colors.bg` | 배경색 전략 (base, surface, elevated, muted) |
| `colors.text` | 텍스트 색상 |
| `colors.border` | 경계선 색상 |
| `meta.contrast` | 대비 규칙 (normal, high) |

### Style Layer (GUI 스타일)

| 속성 | 설명 |
|------|------|
| `shadows` | 그림자 스타일 (sm, md, lg, active) |
| `surface` | 표면 처리 (flat, raised, inset) |
| `borders` | 경계선 표현 (width, style) |
| `states` | 상태 표현 방식 (hover, active, focus) |
| `effects` | 특수 효과 (blur, glow 등) |

### Typography Layer (타이포그래피)

| 속성 | 설명 |
|------|------|
| `textStyles` | 조합된 텍스트 스타일 (heading, body, caption 등) |
| `semantic` | 용도별 매핑 (button, input, card-title 등) |

> Typography는 테마(Palette/Style)와 **독립적**. 시스템 전체에서 일관되게 유지.

### Site Style Layer (사이트 전용)

디자인 시스템 위에 적용되는 **이 사이트만의 스타일 선호도**:

| 속성 | 설명 |
|------|------|
| `uiDensity` | UI 밀도 (minimal, comfortable, compact) |
| `guidance` | 사용자 안내 방식 (tooltip, inline, none) |
| `defaults` | 기본 선택값 (defaultPalette, defaultStyle 등) |

---

## 에픽 구성

| Epic | 제목 | 설명 | 우선순위 |
|------|------|------|----------|
| E01 | [Palette 레이어 분리](./E01-palette-layer.md) | 배색 시스템을 독립 레이어로 추출 | P0 |
| E02 | [Style 레이어 분리](./E02-style-layer.md) | GUI 스타일을 독립 레이어로 추출 | P0 |
| E03 | [조합 시스템 구축](./E03-combination-system.md) | Palette × Style 조합 로직 | P0 |
| E04 | [연구 페이지 구축](./E04-research-pages.md) | 배색/스타일/조합 확인 페이지 | P1 |
| E05 | [Typography 레이어](./E05-typography-layer.md) | Text Styles 조합 및 Semantic 매핑 | P1 |
| E06 | [Site Style 정의](./E06-site-style.md) | 사이트 전용 스타일 선호도 | P1 |

---

## 완료 기준

- [ ] Palette와 Style이 독립적으로 정의됨
- [ ] 어떤 Palette든 어떤 Style과 조합 가능
- [ ] 기존 Minimal, Neumorphism 테마가 새 구조로 동작
- [ ] 연구 페이지에서 개별 확인 및 조합 테스트 가능
- [ ] Typography Text Styles 정의 및 Semantic 매핑 완료
- [ ] Site Style 적용 (Minimal UI + Tooltip 가이드)
- [ ] 빌드 통과

---

## 기술 제약 (유지)

- 외부 라이브러리 최소화
- CSS 변수 기반 스타일링 (`var(--ds-xxx)`)
- TypeScript 타입 안전성
- Vite 기본 기능만 사용

---

## 예상 결과

### Before
```typescript
// 테마 = 배색 + 스타일 묶음
setThemeName('neumorphism');
```

### After
```typescript
// 배색과 스타일을 개별 선택
setPaletteName('vivid');
setStyleName('neumorphism');
```

---

## 참고

- [v3: 스타일 아키텍처 현대화](../v3/epic-overview.md) - CSS Modules 기반
- 배색 연구는 별도 배색 책/자료 참고
