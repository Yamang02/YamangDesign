# P03: 시맨틱 매핑 시스템

## 개요

컬러 스케일 → 시맨틱 토큰 매핑을 프리셋별로 정의하고, bgStrategy 기본 매핑과 오버라이드를 지원합니다.

## 작업 항목

### 1. 타입 정의 (types.ts)

- [ ] `SemanticMapping` 인터페이스
- [ ] `ScaleReference` 인터페이스
- [ ] `PaletteDefinition.semanticMapping?: SemanticMapping` 추가

### 2. 기본 매핑 정의

**파일:** `src/palettes/strategies/default-mappings.ts` (신규)

- [ ] `defaultSemanticMappings: Record<BgStrategy, SemanticMapping>`
- [ ] light, colored, dark 각 전략별 매핑 정의

### 3. 매핑 해석 로직

**파일:** `src/palettes/mapping/resolve.ts` (신규)

- [ ] `resolveColorValue(value, scales)` - ScaleReference 또는 직접 색상 → string
- [ ] `resolveSemanticMapping(mapping, scales)` → SemanticColors
- [ ] (선택) `getMergedMapping(custom, bgStrategy)` - 부분 오버라이드 지원

### 4. createPalette 업데이트

**파일:** `src/palettes/index.ts`

- [ ] strategyFn 호출 제거. 항상 resolve 경로만 사용
- [ ] `getMergedMapping(definition.semanticMapping, definition.bgStrategy)` → `resolveSemanticMapping` 적용
- [ ] semanticMapping 없으면 defaultSemanticMappings[bgStrategy] 사용

### 5. strategy 파일 제거

- [ ] `light-bg.ts`, `colored-bg.ts`, `dark-bg.ts` 삭제
- [ ] default-mappings.ts 생성 시 기존 strategy 로직을 ScaleReference 형태로 이전

### 6. 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `palettes/index.ts` | createPalette resolve 경로로 통일, strategy import 제거 |
| `strategies/light-bg.ts` 등 | 삭제 |

### 7. 기술적 고려

- **부분 오버라이드**: lodash 미사용. `deepmerge` 패키지 또는 1~2 depth용 직접 구현
- **Fallback**: 존재하지 않는 scale/step 참조 시 경고 + 안전한 fallback
- **성능**: `resolveSemanticMapping` 메모이제이션 적용 권장

## 의존성

- 선행: P01, P02
- 후행: P04 (ScaleSelectionModal에서 매핑 편집)
