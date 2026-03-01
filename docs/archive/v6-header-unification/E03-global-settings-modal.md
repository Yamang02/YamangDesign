# E03: 전역 설정 모달 설계 및 구현

## 개요

분산되어 있는 디자인 시스템 설정(팔레트, 스타일, 시스템 프리셋 등)을 헤더에서 접근 가능한 통합 설정 모달로 제공합니다. Playground와 모달은 **편집 대상**이 다르며, 동일한 ThemeProvider 상태를 공유합니다.

## Playground vs 전역 설정 모달

| 구분 | Playground | 전역 설정 모달 |
|------|-----------|----------------|
| **편집 대상** | 컴포넌트 수준 | 레이아웃 수준 (랜딩, 페이지 전체) |
| **미리보기** | 개별 컴포넌트 변화 확인 | 현재 보고 있는 페이지가 바로 반영 |
| **접근** | Playground 페이지 방문 | 어느 페이지에서든 헤더 설정 버튼 클릭 |
| **기능** | 동일 (팔레트, 스타일, 프리셋 등) | 동일 |

- 둘 다 편집이 가능하고, 기능은 비슷하다. 다만 **대상**이 다를 뿐이다.
- Playground: 컴포넌트 조합/스펙을 살펴보며 세부 조정
- 모달: 랜딩·Lab 페이지 등 실제 레이아웃 위에서 변경 효과 확인
- 모달은 Playground의 편집 UI 스타일을 따를 필요는 없다. 모달 특성에 맞는 UI로 설계.

## 선행 조건

- E01 (헤더 레이아웃), E02 (아이콘 네비게이션) 완료 — HeaderSettingsButton 존재 시 진행

## 현재 상태 분석

### 설정 위치 분산 현황

| 설정 항목 | 현재 위치 | 접근 방법 |
|-----------|----------|-----------|
| 컬러 에디터 | Navigation | 우측 상단 버튼 클릭 |
| 팔레트 프리셋 | ColorPicker 내부 | 컬러 에디터 열어야 접근 |
| 스타일 선택 | Playground | 페이지 직접 방문 |
| 시스템 프리셋 | Playground | 페이지 직접 방문 |
| 중성색 프리셋 | Playground | 페이지 직접 방문 |
| 폰트 선택 | Playground | 페이지 직접 방문 |

### 문제점
1. **발견하기 어려움**: 레이아웃 단위로 설정을 바꾸려 해도 Playground를 찾아가야 함
2. **컨텍스트 전환**: 현재 보고 있는 페이지(랜딩, Lab)에서 바로 변경 결과를 보려면 설정 접근 경로 부족
3. **일관성 부족**: 컬러만 헤더에서 접근 가능, 나머지는 분리됨
4. **저장 기능 제한**: 팔레트만 저장, 전체 테마 조합 저장 불가

## 목표 상태

- Playground는 기존처럼 컴포넌트 수준 편집·미리보기 유지
- 전역 설정 모달: 레이아웃 수준 편집. 적용 시 사용자가 보고 있던 페이지가 즉시 변경됨
- 두 경로 모두 동일한 ThemeProvider 상태를 읽고 쓰므로 결과는 일치

### 통합 설정 모달 UI

