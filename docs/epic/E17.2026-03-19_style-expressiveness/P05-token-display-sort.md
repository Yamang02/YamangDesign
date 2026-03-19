# P05: 토큰 표시·정렬 UX 개선

## 목표

토큰 목록의 카테고리 그룹핑, 정렬 옵션, 검색, 사조 간 값 차이(diff) 하이라이트를 추가하여, 토큰 구조를 직관적으로 파악하고 사조 간 차이를 즉시 식별할 수 있게 한다.

## 구현 상세

### 현재 토큰 표시 구조

`TokenSection` 컴포넌트가 `{ token, label }[]`를 받아 카테고리(color, spacing, typography, size, shadow, other)로 자동 분류한다. 값은 DOM에서 `getComputedStyle`로 읽는다. 정렬·필터·비교 기능은 없다.

### 추가할 기능

#### 1. 정렬 옵션

TokenLab, StyleLab 등에서 토큰 목록의 정렬 기준을 선택할 수 있는 셀렉트를 추가한다.

| 정렬 기준 | 설명 |
|-----------|------|
| 이름순 (기본) | `--ds-color-bg-base` → `--ds-shadow-md` |
| 카테고리순 | color 그룹 → spacing 그룹 → shadow 그룹 |
| 값 유형순 | hex 컬러 → px 단위 → ms 단위 → 기타 |

#### 2. 검색·필터

토큰 목록 상단에 텍스트 입력으로 토큰 이름·값을 필터한다.

```
[🔍 radius ] → --ds-radius-sm, --ds-radius-md, --ds-radius-lg, ...
[🔍 #FF    ] → --ds-color-primary-500: #FF6B6B, ...
```

#### 3. 사조 간 Diff 하이라이트

StyleLab에서 "기준 사조"를 선택하면, 다른 사조와 값이 다른 토큰에 시각적 하이라이트를 표시한다.

```typescript
interface TokenDiff {
  token: string;           // --ds-radius-md
  baseValue: string;       // 8px (minimal)
  compareValue: string;    // 0 (brutalism)
  isDifferent: boolean;
}

function computeTokenDiff(
  baseVars: Record<string, string>,
  compareVars: Record<string, string>
): TokenDiff[] {
  return Object.keys(baseVars).map(token => ({
    token,
    baseValue: baseVars[token],
    compareValue: compareVars[token] ?? '(없음)',
    isDifferent: baseVars[token] !== compareVars[token],
  }));
}
```

차이가 있는 토큰은 배경색 하이라이트 또는 "변경됨" 뱃지로 표시한다.

#### 4. 카테고리 접기/펼치기

토큰 수가 많아질수록 전체 목록이 길어진다. 카테고리 헤더를 클릭하면 해당 그룹을 접거나 펼 수 있게 한다.

### 변경 파일

- `src/app/components/TokenSection/TokenSection.tsx` — 정렬·필터·접기/펼치기 로직 추가
- `src/app/components/TokenSection/TokenSection.module.css` — diff 하이라이트 스타일, 접기 애니메이션
- `src/app/components/TokenSection/TokenSection.types.ts` — 정렬·필터 관련 props 추가
- `src/app/pages/labs/StyleLab/` — Diff 모드 UI 통합 (기준 사조 선택 + diff 결과 표시)
- `src/app/pages/labs/TokenLab/` — 정렬·필터 UI 통합

## 체크리스트

- [ ] TokenSection에 정렬 기준 선택 UI 추가 (이름순, 카테고리순, 값 유형순)
- [ ] TokenSection에 텍스트 검색 필터 추가
- [ ] 카테고리 헤더 클릭으로 접기/펼치기 구현
- [ ] StyleLab에 사조 간 토큰 diff 기능 구현 (기준 사조 선택 → 차이 하이라이트)
- [ ] diff 하이라이트 스타일이 현재 테마의 토큰을 사용하는지 확인 (하드코딩 금지)
- [ ] 토큰 100개 이상 표시 시 성능 문제 없는지 확인
