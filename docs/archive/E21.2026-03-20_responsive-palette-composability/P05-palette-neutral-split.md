# P05: PaletteDefinition neutral 분리

## 목표

`PaletteDefinition.colors`에서 `neutral` 필드를 제거하고, `recommendedNeutral?: NeutralPresetName` 힌트 필드로 대체한다.
`neutralPreset`이 단일 진실의 원천이 되며, 도메인 모델이 Context의 기존 의도를 따라간다.

## 구현 상세

**접근 방법:**
- `PaletteDefinition.colors`에서 `neutral?: string` 제거
- `PaletteDefinition` 루트에 `recommendedNeutral?: NeutralPresetName` 추가
- 팔레트를 compute할 때 neutral 스케일은 `neutralPreset`에서만 생성 (이미 그렇게 동작 중이라면 확인)
- 타입 변경에 따른 컴파일 오류 전체 확인 및 수정

**변경 파일:**
- MODIFY `src/domain/palettes/types.ts` — `colors.neutral` 제거, `recommendedNeutral` 추가
- MODIFY `src/domain/palettes/mapping/resolve.ts` — neutral 관련 로직 확인/조정
- MODIFY `src/domain/palettes/strategies/default-mappings.ts` — neutral 참조 확인

## 체크리스트

- [ ] `types.ts`에서 `colors.neutral` 제거, `recommendedNeutral?: NeutralPresetName` 추가
- [ ] TypeScript 컴파일 오류 전체 목록 확인
- [ ] `resolve.ts`, `default-mappings.ts`에서 `colors.neutral` 참조 제거/대체
- [ ] 팔레트 compute 결과에서 neutral 스케일이 여전히 올바르게 생성되는지 확인
- [ ] 기존 테스트 통과 확인 (`resolve.test.ts` 등)
