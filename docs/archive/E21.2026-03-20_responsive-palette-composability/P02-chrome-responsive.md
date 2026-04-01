# P02: 크롬 반응형

## 목표

Header/Nav가 모바일 뷰포트에서 정상적으로 표시된다.
메뉴 항목이 깨지지 않고, 좁은 화면에서 적절한 형태(햄버거 메뉴 또는 축약 네비게이션)로 전환된다.

## 구현 상세

**접근 방법:**
- P01에서 정의한 브레이크포인트 토큰을 CSS `@media` 쿼리 기준으로 사용
- `md` 미만(768px)에서 nav 항목 숨김 또는 드로어/햄버거 형태로 전환
- Avatar, Icon 등 크롬 구성 요소도 모바일 레이아웃에 맞게 조정

**변경 파일:**
- MODIFY `src/app/components/Header/Header.tsx` — 반응형 로직 추가
- MODIFY `src/app/components/Header/Header.module.css` — 미디어 쿼리 추가
- MODIFY `src/app/components/Avatar/Avatar.module.css` — 필요 시 모바일 조정
- MODIFY `src/app/components/Icon/Icon.module.css` — 필요 시 모바일 조정

## 체크리스트

- [ ] 현재 Header/Nav 모바일 깨짐 원인 파악
- [ ] `md` 미만 브레이크포인트에서 nav 메뉴 처리 방식 결정 (숨김 / 햄버거)
- [ ] Header CSS에 미디어 쿼리 추가, 모바일 레이아웃 적용
- [ ] 480px, 768px 너비에서 크롬이 정상 표시되는지 확인
- [ ] 데스크탑(1024px+)에서 기존 레이아웃 깨지지 않는지 확인
