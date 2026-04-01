# P07: PaletteLab UI — 브랜드/중립 독립 축

## 목표

PaletteLab UI에서 브랜드 팔레트와 neutral 프리셋을 명시적으로 분리된 두 선택 축으로 노출한다.
사용자가 브랜드 팔레트와 neutral을 독립적으로 조합하고 결과를 실시간으로 확인할 수 있다.

## 구현 상세

**접근 방법:**
- PaletteLab 내 팔레트 선택 영역을 "브랜드" / "중립" 두 섹션으로 분리
- 브랜드 섹션: 기존 팔레트 프리셋 선택 (primary/secondary/accent)
- 중립 섹션: NeutralPreset 독립 선택
- 선택된 팔레트에 `recommendedNeutral`이 있으면 UI에 "(추천)" 표시
- 두 선택이 조합된 최종 팔레트 미리보기를 기존 방식대로 렌더링

**변경 파일:**
- MODIFY `src/app/pages/labs/PaletteLab/PaletteLab.tsx` — 브랜드/중립 섹션 분리
- MODIFY `src/app/pages/labs/PaletteLab/PaletteLab.module.css` — 레이아웃 조정
- MODIFY (필요 시) `src/app/pages/labs/PaletteLab/ScaleSelectorPanel.tsx` — neutral 선택 패널

## 체크리스트

- [ ] PaletteLab에 브랜드/중립 선택 섹션 분리 UI 구현
- [ ] NeutralPreset 선택이 실시간으로 팔레트 미리보기에 반영되는지 확인
- [ ] `recommendedNeutral`이 있는 팔레트 선택 시 해당 값 "(추천)" 강조 표시
- [ ] 브랜드와 중립을 다양하게 조합했을 때 시각적으로 올바르게 렌더링되는지 확인
- [ ] 기존 PaletteLab 기능(스케일 뷰, 카테고리 탭 등) 정상 동작 확인
