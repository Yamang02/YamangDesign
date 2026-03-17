# P02: UI 양식 통일 적용

## 목표

P01 감사에서 발견된 UI 양식 불일치를 수정한다.
E13 P04에서 확립된 섹션 시스템(LabSection, ComparisonGrid, TokenValueRow,
MetadataTable, TabBar)을 일관되게 적용한다.

## 구현 상세

### Step 1: TokenLab DS 섹션 래퍼 교체

**대상 파일:** `src/app/pages/labs/TokenLab/TokenLab.tsx`

**현재:**
```tsx
<section id="ds-tokens" className={styles.dsTokensWrapper}>
  <h2 className={styles.sectionTitle}>Design System</h2>
  <div className={styles.sectionContent}>
    <GlobalSection onSelectToken={setSelectedToken} />
    <AliasSection onSelectToken={setSelectedToken} />
  </div>
</section>
```

**변경:**
```tsx
<LabSection title="Design System" id="ds-tokens">
  <GlobalSection onSelectToken={setSelectedToken} />
  <AliasSection onSelectToken={setSelectedToken} />
</LabSection>
```

- `styles.dsTokensWrapper`, `styles.sectionTitle`, `styles.sectionContent` 관련 CSS 제거
- `LabSection`이 내부적으로 h2 + card 래핑을 처리하므로 중복 없음

### Step 2: TokenLab ComponentInspector 탭 → TabBar 교체

**대상:** `ComponentInspector` 함수 컴포넌트 내 탭 영역

**현재:**
```tsx
<div className={styles.componentTabs}>
  {COMPONENT_ORDER.map((key) => (
    <button type="button" className={styles.componentTab} data-active={...} onClick={...}>
      {key}
    </button>
  ))}
</div>
```

**변경:**
```tsx
<TabBar
  tabs={COMPONENT_ORDER.map((key) => ({ id: key, label: key }))}
  activeTab={activeComponent}
  onTabChange={(id) => setActiveComponent(id as ComponentKey)}
/>
```

- `styles.componentTabs`, `styles.componentTab` CSS 삭제
- `TabBar` import 추가 (이미 layouts에서 export됨)

## 변경 파일

- `src/app/pages/labs/TokenLab/TokenLab.tsx`
- `src/app/pages/labs/TokenLab/TokenLab.module.css` (불필요 클래스 정리)

## 체크리스트

- [x] TokenLab DS 섹션 raw `<section>` → `LabSection` 교체
- [x] `dsTokensWrapper` / `sectionTitle` / `sectionContent` CSS 삭제
- [x] ComponentInspector 커스텀 탭 버튼 → `TabBar` 교체
- [x] `componentTabs` / `componentTab` CSS 삭제
- [ ] 변경 후 TokenLab 렌더링 시각 확인 (ToC 앵커 동작 포함)
