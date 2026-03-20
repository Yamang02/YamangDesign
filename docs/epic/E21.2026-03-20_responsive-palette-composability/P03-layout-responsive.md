# P03: 레이아웃 반응형

## 목표

Dashboard, Article, Landing 세 레이아웃이 뷰포트 크기에 따라 적절하게 재배치된다.
고정 그리드/폭이 좁은 화면에서 단일 컬럼으로 전환되고, 패딩/간격이 모바일에 맞게 조정된다.

## 구현 상세

**접근 방법:**
- P01 브레이크포인트 토큰 기준 미디어 쿼리 적용
- Dashboard: 3컬럼 stats 그리드 → 모바일 1컬럼
- Article: 본문 max-width + 사이드 여백 → 모바일 full-width
- Landing: 히어로/섹션 레이아웃 → 모바일 수직 스택
- `FloatingLayoutControlPanel`은 모바일에서 위치/크기 조정 필요 여부 확인

**변경 파일:**
- MODIFY `src/app/pages/layouts/LayoutDashboard.tsx`
- MODIFY `src/app/pages/layouts/LayoutArticle.tsx`
- MODIFY `src/app/pages/layouts/LayoutLanding.tsx`
- MODIFY `src/app/pages/layouts/FloatingLayoutControlPanel.module.css` — 모바일 위치 조정

## 체크리스트

- [ ] LayoutDashboard: 3컬럼 그리드 → 모바일 1컬럼 전환 확인
- [ ] LayoutArticle: 모바일 full-width, 적절한 패딩 확인
- [ ] LayoutLanding: 모바일 수직 스택 전환 확인
- [ ] FloatingLayoutControlPanel: 모바일에서 오버플로우 없이 표시되는지 확인
- [ ] 세 레이아웃 모두 480px / 768px / 1024px에서 시각적 검증
