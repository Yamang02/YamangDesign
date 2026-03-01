# Epic: 테마 카테고리 시스템 및 확장 가능한 프리셋 구조

## 개요

현재 flat한 프리셋 구조를 카테고리 기반 시스템으로 변경하고, Default만 남긴 상태에서 점진적으로 확장 가능한 구조로 개선합니다.

## 배경 및 문제점

### 현재 구조
- **Flat Preset List**: `default`, `vivid`, `pastel`, `monochrome`, `earth` 등이 동일 레벨에 나열
- **불필요한 프리셋**: 개발 중인 시스템에 미리 정의된 테마들이 많아 관리 부담
- **확장성 제약**: 새로운 프리셋 추가 시 분류 체계 없음
- **카테고리 부재**: Custom과 Preset의 구분이 명확하지 않음

### 목표

1. **미니멀한 시작점**: Default 프리셋 1개만 유지, 나머지 제거
2. **확장 가능한 카테고리**: Default, Custom, Natural 3개 카테고리
3. **메타데이터 시스템**: 카테고리, 이름, 설명 기반 검색
4. **UI/UX 개선**: Custom 탭 기본, 탭 구조, 검색 기능
5. **시맨틱 매핑 커스터마이징**: 프리셋별 시맨틱 토큰 매핑 정의 가능

## 스토리 목록

| Phase | 제목 | 핵심 내용 |
|-------|------|----------|
| **P01** | 기반 구조 변경 | 타입 정의, 디렉토리 구조, Registry |
| **P02** | 프리셋 정리 및 마이그레이션 | Default 이동, vivid/pastel 등 제거 |
| **P03** | 시맨틱 매핑 시스템 | default-mappings, resolve 경로로 통일, strategy 파일 제거 |
| **P04** | UI 컴포넌트 구현 | ThemeTab, SearchBar, ScaleSelectionModal 등 |
| **P05** | PaletteLab 통합 | 탭/검색/매핑 편집 UI 통합 |
| **P06** | 테스트 및 정리 | 빌드, 타입, 문서 |

## 영향도 요약

| 영역 | 영향 | 파일 |
|------|------|------|
| **타입** | 높음 | `palettes/types.ts`, `@types/theme.d.ts` |
| **프리셋** | 높음 | `palettes/presets/*`, `palettes/index.ts` |
| **상수** | 높음 | `constants/palette-definitions.ts`, `constants/lab-presets.ts` |
| **테마** | 중간 | `themes/presets.ts`, `themes/ThemeProvider.tsx` |
| **컴포넌트** | 중간 | `ColorPicker`, `GlobalSettingsModal`, `PaletteLab` |
| **전역** | 중간 | `App.tsx`, `hooks/usePalettePresets.ts` |

## 의존성

- ThemeProvider 아키텍처 유지
- `palette-definitions.ts` → SOT (단일 소스)
- `PaletteName` 타입: `palettes/types.ts` SOT

## 향후 검토 (본 에픽 범위 아님)

- **다크모드/라이트모드 전략**: 별도 에픽으로 검토 예정

## 성공 지표

1. **단순성**: Default 프리셋 1개만 유지, 빌드 에러 없음
2. **확장성**: 새 카테고리/테마 추가 시 한 줄 또는 파일 추가로 가능
3. **UI/UX**: Custom 탭 기본, 검색 기능 동작, 빈 카테고리 표시

## 참조 문서

- [새 프리셋 추가 방법](./ADDING-PRESETS.md)
- [P01: 기반 구조 변경](./P01-foundation.md)
- [P02: 프리셋 정리 및 마이그레이션](./P02-migration.md)
- [P03: 시맨틱 매핑 시스템](./P03-semantic-mapping.md)
- [P04: UI 컴포넌트 구현](./P04-ui-components.md)
- [P05: PaletteLab 통합](./P05-lab-integration.md)
- [P06: 테스트 및 정리](./P06-testing.md)
- [REVIEW: 영향도 검토 및 개선사항](./REVIEW-impact-and-improvements.md)

---
**작성일**: 2026-03-01 | **우선순위**: High | **예상 기간**: 1-2 weeks
