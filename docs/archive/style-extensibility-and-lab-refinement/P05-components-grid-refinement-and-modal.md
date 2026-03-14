# P05: Components 그리드 정제 및 상세 모달

## 목표

- 컴포넌트 그리드 카드의 **크기를 동일하게** 하고, **outlined** 스타일로 통일한다.
- **직관적인 정렬 순서**(알파벳순 또는 복잡도 순)를 적용한다.
- **Form Example**은 단일 컴포넌트가 아닌 패턴/예제이므로 그리드와 구분해 처리한다.
- 카드 클릭 시 **사이드 패널(DetailPanel) 대신**, **테마가 적용된 별도 모달**에서 상세(Variants + Tokens)를 표시한다.

## 구현 상세

### 1. 카드 크기 통일

- **ComponentCard**: 고정 높이 또는 최소 높이 + 비율 유지로 그리드 내 모든 카드가 동일한 크기를 갖도록 한다.
  - 예: `min-height: 180px`, `height: 100%`(그리드 셀 채움) 또는 `aspect-ratio` 활용.
- **프리뷰 영역**: `flex: 1` + 고정 `min-height`로 헤더 아래 공간을 균일하게 한다.
- **Components.module.css** `.showcaseGrid`: 필요 시 `grid-auto-rows: 1fr` 또는 `grid-auto-rows: minmax(200px, auto)`로 행 높이 통일.

### 2. Outlined 카드 스타일

- **ComponentCard.module.css**:
  - 카드 스타일을 **outlined**로 변경: `box-shadow` 제거 또는 `var(--ds-shadow-none)` / 최소화.
  - `border` 강조: `border-width`를 명확히(예: 1px), `border-color: var(--ds-color-border-default)`.
  - hover 시: `border-color: var(--ds-color-border-focus)` 또는 살짝 강조, shadow는 유지하지 않거나 매우 약하게.
- 기존 "elevation 1 → hover elevation 2" 대신 "outlined → hover 시 border 강조" 시맨틱으로 정리.

### 3. 정렬 순서

- **옵션 A — 복잡도 순(권장)**  
  단일/단순 컴포넌트 → 복합 컴포넌트 순으로 나열하면 학습·탐색에 유리하다.
  - 순서: **Badge → Icon → Avatar → Button → Input → Select → Card**  
  - (Form Example은 그리드와 분리하므로 이 목록에 포함하지 않음.)

- **옵션 B — 알파벳순**  
  예: Avatar → Badge → Button → Card → Icon → Input → Select.

- **구현**: `SHOWCASE_GRID_IDS`(또는 동일 역할 상수)를 위에서 선택한 순서로 정의하고, 그리드 렌더 시 이 순서를 그대로 사용한다. Form Example은 별도 블록에서만 렌더(아래 4번 참고).

### 4. Form Example 처리

- **성격**: 단일 컴포넌트 쇼케이스가 아니라, 여러 컴포넌트를 조합한 **패턴/예제**에 가깝다.
- **권장 처리**:
  - **그리드와 시각적·구조적 분리**
    - 상단: **컴포넌트 그리드** (Badge, Icon, Avatar, Button, Input, Select, Card만, 위 3번 순서 적용).
    - 하단: **"Examples" 또는 "Patterns"** 섹션으로 한 줄 또는 한 블록을 두고, 그 안에 "Form Example" 카드(또는 링크/카드) 하나만 배치.
  - Form Example 카드는 **다른 카드와 동일한 outlined + 동일 크기**로 두어 일관성을 유지하되, 라벨(예: "Example", "Pattern")을 헤더에 표시해 성격을 구분할 수 있게 한다.
- **대안**:
  - Form Example을 그리드에서 완전히 제외하고, 네비게이션/다른 페이지(예: "Examples")로만 노출.
  - 또는 그리드 마지막 한 칸에 두고, 서브타이틀만 "Form Example"로 두는 방식 유지.

- **결정**: "그리드 아래 별도 Examples 섹션 + Form Example 1개"를 기본안으로 하고, 필요 시 다른 예제(예: Dashboard Snippet)도 같은 섹션에 추가할 수 있게 한다.

### 5. 컴포넌트 상세 모달 (DetailPanel 대체)

