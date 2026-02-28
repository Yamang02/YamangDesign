# E04: 나머지 컴포넌트 마이그레이션

## 목표

Button, Card, ColorPicker, Navigation 등 나머지 컴포넌트를 CSS Modules로 마이그레이션.

---

## 컴포넌트 목록

| 컴포넌트 | 복잡도 | hover/focus 이슈 | 우선순위 |
|----------|--------|------------------|----------|
| HexInput | 중 | ✅ 있음 | 높음 |
| Button | 하 | 일부 | 중간 |
| Card | 하 | 없음 | 낮음 |
| PresetManager | 중 | ✅ 있음 | 높음 |
| Navigation | 하 | 없음 | 낮음 |

---

## 1. HexInput 마이그레이션

### HexInput.module.css

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-1);
}

.label {
  font-size: var(--ds-text-xs);
  color: var(--ds-color-text-secondary);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-1);
}

.colorPreview {
  width: 28px;
  height: 28px;
  border-radius: var(--ds-radius-sm);
  border: 1px solid var(--ds-color-border-default);
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.colorPreview:hover {
  border-color: var(--ds-color-border-focus);
}

.nativeColorInput {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 var(--ds-spacing-1);
  font-size: var(--ds-text-xs);
  font-family: var(--ds-font-mono);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-sm);
  color: var(--ds-color-text-primary);
  outline: none;
  transition: border-color var(--ds-transition-fast);
}

.input:hover:not(:focus):not(:disabled) {
  border-color: var(--ds-color-border-focus);
}

.input:focus {
  border-color: var(--ds-color-action-primary-default);
}

.input[data-error="true"] {
  border-color: var(--ds-color-danger);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 2. Button 마이그레이션

### Button.module.css

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-spacing-2);
  font-family: var(--ds-font-sans);
  font-weight: var(--ds-font-weight-medium);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  transition:
    background-color var(--ds-transition-fast),
    box-shadow var(--ds-transition-normal),
    transform var(--ds-transition-fast);
}

/* Size */
.button[data-size="sm"] {
  height: var(--ds-size-sm);
  padding: 0 var(--ds-spacing-3);
  font-size: var(--ds-text-sm);
}

.button[data-size="md"] {
  height: var(--ds-size-md);
  padding: 0 var(--ds-spacing-4);
  font-size: var(--ds-text-md);
}

.button[data-size="lg"] {
  height: var(--ds-size-lg);
  padding: 0 var(--ds-spacing-6);
  font-size: var(--ds-text-lg);
}

/* Variant: Primary */
.button[data-variant="primary"] {
  background-color: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
  border: none;
  box-shadow: var(--ds-shadow-sm);
}

.button[data-variant="primary"]:hover:not(:disabled) {
  background-color: var(--ds-color-action-primary-hover);
  box-shadow: var(--ds-shadow-md);
}

.button[data-variant="primary"]:active:not(:disabled) {
  background-color: var(--ds-color-action-primary-active);
  box-shadow: var(--ds-shadow-active);
  transform: translateY(1px);
}

/* Variant: Secondary */
.button[data-variant="secondary"] {
  background-color: var(--ds-color-action-secondary-default);
  color: var(--ds-color-text-primary);
  border: none;
  box-shadow: var(--ds-shadow-sm);
}

.button[data-variant="secondary"]:hover:not(:disabled) {
  background-color: var(--ds-color-action-secondary-hover);
  box-shadow: var(--ds-shadow-md);
}

/* Variant: Outline */
.button[data-variant="outline"] {
  background-color: transparent;
  color: var(--ds-color-action-primary-default);
  border: 1px solid var(--ds-color-action-primary-default);
}

.button[data-variant="outline"]:hover:not(:disabled) {
  background-color: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
}

/* Variant: Ghost */
.button[data-variant="ghost"] {
  background-color: transparent;
  color: var(--ds-color-text-primary);
  border: none;
}

