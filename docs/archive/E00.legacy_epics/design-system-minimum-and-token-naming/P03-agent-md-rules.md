# P03: AGENT.md 룰 추가

## 목표

토큰 네이밍 컨벤션과 디자인 시스템 최소 구성 원칙을 AGENT.md에 반영하여, AI/에이전트가 코드 생성·수정 시 일관된 토큰 사용과 스타일 규칙을 따르도록 한다.

## 구현 상세

### 추가할 룰

1. **토큰 네이밍**
   - CSS 변수 이름은 `docs/design/` (또는 에픽 내) 토큰 네이밍 레퍼런스를 따른다.
   - `--ds-*`: 테마/팔레트 영향 토큰, `--ui-*`: 사이트 shell 고정 토큰.
   - 신규 토큰 추가 시: Global → Alias 구조와 기존 category 패턴을 유지한다.

2. **스타일 원칙 (기존 강화)**
   - 컴포넌트·페이지 스타일에서는 **반드시** `var(--ds-xxx)` 또는 `var(--ui-xxx)` 사용. hex, rgb, named color 직접 사용 금지.
   - 예외: 토큰/프리셋 **정의** 파일(예: `neutral-presets.ts`, `system-colors.ts`, 팔레트 preset, default-mappings) 내부의 원시값.

3. **참조**
   - 토큰 목록·의미: `docs/design/17-token-3tier-reference.md`
   - 토큰 네이밍 상세: P02 산출물 경로

### 수정 대상

- `AGENT.md`: “Theme Tokens” 또는 “Styling” 섹션에 위 내용을 추가하거나, “Design Tokens & Naming” 같은 새 섹션으로 삽입.
- 기존 “CSS 변수만 사용”, “하드코딩 금지” 문구와 중복되지 않도록 통합.

### 체크리스트 반영

- P01 점검 결과에서 도출한 “위반 목록”이 있다면, 룰에 “위반 시 수정 권장” 정도로 언급할 수 있음.

## 체크리스트

- [ ] AGENT.md에 토큰 네이밍 규칙 요약 추가
- [ ] AGENT.md에 hex/직접 값 금지 및 예외(정의부) 명시
- [ ] 토큰 레퍼런스 문서 링크 추가
- [ ] 기존 Styling / Theme Tokens 섹션과 중복 정리
