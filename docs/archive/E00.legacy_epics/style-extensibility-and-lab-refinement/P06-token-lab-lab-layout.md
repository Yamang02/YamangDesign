# P06: Token Lab에 LabLayout 사용

## 목표

Token Lab 페이지가 Palette Lab, Style Lab, Font Lab, Components와 동일하게 **LabLayout**을 사용하도록 하고, 에픽 원칙으로 "모든 Lab 페이지는 LabLayout 사용"을 명시한다.

## 배경

- P03에서 Lab 테마 독립성(`data-context="lab"`)을 적용했고, LabLayout이 이 컨텍스트를 제공한다.
- Token Lab은 이미 `LabLayout`으로 감싸져 있으나, 에픽 문서에는 "Components 쇼룸 그리드"만 명시되어 있었다.
- Lab 일관성을 위해 Token Lab도 LabLayout 사용을 에픽 범위에 넣고, 필요 시 TOC/제목 등 옵션을 다른 Lab과 맞춘다.

## 구현 상세

- **현황**: `TokenLab.tsx`는 이미 `<LabLayout title="Token Lab" tocItems={tocItems}>`로 렌더하고 있음.
- **할 일**:
  1. 에픽 Readme 또는 "특이점"에 **"모든 Lab 페이지(Palette, Style, Font, Token, Components)는 LabLayout 사용"**을 원칙으로 추가.
  2. Token Lab이 LabLayout을 사용 중인지 확인하고, `showToc`, `subtitle`, `navigationMode` 등이 다른 Lab과 필요 시 일관되게 설정되어 있는지 점검.

## 체크리스트

- [x] 에픽 Readme에 Lab 페이지별 LabLayout 사용 원칙 명시
- [x] TokenLab이 LabLayout으로 감싸져 있는지 확인 (이미 적용됨)
- [x] (선택) Token Lab의 LabLayout props가 다른 Lab과 일관되는지 검토