- **요구사항**: 특정 컴포넌트 카드 클릭 시 **사이드 패널이 아닌, 테마가 적용된 별도 모달**에서 상세를 연다.
- **모달 동작**:
  - **테마 적용**: 모달 내부 콘텐츠는 현재 글로벌 테마를 그대로 사용해야 한다.  
    → 모달 콘텐츠 루트에 `data-context="preview"`를 적용해 Lab 고정값을 해제하고 글로벌 테마 변수를 쓰도록 한다.
  - **콘텐츠**: 기존 DetailPanel과 동일하게 **Variants(상단) + Tokens(하단)** 단일 스크롤 영역.
  - **접근성**: 포커스 트랩, Esc로 닫기, `aria-modal="true"`, 제목/닫기 버튼 등 모달 패턴 준수.

- **모달 스타일 (결정안)**  
  - **크기**: **C — 반응형**  
    작은 뷰포트에서는 거의 풀스크린, 큰 뷰포트에서는 큰 쇼케이스 창.  
    예: `width: min(90vw, 900px)`, `max-height: 85vh`.
  - **백드롭**: **C — 블러 + 반투명**  
    `backdrop-filter: blur(4px)` + 반투명 배경으로 “창이 떠 있다”는 느낌.
  - **틀 vs 내용**: 모달 컨테이너·헤더·닫기 버튼은 Lab 스타일 유지, **본문만** `data-context="preview"`로 테마 적용.

- **구현 방향**:
  - **새 컴포넌트**: `ComponentDetailModal` (또는 `ShowcaseModal`)  
    - Props: `open`, `onClose`, `title`, `children` (기존 `ComponentShowcase` 내용).
    - 내부 구조:  
      - 오버레이(블러 + 반투명) + 모달 컨테이너(반응형 크기).  
      - 헤더(제목 + 닫기 버튼).  
      - 스크롤 가능한 본문: `<div data-context="preview">` 안에 Variants + Tokens.
  - **Components 페이지**:  
    - 카드 클릭 시 `DetailPanel` 대신 `ComponentDetailModal`을 열고, `ComponentShowcase(id)`를 children으로 전달.
  - **DetailPanel**은 이 페이지에서는 사용하지 않도록 제거하거나, 다른 Lab(예: Style Lab, Palette Lab)에서만 계속 사용.

- **스타일**: 모달 오버레이/배경은 Lab UI이므로 `[data-context="lab"]` 스타일을 받고, **내부 콘텐츠 영역만** `data-context="preview"`로 감싸 테마 색/타이포/그림자가 적용되게 한다.

### 6. 파일/구성 변경 요약

| 대상 | 변경 내용 |
|------|-----------|
| `ComponentCard.module.css` | outlined 스타일(테두리 강조, shadow 최소화), 카드 높이 통일용 min-height 등 |
| `Components.module.css` | `.showcaseGrid` 행 높이 통일, 필요 시 `.showcaseExamples` 섹션 스타일 |
| `Components.tsx` | `SHOWCASE_GRID_IDS` 순서 변경, Form Example 그리드에서 제외 후 Examples 섹션으로 이동, DetailPanel → ComponentDetailModal 전환 |
| 신규 `ComponentDetailModal` | 테마 적용 모달, `data-context="preview"` 래퍼, Variants+Tokens 스크롤 영역 |

## 체크리스트

- [x] **카드 크기 통일**: ComponentCard + showcaseGrid에서 모든 카드 동일 높이(또는 동일 셀 크기) 적용
- [x] **Outlined 카드**: ComponentCard를 outlined 스타일로 변경(border 강조, shadow 제거/최소화)
- [x] **정렬 순서**: 복잡도 순(또는 확정한 순서)으로 `SHOWCASE_GRID_IDS` 정의 및 적용
- [x] **Form Example 분리**: 그리드 아래 "Examples" 섹션에 Form Example만 배치, 그리드 목록에서는 제외
- [x] **ComponentDetailModal** 신규 구현 (open/onClose/title/children, Esc 닫기, aria-modal, 크기 C·백드롭 C)
- [x] 모달 본문에 `data-context="preview"` 적용해 테마가 모달 안에서 적용되는지 확인
- [x] Components 페이지에서 카드 클릭 시 DetailPanel 대신 ComponentDetailModal 사용
- [x] DetailPanel은 다른 Lab(Style, Palette 등)에서만 사용, Components는 모달만 사용