```
┌─────────────────────────────────────────────────────────────┐
│                                                          ✕  │
│  디자인 시스템 설정                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ 테마 프리셋 ─────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [Default] [Vivid] [Pastel] [Earth] [+ 사용자 저장]   │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 팔레트 ──────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  Primary     [████████] #3B82F6                       │  │
│  │  Secondary   [████████] #10B981                       │  │
│  │  Accent      [████████] #F59E0B                       │  │
│  │  Sub         [Auto ▾ ]                                │  │
│  │  Neutral     [Auto ▾ ]                                │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 스타일 ──────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [Minimal ▾]                                          │  │
│  │                                                       │  │
│  │  ○ Minimal      - 깔끔하고 평면적인 디자인            │  │
│  │  ○ Neumorphism  - 부드러운 그림자 효과                │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 시스템 색상 ─────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [Default ▾]                                          │  │
│  │                                                       │  │
│  │  Error   [██] Warning [██] Success [██] Info [██]     │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 중성색 ──────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [Gray ▾]  → [████ 50-900 스케일 미리보기]            │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 고급 설정 (접힘) ────────────────────────────────────┐  │
│  │                                                       │  │
│  │  폰트 [Pretendard ▾]                                  │  │
│  │  배경 전략 [Light BG ▾]                               │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [내보내기]  [가져오기]        [초기화]  [적용]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 컴포넌트 구조

### 파일 구조

```
src/components/GlobalSettings/
├── index.ts
├── GlobalSettingsModal.tsx       # 메인 모달 컴포넌트
├── GlobalSettingsModal.module.css
├── sections/
│   ├── ThemePresetSection.tsx    # 테마 프리셋 선택
│   ├── PaletteSection.tsx        # 팔레트 편집 (기존 ColorPicker 재활용)
│   ├── StyleSection.tsx          # 스타일 선택
│   ├── SystemColorSection.tsx    # 시스템 색상 프리셋
│   ├── NeutralSection.tsx        # 중성색 프리셋
│   └── AdvancedSection.tsx       # 고급 설정 (폰트, 배경 전략)
├── hooks/
│   └── useGlobalSettings.ts      # 설정 상태 관리
└── types.ts
```

### GlobalSettingsModal

- Phase 1: ThemePresetSection, PaletteSection, StyleSection, SystemColorSection만 포함
- Phase 2: NeutralSection, AdvancedSection 추가

```tsx
interface GlobalSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSettingsModal({ open, onClose }: GlobalSettingsModalProps) {
  const {
    palette,
    styleName,
    systemPreset,
    // Phase 2: neutralPreset, fontFamily
    setPalette,
    setStyleName,
    setSystemPreset,
    reset,
    apply,
    exportSettings,
    importSettings,
  } = useGlobalSettings();

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>디자인 시스템 설정</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </header>

