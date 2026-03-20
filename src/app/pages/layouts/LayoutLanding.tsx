import { Landing } from '@app/pages/labs';
import { useLayoutPreviewControls } from '@app/context/LayoutPreviewControlsContext';
import { FloatingLayoutControlPanel } from './FloatingLayoutControlPanel';

export function LayoutLanding() {
  const { themeVars, fontFamilyValue } = useLayoutPreviewControls();

  return (
    <div style={{ ...themeVars, fontFamily: fontFamilyValue }}>
      <Landing />
      <FloatingLayoutControlPanel />
    </div>
  );
}
