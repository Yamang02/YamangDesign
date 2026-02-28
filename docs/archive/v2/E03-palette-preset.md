# E03: 팔레트 프리셋 시스템

## 목적

1. HEX 값 직접 입력 지원
2. 팔레트를 이름과 함께 저장/불러오기 (localStorage)

---

## 현재 상태

```tsx
// Navigation.tsx - 컬러 에디터
<input type="color" value={tempPalette.primary} onChange={...} />
```

- `<input type="color">`만 사용
- HEX 직접 입력 불가
- 팔레트 저장 기능 없음

---

## 목표 상태

```tsx
<ColorPicker>
  <HexInput value="#6366F1" onChange={...} />
  <PresetManager
    presets={presets}
    onSave={(name) => savePreset(name, palette)}
    onLoad={(preset) => loadPreset(preset)}
    onDelete={(id) => deletePreset(id)}
  />
</ColorPicker>
```

---

## 태스크

### T03-1: 타입 정의

**파일:** `src/@types/palette.d.ts`

```typescript
interface PalettePreset {
  id: string;
  name: string;
  palette: ExternalPalette;
  createdAt: number;
  updatedAt?: number;
}

interface PalettePresetsStorage {
  version: number;
  presets: PalettePreset[];
}
```

---

### T03-2: usePalettePresets 훅

**파일:** `src/hooks/usePalettePresets.ts`

```typescript
interface UsePalettePresetsReturn {
  presets: PalettePreset[];
  savePreset: (name: string, palette: ExternalPalette) => void;
  loadPreset: (id: string) => ExternalPalette | null;
  deletePreset: (id: string) => void;
  updatePreset: (id: string, name: string, palette: ExternalPalette) => void;
  exportPresets: () => string;  // JSON 내보내기
  importPresets: (json: string) => void;  // JSON 가져오기
}

export function usePalettePresets(): UsePalettePresetsReturn;
```

**localStorage 키:** `yamang-palette-presets`

**기본 프리셋 (내장):**
```typescript
const defaultPresets: PalettePreset[] = [
  {
    id: 'default-indigo',
    name: 'Indigo (Default)',
    palette: { primary: '#6366F1' },
    createdAt: 0,
  },
  {
    id: 'default-emerald',
    name: 'Emerald',
    palette: { primary: '#10B981' },
    createdAt: 0,
  },
  {
    id: 'default-rose',
    name: 'Rose',
    palette: { primary: '#F43F5E' },
    createdAt: 0,
  },
];
```

---

### T03-3: HexInput 컴포넌트

**파일:** `src/components/ColorPicker/HexInput.tsx`

```typescript
interface HexInputProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  showColorPreview?: boolean;
  size?: 'sm' | 'md';
}
```

**기능:**
- HEX 형식 검증 (`#RRGGBB` 또는 `#RGB`)
- 색상 프리뷰 사각형 표시
- 기존 `<input type="color">`와 연동 옵션

**UI:**
```
┌─────────────────────────────────┐
│ [■] #6366F1  [🎨]               │
│  ↑      ↑      ↑                │
│ 프리뷰  HEX입력  컬러피커버튼     │
└─────────────────────────────────┘
```

---

### T03-4: PresetManager 컴포넌트

**파일:** `src/components/ColorPicker/PresetManager.tsx`

```typescript
interface PresetManagerProps {
  presets: PalettePreset[];
  currentPalette: ExternalPalette;
  onSave: (name: string) => void;
  onLoad: (preset: PalettePreset) => void;
  onDelete: (id: string) => void;
}
```

**UI:**
```
┌─────────────────────────────────┐
│ 💾 Save Current Palette         │
│ ┌─────────────────────────────┐ │
│ │ Preset name: [          ]   │ │
│ │              [Save]         │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📁 Saved Presets                │
│ ┌─────────────────────────────┐ │
│ │ ■■■■ Indigo (Default) [Load]│ │
│ │ ■■■■ Emerald         [Load][🗑]│
│ │ ■■■■ My Custom       [Load][🗑]│
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

### T03-5: ColorPicker 통합 컴포넌트

**파일 구조:**
```
src/components/ColorPicker/
├── ColorPicker.tsx      # 메인 통합 컴포넌트
├── ColorPicker.types.ts
├── ColorPicker.styles.ts
├── HexInput.tsx
├── PresetManager.tsx
└── index.ts
```

**ColorPicker.tsx:**
```tsx
export function ColorPicker() {
  const { palette, setPalette } = useTheme();
  const presetManager = usePalettePresets();

  return (
    <div>
      {/* Primary, Secondary, Accent, Sub 각각 HexInput */}
      <HexInput label="Primary" value={palette.primary} onChange={...} />
      <HexInput label="Secondary" value={palette.secondary} onChange={...} />
      ...

      {/* 프리셋 관리 */}
      <PresetManager
        presets={presetManager.presets}
        currentPalette={palette}
        onSave={presetManager.savePreset}
        onLoad={(preset) => setPalette(preset.palette)}
        onDelete={presetManager.deletePreset}
      />
    </div>
  );
}
```

---

### T03-6: Navigation에 통합

기존 컬러 에디터 UI를 `<ColorPicker />` 컴포넌트로 교체.

---

### T03-7: 데이터 마이그레이션

- localStorage 버전 관리
- 이전 형식 데이터 자동 변환

---

## 완료 기준

- [ ] HEX 값 직접 입력 가능
- [ ] 팔레트 프리셋 저장 (이름 + 4색)
- [ ] 프리셋 목록에서 불러오기
- [ ] 프리셋 삭제 가능
- [ ] 기본 프리셋 3개 내장
- [ ] localStorage 영속성 검증
- [ ] HEX 형식 검증 (유효하지 않은 값 방지)

---

## 예상 파일 변경

| 파일 | 변경 |
|------|------|
| `src/@types/palette.d.ts` | 신규 |
| `src/hooks/usePalettePresets.ts` | 신규 |
| `src/components/ColorPicker/*` | 신규 |
| `src/components/Navigation/Navigation.tsx` | 수정 |
