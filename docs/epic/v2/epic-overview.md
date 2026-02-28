# Epic v2: 테마 드롭다운 + 팔레트 프리셋 + 아이콘 시스템 + 데모 페이지 ✅ 완료

## 개요

POC 완료 후 확장. 실사용 가능한 디자인 시스템으로 발전.

---

## 핵심 목표

1. **테마 선택 UX 개선** - 토글 → 드롭다운
2. **컬러 팔레트 고도화** - HEX 입력 + 프리셋 저장/불러오기
3. **아이콘 시스템 구축** - Nucleo + Material Icons
4. **실제 사이트 데모** - 컴포넌트가 자연스럽게 통합된 페이지

---

## 에픽 구성

| Epic | 제목 | 우선순위 | 의존성 | 상태 |
|------|------|----------|--------|------|
| E01 | [Select 컴포넌트 + 테마 드롭다운](./E01-theme-dropdown.md) | P0 | - | ✅ 완료 |
| E02 | [아이콘 시스템](./E02-icon-system.md) | P0 | - | ✅ 완료 |
| E03 | [팔레트 프리셋 시스템](./E03-palette-preset.md) | P1 | - | ✅ 완료 |
| E04 | [데모 사이트 페이지](./E04-demo-page.md) | P1 | E01, E02 | ✅ 완료 |

---

## 완료 기준 (Definition of Done)

- [x] 드롭다운으로 테마 3개 이상 선택 가능
- [x] HEX 값 직접 입력으로 팔레트 커스텀
- [x] 팔레트 프리셋 저장/불러오기 (localStorage)
- [x] Nucleo/Material 아이콘 통합 사용
- [x] 실제 웹사이트처럼 보이는 데모 페이지
- [x] 모든 기존 테스트/빌드 통과

---

## 기술 제약

- 외부 라이브러리 최소화 (기존 원칙 유지)
- CSS-in-JS 패턴 유지 (`*.styles.ts`)
- CSS 변수 기반 스타일링 (`var(--ds-xxx)`)
- TypeScript 타입 안전성 유지

---

## 폴더 구조 변경 예정

```
src/
├── @types/
│   └── palette.d.ts          # [NEW]
├── components/
│   ├── Select/               # [NEW]
│   ├── Icon/                 # [NEW]
│   └── ColorPicker/          # [NEW]
├── hooks/
│   └── usePalettePresets.ts  # [NEW]
├── pages/
│   └── Demo/                 # [NEW]
└── assets/
    └── icons/                # [NEW]
```
