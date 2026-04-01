---
name: yamang-design-stack
description: Use when building or reviewing YamangDesign — project-specific conventions for CSS variable tokens, component structure, path aliases, and styling policy.
---

# YamangDesign Stack

Project-specific conventions for the YamangDesign design system. These rules extend `typescript-stack` and `react-stack`, and take precedence when they conflict.

**저장소 전역 코딩·레이어·CC-05 요약:** [docs/process/CODING_CONVENTIONS.md](../../../docs/process/CODING_CONVENTIONS.md) (E26/E27, ESLint와 함께 유지).

## Commands

```bash
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # tsc -b && vite build
npm run lint             # ESLint + Stylelint + 색/크기 리터럴 스크립트 (`scripts/check-runtime-literals.js`)
npm run test             # Vitest run
npm run test:watch       # Vitest watch
npm run check:literals   # 위 리터럴 검사만 단독 실행 (lint에 포함됨)
npm run lint:css         # Stylelint만
```

**리터럴 검사:** CSS는 Stylelint(현재 규칙 세트는 최소); TS/TSX·테마 트리는 **스크립트**가 담당(문자열 리터럴 내부·`art` 경로 등은 정책대로 제외). ESLint 단독으로 동일 동작을 내기 어려워 **lint 한 줄**에 묶어 단일 진입점만 유지한다.

## Styling Policy

| Rule | Detail |
|------|--------|
| Variable prefix | `var(--ds-*)` (테마/팔레트 영향), `var(--ui-*)` (사이트 shell 고정) |
| Hardcoding policy | 컴포넌트·페이지에서 hex/rgb/named color 직접 사용 금지. 토큰/프리셋 **정의** 파일(`*presets*.ts`, `*mappings*.ts`, `uiTokens`)만 예외. **Art Reference Gallery**(`src/app/pages/art/**`)는 아래 **Art Reference Gallery** 절 |
| Hex format | **대문자** 통일 (`#FFFFFF`, `#6366F1`). 소문자 금지 |
| Styling approach | CSS Modules (`.module.css`) + CSS Variables. CSS-in-JS/Tailwind 사용하지 않음 |
| Transition | 하드코딩 금지. `var(--ds-transition-*)` recipe 사용 |

## Token Naming

```
--ds-{category}-{sub?}-{name}   (kebab-case)
```

| Category | Pattern | Example |
|----------|---------|---------|
| Colors | `--ds-color-{category}-{name}` | `--ds-color-action-primary-default` |
| Shadows | `--ds-shadow-{size}` | `--ds-shadow-md` |
| Spacing | `--ds-spacing-{scale}` | `--ds-spacing-4` |
| Typography | `--ds-text-{size}`, `--ds-font-{property}` | `--ds-text-sm` |
| Motion | `--ds-duration-{speed}`, `--ds-ease-{type}`, `--ds-transition-{name}` | `--ds-transition-interactive` |
| Focus | `--ds-focus-ring-width`, `--ds-focus-ring-offset`, `--ds-focus-ring-color` | |

### Token vs Hardcoding 판단

**토큰 사용** (하나라도 해당):
- 여러 컴포넌트에서 동일하게 사용
- 테마/다크모드 전환 시 변경됨
- 디자인 시스템 스케일(4px, 8px, …)에 속함
- 브랜드 일관성에 필요

**하드코딩 허용** (모두 해당):
- 이 컴포넌트에서만 쓰는 레이아웃 (flex, grid 구조)
- 시스템 스케일 외 고유 값 (`max-width: 800px`)
- 다른 컴포넌트와 맞출 필요 없음

## Art Reference Gallery (`src/app/pages/art/**`)

**실험 구역:** 명화·스타일 재현을 위한 페이지로, **semantic 컬러 토큰 전면 적용 대상이 아님**. 배경·액센트·질감은 HEX/rgba 등으로 자유롭게 둘 수 있다.