.button[data-variant="ghost"]:hover:not(:disabled) {
  background-color: var(--ds-color-bg-muted);
}

/* Focus */
.button:focus-visible {
  outline: 2px solid var(--ds-color-action-primary-default);
  outline-offset: 2px;
}

/* Disabled */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Full width */
.button[data-full-width="true"] {
  width: 100%;
}

/* Icon only */
.button[data-icon-only="true"] {
  padding: 0;
  aspect-ratio: 1;
}
```

---

## 3. Card 마이그레이션

### Card.module.css

```css
.card {
  background-color: var(--ds-color-bg-surface);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
  overflow: hidden;
}

.card[data-variant="elevated"] {
  border: none;
}

.card[data-variant="outlined"] {
  border: 1px solid var(--ds-color-border-default);
  box-shadow: none;
}

.card[data-interactive="true"] {
  cursor: pointer;
  transition:
    box-shadow var(--ds-transition-normal),
    transform var(--ds-transition-fast);
}

.card[data-interactive="true"]:hover {
  box-shadow: var(--ds-shadow-lg);
  transform: translateY(-2px);
}

.card[data-interactive="true"]:active {
  box-shadow: var(--ds-shadow-sm);
  transform: translateY(0);
}

/* Padding variants */
.card[data-padding="none"] {
  padding: 0;
}

.card[data-padding="sm"] {
  padding: var(--ds-spacing-3);
}

.card[data-padding="md"] {
  padding: var(--ds-spacing-4);
}

.card[data-padding="lg"] {
  padding: var(--ds-spacing-6);
}
```

---

## 4. PresetManager 마이그레이션

### PresetManager.module.css

```css
.section {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-2);
}

.title {
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-font-weight-semibold);
  color: var(--ds-color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
}

.saveRow {
  display: flex;
  gap: var(--ds-spacing-2);
}

.saveInput {
  flex: 1;
  height: 32px;
  padding: 0 var(--ds-spacing-2);
  font-size: var(--ds-text-sm);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-sm);
  color: var(--ds-color-text-primary);
  outline: none;
}

.saveInput:focus {
  border-color: var(--ds-color-action-primary-default);
}

.saveButton {
  height: 32px;
  padding: 0 var(--ds-spacing-3);
  font-size: var(--ds-text-sm);
  background-color: var(--ds-color-action-primary-default);
  border: none;
  border-radius: var(--ds-radius-sm);
  color: var(--ds-color-text-onAction);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-1);
}

.saveButton:hover:not(:disabled) {
  background-color: var(--ds-color-action-primary-hover);
}

.saveButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.presetList {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-2);
  max-height: 200px;
  overflow-y: auto;
}

.presetItem {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
  padding: var(--ds-spacing-2);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
  transition:
    background-color var(--ds-transition-fast),
    border-color var(--ds-transition-fast);
}

.presetItem:hover {
  background-color: var(--ds-color-bg-muted);
  border-color: var(--ds-color-border-default);
}

.presetColors {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.presetColorDot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.presetName {
  flex: 1;
  font-size: var(--ds-text-sm);
  color: var(--ds-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deleteButton {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
  color: var(--ds-color-text-muted);
  transition:
    color var(--ds-transition-fast),
    background-color var(--ds-transition-fast);
}

.deleteButton:hover {
  color: var(--ds-color-danger);
  background-color: var(--ds-color-danger-subtle);
}
```

---

## 작업 순서

1. HexInput (hover/focus 버그 수정 우선)
2. PresetManager (hover 이슈)
3. Button
4. Card
5. Navigation
6. ColorPicker (HexInput 의존)

---

## 완료 기준

- [ ] 모든 `*.styles.ts` 파일 삭제
- [ ] JS state로 hover 관리하는 코드 전체 제거
- [ ] 모든 컴포넌트 CSS Modules로 전환
- [ ] 하드코딩된 색상/크기 값 제거
- [ ] 빌드 통과
- [ ] 기존 테마 전환 정상 동작
