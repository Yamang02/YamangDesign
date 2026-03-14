# Epic E09: Lab 콘텐츠 구조화 (데이터 분리 + 페이지 분리)

## 목표

두 축으로 워크벤치 콘텐츠 구조를 정비한다.

1. **데이터 분리**: 각 랩(Style / Token / Font)의 오버뷰·카테고리·설명 등 **콘텐츠를 코드에서 분리**하여 전용 디렉토리에서 **JSON**으로 관리한다. 단일 소스로 추가·수정 시 오버뷰와 본문이 자동 반영되도록 한다.
2. **페이지 분리**: 모달에 갇혀 있던 **프리셋 설정**과 **시맨틱 토큰 매핑**을 전용 페이지로 분리하고, `GlobalSettingsModal`을 제거한다.

## 배경 / 맥락

- 현재 Style / Token / Font 랩의 오버뷰·테이블 카테고리·설명 문구는 컴포넌트 내 **하드코딩 상수**로만 존재한다.
- 컬러셋·토큰·스타일·타이포 항목을 추가·변경할 때마다 **여러 파일을 수동 수정**해야 하며, 오버뷰와 본문이 어긋나기 쉽다.
- Palette Lab만 ThemeProvider 기반으로 동적이며, 나머지 랩은 **데이터 소스가 없어** 동적 반영이 불가하다.

## 특이점

### 포맷 선택

- **JSON**: 의존성 없음, Vite/TS에서 바로 import 가능. 구조가 단순하면 가독성 충분.
- **YAML**: 중첩·목록이 많은 콘텐츠에 가독성 유리. `js-yaml` 등 파서 필요 또는 Vite 플러그인.
- Phase에서 **우선 JSON**으로 구조를 잡고, 필요 시 YAML 전환 또는 병행 옵션을 둔다.

### 디렉토리 제안

```
src/content/labs/
  style-lab/
    overview.json      # styleProperties, styleVariants
  token-lab/
    overview.json      # layers + categories (Shell / DS / System)
    categories.json    # SHELL_CATEGORIES, GLOBAL_*, ALIAS_GROUPS, SYS_GROUPS
  font-lab/
    overview.json      # typographyProperties, semanticRoles, sizeScale
  palette-lab/
    (선택) labels.json # 오버뷰용 고정 라벨만, 실제 팔레트는 기존 동적 유지
```

### 데이터 주도 UI

- 랩 컴포넌트는 `import overview from '@/content/labs/style-lab/overview.json'` 등으로 **데이터를 읽어** 렌더링한다.
- 토큰 추가·스타일 추가는 **JSON 편집 한 곳**으로 반영 가능하게 한다.

## Phase 목록

### 데이터 분리
- [P01: 콘텐츠 디렉토리 구조 및 Style Lab 데이터 이전](./P01.content-dir-and-style-lab.md)
- [P02: Token Lab 콘텐츠 데이터화](./P02.token-lab-content-data.md)
- [P03: Font Lab 콘텐츠 데이터화](./P03.font-lab-content-data.md)
- [P04: (선택) YAML 지원 또는 문서화](./P04.yaml-option-docs.md)

### 페이지 분리
- [P05: StoredSettings v2 + 통합 설정 페이지 신설 + 두 모달 제거](./P05.preset-page-separation.md)
- [P06: 컴포넌트-값 매핑 탭 신설](./P06.semantic-mapping-page.md)
- [P07: 디자인 설정 페이지 전면 리뉴얼](./P07.design-settings-renewal.md)
- [P08: 디자인 페이지 정비](./P08.design-page-cleanup.md)

### 참고 문서
- [기본값 정책 (19-default-value-policy)](../../design/19-default-value-policy.md) — resolvePalette, bgStrategy, StoredSettings 초기값 요약 (P08 7.5)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [ ] P04 완료 (선택, 미진행)
- [x] P05 완료
- [x] P06 완료
- [x] P07 완료
- [x] P08 완료
