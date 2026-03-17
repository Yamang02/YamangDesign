# P04: 랩 섹션 시스템 정의

## 목표
랩 페이지에서 반복되는 섹션 유형을 카탈로그로 정의하고,
각 유형의 구현 패턴(컴포넌트 조합)을 표준화한다.
새 랩 섹션을 추가할 때 "어떤 컴포넌트를 어떻게 쓰면 되는지"가 명확한 상태.

## 구현 상세

### 섹션 타입 카탈로그 (초안, 확정 필요)

| 타입 | 설명 | 사용 예 |
|---|---|---|
| **SelectionGrid** | 여러 preset 중 하나를 선택 | PaletteLab 브랜드 색상, FontLab 폰트 선택 |
| **ComparisonGrid** | A/B/C 시각적 비교 + 상세 패널 | StyleLab 그림자 비교, PaletteLab 시스템 색상 |
| **Inspector** | 구조화된 값 탐색 (트리+테이블) | TokenLab 토큰 인스펙터 |
| **Settings** | 값 입력/수정 폼 | DesignSettingsLab 탭 섹션들 |
| **Overview** | 요약 다이어그램/설명 | 각 랩 상단 LabOverview |

### ComparisonGrid 표준 조합 (핵심)
```tsx
// 현재: 랩마다 다름
// 목표: 이 조합만 사용
<ComparisonGridWrapper paletteVars={vars}>
  <div className={styles.comparisonGrid}>
    {items.map(item => (
      <ComparisonCard
        key={item.id}
        title={item.name}
        selected={selected?.id === item.id}
        onClick={() => setSelected(item)}
      >
        {/* 시각화 */}
      </ComparisonCard>
    ))}
  </div>
</ComparisonGridWrapper>

<DetailPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
  {/* 상세 내용 */}
</DetailPanel>
```

### 메뉴/NavItem variant 규칙
| 상황 | display |
|---|---|
| 메인 사이드바 카테고리 | 아이콘 only + tooltip |
| 사이드바 서브메뉴 | 아이콘 + 텍스트 |
| 헤더 네비 | 아이콘 + 텍스트 |
| 탭 바 | 텍스트 only (또는 아이콘 + 텍스트) |

→ NavItem에 `display: 'icon-only' | 'icon+label' | 'label-only'` prop 도입

### 탭 바 컴포넌트 추출
현재 DesignSettingsLab과 LabLayout 두 곳에 각각 탭 구현 → 공통 `TabBar` 컴포넌트 추출

### DetailPanel 내부 공통 블록
각 랩의 detail 내용이 공통 빌딩 블록을 공유하도록:
- `TokenValueRow`: 토큰 이름 + 값 한 행
- `ColorSwatchGrid`: 색상 그리드
- `MetadataTable`: key-value 테이블

## 체크리스트
- [ ] 섹션 타입 카탈로그 5가지 최종 확정
- [ ] `ComparisonGridWrapper` 컴포넌트 추출 (paletteVars 맥락 주입 담당)
- [ ] PaletteLab / StyleLab / TokenLab: ComparisonGrid 패턴 통일 적용
- [ ] `NavItem` display prop 도입 및 기존 NavItem 사용처 일괄 업데이트
- [ ] `TabBar` 컴포넌트 추출 → DesignSettingsLab + LabLayout에 적용
- [ ] DetailPanel 내부 공통 블록 컴포넌트 추출 (`TokenValueRow`, `ColorSwatchGrid`, `MetadataTable`)
- [ ] 각 랩 detail 내용 → 공통 블록 사용으로 교체
- [ ] 새 랩 추가 시 이 카탈로그만 보면 되는지 검증 (간단한 스모크 테스트)