        <div className={styles.content}>
          <ThemePresetSection />
          <PaletteSection palette={palette} onChange={setPalette} />
          <StyleSection value={styleName} onChange={setStyleName} />
          <SystemColorSection value={systemPreset} onChange={setSystemPreset} />
          {/* Phase 2: NeutralSection, AdvancedSection */}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <button onClick={exportSettings}>내보내기</button>
            <button onClick={() => importSettings()}>가져오기</button>
          </div>
          <div className={styles.footerRight}>
            <button onClick={reset}>초기화</button>
            <button onClick={apply} className={styles.primaryBtn}>
              적용
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
```

### useGlobalSettings Hook

- Phase 1: palette, styleName, systemPreset만 사용 (ThemeProvider 기존 API)
- Phase 2: neutralPreset, fontFamily 추가 (ThemeProvider 확장 후)

```tsx
// 기존 ThemeProvider의 상태를 래핑하고 추가 기능 제공
export function useGlobalSettings() {
  const {
    palette,
    styleName,
    systemPreset,
    setPalette,
    setStyleName,
    setSystemPreset,
  } = useTheme();

  // 로컬 편집 상태 (적용 전까지 임시 저장)
  const [localPalette, setLocalPalette] = useState(palette);
  const [localStyleName, setLocalStyleName] = useState(styleName);
  const [localSystemPreset, setLocalSystemPreset] = useState(systemPreset);

  // 변경사항 있는지 확인
  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(localPalette) !== JSON.stringify(palette) ||
      localStyleName !== styleName ||
      localSystemPreset !== systemPreset
    );
  }, [localPalette, localStyleName, localSystemPreset, palette, styleName, systemPreset]);

  // 적용
  const apply = useCallback(() => {
    setPalette(localPalette);
    setStyleName(localStyleName);
    setSystemPreset(localSystemPreset);

    // localStorage에 전체 설정 저장
    saveSettingsToStorage({
      palette: localPalette,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
    });
  }, [localPalette, localStyleName, localSystemPreset]);

  // 초기화
  const reset = useCallback(() => {
    setLocalPalette(defaultPalette);
    setLocalStyleName('minimal');
    setLocalSystemPreset('default');
  }, []);

  // 내보내기/가져오기
  const exportSettings = useCallback(() => {
    const data = {
      version: '1.0',
      palette: localPalette,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
      exportedAt: new Date().toISOString(),
    };
    downloadJSON(data, 'yamang-design-settings.json');
  }, [localPalette, localStyleName, localSystemPreset]);

  const importSettings = useCallback(async () => {
    const data = await pickJSONFile();
    if (data) {
      setLocalPalette(data.palette);
      setLocalStyleName(data.styleName);
      setLocalSystemPreset(data.systemPreset);
    }
  }, []);

  return {
    // 현재 값 (로컬 편집 상태)
    palette: localPalette,
    styleName: localStyleName,
    systemPreset: localSystemPreset,

    // 설정 변경
    setPalette: setLocalPalette,
    setStyleName: setLocalStyleName,
    setSystemPreset: setLocalSystemPreset,

    // 액션
    hasChanges,
    apply,
    reset,
    exportSettings,
    importSettings,
  };
}
```

## 섹션별 구현 세부사항

### ThemePresetSection

- 저장된 테마 프리셋 카드 목록 표시
- 클릭 시 전체 설정 일괄 적용
- "저장" 버튼으로 현재 설정을 새 프리셋으로 저장
- 기본 제공 프리셋 + 사용자 저장 프리셋

### PaletteSection

- 기존 `ColorPicker` 컴포넌트 재활용
- `PresetManager` 통합 (팔레트 프리셋)
- HexInput들로 Primary, Secondary, Accent, Sub, Neutral 편집

### StyleSection

- 라디오 버튼 그룹으로 스타일 선택
- 각 스타일의 미리보기 카드 표시
- Minimal, Neumorphism (향후 Glassmorphism, Brutalism 추가 가능)

### SystemColorSection

- Default / Muted 프리셋 선택
- 4가지 시스템 색상 (Error, Warning, Success, Info) 미리보기

### NeutralSection

- Gray, Slate, Zinc, Stone 프리셋 선택
- 50-900 스케일 색상 띠 미리보기

### AdvancedSection

- 접힘/펼침 가능한 섹션
- 폰트 패밀리 선택
- 배경 전략 선택 (Light BG, Colored BG, Dark BG)

## 모달 vs 사이드 패널

### 선택: 모달 방식

**이유:**
1. **레이아웃 수준 미리보기**: 모달에서 적용 시, 뒤의 페이지(랜딩·Lab 등)가 바로 반영됨. 사용자가 보고 있던 레이아웃 위에서 효과 확인 가능
2. **집중**: 설정에 집중하도록 오버레이로 배경 흐리게 (또는 반투명으로 뒤 레이아웃이 어렵풋이 보이도록)
3. **공간**: 충분한 공간으로 모든 설정 표시 가능
4. **접근성**: 어느 페이지에서든 헤더 설정 버튼으로 동일하게 접근

**대안 검토 (사이드 패널):**
- 장점: 뒤 레이아웃이 더 잘 보일 수 있음
- 단점: 화면 공간 제한, DetailPanel과 역할 혼동
- 결론: 모달이 적합. 모달 UI는 Playground 스타일을 따를 필요 없음

## 저장 전략

### localStorage 구조

```typescript
// 키: 'yamang-design-settings'
interface StoredSettings {
  version: string;
  palette: ExternalPalette;
  styleName: StyleName;
  systemPreset: SystemPresetName;
  neutralPreset: NeutralPresetName;
  fontFamily: string;
  updatedAt: string;
}

