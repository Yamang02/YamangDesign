# P01: 랩 UI 현황 감사

## 목표

각 랩(Style / Token / Font / DesignSettings)의 현재 UI 구현을
E13에서 확립한 섹션 시스템 기준으로 점검하고,
불일치 항목과 동적 구조 미달 항목을 목록화한다.
이 Phase는 구현 없이 감사 문서 작성만 수행한다.

## 감사 기준

1. **UI 양식 통일**: LabSection / ComparisonGrid / TokenValueRow / MetadataTable / TabBar를 적절히 사용하는가
2. **동적 구조**: 데이터(JSON/도메인) 편집만으로 ToC·Overview·본문 섹션이 자동 반영되는가
3. **데이터 그룹화**: 연관 정보가 같은 섹션·카드 안에 있는가, 컨텍스트 단절 없이 읽히는가

## 감사 대상 및 발견 사항

### StyleLab (`src/app/pages/labs/StyleLab/StyleLab.tsx`)

| 항목 | 현황 | 판정 |
|---|---|---|
| `tocItems` | 파일 내 하드코딩 const | ❌ 동적 아님 |
| Overview | `StyleOverviewDiagram` (커스텀 다이어그램, 하드코딩) | ❌ 동적 아님 |
| Property Matrix | 커스텀 `<table>` + `propertyRows` 하드코딩 | ⚠️ 독자 구현 |
| Shadow Comparison | `ComparisonGrid` + `ComparisonCard` 사용 | ✅ |
| Component Comparison | `ComparisonGrid` + `ComparisonCard` 사용 | ✅ |
| `STYLE_METADATA` (설명/특징) | 컴포넌트 파일 내 하드코딩 | ❌ 데이터 파일 없음 |
| DetailPanel | `MetadataTable` 사용 | ✅ |
| 새 스타일 프리셋 추가 시 | `tocItems` + `STYLE_METADATA` 수동 수정 필요 | ❌ |

### TokenLab (`src/app/pages/labs/TokenLab/TokenLab.tsx`)

| 항목 | 현황 | 판정 |
|---|---|---|
| `tocItems` | 파일 내 하드코딩 const (트리 구조) | ❌ 동적 아님 |
| Overview | `TokenOverviewDiagram` (커스텀 다이어그램) | ❌ 동적 아님 |
| Shell / Alias / Sys 데이터 | `categories.json`에서 로드 | ✅ 동적 |
| DS Global 서브그룹 | 컴포넌트 내 하드코딩 (`GLOBAL_COLOR_TOKENS` 등 4개 고정) | ⚠️ JSON엔 있지만 그룹 구조 고정 |
| DS 섹션 래퍼 | 커스텀 `<section>` + `<h2>` (LabSection 미사용) | ❌ 양식 불일치 |
| ComponentInspector 탭 | 커스텀 `<button>` 루프 (TabBar 미사용) | ❌ 양식 불일치 |
| 새 토큰 카테고리 추가 시 | JSON 수정으로 Shell/Alias/Sys는 반영, ToC는 수동 수정 | ⚠️ |

### FontLab (`src/app/pages/labs/FontLab/FontLab.tsx`)

| 항목 | 현황 | 판정 |
|---|---|---|
| `tocItems` | 파일 내 하드코딩 const | ❌ 동적 아님 |
| Overview | `FontOverviewDiagram` (커스텀 다이어그램) | ❌ 동적 아님 |
| `textStyleNames` | `Object.keys(textStyles)` — 도메인 데이터 반영 | ✅ 동적 |
| `semanticRoles` | 파일 내 하드코딩 배열 | ❌ 데이터 파일 없음 |
| Text Styles 섹션 | `ComparisonGrid` + `ComparisonCard` 사용 | ✅ |
| Semantic Mapping 섹션 | 구조 확인 필요 (FontLab.tsx 후반부) | — |
| Type Scale 섹션 | `fontSizeKeys`는 도메인에서, 레이아웃 확인 필요 | — |
| Detail Panel | `TokenValueRow` 사용 | ✅ |

### DesignSettingsLab (`src/app/pages/labs/DesignSettingsLab/index.tsx`)

| 항목 | 현황 | 판정 |
|---|---|---|
| TabBar | `TabBar` 컴포넌트 사용 | ✅ |
| LabLayout | 사용하나 `tocItems` 없음 (ToC 없음) | — (의도적) |
| 탭 목록 | 3개 고정 탭 (preset / semantic / component) | — (적절) |

## 체크리스트

- [x] StyleLab 감사 완료
- [x] TokenLab 감사 완료
- [x] FontLab 감사 완료 (부분 — 후반부 섹션 상세 확인 필요)
- [x] DesignSettingsLab 감사 완료
- [x] 발견 사항 정리

## 다음 Phase 입력 (우선순위)

**P02 (UI 양식 통일):**
1. TokenLab DS 섹션 래퍼 → `LabSection` 교체
2. TokenLab ComponentInspector 탭 → `TabBar` 교체

**P03 (동적 구조 점검):**
1. StyleLab `STYLE_METADATA`를 content JSON으로 분리
2. FontLab `semanticRoles` JSON화
3. 추가 시 ToC 자동 반영 방법 평가

**P04 (데이터 그룹화):**
1. FontLab Semantic Mapping / Type Scale 섹션 레이아웃 상세 확인
2. TokenLab DS Global 그룹 구조 (4개 고정 그룹 vs JSON 확장) 평가
