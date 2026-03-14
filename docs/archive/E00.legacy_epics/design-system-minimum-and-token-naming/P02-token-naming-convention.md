# P02: 토큰 네이밍 컨벤션 정의

## 목표

디자인 토큰 CSS 변수 이름 규칙을 한 곳에 정의하고, 신규 토큰 추가 시와 코드/스타일 작성 시 참고할 수 있도록 문서화한다.

## 구현 상세

### 네이밍 규칙 정의 항목

1. **접두사**
   - `--ds-`: 디자인 시스템(테마/팔레트 영향) 토큰
   - `--ui-`: 사이트 shell(헤더, 설정 패널 등) 고정 토큰 — 테마 무관

2. **구조**
   - `--ds-{category}-{sub?-}{name}` (kebab-case)
   - category: `color`, `spacing`, `radius`, `border`, `text`, `font`, `duration`, `ease`, `shadow`, `size`, `z`, `state`, `transition` 등

3. **Category별 패턴**
   - **color**: `--ds-color-{scale}-{step}` (원시) / `--ds-color-{role}-{name}` (alias)
     - scale: primary, neutral, semantic scale 이름
     - role: bg, text, border, action, feedback 등
   - **spacing**: `--ds-spacing-{key}` (숫자 또는 semantic key)
   - **typography**: `--ds-text-{style}-{property}` (size, leading, weight, font), `--ds-font-{name}`
   - **motion**: `--ds-duration-{key}`, `--ds-ease-{key}`, `--ds-state-{state}-opacity`, `--ds-transition-{name}`
   - **elevation/shadow**: `--ds-elevation-{key}` (원시), `--ds-shadow-{key}` (alias)
   - **z-index**: `--ds-z-{layer}`

4. **금지/주의**
   - 컴포넌트·페이지 CSS에서 hex/rgb 직접 사용 금지 (토큰 정의부·프리셋 소스는 예외)
   - `--ds-text-xs` 등 원시만 노출하는 이름과 `--ds-text-{style}-size` 혼용 시 의미 구분 명시

### 산출물

- `docs/design/` 또는 에픽 폴더 내 **토큰 네이밍 레퍼런스** 문서
  - 위 규칙과 현재 코드베이스 예시 매핑
  - (선택) 테이블: category → 예시 변수명 → 용도

### 참고

- `src/utils/css.ts` (flattenToCSSVars, prefix `ds`, camelCase → kebab-case)
- `docs/design/17-token-3tier-reference.md`
- ThemeProvider에서 주입하는 변수 이름

## 체크리스트

- [ ] 접두사(ds / ui) 규칙 문서화
- [ ] category별 패턴 문서화
- [ ] color(bg, text, border, action, feedback) 네이밍 예시 정리
- [ ] typography(text style vs raw size) 구분 정리
- [ ] motion(duration, ease, state, transition) 네이밍 정리
- [ ] 금지 사항(hex 직접 사용 등) 명시
- [ ] 토큰 네이밍 레퍼런스 문서 저장
