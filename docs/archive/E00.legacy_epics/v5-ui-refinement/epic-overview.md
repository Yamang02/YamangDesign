# Epic V5: UI Refinement

## 목표

Lab 페이지들의 UI를 정비하여 **프리셋 비교**가 용이하고, **일관성 있게 관리**되는 구조로 개선

## 핵심 변경

| 현재 | 목표 |
|------|------|
| 드롭다운으로 하나씩 선택 | 프리셋들을 **나란히 비교** |
| 하드코딩된 텍스트/라벨 | **중앙 집중 관리** |
| hr 태그로 섹션 구분 | **섹션 카드** + **사이드바 TOC** |
| DetailPanel이 전체 뷰포트 | 헤더 아래 **컨텐츠 영역에만** 표시 |

---

## 문서 목록

### 데이터/콘텐츠
- [E01: Lab 콘텐츠 중앙화](./E01-lab-content.md)
  - `lab-content.ts`: 텍스트, 라벨, 포맷터
  - `lab-presets.ts`: CSS 변수 프리셋 (inline style 오버라이드용)

### 레이아웃
- [E02: 섹션 카드 레이아웃](./E02-section-card.md)
  - LabSection → 카드 스타일 래퍼
- [E03: 사이드바 TOC](./E03-sidebar-toc.md)
  - 좌측 목차, Intersection Observer로 현재 위치 추적
- [E04: DetailPanel 위치](./E04-detail-panel.md)
  - `--nav-height` 변수로 헤더 아래 배치

### 비교 뷰
- [E05: Lab 비교 뷰](./E05-comparison-view.md)
  - ComparisonCard 컴포넌트
  - PaletteLab: 5개 프리셋 나란히
  - StyleLab: minimal vs neumorphism
  - Playground: Palette × Style 매트릭스

### 데이터 통합
- [E06: Palette 프리셋 통합](./E06-palette-preset-unification.md)
  - 헤더 ColorPicker vs PaletteLab 프리셋 불일치 해결
  - 공통 정의 파일로 통합
- [E07: Components 쇼케이스 콘텐츠](./E07-components-showcase-content.md)
  - Components 페이지 하드코딩 제거
  - `showcase-content.ts`로 중앙 관리

### 시스템 컬러
- [E08: 시스템 컬러 프리셋](./E08-system-color-presets.md)
  - Error, Warning, Success, Info 전용 컬러 정의
  - 프리셋 기반 (default, muted) - 용도별 Theme 대응
  - PaletteLab에 System Colors 섹션 추가
- [E09: 중립색상(Neutral) 분리](./E09-neutral-color-separation.md)
  - neutral 신규 추가(텍스트/테두리/배경), sub 유지(컬러풀 보조색)
  - Sub 적용 정책: 지정된 영역(특정 폰트, variant 등)에만 sub 사용

---

## 목표 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│  Navigation                                                 │
├─────────┬───────────────────────────────────────┬───────────┤
│         │                                       │           │
│   TOC   │  Lab Header                           │  Detail   │
│  ────── │                                       │  Panel    │
│  • Sec1 │  ┌─────────────────────────────────┐  │           │
│  ○ Sec2 │  │ Section Card                    │  │  (읽기    │
│  ○ Sec3 │  │                                 │  │   전용)   │
│         │  │ ┌───────┐ ┌───────┐ ┌───────┐   │  │           │
│         │  │ │Preset1│ │Preset2│ │Preset3│   │  │           │
│         │  │ └───────┘ └───────┘ └───────┘   │  │           │
│         │  │                                 │  │           │
│         │  └─────────────────────────────────┘  │           │
│         │                                       │           │
└─────────┴───────────────────────────────────────┴───────────┘
```

---

## 영향 범위

| 파일/디렉토리 | 변경 내용 |
|---------------|-----------|
| `src/constants/` | 신규 - lab-content.ts, lab-presets.ts |
| `src/layouts/LabLayout/` | TOC, 섹션 카드, ComparisonCard 추가 |
| `src/components/DetailPanel/` | 위치 수정 (top, height) |
| `src/pages/layouts/*Lab/` | 비교 뷰 + 중앙 콘텐츠 적용 |
| `src/styles/ui-variables.css` | `--nav-height` 추가 |

---

## 구현 순서

1. **E01** - 콘텐츠 중앙화 (독립 작업)
2. **E04** - DetailPanel 위치 수정 (빠른 수정)
3. **E02** - 섹션 카드 레이아웃
4. **E03** - 사이드바 TOC (E02의 id prop 활용)
5. **E05** - 비교 뷰 적용 (E01 데이터 활용)