// 키: 'yamang-design-presets'
interface StoredPresets {
  version: string;
  presets: Array<{
    id: string;
    name: string;
    settings: StoredSettings;
    createdAt: string;
  }>;
}
```

### 앱 시작 시 로드

```tsx
// ThemeProvider 수정
function ThemeProvider({ children }) {
  // 저장된 설정 로드
  const savedSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem('yamang-design-settings');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // 초기값으로 사용
  const [palette, setPalette] = useState(
    savedSettings?.palette ?? defaultPalette
  );
  // ...
}
```

## 영향도 분석

### 수정/교체 대상

| 대상 | 현재 상태 | E03 적용 후 |
|------|----------|-------------|
| **HeaderSettingsButton** | ColorPicker + Style Select 인라인 패널 | 설정 버튼 클릭 시 GlobalSettingsModal 오픈. 기존 패널 제거 |
| **App.tsx** | ThemeProvider 하위에 Header, main, Footer | GlobalSettingsModal 추가 (Header siblings 또는 ThemeProvider 내부) |
| **ThemeProvider** | palette, styleName, systemPreset 보유. neutralPreset, fontFamily 없음 | 1차: 기존 3가지만 사용. 2차: neutralPreset, fontFamily 추가 (CSS vars 주입 필요) |

### ThemeProvider 현황 (구현 참고)

- **이미 있음**: `palette`, `styleName`, `systemPreset` — useGlobalSettings에서 바로 사용 가능
- **없음**: `neutralPreset`, `fontFamily` — Playground는 로컬 state로 `getNeutralPresetVariables`, `fontFamily` 적용. 모달 1차에서는 생략하거나, ThemeProvider 확장 후 2차 반영

### Playground와의 관계

- Playground: 로컬 state로 palette/style/system/neutral/font 조합 실험 (ThemeProvider와 독립)
- 모달: ThemeProvider(전역) 편집 → 랜딩·Lab 페이지에 즉시 반영
- E03 1차 범위: 모달 구현 및 헤더 연동. Playground–ThemeProvider 연동은 별도 작업

## 구현 단계

### Phase 1 (MVP)

- palette, styleName, systemPreset — ThemeProvider 기존 API 사용
- ThemePresetSection, PaletteSection, StyleSection, SystemColorSection
- useGlobalSettings (기존 3개 상태만)
- HeaderSettingsButton → 모달 트리거
- localStorage 저장/로드 (palette, styleName, systemPreset)
- 내보내기/가져오기 (version 필드 포함)

### Phase 2 (확장)

- ThemeProvider에 neutralPreset, fontFamily 추가
- NeutralSection, AdvancedSection 구현
- useGlobalSettings 확장
- StoredSettings에 neutralPreset, fontFamily 포함

## 상세 설계 보완

### reset 동작

- **모달 내 reset**: 적용 전 로컬 편집 상태를 기본값(default palette, minimal style, default systemPreset)으로 초기화
- **저장 초기화 아님**: localStorage는 `apply` 시에만 갱신. reset 후 apply 하면 그때 저장됨

### importSettings 검증

```ts
// 가져온 JSON 검증 (version, 필수 필드)
function validateImportedSettings(data: unknown): data is StoredSettings {
  if (!data || typeof data !== 'object') return false;
  const o = data as Record<string, unknown>;
  return (
    typeof o.version === 'string' &&
    o.palette != null &&
    typeof o.styleName === 'string' &&
    typeof o.systemPreset === 'string'
  );
}
```

### 접근성

- `aria-modal="true"`, `aria-labelledby` (제목과 연결)
- 포커스 트랩: 모달 열림 시 내부 첫 포커스, 닫힐 때 트리거 버튼으로 복귀
- Escape로 닫기 (기존 체크리스트 항목)
- E04 연계: 모바일에서 모달 → 풀스크린 시트(드로어) 전환 고려

## 체크리스트

### Phase 1

- [ ] GlobalSettingsModal 컴포넌트 구현
- [ ] useGlobalSettings 훅 (palette, styleName, systemPreset)
- [ ] ThemePresetSection 구현
- [ ] PaletteSection 구현 (ColorPicker 재활용)
- [ ] StyleSection 구현
- [ ] SystemColorSection 구현
- [ ] localStorage 저장/로드 (yamang-design-settings)
- [ ] 내보내기/가져오기 (검증 로직 포함)
- [ ] HeaderSettingsButton → 모달 트리거로 전환
- [ ] App에 GlobalSettingsModal 마운트
- [ ] 키보드 접근성 (Escape, focus trap)
- [ ] 애니메이션 (fade in/out)

### Phase 2

- [ ] ThemeProvider에 neutralPreset, fontFamily 확장
- [ ] NeutralSection 구현
- [ ] AdvancedSection 구현
- [ ] useGlobalSettings 확장

## 기존 컴포넌트 재활용

| 기존 컴포넌트 | 재활용 방법 |
|--------------|------------|
| ColorPicker | PaletteSection 내부에 임베드 |
| PresetManager | 테마 프리셋 관리에 패턴 참조 |
| HexInput | 그대로 사용 |
| Select | 스타일, 프리셋 선택에 사용 |
| usePalettePresets | 확장하여 전체 설정 프리셋 관리 |

## 참조

- 현재 ColorPicker: `src/components/ColorPicker/ColorPicker.tsx`
- 현재 PresetManager: `src/components/ColorPicker/PresetManager.tsx`
- ThemeProvider: `src/themes/ThemeProvider.tsx`
- HeaderSettingsButton: `src/components/Header/HeaderSettingsButton.tsx` (모달 트리거로 전환 대상)
- Playground: `src/pages/layouts/Playground/Playground.tsx` (컴포넌트 수준 편집, 1차 연동 제외)
- lab-presets: `src/constants/lab-presets.ts` (getThemeVariables, getSystemColorVariables 등)
