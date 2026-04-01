---
name: yamang-design-stack
description: Use when building or reviewing YamangDesign — project-specific conventions for CSS variable tokens, component structure, path aliases, and styling policy.
---

# YamangDesign Stack

Project-specific conventions for the YamangDesign design system. These rules extend `typescript-stack` and `react-stack`, and take precedence when they conflict.

## Commands

```bash
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # tsc -b && vite build
npm run lint             # ESLint check
npm run test             # Vitest run
npm run test:watch       # Vitest watch
npm run check:literals   # Hardcoded literal detection
```

## Styling Policy

| Rule | Detail |
|------|--------|
| Variable prefix | `var(--ds-*)` (테마/팔레트 영향), `var(--ui-*)` (사이트 shell 고정) |
| Hardcoding policy | 컴포넌트·페이지에서 hex/rgb/named color 직접 사용 금지. 토큰/프리셋 **정의** 파일(`*presets*.ts`, `*mappings*.ts`, `uiTokens`)만 예외 |
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

- [docs/design/ARCHITECTURE.md](docs/design/ARCHITECTURE.md)
- [docs/design/18-token-naming-reference.md](docs/design/18-token-naming-reference.md)
- [docs/design/17-token-3tier-reference.md](docs/design/17-token-3tier-reference.md)

---

## Done when

Code under review follows all YamangDesign-specific conventions above, or deviations are explicitly justified.
