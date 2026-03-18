# P05: Lab 섹션 카드 레이아웃 일관화

## 목표

Lab 페이지의 섹션 타이틀 위치와 카드 구조를 일관화한다.
TOC 계층(섹션)과 시각적 계층(카드)이 일치하도록 `LabSection`을 수정하고,
서브섹션 전용 `LabPanel` 컴포넌트를 도입해 TokenLab의 중첩 구조를 정리한다.

## 구현 상세

### 문제

`LabSection card={true}` 일 때 섹션 타이틀이 카드 박스 안에 들어가서,
TOC 레벨(섹션)과 시각 레벨(카드 헤더)이 불일치한다.
TokenLab의 GlobalSection / AliasSection은 실제로는 "패널"인데 `LabSection`을 써서
계층 구분이 더 모호해진다.

### 접근

**`LabSection` 수정:**
- `card={true}` 일 때 타이틀(`.sectionHeader`)은 카드 밖에, `.sectionCard`는 콘텐츠만 감싸도록 구조 변경
- `card={false}` 동작은 기존과 동일

```
Before: <sectionCard> <sectionHeader> <sectionContent> </sectionCard>
After:  <sectionHeader>  <sectionCard> <sectionContent> </sectionCard>
```

**`LabPanel` 신규:**
- 타이틀이 카드 헤더 안에 들어가는 컴포넌트 (h3, 패널 레벨)
- TokenLab GlobalSection / AliasSection에서 사용

```
<panelCard>
  <panelHeader> title (h3) </panelHeader>
  <panelContent> children </panelContent>
</panelCard>
```

### 변경 파일

| 파일 | 변경 유형 |
|---|---|
| `src/app/layouts/LabLayout/LabSection.tsx` | 수정 — `card={true}` 시 타이틀 카드 밖으로 |
| `src/app/layouts/LabLayout/LabLayout.module.css` | 수정 — `.sectionCard` 범위 재조정, `.panelCard/.panelHeader/.panelContent` 추가 |
| `src/app/layouts/LabLayout/LabPanel.tsx` | 신규 |
| `src/app/layouts/LabLayout/index.ts` | 수정 — `LabPanel` export 추가 |
| `src/app/pages/labs/TokenLab/sections/GlobalSection.tsx` | 수정 — `LabSection` → `LabPanel` 교체 |
| `src/app/pages/labs/TokenLab/sections/AliasSection.tsx` | 수정 — `LabSection` → `LabPanel` 교체 |

FontLab / StyleLab / PaletteLab은 `LabSection` 컴포넌트 변경으로 자동 반영. 별도 수정 불필요.

## 체크리스트

- [x] `LabSection`: `card={true}` 시 `.sectionHeader`가 `.sectionCard` 밖에 렌더링되는지 확인
- [x] `LabLayout.module.css`: `.sectionCard`가 콘텐츠 영역만 감싸도록 스타일 조정
- [x] `LabPanel.tsx` 생성 및 타이틀이 카드 헤더 안에 렌더링되는지 확인
- [x] `LabLayout/index.ts`에 `LabPanel` export 추가
- [x] `GlobalSection`, `AliasSection`이 `LabPanel`을 사용하도록 교체
- [x] 전체 Lab 페이지(TokenLab, FontLab, StyleLab, PaletteLab)에서 섹션 타이틀이 모두 카드 밖 동일 레벨에 표시되는지 시각 확인
- [x] TokenLab Design System 섹션에서 Global/Alias 패널이 서브그룹으로 자연스럽게 표시되는지 확인
