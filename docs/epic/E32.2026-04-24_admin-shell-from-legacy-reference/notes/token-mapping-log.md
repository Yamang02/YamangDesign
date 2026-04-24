# E32 P01 토큰 매핑 로그

## 기준
- 관측값은 참고한 타 어드민 UI의 인라인 스타일/Ant 기본 톤을 기준으로 읽는다.
- 구현 토큰은 Yamang의 `--ds-*`와 `--shell-*`를 우선 사용한다.
- 매핑 불가 항목은 신규 토큰 후보로 분리한다.

## 색상 매핑 초안
| 영역 | 관측값(예시) | Yamang 토큰 후보 | 상태 |
| --- | --- | --- | --- |
| 콘텐츠 배경 | `#fff` | `--ds-color-bg-base` 또는 `--ds-color-bg-surface` | 매핑 가능 |
| 헤더 경계선 | `1px solid ...` | `--shell-border-default`, `--ds-border-width` | 매핑 가능 |
| 헤더/사이드 액션 강조 | `#1890ff` 계열 | `--ds-color-action-primary-default` | 매핑 가능(색조 차이 허용) |
| 보조 텍스트(페이지ID) | `#bfbfbf` | `--ds-color-text-muted` | 매핑 가능 |
| 사이드 다크 배경 | `#001529` | `--shell-bg-base`(Admin 컨텍스트 재정의) | 부분 매핑 |
| 선택 메뉴 대비 텍스트 | `rgba(255,255,255,0.85)` | `--shell-text-on-action` + opacity 규칙 | 신규 규칙 후보 |

## 간격/사이즈 매핑 초안
| 영역 | 관측값(예시) | Yamang 토큰 후보 | 상태 |
| --- | --- | --- | --- |
| 헤더 높이 | `64px` | `--nav-height` | 매핑 가능 |
| 콘텐츠 패딩 | `48px` | `--ds-spacing-*` 스케일 확장 필요 | 신규 토큰 후보 |
| 사이드 로고/블록 마진 | `16px`, `32px` | `--ds-spacing-4`, `--ds-spacing-8` | 매핑 가능 |
| 메뉴 아이콘 버튼 | `40px` | `--ds-component-size-nav-item` | 매핑 가능 |
| 검색/필터 행 간격 | `8px`, `12px`, `16px` | `--ds-spacing-2/3/4` | 매핑 가능 |

## 타이포 매핑 초안
| 영역 | 관측값(예시) | Yamang 토큰 후보 | 상태 |
| --- | --- | --- | --- |
| 페이지ID 라벨 | `12px`, monospace | `--ds-text-xs` + `--ds-font-mono` | 매핑 가능 |
| 일반 본문/보조텍스트 | `12px~14px` | `--ds-text-sm`, `--ds-text-md` | 매핑 가능 |
| 역할 배지/미니 라벨 | `10px` | `--ds-text-xs` | 매핑 가능(최소 가독성 확인 필요) |

## 신규 토큰/규칙 후보
1. **Admin 콘텐츠 패딩 스텝**: `--ds-spacing-12`(48px) 또는 `--admin-content-padding` 별칭 필요.
2. **Admin 다크 사이드바 세트**: `--admin-sidebar-bg`, `--admin-sidebar-text`, `--admin-sidebar-hover`.
3. **선택/활성 상태 투명도 규칙**: `--admin-nav-selected-opacity`, `--admin-nav-hover-opacity`.
4. **표준 헤더 높이 별칭**: `--admin-header-height` (`--nav-height`와 동기화).
