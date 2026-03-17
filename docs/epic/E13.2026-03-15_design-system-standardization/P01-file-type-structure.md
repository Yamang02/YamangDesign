# P01: 파일·타입 구조 표준화

## 목표
모든 컴포넌트가 동일한 파일 구조와 타입 export 패턴을 따르는 상태.
이후 컴포넌트 수정 시 "타입이 어디 있지?" 고민 없이 일관된 위치에서 찾을 수 있다.

## 구현 상세

### 표준 파일 구조 (모든 컴포넌트 적용 대상)
```
ComponentName/
  ComponentName.tsx         # 컴포넌트 구현
  ComponentName.types.ts    # Props 인터페이스 (inline 금지)
  ComponentName.module.css  # 스타일
  index.ts                  # named export: 컴포넌트 + 타입
```

### index.ts 표준 패턴
```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### 정비 대상 컴포넌트
| 컴포넌트 | 문제 | 조치 |
|---|---|---|
| `Tooltip` | Props inline in `.tsx` | `.types.ts` 파일 분리 |
| `Header` | Props inline in `.tsx` | `.types.ts` 파일 분리 |
| `HeaderNav` | Props inline in `.tsx` | `.types.ts` 파일 분리 |
| `DetailPanel` | Props inline in `.tsx` | `.types.ts` 파일 분리 |
| `ColorPicker/HexInput` | 타입이 `ColorPicker.types.ts`에 혼재 | `HexInput.types.ts` 분리 |
| `ColorPicker/PresetManager` | 타입이 `ColorPicker.types.ts`에 혼재 | `PresetManager.types.ts` 분리 |
| `ColorPicker/index.ts` | 타입 export 없음 | 타입 re-export 추가 |
| `ComponentCard` | Props inline | `.types.ts` 파일 분리 |
| `ComponentDetailModal` | Props inline | `.types.ts` 파일 분리 |

## 체크리스트
- [ ] 표준 파일 구조 규칙 결정 및 이 문서에 확정 기록
- [ ] Tooltip: Props 타입 분리 → `Tooltip.types.ts`
- [ ] Header: Props 타입 분리 → `Header.types.ts`
- [ ] HeaderNav / HeaderNavItem / HeaderNavDropdown: 타입 분리
- [ ] DetailPanel: Props 타입 분리 → `DetailPanel.types.ts`
- [ ] ColorPicker/HexInput: `HexInput.types.ts` 분리
- [ ] ColorPicker/PresetManager: `PresetManager.types.ts` 분리
- [ ] ColorPicker/index.ts: 타입 re-export 추가
- [ ] ComponentCard / ComponentDetailModal: 타입 분리
- [ ] 전체 컴포넌트 index.ts 타입 export 누락 여부 최종 확인
