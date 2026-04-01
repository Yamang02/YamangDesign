import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('이미지가 있으면 img를 렌더한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Avatar, {
        src: '/a.png',
        alt: '사용자',
        initials: 'AB',
      })
    );
    expect(html).toContain('<img');
    expect(html).toContain('src="/a.png"');
    expect(html).toContain('alt="사용자"');
  });

  it('자식이 있으면 자식을 표시한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        Avatar,
        { initials: 'X' },
        React.createElement('span', { 'data-testid': 'child' }, 'child')
      )
    );
    expect(html).toContain('child');
    expect(html).not.toContain('X');
  });

  it('src·children이 없으면 이니셜을 표시한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Avatar, { initials: 'JD' })
    );
    expect(html).toContain('JD');
    expect(html).not.toContain('<img');
  });

  it('size·variant를 data 속성으로 반영한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Avatar, {
        initials: 'A',
        size: 'lg',
        variant: 'primary',
      })
    );
    expect(html).toContain('data-size="lg"');
    expect(html).toContain('data-variant="primary"');
  });
});
