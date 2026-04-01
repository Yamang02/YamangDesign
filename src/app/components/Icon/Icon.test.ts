import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('material 아이콘이 SVG path를 렌더한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Icon, { name: 'home', library: 'material' })
    );
    expect(html).toContain('<svg');
    expect(html).toContain('<path');
    expect(html).toContain('viewBox="0 0 24 24"');
  });

  it('nucleo 아이콘이 stroke 기반 SVG를 렌더한다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Icon, { name: 'sun', library: 'nucleo' })
    );
    expect(html).toContain('stroke=');
    expect(html).toContain('<path');
  });

  it('title이 있으면 svg에 title 요소를 넣는다', () => {
    const html = renderToStaticMarkup(
      React.createElement(Icon, {
        name: 'home',
        library: 'material',
        title: '홈',
      })
    );
    expect(html).toContain('<title');
    expect(html).toContain('홈');
  });

  it('존재하지 않는 material 이름이면 경고 후 null', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = renderToStaticMarkup(
      React.createElement(Icon, {
        name: 'definitely-missing-icon-xyz',
        library: 'material',
      })
    );
    expect(html).toBe('');
    expect(warn).toHaveBeenCalledWith(
      'Icon "definitely-missing-icon-xyz" not found in material library'
    );
    warn.mockRestore();
  });

  it('존재하지 않는 nucleo 이름이면 경고 후 null', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = renderToStaticMarkup(
      React.createElement(Icon, {
        name: 'missing-nucleo',
        library: 'nucleo',
      })
    );
    expect(html).toBe('');
    expect(warn).toHaveBeenCalledWith(
      'Icon "missing-nucleo" not found in nucleo library'
    );
    warn.mockRestore();
  });
});
