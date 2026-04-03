/**
 * E29: border-image-slice — 참고 스니펫 (데모 없음)
 */
import { CraftSection } from '../../CraftSection';

const BORDER_IMAGE_SNIPPET = `.demo-box {
  box-sizing: border-box;
  width: 200px;
  height: 120px;
  color: var(--ds-color-primary-500);
  border-width: 16px;
  border-style: solid;
  border-image-source: repeating-linear-gradient(
    45deg,
    currentColor 0,
    currentColor 2px,
    transparent 0,
    transparent 50%
  );
  border-image-slice: 24;
  border-image-width: 16px;
  border-image-repeat: stretch;
}

/* fill 케이스: slice 뒤에 fill */
/* border-image-slice: 24 fill; */`;

export function BorderImageCraft() {
  return (
    <CraftSection
      id="border-image-slice"
      title="border-image-slice"
      description={
        <>
          <code>border-image</code>로 그라데이션·이미지를 테두리에 올릴 때{' '}
          <code>slice</code>는 9-슬라이스 분할, <code>repeat</code>는 가장자리 타일링(
          <code>stretch</code> · <code>repeat</code> · <code>round</code> 등),
          <code>fill</code>은 중앙 영역 채움 여부를 결정한다. 아래는 CSS gradient만 소스로 쓴 예시다.
        </>
      }
      code={BORDER_IMAGE_SNIPPET}
    />
  );
}
