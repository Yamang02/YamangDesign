# P01: Nav 아이콘+텍스트 일관성 정비

## 목표

HeaderNav의 모든 항목(최상위 + 드롭다운)이 아이콘+텍스트 형식으로 일관되게 표시된다.

## 구현 상세

**변경 파일:**
- `src/app/config/nav-categories.ts` — NavItem 타입에 `iconLibrary` 추가, 모든 nav 항목 아이콘 교체/추가
- `src/app/components/Header/HeaderNav.tsx` — `categoryLabels` 맵 제거, `category.tooltip` 직접 사용, `iconLibrary` 전달
- `src/app/components/Header/HeaderNavDropdown.types.ts` — `HeaderNavDropdownItem`에 `iconLibrary` 추가
- `src/app/components/Header/HeaderNavDropdown.tsx` — Icon에 `library={item.iconLibrary ?? 'material'}` 전달
- `src/app/components/Header/HeaderSettingsButton.tsx` — 레이블 "settings" → "Settings" 수정
- `src/app/components/Icon/icons/nucleo.ts` — 외부 아이콘 6개 추가

**아이콘 전략:**
- Material Icons + Nucleo Icons 혼용 유지
- Nucleo 라이브러리에 없는 아이콘은 Tabler Icons / Lucide Icons(MIT)에서 SVG path 직접 추출
- 추가된 외부 아이콘: `shell`(Lucide - 조개 나선형), `ferris-wheel`(Lucide - 관람차), `atom`(Tabler), `circles-relation`(Tabler), `browser`(Tabler), `layout-navbar`(Tabler)

**레이블 관리:**
- `NavCategory` 타입에 `label` 필드 추가하지 않음 → 기존 `tooltip` 필드를 label로 직접 사용
- `HeaderNav.tsx`의 `categoryLabels` 하드코딩 맵 제거

**최종 nav 구성:**
| 항목 | 아이콘 | 라이브러리 |
|------|--------|-----------|
| Labs | science | material |
| ↳ Palette | palette | material |
| ↳ Style | auto-awesome | material |
| ↳ Font | text-fields | material |
| ↳ Tokens | category | material |
| Build | widgets | material |
| ↳ Atoms | atom | nucleo (Tabler) |
| ↳ Molecules | circles-relation | nucleo (Tabler) |
| ↳ Organisms | auto-awesome-mosaic | material |
| Context | devices | material |
| ↳ Service | browser | nucleo (Tabler) |
| ↳ Shell | shell | nucleo (Lucide) |
| Playground | ferris-wheel | nucleo (Lucide) |

## 체크리스트

- [x] 전체 nav 항목 아이콘 렌더링 감사 (미표시 6개 발견)
- [x] 미표시 항목 icon 이름 유효한 값으로 교체
- [x] `HeaderNav.tsx`의 `categoryLabels` 맵 제거, `category.tooltip` 직접 사용
- [x] `HeaderSettingsButton` 레이블 "Settings" 대소문자 통일
- [x] `NavItem` 타입에 `iconLibrary` 추가, 드롭다운 아이콘 라이브러리 전달 체계 구성
- [x] 외부 아이콘(shell, ferris-wheel, atom, circles-relation, browser) nucleo.ts에 추가
- [x] 전체 nav 항목 렌더링 최종 확인 (사용자 확인 완료)
