/**
 * E29: @chenglou/pretext — 참고 스니펫 (데모 없음)
 */
import { CraftSection } from '../../CraftSection';

const PRETEXT_SNIPPET = `import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';

const font = '10px ui-monospace, monospace';
const block = lines.join('\\n'); // 격자 문자열 (실루엣 마스크 반영)

const prepared = prepareWithSegments(block, font, { whiteSpace: 'pre-wrap' });
const layout = layoutWithLines(prepared, 65536, lineHeight);

// Canvas: layout.lines[i].text 를 lineHeight 간격으로 fillText`;

export function PretextLayoutCraft() {
  return (
    <CraftSection
      id="pretext-layout"
      title="Pretext 텍스트 레이아웃"
      description={
        <>
          격자 문자열을 <code>prepareWithSegments</code>로 측정 가능한 단위로 나눈 뒤,{' '}
          <code>layoutWithLines</code>로 줄 메트릭을 얻고 Canvas <code>fillText</code>로 그린다.
          Golconda 신사 실루엣 등에서 같은 API 흐름을 쓴다.
        </>
      }
      code={PRETEXT_SNIPPET}
    />
  );
}
