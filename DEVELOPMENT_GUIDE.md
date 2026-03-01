# Development Guide

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # tsc + vite build
npm run lint     # eslint 검사
```

## Coding Rules

### Styling
- **CSS 변수만 사용**: `var(--ds-xxx)` 형식
- 하드코딩 금지: `#6366F1`, `rgba(...)` 등 직접 값 사용 불가

```typescript
// Good
backgroundColor: 'var(--ds-color-action-primary-default)'

// Bad
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
- [docs/epic/theme-hierarchy/ADDING-PRESETS.md](docs/epic/theme-hierarchy/ADDING-PRESETS.md) - 새 프리셋 추가 방법

## AI Policy
정책 원천: [ai/rules.yaml](ai/rules.yaml)

```bash
node ai/generate.js  # .claudeignore, .cursorignore 생성
```
