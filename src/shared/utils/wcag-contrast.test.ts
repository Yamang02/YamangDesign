import { describe, it, expect } from 'vitest';
import { WCAG21_CONTRAST } from './wcag-contrast';

describe('WCAG21_CONTRAST', () => {
  it('WCAG 2.1 §1.4.3 / §1.4.6 기준값과 일치', () => {
    expect(WCAG21_CONTRAST.AA_NORMAL_TEXT).toBe(4.5);
    expect(WCAG21_CONTRAST.AA_LARGE_TEXT).toBe(3);
    expect(WCAG21_CONTRAST.AAA_NORMAL_TEXT).toBe(7);
    expect(WCAG21_CONTRAST.AAA_LARGE_TEXT).toBe(4.5);
  });
});
