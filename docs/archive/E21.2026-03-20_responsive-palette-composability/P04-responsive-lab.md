# P04: ResponsiveLab

## 목표

뷰포트 시뮬레이터 랩 페이지를 추가한다.
미리보기 컨테이너 크기를 변경하면서 실제 레이아웃(Dashboard/Article/Landing)이 어떻게 반응하는지 확인할 수 있다.

## 구현 상세

**접근 방법:**
- 기존 Lab 패턴(SpacingLab, GridLab) 참고
- 상단: 레이아웃 선택 (Dashboard / Article / Landing)
- 상단: 뷰포트 프리셋 버튼 (Mobile 375px / Tablet 768px / Desktop 1280px)
- 미리보기 영역: 선택한 너비로 고정된 컨테이너 안에 레이아웃 렌더링
- iframe 없이 CSS `width` + `overflow: hidden`으로 크기 제한
- 컨테이너 테두리에 현재 너비 표시 (px 수치)

**변경 파일:**
- CREATE `src/app/pages/labs/ResponsiveLab/ResponsiveLab.tsx`
- CREATE `src/app/pages/labs/ResponsiveLab/ResponsiveLab.module.css`
- CREATE `src/app/pages/labs/ResponsiveLab/index.ts`
- MODIFY `src/app/pages/labs/index.ts` — ResponsiveLab export 추가
- MODIFY `src/app/config/nav-categories.ts` — 랩 네비게이션에 추가

## 체크리스트

- [ ] ResponsiveLab 컴포넌트 scaffold (파일 생성, 라우트 연결)
- [ ] 레이아웃 선택 컨트롤 구현 (Dashboard / Article / Landing 전환)
- [ ] 뷰포트 프리셋 버튼 구현 (Mobile / Tablet / Desktop)
- [ ] 미리보기 컨테이너: 선택 너비로 제한, 현재 너비 수치 표시
- [ ] 세 레이아웃 모두 시뮬레이터 내에서 정상 렌더링 확인
- [ ] 네비게이션에 ResponsiveLab 항목 추가 확인
