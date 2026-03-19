import { describe, expect, it } from 'vitest';
import { navCategories } from './nav-categories';

describe('navCategories', () => {
  it('places layouts before labs', () => {
    const ids = navCategories.map((category) => category.id);
    expect(ids[0]).toBe('layouts');
    expect(ids[1]).toBe('labs');
  });

  it('defines three layout pages in layouts dropdown', () => {
    const layouts = navCategories.find((category) => category.id === 'layouts');
    expect(layouts?.items?.map((item) => item.id)).toEqual([
      'layout-landing',
      'layout-dashboard',
      'layout-article',
    ]);
  });
});
