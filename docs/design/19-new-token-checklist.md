# 신규 디자인 토큰 추가 체크리스트

DS에 **새 CSS 변수** 또는 **팔레트/프리셋 값**을 넣을 때 한 번에 훑는 목록이다. 상세 규칙은 [yamang-design-stack](../../.cursor/skills/yamang-design-stack/SKILL.md), 네이밍은 [18-token-naming-reference](./18-token-naming-reference.md), 계층은 [03-token-architecture](./03-token-architecture.md)를 본다.

## 이름·계층

- [ ] 변수명이 `--ds-{category}-…` 또는 `--ui-…` 패턴인가? (kebab-case)
- [ ] Primitive → Semantic → (컴포넌트) 흐름에 맞는가? 기존 토큰과 중복되지 않는가?

## 코드 반영

- [ ] `domain/tokens` 또는 프리셋/매핑 소스에 값이 추가되었는가?
- [ ] `ThemeProvider` / `token-set` 경로로 런타임 주입이 필요한 경우, 해당 파이프라인을 거쳤는가?

## 검증

- [ ] `npm run build` 통과
- [ ] `npm run lint` (ESLint + Stylelint + `check:literals` 포함) 정책과 충돌하지 않는가?
- [ ] 아트 전용 예외가 아니라면 [ARCHITECTURE.md](./ARCHITECTURE.md)의 Art Reference Gallery 절과 모순되지 않는가?

## 문서

- [ ] 공개 Lab/문서에 토큰이 노출되어야 하면 Token Lab 카테고리 등 관련 JSON/콘텐츠를 갱신했는가?
