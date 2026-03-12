# 17. Token 3-Tier Architecture Reference

## Overview

대형 디자인 시스템에서 권장하는 3-tier 토큰 계층 구조를 정리한다.
KRDS(한국 디자인 시스템, www.krds.go.kr) 권고 방식을 참고하되,
이 프로젝트는 단일 애플리케이션 구조에 맞게 Global + Alias 2-tier로 실구현한다.

---

## 이상적인 3-tier 구조 (대형 라이브러리 기준)

```
Global Tokens (기초 토큰)
    원시값만 보유. 의미 없음.
    --ds-color-primary-500: #6366F1
    --ds-spacing-4: 16px

        ↓ 참조

Alias Tokens (의미 토큰)
    Global을 의미 있는 이름으로 매핑.
    --ds-color-action-primary: var(--ds-color-primary-500)
    --ds-color-bg-surface: var(--ds-color-neutral-50)

        ↓ 참조

Component Tokens (컴포넌트 토큰)
    Alias를 컴포넌트 역할로 매핑. 소비자가 오버라이드 가능.
    --ds-comp-button-primary-bg: var(--ds-color-action-primary)
    --ds-comp-button-primary-text: var(--ds-color-text-on-action)
```

CSS 사용:
```css
.button-primary {
  background-color: var(--ds-comp-button-primary-bg);
}
```

팔레트 변경 시 `--ds-color-primary-500` 한 줄만 바뀌면 전체 체인이 갱신된다.

---

## Component Token이 필요한 경우

Component Token은 디자인 시스템이 **외부 팀에 배포되는 라이브러리**일 때 가치가 있다.

| 상황 | 필요 여부 |
|------|-----------|
| 다수의 외부 팀이 소비, 컴포넌트 커스터마이징 필요 | ✅ 필요 |
| 정부·기업 전체 공통 시스템 (KRDS, Salesforce SLDS) | ✅ 필요 |
| 단일 애플리케이션 내부 시스템 | ❌ 불필요 |
| 소규모 팀 운영 제품 | ❌ 불필요 |

**Component Token이 없어도** Alias Token 레이어만으로 팔레트/테마 전환, 다크모드,
일관된 디자인 언어를 완전히 구현할 수 있다.

---

## 이 프로젝트의 선택: Global + Alias

```
Global Tokens  →  Alias Tokens  →  컴포넌트 CSS var() 직접 참조
```

### Global Tokens (src/tokens/global/)

순수한 값. 의미 없음.

```
색상 스케일:  --ds-color-primary-{50~900}
간격:         --ds-spacing-{key}
타이포:       --ds-text-{style}-{property}
테두리:       --ds-radius-{key}, --ds-border-{key}
모션:         --ds-duration-{key}, --ds-ease-{key}
엘리베이션:  --ds-elevation-{key}   (shadow 원시값)
```

### Alias Tokens (tokens/alias/로 개념 통합)

Global을 의미 있는 역할로 매핑. **팔레트/테마가 바뀌면 이 레이어만 재계산**된다.

```
배경:   --ds-color-bg-{base|surface|surfaceBrand|elevated|muted}
텍스트: --ds-color-text-{primary|secondary|muted|onAction}
테두리: --ds-color-border-{default|subtle|accent|focus}
액션:   --ds-color-action-{primary|secondary|accent}-{default|hover|active}
피드백: --ds-color-feedback-{error|warning|success|info}-{bg|text|border}
그림자: --ds-shadow-{sm|md|lg|inset}
```

---

## 참고 시스템

| 시스템 | 구조 |
|--------|------|
| KRDS (한국 디자인 시스템) | 기초 → 의미 → 컴포넌트 3-tier |
| Material Design 3 | Ref → System → Component 3-tier |
| GitHub Primer | Primitives → Functional → Component 3-tier |
| Salesforce SLDS | Global → Alias → Component 3-tier |
| Style Dictionary | 동일 3-tier를 코드로 관리하는 도구 |
