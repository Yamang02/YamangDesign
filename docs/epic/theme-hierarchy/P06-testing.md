# P06: 테스트 및 정리

## 개요

빌드, 타입, 기존 참조를 확인하고 문서를 업데이트합니다.

## 작업 항목

### 1. 빌드 및 타입

- [ ] `npm run build` 성공
- [ ] 타입 에러 없음 (`npm run typecheck` 또는 IDE)
- [ ] 린트 에러 없음

### 2. 기존 참조 확인

| 대상 | 확인 내용 |
|------|----------|
| ThemeProvider | palette/styles 조합 정상 동작 |
| ColorPicker | themePresets(default만) 정상 표시 |
| GlobalSettingsModal | preset 선택 옵션 정상 |
| usePalettePresets | colorStartPoints, themePresets 호환 |
| PaletteLab | 비교 그리드, DetailPanel 정상 |
| lab-presets | getPaletteVariables, getThemeVariables |

### 3. 문서 업데이트

- [ ] EPIC-THEME-HIERARCHY.md → epic/theme-hierarchy/로 이동 또는 링크 정리
- [ ] README 또는 CONTRIBUTING에 새 프리셋 추가 방법 문서화

### 4. 정리

- [ ] 주석/console.log 제거
- [ ] 미사용 import 제거

## 의존성

- 선행: P01~P05
