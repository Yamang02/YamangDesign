import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ComparisonCard } from './ComparisonCard';

describe('ComparisonCard', () => {
  it('onClick이 없으면 루트가 div이다', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComparisonCard, {
        title: 'T',
        subtitle: 'S',
        children: 'body',
      })
    );
    expect(html.startsWith('<div')).toBe(true);
    expect(html).toContain('T');
    expect(html).toContain('S');
    expect(html).toContain('body');
  });

  it('onClick만 있으면 루트가 button이다', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComparisonCard, {
        title: 'T',
        onClick: () => {},
        children: 'c',
      })
    );
    expect(html.startsWith('<button')).toBe(true);
    expect(html).toContain('type="button"');
  });

  it('onClick과 headerAction이 함께 있으면 루트가 div role=button(중첩 버튼 방지)', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComparisonCard, {
        title: 'T',
        onClick: () => {},
        headerAction: React.createElement('button', { type: 'button' }, 'act'),
        children: 'c',
      })
    );
    expect(html.startsWith('<div')).toBe(true);
    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
  });

  it('headerAction이 있으면 헤더 액션 영역을 렌더한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComparisonCard, {
        title: 'T',
        onClick: () => {},
        headerAction: React.createElement('span', null, 'extra'),
        children: 'c',
      })
    );
    expect(html).toContain('카드 헤더 액션');
    expect(html).toContain('extra');
  });

  it('surfaceContent이면 콘텐츠 영역에 surface 클래스가 적용된다', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComparisonCard, {
        title: 'T',
        surfaceContent: true,
        children: 'inner',
      })
    );
    expect(html).toContain('inner');
  });
});
