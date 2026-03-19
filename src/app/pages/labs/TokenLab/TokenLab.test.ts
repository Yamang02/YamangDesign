import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AliasSection, GlobalSection, ShellTokensSection, SysTokensSection } from './TokenLab';

describe('TokenLab collapse behavior', () => {
  it('hides Global Color table when collapsed', () => {
    const html = renderToStaticMarkup(
      React.createElement(GlobalSection, {
        search: '',
        sortMode: 'semantic',
        collapsed: { 'global:Color': true },
        onToggleCollapsed: () => {},
      })
    );

    expect(html).not.toContain('primary-500');
  });

  it('hides Shell bg table when collapsed', () => {
    const html = renderToStaticMarkup(
      React.createElement(ShellTokensSection, {
        search: '',
        sortMode: 'semantic',
        collapsed: { 'shell:배경 (bg)': true },
        onToggleCollapsed: () => {},
      })
    );

    expect(html).not.toContain('base');
  });

  it('hides Alias bg table when collapsed', () => {
    const html = renderToStaticMarkup(
      React.createElement(AliasSection, {
        search: '',
        sortMode: 'semantic',
        collapsed: { 'alias:배경 (bg)': true },
        onToggleCollapsed: () => {},
      })
    );

    expect(html).not.toContain('surface-low');
  });

  it('hides System Error table when collapsed', () => {
    const html = renderToStaticMarkup(
      React.createElement(SysTokensSection, {
        search: '',
        sortMode: 'semantic',
        collapsed: { 'sys:Error': true },
        onToggleCollapsed: () => {},
      })
    );

    expect(html).not.toContain('error-subtle');
  });
});
