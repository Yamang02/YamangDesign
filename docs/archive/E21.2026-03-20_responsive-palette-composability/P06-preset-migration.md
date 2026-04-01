# P06: 프리셋 마이그레이션

## 목표

모든 기존 팔레트 프리셋에서 `colors.neutral`을 제거하고, 적절한 `recommendedNeutral` 값을 지정한다.
마이그레이션 후 모든 프리셋이 P05 타입 변경을 만족하며, 기존 팔레트 렌더링이 동일하게 유지된다.

## 구현 상세

**접근 방법:**
- 각 프리셋 파일에서 `colors.neutral` 제거
- 기존 neutral 색상과 가장 가까운 `NeutralPresetName` 값을 `recommendedNeutral`로 지정
- NeutralPreset 목록이 부족하다면 이 Phase에서 추가

**대상 파일:**
- MODIFY `src/domain/palettes/presets/default/default.ts`
- MODIFY `src/domain/palettes/presets/natural/SpringCreamSoda01.ts`
- MODIFY `src/domain/palettes/presets/pop/OrientalChineseRestaurant01.ts`
- MODIFY `src/domain/palettes/presets/historical/BauhausClassic.ts`
- MODIFY `src/domain/palettes/presets/historical/ArtDecoGold.ts`
- MODIFY `src/domain/palettes/presets/historical/VaporwaveNeon.ts`
- MODIFY `src/domain/palettes/presets/historical/MemphisPop.ts`
- MODIFY `src/domain/palettes/presets/historical/SwissMonochrome.ts`
- MODIFY (필요 시) NeutralPreset 정의 파일 — 프리셋 추가

## 체크리스트

- [ ] 모든 프리셋 파일에서 `colors.neutral` 제거
- [ ] 각 프리셋에 `recommendedNeutral` 값 지정
- [ ] NeutralPreset 목록이 모든 추천값을 커버하는지 확인, 부족 시 추가
- [ ] 전체 프리셋 TypeScript 컴파일 오류 없음 확인
- [ ] PaletteLab에서 각 프리셋이 이전과 동일하게 렌더링되는지 시각적 확인
