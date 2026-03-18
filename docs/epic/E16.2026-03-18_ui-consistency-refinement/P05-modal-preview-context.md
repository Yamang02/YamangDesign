# P05: ComponentDetailModal 프리뷰 컨텍스트 복원

## 목표
ComponentDetailModal body가 항상 `data-context="preview"`를 가져,
모달 내 컴포넌트 미리보기가 현재 테마 토큰으로 올바르게 렌더링되도록 한다.

## 배경 / 원인

`ComponentDetailModal.tsx` line 62에서 `data-context="preview"`를
`previewStyle`이 truthy일 때만 설정했다:

```tsx
<div className={styles.body} data-context={previewStyle ? 'preview' : undefined} style={previewStyle}>
```

`Components.tsx`는 `previewStyle`을 전달하지 않으므로 `data-context="preview"`가 붙지 않았고,
`[data-shell]` 컨텍스트의 오버라이드(`--ds-color-action-primary-default` → shell gray)가 복원되지 않아
배지 등 컴포넌트가 테마 색상 대신 shell gray로 렌더링되었다.

## 구현 상세

`data-context="preview"` 설정과 `previewStyle` CSS 변수 주입은 별개의 관심사다.
- `data-context="preview"`: 토큰 복원 (항상 필요)
- `style={previewStyle}`: 특정 테마 CSS 변수 주입 (선택적)

`body`에 항상 `data-context="preview"`를 설정하고, `style`은 `previewStyle`이 있을 때만 적용한다.

**변경 파일:**
- `src/app/components/ComponentDetailModal/ComponentDetailModal.tsx`

## 체크리스트
- [x] ComponentDetailModal body에 `data-context="preview"` 고정 설정
- [x] `style={previewStyle}` 은 별도로 유지 (기존 previewStyle 기능 보존)
- [x] Components 페이지 Badge 모달에서 theme 색상이 올바르게 표시되는지 확인
