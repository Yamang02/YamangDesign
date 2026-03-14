# P07: Token Display 가시성·공간 개선

## 목표

ComponentDetailModal과 TokenLab 양쪽에서 디자인 토큰 값의 가시성과 공간 활용을 개선한다.

## 배경

- ComponentDetailModal의 토큰 테이블: `tokenValue` 색상이 `--ds-color-text-secondary`로 흐리고, shadow 같은 긴 값도 가독성 부족
- TokenLab의 `ComponentInspector`: 토큰 역할과 이름만 표시하고 실제 computed value가 없음
- `ColorTokenCard`: `tokenValue`가 `--ds-color-text-secondary`로 흐림

## 구현 상세

### ComponentDetailModal (`Components.module.css` / `Components.tsx`)

- `.tokenValue`: `color: --ds-color-text-secondary` → `--ds-color-text-primary`, `background: --ds-color-bg-muted`, `border-radius: radius-sm`, padding 추가하여 코드 칩 스타일 적용
- `.tokenSwatch`: 크기 16px → 20px, 보더 강화
- `.tokenGroupTitle`: `background: --ds-color-bg-muted` 추가, 좌측 accent 바 (`border-left: 2px solid --ds-color-border-focus`) 적용

### TokenLab (`TokenLab.module.css` / `TokenLab.tsx`)

- `ColorTokenCard`의 `.tokenValue`, `.tokenName`: 색상을 `--ds-color-text-primary`로, `tokenName` 폰트 크기 xs → sm
- `ComponentInspector`의 `tokenListItem`: computed value 열 추가 (우측 정렬, 코드 칩 스타일). `useCssVar` 훅 재사용

## 체크리스트

- [x] `Components.module.css` — `.tokenValue` 코드 칩 스타일, `.tokenSwatch` 크기, `.tokenGroupTitle` accent 바
- [x] `TokenLab.module.css` — `.tokenValue`, `.tokenName` 색상 수정
- [x] `TokenLab.tsx` — `ComponentInspector`에 computed value 표시 추가 (`TokenListRow` 컴포넌트)
