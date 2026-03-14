# P04: UI 컴포넌트 구현

## 개요

PaletteLab 탭/검색/시맨틱 매핑 편집을 위한 UI 컴포넌트를 구현합니다. 매핑 편집 로직은 `mapping/editor.ts` 없이 ColorUsageDiagram + ScaleSelectionModal 내부에서 처리합니다.

## 작업 항목

### 1. ThemeTabNavigation

- [x] Custom, Default, Natural 탭 구현
- [x] 빈 카테고리(Natural) 처리 (EmptyCategory와 P05 통합 시)
- [x] 선택된 탭 상태 관리

### 2. ThemeSearchBar

- [x] 검색 입력 UI
- [x] Debounce 300ms
- [x] 검색어 상태

### 3. EmptyCategory

- [x] "아직 테마가 없습니다" 메시지 표시

### 4. ColorUsageDiagram 인터랙티브 모드

- [x] 컬러 배지/스와치 클릭 가능
- [x] 클릭 시 스케일 선택 모달 트리거

### 5. ScaleSelectionModal

- [x] 스케일 목록 (primary, secondary, accent, neutral, sub)
- [x] Step 선택 UI (50~900)
- [x] Direct Color Input (#HEX) 옵션
- [x] 추천(✓) / 경고(⚠️) 아이콘 헤더에 고정
- [x] 아이콘 호버 시 툴팁

### 6. 추천 시스템

**파일:** `src/palettes/mapping/recommendations.ts` (신규)

- [x] `getScaleRecommendation(semanticToken, scale, step, bgStrategy)` 구현
- [x] `RecommendationLevel`: 'recommended' | 'warning' | 'neutral'

### 7. CSS 레이아웃 (ScaleSelectionModal)

- [x] `.scaleHeader` min-height: 32px UI 깨짐 방지
- [x] scale-icon flex-shrink: 0

### 8. 접근성

- [x] 키보드 네비게이션 (tab, Enter/Space)
- [x] ARIA 레이블 (tablist, tab, dialog, aria-labelledby)

## 의존성

- 선행: P03 (매핑 타입)
- 후행: P05 (PaletteLab 통합)

---

## 특이사항 검토 (2026-03-01)

### 1. ThemeTabNavigation 탭 범위

- **Custom**: 사용자 직접 색상 입력 UI. themeRegistry에 해당 그룹 없음. `themes: []` 또는 별도 상태.
- **Default**: `getThemesByCategory('default')` → default 프리셋들
- **Natural**: `getThemesByCategory('natural')` → 현재 빈 배열. EmptyCategory 표시

### 2. 편집 가능한 시맨틱 토큰 범위

- **편집 대상**: `SemanticMapping`에 정의된 토큰만 (bg.*, text.primary/secondary/muted/onAction, border.*)
- **편집 제외**:
  - `text.inverse`: SemanticMapping에 없음, combine.ts에서 별도 계산
  - `action-*`: scales 직접 사용, semanticMapping 범위 밖

### 3. ColorUsageDiagram 기존 구조

- 현재 `semanticMappings`에 Background, Text, Border, **Action** 4개 카테고리
- Action 카테고리 항목은 클릭 시 ScaleSelectionModal **미제공** (또는 read-only로 표시)
- bg/text/border만 인터랙티브 편집 지원

### 4. ScaleSelectionModal Direct Color

- `string | ScaleReference` 둘 다 지원
- #HEX 입력 시 `string`으로 저장, ScaleReference 선택 시 객체로 저장

### 5. 추천 시스템 (recommendations.ts)

- `getScaleRecommendation(semanticToken, scale, step, bgStrategy)` → `RecommendationLevel`
- semanticToken: `'bg.base'` | `'text.primary'` 등 SemanticMapping 키 경로
- 배경 전략별 적합한 스케일/스텝 조합 판별 (예: light 배경에 text.primary → neutral-900 권장)

### 6. Custom 탭과 PaletteLab 기존 비교 구조

- P05에서 통합. P04는 컴포넌트만 구현, PaletteLab 레이아웃 변경은 P05
- ThemeTabNavigation은 독립 컴포넌트로 export, P05에서 Layout에 배치

### 7. Icon / Tooltip

- `Icon`: check, warning 등 material/nucleo 라이브러리 확인 필요
- `Tooltip`: portal 지원, 모달 내부에서 사용 시 `portal` 권장
