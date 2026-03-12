# Epic V7: Token System Redesign + Token Lab

> **참고 문서**: [17. Token 3-Tier Architecture Reference](../design/17-token-3tier-reference.md)

## 목표

토큰 생성 과정을 KRDS 권고 방식에 따라 **Global → Alias 2-tier**로 재설계하고,
전체 토큰 계층을 직관적으로 탐색할 수 있는 **Token Lab**을 구축한다.

---

## 현재 상태 vs 목표

| 항목 | 현재 | 목표 |
|------|------|------|
| 토큰 레이어 명칭 | `primitives/` | `global/` |
| action 토큰 위치 | `combine.ts` 내부 함수 | `SemanticMapping`으로 통합 |
| feedback 토큰 위치 | `system-colors.ts` 독립 흐름 | Alias 레이어로 편입 |
| elevation 정의 | 테마별 ts 파일에 인라인 | `global/elevation.ts` 분리 |
| Token Lab | 없음 | Global / Alias / 컴포넌트 인스펙터 |

### 문제 상세

**1. action이 SemanticMapping 밖에 존재**

`action` 색상은 `combine.ts`의 `generateActionColors()`에서 별도 생성된다.
SemanticMapping 시스템 밖에 있어 ScaleReference 기반 커스터마이징이 불가능하다.

```
SemanticMapping (현재)        SemanticMapping (목표)
├── bg.*        ✅            ├── bg.*        ✅
├── text.*      ✅            ├── text.*      ✅
├── border.*    ✅            ├── border.*    ✅
└── (없음)      ❌            ├── action.*    ✅
                              └── feedback.*  ✅
```

**2. feedback이 별도 흐름으로 주입**

`tokens/primitives/system-colors.ts`의 Error/Warning/Success/Info가
`generateSystemColorVars()`로 독립 주입되어 alias 레이어와 분리되어 있다.

**3. alias token이 global token을 var()로 참조하지 않음**

현재 ThemeProvider가 계산된 hex 값을 직접 주입한다.
이상적으로는 alias token이 `var(--ds-color-primary-500)` 형태로 global을 참조해야 한다.

---

## 스토리 목록

### 레이어 재편

- [E01: Global Layer 재편](./E01-global-layer.md)
  - `tokens/primitives/` → `tokens/global/` 완전 이전 (하위호환 제거)
  - `elevation.ts` 분리 (shadow raw values)

- [E02: Alias Layer 완성](./E02-alias-layer.md)
  - `SemanticMapping`에 `action.*` 통합 (`combine.ts` → mapping으로)
  - `feedback.*` 추가 (system-colors를 alias 레이어로 편입)
  - `elevation.*` alias 추가 (`--ds-shadow-*`)
  - `ThemeProvider` 주입 로직 업데이트

### CSS 정합성

- [E03: 컴포넌트 CSS 토큰 정합성](./E03-css-token-consistency.md)
  - 모든 컴포넌트 CSS가 alias token만 참조하는지 감사
  - 누락·불일치 토큰명 수정
  - 컴포넌트별 사용 토큰 목록 문서화

### Token Lab

- [E04: Token Lab 구축](./E04-token-lab.md)
  - `/token-lab` 페이지 신설
  - Section 1: Global Tokens — 스케일, 간격, 타이포 원시값 표
  - Section 2: Alias Tokens — semantic 역할별 색상 + 참조 스케일 표시
  - Section 3: Component Inspector — 컴포넌트 선택 시 사용 alias token 목록 + 라이브 프리뷰

---

## 토큰 체인 (목표 상태)

```
팔레트 입력
    │
    ▼
Global Tokens          -- 원시값, JS에서 계산
--ds-color-primary-500: #6366F1
--ds-spacing-4: 16px

    │ var() 참조
    ▼
Alias Tokens           -- 의미 부여, 팔레트/테마 전환 시 재계산
--ds-color-action-primary-default: var(--ds-color-primary-500)
--ds-color-bg-surface: var(--ds-color-neutral-50)
--ds-shadow-md: var(--ds-elevation-md)

    │ var() 참조
    ▼
컴포넌트 CSS
background-color: var(--ds-color-action-primary-default)
```

---

## 폴더 구조 변경 계획

```
현재                              목표
src/tokens/
├── primitives/              →   global/
│   ├── spacing.ts               ├── spacing.ts
│   ├── typography.ts            ├── typography.ts
│   ├── borders.ts               ├── borders.ts
│   ├── sizes.ts                 ├── sizes.ts
│   ├── motion.ts                ├── motion.ts
│   ├── transition.ts            ├── transition.ts
│   ├── system-colors.ts    →   │   (alias/feedback.ts로 이동)
│   └── neutral-presets.ts       └── elevation.ts  (신설)
│
├── typography/             →   (global/에 통합 또는 유지)
│   ├── text-styles.ts
│   └── semantic.ts
│
└── ui/                          ui/              (변경 없음)
```
