import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('브랜드 로고·네비 슬롯·data-shell을 렌더한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        Header,
        { onLogoClick: () => {} },
        React.createElement('span', { 'data-testid': 'nav-slot' }, 'nav')
      )
    );
    expect(html).toContain('data-shell');
    expect(html).toContain('야망디자인');
    expect(html).toContain('nav-slot');
  });
});
