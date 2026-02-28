# 16. Semantic Mapping

## Overview

Neutral 스케일의 **어느 단계를 어느 시맨틱 역할에 매핑할지**를 정의하는 독립적인 축. Palette, Font, Style과 동일한 수준에서 선택·실험할 수 있다.

---

## 왜 별도 축인가

### 기존 축과의 관계

| 축 | 역할 | 예시 |
|----|------|------|
| **Palette** | 어떤 색이 있는가 | primary, neutral 스케일 값 |
| **Font** | 타이포그래피 | sans, mono |
| **Style** | 시각 표현 방식 | Minimal(드롭쉐도우, 테두리), Neumorphism(raised) |
| **Semantic Mapping** | 대비·가독성 수준 | border-default에 300 vs 400 매핑 |

Style은 "표면이 어떻게 보이는가", Semantic Mapping은 "경계·텍스트가 얼마나 구분되는가"를 결정한다. 서로 다른 차원이므로 **독립적으로 선택** 가능하다.

### 예시

- **Minimal + Current 매핑** → 기존 light-bg 전략 (border: 300, text-secondary: 700)
- **Minimal + Radix-like 매핑** → 테두리·텍스트 대비 강화 (border: 400, text-secondary: 600)
- **Minimal + High Contrast 매핑** → WCAG AA 강화 (border: 500, text-muted: 600)

---

## 일반적인 디자인 시스템 관례

### Neutral 스케일 용도 매핑 (참고)

| 시스템 | Border | Text (secondary/muted) |
|--------|--------|------------------------|
| Radix | 6–8단계 (subtle ~ strong) | 11–12단계 (low ~ high contrast) |
| Tailwind | 200–300 (border) | 400 (secondary), 600–800 (headings) |
| GitHub Primer | 7–8단계 | 9–10단계 |
| 현재 light-bg | 200–300 | 500–700 |

### 대비 요구사항 (WCAG)

- 본문 텍스트: 4.5:1 이상 (AA)
- UI 요소(테두리 등): 3:1 이상
- `#767676` on white ≈ 4.54:1 (AA 근접) — 더 밝은 회색은 가독성 저하

---

## 시맨틱 매핑 대상

Neutral 스케일 단계(50, 100, …, 900)를 다음 시맨틱 토큰에 매핑한다.

| 시맨틱 토큰 | 용도 | 현재(light-bg) |
|-------------|------|----------------|
| `border.default` | 기본 테두리, Input 경계 | neutral[300] |
| `border.subtle` | 연한 구분선, Card 테두리 | neutral[200] |
| `text.secondary` | 보조 텍스트, 섹션 라벨 | neutral[700] |
| `text.muted` | 힌트, placeholder | neutral[500] |

(추가 가능: `bg.surface`, `bg.muted` 등 배경 매핑)

---

## 매핑 프리셋 예시

| ID | label | 설명 | border.default | text.secondary |
|----|-------|------|----------------|----------------|
| `current` | Current | 기존 light-bg 전략 | 300 | 700 |
| `radix-like` | Radix-like | 테두리·텍스트 대비 강화 | 400 | 600 |
| `high-contrast` | High Contrast | WCAG AA 강화 | 500 | 700 |

---

## 적용 범위

- **Playground**: Palette × Style × Font와 함께 Semantic Mapping Select로 실험
- **향후**: 별도 페이지(Token Lab 등)에서 매핑 전용 비교·설정 가능
- **코어 전략**: `light-bg.ts` 등 기존 semantic 전략은 유지. 매핑 프리셋은 **오버레이**로 적용해 비교

---

## 구현 참고

```
getThemeVariables(palette, style)     → 기본 시맨틱 토큰
getNeutralPresetVariables(neutral)    → neutral 스케일
getSemanticMappingOverrides(scale, presetId) → 매핑 오버레이 (마지막에 적용)
```

같은 로직을 Playground와 향후 별도 페이지에서 공통으로 사용한다.