**앱 크롬:** `App`의 Header / `main` 래퍼 / Footer는 기존처럼 테마·DS와 맞춘다. 아트 전용으로 전역 쉘을 바꾸지 않는다.

**페이지 안 레이아웃:** `ArtShell`(챕터 사이드바 + 본문 그리드)과 본문은 **간격·폭·타이포 스케일·`--nav-height` 보정** 등에는 `var(--ds-*)` / `var(--ui-*)` / `--app-*`를 쓴다. **챕터 네비·필요 시 일부 본문**은 페이지 배경에 맞춰 **아트 전용 크롬**(예: `theme` prop, 페이지 로컬 CSS 변수)으로 색 대비를 맞춘다.

**접근성:** 장식적 배경은 완화 가능. 본문·버튼·링크·포커스는 대비·키보드 최소 기준을 유지한다.

**`npm run check:literals`:** `src/app/pages/art/` 트리는 스크립트에서 **스캔 제외**(위 정책과 정합). 그 외 `src/app/`·`src/domain/themes`는 기존대로 검사한다.

## Component Structure

```
ComponentName/
├── ComponentName.tsx           # 구현
├── ComponentName.types.ts      # Props 인터페이스
├── ComponentName.module.css    # 스타일 (var(--ds-*) 토큰 사용)
└── index.ts                    # export { ComponentName }
```

## Path Aliases

| Alias | Path | Purpose |
|-------|------|---------|
| `@domain/*` | `./src/domain/*` | 순수 비즈니스 로직 (React 없음) |
| `@app/*` | `./src/app/*` | React 컴포넌트, 페이지, hooks |
| `@shared/*` | `./src/shared/*` | 도메인 무관 유틸, 전역 스타일 |

## Dependency Direction

```
app/ → domain/ → shared/
app/ → shared/
```

- `domain/`은 `app/`을 import하지 않는다
- `shared/`는 `domain/`과 `app/`을 모른다

## File Placement

| 조건 | 위치 |
|------|------|
| React import / hook 사용 | `src/app/` |
| localStorage / fetch / 파일 I/O | `src/app/infra/` |
| palette / theme / token (React 없음) | `src/domain/` |
| 도메인 지식 없는 순수 함수 | `src/shared/utils/` |
| 전역 CSS | `src/shared/styles/` |
| 페이지별 정적 텍스트/JSON | `src/app/content/` |
| 앱 동작 설정 (라우트, 기본값) | `src/app/config/` |

## Naming — 예약어 회피

변수·함수·Props 이름으로 기술스택 예약어를 사용하지 않는다:

- **TS 키워드:** `type`, `namespace`, `declare`, `abstract`
- **React Props:** `key`, `ref`, `children`, `defaultValue`, `className`
- **React Hooks:** `state`, `effect`, `context`, `reducer`
- **DOM/HTML:** `class`, `for`, `name`, `value`, `id`, `style`
- **JS 예약어:** `default`, `export`, `import`, `module`, `target`
- **CSS Modules:** `global`, `local`, `composes`

## Naming — 의미 있는 이름

함수 파라미터·지역 변수에 단일 문자(`a`, `b`, `x`)나 역할 불명확한 이름 금지.
비교/대칭 인자: `current`/`preset`, `left`/`right`, `source`/`target` 등 역할 드러나는 이름 사용.

반복문 인덱스(`i`, `j`), 수학 관례(`n`, `e`)는 예외.

## Reference

- [docs/design/ARCHITECTURE.md](docs/design/ARCHITECTURE.md) — Art Reference Gallery 한 줄 요약 포함
- [docs/design/18-token-naming-reference.md](docs/design/18-token-naming-reference.md)
- [docs/design/17-token-3tier-reference.md](docs/design/17-token-3tier-reference.md)
- [docs/design/19-new-token-checklist.md](docs/design/19-new-token-checklist.md)

---

## Done when

Code under review follows all YamangDesign-specific conventions above, or deviations are explicitly justified.
