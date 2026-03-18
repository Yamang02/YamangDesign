# P04: 데이터 그룹화 평가 및 개선

## 목표

각 랩에서 렌더링되는 데이터가 사용자 관점에서 충분히 그룹화되어 있는지 평가하고,
산재된 연관 정보를 같은 컨텍스트 안으로 통합한다.

## 그룹화 판단 기준

- **연관성**: 같은 개념을 설명하는 데이터는 같은 카드/섹션 안에 있어야 한다
- **완결성**: 한 항목을 이해하는 데 필요한 정보가 스크롤 없이 한 뷰에 있어야 한다
- **밀도 균형**: 너무 적은 정보는 섹션 낭비, 너무 많으면 맥락 파악이 어렵다

## 현황 평가 (P01 감사 기반 + 추가 확인 필요 항목)

### StyleLab

| 섹션 | 그룹화 상태 | 개선 방향 |
|---|---|---|
| Property Matrix | 스타일 × 속성 교차표 — 각 스타일의 전체 속성을 한눈에 볼 수 있음 | ✅ 현행 유지 |
| Shadow Comparison | 그림자 시각 비교만 담당 | ✅ 적절 |
| Component Comparison | 컴포넌트 시각 비교만 담당 | ✅ 적절 |
| StyleDetail (DetailPanel) | 설명 + 특징 목록 + Shadow/Stroke MetadataTable | ✅ 적절 |
| Overview | StyleOverviewDiagram — 스타일 시스템 개요 | ⚠️ 실제 스타일 목록과 개수가 연동되지 않음 |

**판정:** StyleLab은 그룹화 자체는 양호. P03에서 metadata.json 분리 후 자연스럽게 개선됨.

### TokenLab

| 섹션 | 그룹화 상태 | 개선 방향 |
|---|---|---|
| Shell | bg/text/border/action/shadow 카테고리 분류 | ✅ categories.json 기반 |
| DS Global | Color(그리드) + Spacing/Motion(그리드) + Typography(전체폭) | ✅ 적절 (P03 후 JSON 기반) |
| DS Alias | 역할별 그룹(`ALIAS_GROUPS`) | ✅ JSON 기반 |
| System | Error/Warning/Success/Info + 사용 예시 | ✅ 시각 예시와 데이터 연계 |
| ComponentInspector | 토큰 목록 + 라이브 프리뷰 나란히 배치 | ✅ 적절 |

**판정:** TokenLab은 그룹화 상태 양호. P02의 양식 통일 후 재평가.

### FontLab (후반부 섹션 상세 확인 필요)

확인 필요 항목:
1. Text Styles 섹션: 비교 그리드 + 개별 스타일 선택 → DetailPanel 패턴 — 연관성 높음 ✅
2. Semantic Mapping 섹션: 역할 → 텍스트 스타일 매핑 — 실제 프리뷰와 같이 보여주는가?
3. Type Scale 섹션: 크기 스케일 시각화 — 토큰 값과 함께 보여주는가?
4. Font Families 섹션: 패밀리 카드 구성 확인

**예상 개선 포인트:**
- Semantic Mapping이 단순 목록이라면 역할별 라이브 프리뷰를 추가해 그룹화 강화 가능
- Type Scale이 스케일 값만 나열된다면 실제 텍스트 크기 시각 예시와 함께 배치

## 구현 상세

이 Phase는 P01~P03 완료 후 실제 렌더링을 보면서 개선 방향을 확정한다.
현 시점에서 확정된 작업:

### FontLab 후반부 코드 감사

`FontLab.tsx` 80번 이후 섹션 구현 확인:
- `semanticMapping` 섹션의 실제 렌더링 방식
- `typeScale` 섹션의 데이터 표현 방식
- `fontFamilies` 섹션의 카드 구성

확인 후 다음 중 하나 선택:
- **현행 유지**: 그룹화 이미 적절
- **프리뷰 강화**: 수치 + 시각 예시를 같은 행/카드에 배치
- **섹션 분할/통합**: 현재 섹션 경계가 부자연스럽다면 재구성

## 감사 결론

FontLab 전체 섹션 코드 검토 결과 (P02~P03 완료 후 기준):

| 섹션 | 판정 | 이유 |
|---|---|---|
| Text Styles | ✅ 현행 유지 | LabCard(preview+label) + DetailPanel 패턴 적절 |
| Semantic Mapping | ✅ 현행 유지 | LabCard(role→style 매핑 + semanticPreview 텍스트) |
| Type Scale | ✅ 현행 유지 | "Aa" 시각 + "{key}·{size}" 라벨 — 폰트 크기 비교 최적 형태 |
| Font Families | ✅ 현행 유지 | ComparisonGrid + ComparisonCard — 기존 패턴 완전 준수 |

코드 변경 없이 완료. StyleLab·TokenLab도 P02~P03 변경 이후 그룹화 양호.

## 체크리스트

- [x] FontLab 후반부(80행~) 섹션 코드 상세 감사
- [x] Semantic Mapping 섹션 그룹화 평가 → 현행 유지
- [x] Type Scale 섹션 그룹화 평가 → 현행 유지
- [x] Font Families 섹션 그룹화 평가 → 현행 유지
- [x] 개선 항목 구현 (없음)
- [ ] 전체 랩 최종 시각 확인 (브라우저 직접 확인 필요)
