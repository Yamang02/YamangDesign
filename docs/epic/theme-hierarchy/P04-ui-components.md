# P04: UI 컴포넌트 구현

## 개요

PaletteLab 탭/검색/시맨틱 매핑 편집을 위한 UI 컴포넌트를 구현합니다. 매핑 편집 로직은 `mapping/editor.ts` 없이 ColorUsageDiagram + ScaleSelectionModal 내부에서 처리합니다.

## 작업 항목

### 1. ThemeTabNavigation

- [ ] Custom, Default, Natural 탭 구현
- [ ] 빈 카테고리(Natural) 처리
- [ ] 선택된 탭 상태 관리

### 2. ThemeSearchBar

- [ ] 검색 입력 UI
- [ ] Debounce 300ms
- [ ] 검색어 상태

### 3. EmptyCategory

- [ ] "아직 테마가 없습니다" 메시지 표시

### 4. ColorUsageDiagram 인터랙티브 모드

- [ ] 컬러 배지/스와치 클릭 가능
- [ ] 클릭 시 스케일 선택 모달 트리거

### 5. ScaleSelectionModal

- [ ] 스케일 목록 (primary, secondary, accent, neutral, sub)
- [ ] Step 선택 UI (50~900)
- [ ] Direct Color Input (#HEX) 옵션
- [ ] 추천(✓) / 경고(⚠️) 아이콘 헤더에 고정
- [ ] 아이콘 호버 시 툴팁

### 6. 추천 시스템

**파일:** `src/palettes/mapping/recommendations.ts` (신규)

- [ ] `getScaleRecommendation(semanticToken, scale, step, bgStrategy)` 구현
- [ ] `RecommendationLevel`: 'recommended' | 'warning' | 'neutral'

### 7. CSS 레이아웃 (ScaleSelectionModal)

```css
.scale-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px; /* UI 깨짐 방지 */
}
.scale-icon { flex-shrink: 0; width: 16px; height: 16px; }
```

### 8. 접근성

- [ ] 키보드 네비게이션
- [ ] ARIA 레이블

## 의존성

- 선행: P03 (매핑 타입)
- 후행: P05 (PaletteLab 통합)
