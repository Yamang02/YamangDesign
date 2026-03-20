import { useLayoutPreviewControls } from '@app/context/LayoutPreviewControlsContext';
import { FloatingLayoutControlPanel } from './FloatingLayoutControlPanel';

export function LayoutArticle() {
  const { themeVars, fontFamilyValue } = useLayoutPreviewControls();

  return (
    <div style={{ ...themeVars, fontFamily: fontFamilyValue, maxWidth: 'var(--app-max-width)', margin: '0 auto', padding: 'var(--ds-spacing-8)' }}>
      <article style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 var(--ds-spacing-2) 0' }}>아티클 제목 (타이포그래피 목업)</h1>
        <p style={{ margin: '0 0 var(--ds-spacing-6) 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          2025년 3월 14일 · 5분 읽기
        </p>
        <p>
          본문 단락. 디자인 시스템의 타이포그래피 토큰이 적용된 콘텐츠 레이아웃입니다.
          제목, 부제, 본문, 인용, 리스트 등이 일관된 간격과 크기로 배치됩니다.
        </p>
        <h2>소제목 (H2)</h2>
        <p>두 번째 단락. 서비스 페이지의 아티클/블로그 스타일을 미리보기할 수 있습니다.</p>
        <ul>
          <li>리스트 항목 1</li>
          <li>리스트 항목 2</li>
          <li>리스트 항목 3</li>
        </ul>
      </article>
      <FloatingLayoutControlPanel />
    </div>
  );
}
