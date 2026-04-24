# E32 P01 블록 원장

## 기준
- 참고: 타 어드민 레이아웃
- 원칙: antd/`.ant-*` 직접 이식 금지, Yamang 토큰+CSS Module 재구현

## 블록 인벤토리
| 블록 | 관측 위치(식별명) | 반복 사용 | Yamang 대응 | 비고 |
| --- | --- | --- | --- | --- |
| Admin 2단 레이아웃(사이드+메인) | `components/layout/AdminLayout/AdminLayout.tsx` | 높음 | 신규 구현 | `position: sticky` 사이드, 콘텐츠 패딩/최소높이 정책 필요 |
| 사이드바 메뉴(중첩/접힘) | `components/layout/Sidebar/Sidebar.tsx` | 높음 | 신규 구현 | 권한 필터 + 메뉴 열림 상태 + 접힘 UI |
| 상단 헤더(토글/유저/상태) | `components/layout/Header/Header.tsx` | 높음 | 신규 구현(기존 Header와 분리) | 현재 Yamang `Header`는 브랜딩용이라 Admin용 헤더 분리 필요 |
| 페이지 콘텐츠 캔버스 | `AdminLayout` Content 블록 | 높음 | 신규 구현 | 배경/패딩/페이지ID 보조텍스트 슬롯 |
| 검색/필터 바 | `templates/TableTemplate/TableSearchBar.tsx` | 높음 | 부분 재사용+신규 | `Input/Select/Button` 재사용, DateRange·필터 접기 확장 래퍼 신규 |
| 페이지네이션/카운트 헤더 | `templates/TableTemplate/TablePaginationHeader.tsx` | 높음 | 신규 구현 | 총건수+페이지크기+다운로드 액션 상단 바 |
| 데이터 테이블 템플릿 | `templates/TableTemplate/TableTemplate.tsx`, `templates/SimpleTableTemplate/SimpleTableTemplate.tsx` | 높음 | 신규 구현 | 정렬/행클릭/스크롤/페이지네이션 정책 통합 |
| 모달 템플릿(폼/일반) | `templates/ModalTemplate/ModalTemplate.tsx` | 중간 | 신규 구현 | Form submit·오류 메시지·ID 표시 패턴 |
| 상세/확인 모달 패턴 | `pages/**/**Modal.tsx` 다수 | 높음 | 기존 컴포넌트 조합+일부 신규 | `Input/Button/Select` 재사용, 포커스 트랩/오버레이는 신규 래퍼 |
| 권한 기반 메뉴 노출 | `Sidebar` 내 `isPageAllowed` 흐름 | 높음 | 신규 구현 | Yamang의 Context demo와 분리된 Admin 권한 컨텍스트 필요 |

## P01 분류 요약
- **기존 재사용 중심:** `Button`, `Input`, `Select`, `Badge`, `Avatar`, `Icon` (표면 스타일은 Admin 스펙으로 조정)
- **신규 구현 중심:** `AdminShellLayout`, `AdminSidebarNav`, `AdminHeaderBar`, `AdminTableTemplate`, `AdminModalTemplate`
- **보류/후속:** 고복잡도 데이터그리드 기능(가상 스크롤, 컬럼 고정 복합), 고급 DatePicker 커스텀, 차트 렌더러
