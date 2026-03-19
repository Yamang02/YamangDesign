# P03: 역사적 팔레트 프리셋

## 목표

디자인 사조별 역사적 대표 배색을 팔레트 프리셋으로 등록하여, 사조 연구 시 "시대적으로 정확한 배색"을 즉시 적용할 수 있게 한다.

## 구현 상세

### 카테고리 확장

현재 `ThemeCategory = 'default' | 'natural' | 'pop' | 'custom'`에 역사적 사조 카테고리를 추가한다.

```typescript
type ThemeCategory =
  | 'default' | 'natural' | 'pop' | 'custom'
  | 'historical';  // 역사적 사조 배색
```

단일 `'historical'` 카테고리로 통합하고, 프리셋의 `displayName`/`description`에서 사조명을 명시한다. 카테고리를 사조별로 세분화하면 (e.g. `'bauhaus'`, `'art-deco'`) 카테고리 수가 사조 추가에 비례해 늘어나므로 피한다.

### 추가할 프리셋

| id | displayName | 사조 | primary | secondary | accent | neutral | bgStrategy | recommendedForStyles |
|----|------------|------|---------|-----------|--------|---------|-----------|---------------------|
| `bauhaus-classic` | Bauhaus Classic | Bauhaus | #E63329 | #F5C518 | #1A3C8F | #1A1A1A | light | minimal, brutalism |
| `art-deco-gold` | Art Deco Gold | Art Deco | #C5A55A | #1B1B1B | #2A6B5E | #F5F0E1 | light | minimal |
| `swiss-mono` | Swiss Monochrome | Swiss/Int'l | #E52320 | #333333 | #FFFFFF | #666666 | light | minimal, brutalism |
| `vaporwave-neon` | Vaporwave Neon | Vaporwave | #FF71CE | #B967FF | #01CDFE | #1A1A2E | dark | glassmorphism |
| `memphis-pop` | Memphis Pop | Memphis | #FF6F61 | #FFD700 | #00CED1 | #2C2C54 | light | brutalism |

### 파일 구조

```
src/domain/palettes/presets/
├── historical/
│   ├── BauhausClassic.ts
│   ├── ArtDecoGold.ts
│   ├── SwissMonochrome.ts
│   ├── VaporwaveNeon.ts
│   ├── MemphisPop.ts
│   └── index.ts
├── registry.ts               ← historical 그룹 추가
└── ...
```

### 변경 파일

- `src/domain/palettes/types.ts` — ThemeCategory에 `'historical'` 추가
- `src/domain/palettes/presets/historical/` — 5개 프리셋 파일 생성
- `src/domain/palettes/presets/historical/index.ts` — re-export
- `src/domain/palettes/presets/registry.ts` — historical ThemeGroup 등록

## 체크리스트

- [ ] ThemeCategory 타입에 'historical' 추가
- [ ] historical/ 디렉토리 및 5개 프리셋 파일 생성
- [ ] 각 프리셋에 recommendedForStyles 메타데이터 포함
- [ ] registry.ts에 historical ThemeGroup 등록
- [ ] PaletteLab에서 Historical 카테고리 탭이 나타나고 프리셋 선택 가능 확인
- [ ] 각 프리셋 적용 시 컬러 스케일이 정상 생성되는지 확인
