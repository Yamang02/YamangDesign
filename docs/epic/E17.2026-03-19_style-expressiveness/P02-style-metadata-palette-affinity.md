# P02: 스타일 메타데이터 및 팔레트 어피니티

## 목표

`StyleDefinition`에 서술적 메타데이터와 bgStrategy 호환성 정보를 추가하여, UI에서 사조 설명을 자동 표시하고 비호환 조합에 대한 경고를 제공한다.

## 구현 상세

### StyleDefinition 타입 확장

```typescript
// src/domain/styles/types.ts 에 추가
interface StyleMetadata {
  /** 사조가 유행한 시대 */
  era: string;
  /** 기원 분야 */
  origin: string;
  /** 핵심 시각적 특징 (UI 표시용) */
  characteristics: string[];
  /** 한 줄 설명 */
  description: string;
}

interface StyleDefinition {
  // 기존 필드 유지...

  /** 서술적 메타데이터 (UI 표시 및 연구 자료) */
  metadata?: StyleMetadata;

  /** 이 스타일이 의도대로 작동하는 bgStrategy */
  preferredBgStrategies?: BgStrategy[];

  /** 이 bgStrategy에서는 효과가 소멸됨 (경고용) */
  incompatibleBgStrategies?: BgStrategy[];
}
```

### 사조별 메타데이터

| 사조 | era | origin | characteristics |
|------|-----|--------|----------------|
| Minimal | 2010s | digital product design | flat surfaces, subtle shadows, clean lines |
| Neumorphism | 2019- | UI concept | soft extrusion, monochrome surfaces, tactile depth |
| Brutalism | 2010s- | web design | raw aesthetic, high contrast, bold borders |
| Glassmorphism | 2020- | UI trend | frosted glass, transparency, layered depth |

### bgStrategy 호환성

| 사조 | preferred | incompatible |
|------|-----------|-------------|
| Minimal | — (제약 없음) | — |
| Neumorphism | `['colored']` | — |
| Brutalism | — (제약 없음) | — |
| Glassmorphism | `['dark', 'colored']` | `['light']` |

### PaletteDefinition 확장

```typescript
// src/domain/palettes/types.ts 에 추가
interface PaletteDefinition {
  // 기존 필드 유지...

  /** 이 팔레트가 잘 어울리는 스타일 목록 (추천용) */
  recommendedForStyles?: StyleName[];
}
```

### 경고 UI 통합

ThemeProvider 또는 Lab UI에서 현재 팔레트의 bgStrategy가 선택된 스타일의 `incompatibleBgStrategies`에 포함되면 경고 메시지를 표시한다. 조합 자체를 차단하지는 않는다.

### 변경 파일

- `src/domain/styles/types.ts` — StyleMetadata, preferredBgStrategies, incompatibleBgStrategies 타입 추가
- `src/domain/styles/presets/minimal.ts` — metadata 객체 추가
- `src/domain/styles/presets/neumorphism.ts` — metadata + preferredBgStrategies 추가
- `src/domain/styles/presets/brutalism.ts` — metadata 추가
- `src/domain/styles/presets/glassmorphism.ts` — metadata + preferred/incompatible 추가
- `src/domain/palettes/types.ts` — recommendedForStyles 필드 추가
- `src/domain/palettes/presets/` — 기존 프리셋에 recommendedForStyles 추가 (선택적)

## 체크리스트

- [ ] StyleMetadata 인터페이스를 types.ts에 정의
- [ ] StyleDefinition에 metadata, preferredBgStrategies, incompatibleBgStrategies 옵셔널 필드 추가
- [ ] 4개 스타일 프리셋에 metadata 객체 작성
- [ ] glassmorphism에 preferredBgStrategies: ['dark', 'colored'], incompatibleBgStrategies: ['light'] 설정
- [ ] neumorphism에 preferredBgStrategies: ['colored'] 설정
- [ ] PaletteDefinition에 recommendedForStyles 옵셔널 필드 추가
- [ ] 타입 에러 없이 빌드 성공 확인
