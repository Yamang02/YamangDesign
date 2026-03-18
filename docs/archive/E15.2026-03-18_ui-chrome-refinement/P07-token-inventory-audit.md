# P07: 컴포넌트 토큰 주석 감사 & Inventory 데이터 검증

## 목표

각 Shell 컴포넌트의 CSS 파일에 사용 토큰 주석 블록을 추가해 single source of truth를 확보하고,
`SHELL_INVENTORY` / `SERVICE_INVENTORY` 데이터를 실제 CSS와 대조해 정합성을 맞춘다.

## 구현 상세

**접근 방법:**
- 각 Shell 컴포넌트 CSS 파일 상단에 `/* @tokens: --token-a, --token-b */` 형태의 주석 블록 추가
- `shell-components.ts`의 `SHELL_INVENTORY` 토큰 목록을 실제 CSS 주석 기준으로 검증/수정
- `ServiceContext.tsx`의 `SERVICE_INVENTORY` 토큰 목록도 동일하게 검증

**감사 대상 컴포넌트 (Shell):**
- `Header` — `src/app/components/Header/Header.module.css`
- `HeaderNav` — `src/app/components/Header/HeaderNav.module.css`
- `HeaderNavDropdown` — `src/app/components/Header/HeaderNavDropdown.module.css`
- `Footer` — `src/app/components/Footer/Footer.module.css`

**감사 대상 컴포넌트 (Service):**
- `Button`, `Input`, `Card`, `Select`, `Badge` — 각 컴포넌트 CSS에서 사용 토큰 확인

**변경 파일:**
- 각 Shell 컴포넌트 CSS 파일 (주석 블록 추가)
- `src/app/content/context/shell-components.ts` (SHELL_INVENTORY 토큰 목록 수정)
- `src/app/pages/context/Service/ServiceContext.tsx` (SERVICE_INVENTORY 토큰 목록 수정)

## 체크리스트

- [x] Header.module.css — 사용 shell 토큰 파악 및 `@tokens` 주석 추가
- [x] HeaderNav.module.css — 사용 shell 토큰 파악 및 `@tokens` 주석 추가
- [x] HeaderNavDropdown.module.css — 사용 shell 토큰 파악 및 `@tokens` 주석 추가
- [x] Footer.module.css — 사용 shell 토큰 파악 및 `@tokens` 주석 추가
- [x] SHELL_INVENTORY 토큰 목록이 CSS 주석과 일치하는지 대조 및 수정
- [x] Service 컴포넌트(Button/Input/Card/Select/Badge) DS 토큰 확인
- [x] SERVICE_INVENTORY 토큰 목록 검증 및 수정
