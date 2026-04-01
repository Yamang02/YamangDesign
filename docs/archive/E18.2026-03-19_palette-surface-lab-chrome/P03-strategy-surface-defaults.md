# P03: bgStrategy별 Surface 기본 매핑

## 목표

light / colored / dark 각 bgStrategy에서 `surfaceLow`, `surface`, `surfaceHigh`의 기본값을 정의한다. neutral 베이스에 primary tint를 비율로 혼합하여, 팔레트마다 고유한 surface 색감을 자동 파생한다.

## 구현 상세

### Tint 비율 설계

| bgStrategy | surfaceLow | surface | surfaceHigh |
|---|---|---|---|
| **light** | mix(neutral-50, primary-500, 3%) | mix(neutral-50, primary-500, 6%) | mix(neutral-100, primary-500, 10%) |
| **colored** | mix(neutral-100, primary-500, 5%) | mix(neutral-50, primary-500, 10%) | mix(neutral-200, primary-500, 15%) |
| **dark** | mix(neutral-800, primary-800, 5%) | mix(neutral-800, primary-800, 8%) | mix(neutral-700, primary-700, 12%) |

### 구현 방식

현재 `default-mappings.ts`의 `SemanticMapping`은 `ScaleReference | string` 값을 사용한다. colorMix는 두 스케일의 해석된 값이 필요하므로, surface 레벨은 **resolve 단계에서 계산**한다:

1. `default-mappings.ts`에서 surfaceLow/surfaceHigh에 **placeholder ScaleReference** 지정 (예: neutral-50)
2. `createPalette()` (또는 resolve 단계)에서 scales가 생성된 후, bgStrategy + tint 비율에 따라 colorMix로 실제 값을 계산하여 SemanticColors에 주입

또는 `SemanticMapping` 값 타입에 `MixReference`를 추가:

```ts
interface MixReference {
  base: ScaleReference;
  mix: ScaleReference;
  ratio: number;
}
```

이 방식이면 default-mappings.ts에서 선언적으로 정의 가능.

### 변경 파일

- `src/domain/palettes/types.ts` — MixReference 타입 추가 (선택)
- `src/domain/palettes/strategies/default-mappings.ts` — 3개 전략에 surfaceLow/surfaceHigh 매핑 추가
- `src/domain/palettes/mapping/resolve.ts` — MixReference 해석 로직 추가
- `src/domain/palettes/index.ts` — createPalette에서 surface 계산 통합

## 체크리스트

- [x] MixReference 타입 정의 또는 대안 방식 결정
- [x] light 전략: surfaceLow / surfaceHigh 기본 매핑 정의
- [x] colored 전략: surfaceLow / surfaceHigh 기본 매핑 정의
- [x] dark 전략: surfaceLow / surfaceHigh 기본 매핑 정의 (반전 방향)
- [x] resolve 단계에서 colorMix 실행하여 최종 hex 산출 확인
- [x] 기존 팔레트 프리셋(registry)이 surface 추가 후에도 정상 동작 확인
- [x] 다양한 primary 색상(녹색, 갈색, 파랑 등)으로 surface 결과 검증
