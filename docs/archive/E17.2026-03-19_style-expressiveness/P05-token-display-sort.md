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
| 역할/시멘틱 그룹순 (기본) | `bg` → `text` → `border` → `action(Primary/Secondary/Accent)` → (필요 시) `focus/overlay` 순처럼 역할 기반 노출 순서를 고정 |
| 그룹 내 상태순 | 예: `default` → `hover` → `active`(접미사/구분 규칙이 있다면 그 규칙을 우선) |
| 이름순 (보조) | 그룹 순서를 무시하고 토큰 suffix 기반으로 알파벳 정렬(연구용 보조) |

#### 2. 검색·필터

토큰 목록 상단에 텍스트 입력으로 토큰 이름(역할/시멘틱 키워드 포함) 중심으로 필터한다.

```
[🔍 radius ] → --ds-radius-sm, --ds-radius-md, --ds-radius-lg, ...
[🔍 bg / text / border ] → 해당 역할(alias) 토큰 그룹만 필터
[🔍 action primary / hover ] → 접미사(hover) 포함 토큰만 필터
```

#### 3. 사조 간 Diff 하이라이트

StyleLab에서 "기준 사조"를 선택하면, 다른 사조와의 **값 차이**가 있는 토큰에 하이라이트를 표시하고, diff 테이블에서는 base 값과 비교 값을 함께 보여준다.

```typescript
interface TokenDiff {
  token: string;           // --ds-color-text-primary 등
  baseValue: string;       // 기준 사조 값
  compareValue: string;    // 비교 사조 값
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
    isDifferent: baseVars[token] !== (compareVars[token] ?? '(없음)'),
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

### 테스트 반영

- `src/domain/themes/e17-style-expressiveness.test.ts`에 P05 관련 계약 테스트를 추가했다.
- TokenLab `aliasGroups`의 토큰이 `buildThemeAndTokenSet(...).tokenSet.semanticVars`에서 모두 조회 가능한지 검증한다.
- 테스트로 발견된 키 정합성 이슈를 반영해 `categories.json`의 `--ds-color-bg-surfaceBrand`를 `--ds-color-bg-surface-brand`로 수정했다.

## 체크리스트

- [x] TokenSection에 정렬 기준 선택 UI 추가 (역할/시멘틱 그룹순, 그룹 내 상태순, 이름순(보조))
- [x] TokenSection에 텍스트 검색 필터 추가
- [x] 카테고리 헤더 클릭으로 접기/펼치기 구현
- [x] StyleLab에 사조 간 토큰 diff 기능 구현 (기준 사조 선택 → 차이 하이라이트)
- [x] diff 비교에 사용할 값 소스가 “어떤 스코프(기준/비교 패널)”에서 해석되는지 P06 스코프 주입 방식과 일치하는지 확인
- [x] diff 하이라이트 스타일이 현재 테마의 토큰을 사용하는지 확인 (하드코딩 금지)
- [x] 토큰 정렬은 “시멘틱/역할 메타데이터(그룹 정의)” 기반이며, 값(hex/px/ms) 파싱에 의존하지 않는지 확인
- [x] 토큰 100개 이상 표시 시 성능 문제 없는지 확인
