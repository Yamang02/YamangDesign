# P04: 데이터 중심 Overview 재구성

## 목표

Lab 페이지의 Overview 영역을 정적 텍스트에서 **실제 토큰·스타일 데이터에서 동적으로 추출한 정보**로 교체하여, 사조 추가·토큰 변경 시 Overview가 자동으로 갱신되도록 한다.

## 구현 상세

### 현재 Overview 구조의 문제

현재 `LabOverview` 컴포넌트는 `description` 문자열과 `items` 배열을 props로 받는다. 각 Lab 페이지에서 이 값들을 하드코딩하고 있어, 토큰이나 스타일이 변경되어도 Overview는 갱신되지 않는다.

### 접근 방법: 데이터 추출 유틸리티

각 Lab 도메인에서 "표시할 만한 요약 데이터"를 추출하는 유틸리티를 만든다. Overview 컴포넌트 자체는 현재 구조를 유지하되, props에 넘기는 데이터의 소스가 하드코딩에서 런타임 추출로 바뀐다.

### StyleLab Overview 데이터 소스

```typescript
// 도메인 데이터에서 추출
function getStyleOverviewData(styles: StyleDefinition[]): OverviewItem[] {
  return [
    { label: '등록된 사조', value: `${styles.length}개` },
    { label: '사조별 고유 토큰 수', value: styles.map(s => {
        const vars = s.createVars?.({ bgColor: '#FFFFFF' }) ?? {};
        return `${s.name}: ${Object.keys(vars).length}`;
      }).join(', ')
    },
    { label: '공통 elevation 단계', value: '6 (none, sm, md, lg, xl, inset)' },
    { label: 'Material 슬롯 사용', value: styles.filter(s => s.material).map(s => s.name).join(', ') || '없음' },
  ];
}
```

### PaletteLab Overview 데이터 소스

```typescript
function getPaletteOverviewData(registry: ThemeGroup[]): OverviewItem[] {
  const total = registry.reduce((n, g) => n + g.themes.length, 0);
  const categories = registry.map(g => `${g.category}(${g.themes.length})`).join(', ');
  const bgStrategies = new Set(registry.flatMap(g => g.themes.map(t => t.bgStrategy)));
  return [
    { label: '등록된 팔레트', value: `${total}개` },
    { label: '카테고리 분포', value: categories },
    { label: 'bgStrategy 종류', value: [...bgStrategies].join(', ') },
  ];
}
```

### TokenLab Overview 데이터 소스

```typescript
function getTokenOverviewData(tokenSet: ThemeTokenSet): OverviewItem[] {
  return [
    { label: 'Scale 변수', value: `${Object.keys(tokenSet.scaleVars).length}개` },
    { label: 'Semantic 변수', value: `${Object.keys(tokenSet.semanticVars).length}개` },
    { label: 'Style 변수', value: `${Object.keys(tokenSet.styleVars).length}개` },
    { label: 'Surface 변수', value: `${Object.keys(tokenSet.surfaceVars).length}개` },
    { label: '총 토큰 수', value: `${Object.values(tokenSet).reduce((n, v) => n + Object.keys(v).length, 0)}개` },
  ];
}
```

### StyleLab 사조 비교 매트릭스 (데이터 기반)

기존 StyleLab의 Property Matrix를 `StyleDefinition` 데이터에서 자동 생성한다.

```typescript
// 모든 스타일의 동일 토큰을 나란히 보여주는 매트릭스
function buildStyleComparisonMatrix(styles: StyleDefinition[]): MatrixRow[] {
  const bgColor = '#F0F0F0'; // 기준 배경색
  return styles.map(style => {
    const resolved = createStyle(style, bgColor);
    const vars = extractStyleVars(style, bgColor);
    return {
      name: style.name,
      shadows: resolved.shadows,
      border: resolved.border,
      vars,
    };
  });
}
```

### 변경 파일

- `src/app/pages/labs/StyleLab/` — Overview props를 데이터 추출 함수로 교체
- `src/app/pages/labs/PaletteLab/` — Overview props를 데이터 추출 함수로 교체
- `src/app/pages/labs/TokenLab/` — Overview props를 데이터 추출 함수로 교체
- `src/app/pages/labs/FontLab/` — Overview props를 데이터 추출 함수로 교체 (해당 시)
- (필요 시) 공통 유틸리티 파일 생성

### 설계 원칙

- Overview 유틸 함수는 **도메인 데이터를 직접 읽는 순수 함수**로 작성한다. API 호출이나 DOM 접근 없음.
- LabOverview 컴포넌트의 인터페이스(`description`, `items`, `children`)는 변경하지 않는다.
- 기존 다이어그램(StyleOverviewDiagram, TokenOverviewDiagram)은 유지하되, 정적 수치가 있다면 데이터 소스로 교체한다.

## 체크리스트

- [ ] StyleLab Overview를 StyleDefinition[] 데이터에서 동적으로 생성
- [ ] PaletteLab Overview를 registry 데이터에서 동적으로 생성
- [ ] TokenLab Overview를 ThemeTokenSet 데이터에서 동적으로 생성
- [ ] FontLab Overview의 정적 수치가 있다면 typography 토큰 데이터에서 추출
- [ ] StyleLab의 Property Matrix가 스타일 추가 시 자동으로 열이 늘어나는지 확인
- [ ] 새 스타일 프리셋을 임시로 추가했을 때 Overview 수치가 자동 갱신되는지 확인
- [ ] Overview 유틸 함수에서 `createVars()` 호출 시 사용하는 컨텍스트 객체 규격(예: `bgColor` hex 문자열 여부)을 P01과 일치시켜 실패 안전하게 동작하는지 확인
- [ ] Overview 계산에 필요한 재계산 범위를 제한(메모이제이션/캐싱)하고, 렌더마다 불필요한 비용이 발생하지 않는지 확인
