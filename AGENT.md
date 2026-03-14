# Development Guide

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # tsc + vite build
npm run lint     # eslint 검사
```

## Coding Rules

### Naming — 기술스택 예약어 회피

변수·함수·Props 이름으로 기술스택의 예약어나 내장 식별자를 사용하지 않는다.

**금지 패턴 (예시)**

| 맥락 | 피해야 할 이름 | 이유 |
|------|--------------|------|
| TypeScript | `type`, `namespace`, `declare`, `abstract` | TS 키워드 |
| React Props | `key`, `ref`, `children`, `defaultValue`, `className` | React 내장 Props |
| React Hooks | `state`, `effect`, `context`, `reducer` | Hook 개념어 / 충돌 위험 |
| DOM / HTML | `class`, `for`, `name`, `value`, `id`, `style` | HTML 어트리뷰트 |
| JavaScript | `default`, `export`, `import`, `module`, `target` | JS 예약어 |
| CSS Modules | `global`, `local`, `composes` | CSS Modules 지시어 |

```typescript
// Bad — 예약어/내장어와 충돌
const type = 'primary';
function style(props) { ... }
const { value, name } = formData;

// Good — 의미가 명확한 도메인 이름 사용
const variant = 'primary';
function applyTokenStyle(props) { ... }
const { inputValue, fieldName } = formData;
```

> 사용 전에 MDN, TypeScript Handbook, React API 문서에서 해당 이름이 예약·내장어인지 확인한다.

### Naming — 파라미터·변수는 의미 있는 이름 사용

함수 파라미터·지역 변수에 **의미 없는 단일 문자(a, b, x, y)** 또는 **역할이 드러나지 않는 이름**을 쓰지 않는다.

**금지 패턴**

| 맥락 | 피해야 할 이름 | 이유 |
|------|----------------|------|
| 함수 파라미터 | `a`, `b`, `x`, `y`, `v`, `o` | 비교·연산 대상이 무엇인지 불명확 |
| 콜백 인자 | `a`, `b` (비교 함수 등) | 어떤 값인지 코드만으로 파악 불가 |

**권장**: 비교/대칭인 경우 `current`/`preset`, `left`/`right`, `source`/`target`, `expected`/`actual` 등 **역할이 드러나는 이름** 사용.

```typescript
// Bad
function isPaletteEqual(a: ExternalPalette, b: ExternalPalette) { ... }

// Good
function isPaletteEqual(current: ExternalPalette, preset: ExternalPalette) { ... }
```

> 반복문 인덱스(`i`, `j`), 수학/알고리즘에서 관례적인 단일 문자(`n`, `e`)는 예외로 둘 수 있다.

---

### Styling
- **CSS 변수만 사용**: `var(--ds-xxx)` 또는 `var(--ui-xxx)` 형식
- **직접 값(hex, rgb, named color) 금지** — 컴포넌트·페이지 CSS/TSX에서는 토큰만 사용
- **예외**: 토큰/프리셋 **정의** 파일(`*presets*.ts`, `*mappings*.ts`, palette preset, `uiTokens` 등) 내부의 원시값
- **Hex 표기**: hex 색상값은 **대문자**로 통일 (`#FFFFFF`, `#6366F1`). 소문자 사용 금지.

```typescript
// Good
backgroundColor: 'var(--ds-color-action-primary-default)'

// Bad (컴포넌트·스타일에서)
backgroundColor: '#6366F1'
```

### Component Structure
각 컴포넌트는 CSS Module 기반으로 구성:
```
ComponentName/
├── ComponentName.types.ts    # Props 인터페이스
├── ComponentName.module.css  # 스타일 (var(--ds-*) 토큰 사용)
├── ComponentName.tsx         # 구현
└── index.ts                  # export
```
Transition은 하드코딩하지 않고 `var(--ds-transition-*)` recipe 사용.
→ [Motion & Transition 가이드](docs/design/15-motion-and-transitions.md)

### Theme Tokens
테마별로 다른 토큰이 주입됨. 컴포넌트는 토큰만 참조:
- Colors: `--ds-color-{category}-{name}`
- Shadows: `--ds-shadow-{size}`
- Spacing: `--ds-spacing-{scale}`
- Typography: `--ds-text-{size}`, `--ds-font-{property}`
- Motion: `--ds-duration-{speed}`, `--ds-ease-{type}`, `--ds-transition-{name}`, `--ds-state-{state}-opacity`
- Focus: `--ds-focus-ring-width`, `--ds-focus-ring-offset`, `--ds-focus-ring-color`

### Design Tokens & Naming

- **접두사**: `--ds-`(테마/팔레트 영향), `--ui-`(사이트 shell 고정)
- **이름 규칙**: [Token Naming Reference](docs/design/18-token-naming-reference.md) 준수 — `--ds-{category}-{sub?-}{name}` (kebab-case)
- **신규 토큰**: Global(원시) → Alias(의미) 구조 유지, 기존 category 패턴 따르기
- **Typography**: Text Style 기반 `--ds-text-{style}-size/leading/weight` 사용 권장

### 토큰 vs 하드코딩 판단 기준

**모든 스타일을 토큰화하지 않는다.** 작업 전 아래 체크리스트로 판단:

#### ✅ 토큰 사용 (`var(--ds-*)`)

- [ ] 여러 컴포넌트에서 동일하게 사용하는가?
- [ ] 테마/다크모드 전환 시 바뀌어야 하는가?
- [ ] 디자인 시스템 스케일(4px, 8px, ...)에 속하는가?
- [ ] 브랜드 일관성에 필요한가?

→ 하나라도 해당되면 **토큰 사용**

#### ❌ 하드코딩 허용 (직접 값)

- [ ] 이 컴포넌트에서만 쓰는 레이아웃인가? (flex, grid 구조)
- [ ] 시스템 스케일이 아닌 고유 값인가? (`max-width: 800px`)
- [ ] 다른 컴포넌트와 맞출 필요가 없는가?

→ 모두 해당되면 **하드코딩 허용**

#### 예시

```css
/* Card.module.css */
.card {
  /* ✅ 토큰 - 시스템 레벨 */
  padding: var(--ds-spacing-4);
  background: var(--ds-color-bg-surface);
  transition: var(--ds-transition-interactive);

  /* ❌ 하드코딩 - 컴포넌트 전용 */
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

.iconWrapper {
  /* ❌ 하드코딩 - 이 컴포넌트만의 고유 크기 */
  width: 48px;
  height: 48px;
}
```

> 자세한 원칙은 [Architecture - 토큰화 원칙](docs/design/ARCHITECTURE.md#토큰화-원칙) 참고

## Reference
- [docs/design/ARCHITECTURE.md](docs/design/ARCHITECTURE.md) - 토큰 흐름, 테마 구조
- [docs/design/18-token-naming-reference.md](docs/design/18-token-naming-reference.md) - 토큰 CSS 변수 네이밍
- [docs/design/17-token-3tier-reference.md](docs/design/17-token-3tier-reference.md) - 3-tier 구조
- [docs/epic/theme-hierarchy/ADDING-PRESETS.md](docs/epic/theme-hierarchy/ADDING-PRESETS.md) - 새 프리셋 추가 방법

## AI Policy
정책 원천: [ai/rules.yaml](ai/rules.yaml)

```bash
node ai/generate.js  # .claudeignore, .cursorignore 생성
```
