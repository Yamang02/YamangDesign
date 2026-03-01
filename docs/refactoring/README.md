# YamangDesign 리팩토링 분석

이 디렉토리는 YamangDesign 프로젝트의 체계적인 리팩토링을 위한 분석 문서를 포함합니다.

---

## 분석 문서

| 문서 | 내용 | 우선순위 |
|------|------|----------|
| [01-current-architecture.md](./01-current-architecture.md) | 현재 아키텍처 개요 | - |
| [02-type-system-issues.md](./02-type-system-issues.md) | 타입 시스템 문제점 | P1 |
| [03-state-management-issues.md](./03-state-management-issues.md) | 상태 관리 문제점 | P2 |
| [04-component-duplication.md](./04-component-duplication.md) | 컴포넌트 중복 분석 | P3 |
| [05-recommended-refactoring.md](./05-recommended-refactoring.md) | 권장 리팩토링 순서 | - |

---

## 우선순위 매트릭스

| 문제 | 영향도 | 작업량 | 우선순위 |
|------|--------|--------|----------|
| PaletteName 타입 중복 | 높음 | 낮음 | **P1** |
| ThemeProvider 상태 로직 중복 | 높음 | 중간 | **P2** |
| PaletteLab 상태 분산 | 중간 | 중간 | **P2** |
| 탭 컴포넌트 중복 | 중간 | 낮음 | **P3** |
| 프리셋 UI 로직 중복 | 중간 | 중간 | **P3** |
| 상수 중복 (colorKeys 등) | 낮음 | 낮음 | **P4** |

---

## 핵심 발견 사항

### 1. 타입 시스템 (P1)
- `PaletteName` 타입이 3곳에서 서로 다르게 정의됨
- `palettes/types.ts`에서는 `string`, `theme-presets.ts`에서는 Union 타입
- 타입 안전성 저하 및 IDE 지원 약화

### 2. 상태 관리 (P2)
- `ThemeProvider.tsx`에서 팔레트 해석 로직 2회 반복 (라인 110-123, 184-196)
- `PaletteLab.tsx`에서 5개 독립 상태 변수가 연관성 없이 분산
- localStorage 로직이 컴포넌트 로직과 혼재

### 3. 컴포넌트 중복 (P3)
- `PaletteCategoryTabs`와 `ThemeTabNavigation` 거의 동일
- `GlobalSettingsModal`과 `PaletteLab`에서 프리셋 UI 패턴 중복
- `ColorUsageDiagram`이 3가지 모드를 단일 컴포넌트에서 처리

### 4. 상수 중복 (P4)
- `colorKeys`, `scaleSteps` 등이 여러 파일에서 로컬 정의

---

## 권장 리팩토링 순서

```
Phase 1: 타입 시스템 통합
├── PaletteName을 theme-presets.ts 단일 소스로 통합
└── palettes/types.ts에서 PaletteName 제거

Phase 2: 상태 관리 개선
├── usePaletteResolution 훅 추출
├── useCustomSemanticPresets 훅 추출 (localStorage 분리)
└── usePaletteLabState 훅으로 상태 통합

Phase 3: 컴포넌트 단순화
├── GenericTabs<T> 공유 컴포넌트 생성
├── PresetList 공유 컴포넌트 추출
└── ColorUsageDiagram 모드 분리

Phase 4: 상수 중앙화
├── constants/palette-scales.ts 생성
└── 모든 스케일/스텝 상수 통합
```

---

## 검증 체크리스트

- [ ] TypeScript 컴파일 오류 없음 (`tsc --noEmit`)
- [ ] 기존 기능 동작 확인 (PaletteLab, GlobalSettings)
- [ ] 테마 전환 정상 동작
- [ ] localStorage 데이터 호환성 유지

---

## 참고 문서

- [ARCHITECTURE.md](../design/ARCHITECTURE.md) - 프로젝트 아키텍처 개요
- [16-semantic-mapping.md](../design/16-semantic-mapping.md) - 시맨틱 매핑 시스템
