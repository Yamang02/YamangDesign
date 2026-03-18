# P03: 동적 섹션 구조 점검 및 보완

## 목표

새로운 요소(스타일 프리셋, 토큰 카테고리, 텍스트 스타일 등)가 추가될 때,
Overview와 각 섹션이 코드 수정 없이 자동으로 반영되는 구조인지 점검하고
미달 항목을 보완한다.

## 현황 분석 (P01 기준)

### StyleLab 동적 구조 미달

**문제 1: `STYLE_METADATA` 하드코딩**
- 현재: StyleLab.tsx 상단에 `const STYLE_METADATA: Partial<Record<StyleName, ...>>` 로 4개 스타일 설명 하드코딩
- 새 스타일 프리셋 추가 시 이 파일을 직접 수정해야 함
- 해결: `src/app/content/labs/style-lab/metadata.json`으로 분리

**문제 2: `tocItems` 하드코딩**
- 현재: 4개 섹션이 고정 배열로 정의됨
- Property Matrix / Shadow Comparison / Component Comparison은 `comparisonPresets.styles` 기반이므로
  새 스타일이 추가되면 비교 섹션은 자동 반영되지만 ToC 항목은 수동 추가 필요
- 우선 현행 유지 (섹션 구조 변경이 없으면 ToC도 변경 없음)

### TokenLab 동적 구조 평가

**문제 1: `tocItems` 하드코딩 (트리)**
- Shell / DS > Global > Alias / System / Component Inspector 5개 고정
- 레이어 구조 자체가 변하지 않으면 ToC도 변하지 않으므로 현행 유지
- 단, Shell 내 카테고리 추가는 `categories.json` 수정만으로 본문 자동 반영 ✅

**문제 2: DS Global 하위 그룹 구조 고정**
- 현재: GlobalSection은 Color / Spacing / Motion / Typography 4개를 컴포넌트 내 직접 나열
- `categories.json`에 `globalColorTokens`, `globalSpacingTokens`, `globalTypographyTokens`, `globalMotionTokens` 4개 배열은 있음
- 그룹 이름과 표시 순서가 컴포넌트에 하드코딩됨
- 해결: `categories.json`에 `globalGroups: [{title, tokens, showSwatch}]` 구조 추가,
  GlobalSection이 이를 동적으로 렌더링

### FontLab 동적 구조 평가

**문제 1: `semanticRoles` 배열 하드코딩**
- 현재: FontLab.tsx에 9개 SemanticTextRole 배열 고정
- `textStyles` / `semanticText`는 도메인 데이터에서 오므로 TypeScript 레벨에서는 동기화되지만
  FontLab에서 렌더링할 역할 목록은 별도 수정 필요
- 해결: `Object.keys(semanticText)`로 동적 추출, 또는 content JSON으로 분리

**문제 2: `tocItems` 섹션 목록 고정**
- 5개 섹션 고정 — 섹션 구조가 변하지 않으면 수정 불필요, 현행 유지

## 구현 상세

### Step 1: StyleLab metadata.json 분리

**새 파일:** `src/app/content/labs/style-lab/metadata.json`
```json
{
  "minimal": {
    "description": "클린하고 모던한 스타일",
    "characteristics": ["아래 방향 드롭 섀도우", "얇은 테두리 (1px)", "플랫한 배경"]
  },
  "neumorphism": { ... },
  "brutalism": { ... },
  "glassmorphism": { ... }
}
```

**StyleLab.tsx 변경:**
```tsx
// 기존 const STYLE_METADATA 삭제
import metadataJson from '@app/content/labs/style-lab/metadata.json';
const STYLE_METADATA = metadataJson as Record<string, { description: string; characteristics: string[] }>;
```

### Step 2: TokenLab GlobalSection 동적화

**categories.json에 추가:**
```json
{
  "globalGroups": [
    { "title": "Color", "tokens": [...], "showSwatch": true },
    { "title": "Spacing", "tokens": [...], "showSwatch": false },
    { "title": "Motion", "tokens": [...], "showSwatch": false },
    { "title": "Typography", "tokens": [...], "showSwatch": false, "fullRow": true }
  ]
}
```

**GlobalSection 변경:**
```tsx
function GlobalSection({ onSelectToken }) {
  return (
    <LabSection title="Global" id="ds-global">
      <div className={styles.tokenCategoryGrid}>
        {GLOBAL_GROUPS.filter(g => !g.fullRow).map(g => (
          <div key={g.title} className={styles.tokenCategory}>
            <h3>{g.title}</h3>
            <TokenTable tokens={g.tokens} showSwatchColumn={g.showSwatch} onSelectToken={onSelectToken} />
          </div>
        ))}
      </div>
      {GLOBAL_GROUPS.filter(g => g.fullRow).map(g => (
        <div key={g.title} className={styles.tokenCategoryFullRow}>
          <h3>{g.title}</h3>
          <TokenTable tokens={g.tokens} showSwatchColumn={g.showSwatch} onSelectToken={onSelectToken} />
        </div>
      ))}
    </LabSection>
  );
}
```

### Step 3: FontLab semanticRoles 동적화

**변경:**
```tsx
// 기존 const semanticRoles 삭제
const semanticRoles = Object.keys(semanticText) as SemanticTextRole[];
```

## 변경 파일

- `src/app/content/labs/style-lab/metadata.json` (신규)
- `src/app/pages/labs/StyleLab/StyleLab.tsx`
- `src/app/content/labs/token-lab/categories.json` (globalGroups 추가)
- `src/app/pages/labs/TokenLab/TokenLab.tsx` (GlobalSection 동적화)
- `src/app/pages/labs/FontLab/FontLab.tsx` (semanticRoles 동적화)

## 체크리스트

- [x] `src/app/content/labs/style-lab/overview.json`에 Glassmorphism 추가 (별도 metadata.json 불필요)
- [x] StyleLab `STYLE_METADATA` 상수 삭제, `overview.json` styleVariants에서 동적 빌드
- [x] `categories.json`에 `globalGroups` 배열 추가
- [x] TokenLab `GlobalSection` 동적 렌더링으로 교체
- [x] 기존 개별 `GLOBAL_*_TOKENS` import 제거
- [x] FontLab `semanticRoles` → `Object.keys(semanticText)` 교체
- [ ] 각 변경 후 렌더링 동등성 확인 (브라우저 직접 확인 필요)
