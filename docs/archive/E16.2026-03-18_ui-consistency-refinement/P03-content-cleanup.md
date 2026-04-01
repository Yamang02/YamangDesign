# P03: 콘텐츠 정리

## 목표
TokenLab의 불필요한 사용예시를 제거하고,
Context 라이브 프리뷰의 콘텐츠를 보강하여 프리뷰 영역이 의미 있게 채워지도록 한다.

## 구현 상세

### TokenLab 사용예시 삭제
`SysTokensSection`의 "사용 예시" 영역 제거:
- `<h3>사용 예시</h3>` + Input/Badge 컴포넌트 데모 블록 삭제
- 관련 CSS 클래스(`.sysUsageRow` 등) 정리
- 사용하지 않게 되는 import 제거

**변경 파일:**
- `src/app/pages/labs/TokenLab/TokenLab.tsx`
- `src/app/pages/labs/TokenLab/TokenLab.module.css`

### 라이브 프리뷰 콘텐츠 보강
Phase 2에서 레이아웃을 잡은 뒤, 콘텐츠 측면에서 보강:
- Shell 프리뷰: Header/Footer 사이에 실제 Shell 컴포넌트(Navigation 등) 추가 배치
- Service 프리뷰: 각 탭(Landing/Dashboard/Article) 프리뷰 콘텐츠 충분성 점검

**변경 파일:**
- `src/app/pages/context/Shell/ShellContext.tsx`
- `src/app/pages/context/Service/ServiceContext.tsx` (필요 시)

## 체크리스트
- [x] TokenLab SysTokensSection의 "사용 예시" 블록 삭제
- [x] TokenLab 관련 CSS 클래스(`.sysUsage`, `.sysUsageRow`) 및 미사용 import(`Input`, `Badge`) 정리
- [x] Shell 프리뷰에 사이드바 + 메인 콘텐츠 레이아웃 추가하여 빈 공간 해소
- [x] Service 프리뷰 각 탭 콘텐츠 충분성 점검 (이미 양호)
