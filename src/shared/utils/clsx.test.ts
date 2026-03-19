import { describe, it, expect } from 'vitest';
import { clsx } from './clsx';

describe('clsx', () => {
  it('문자열을 그대로 반환', () => {
    expect(clsx('foo')).toBe('foo');
  });

  it('여러 문자열을 공백으로 병합', () => {
    expect(clsx('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('falsy 값(null, undefined, false, 빈 문자열)을 무시', () => {
    expect(clsx('foo', null, undefined, false, '', 'bar')).toBe('foo bar');
  });

  it('숫자를 문자열로 변환', () => {
    expect(clsx('foo', 42, 0)).toBe('foo 42 0');
  });

  it('객체의 truthy 키만 포함', () => {
    expect(clsx({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('배열을 재귀적으로 처리', () => {
    expect(clsx(['foo', ['bar', 'baz']])).toBe('foo bar baz');
  });

  it('문자열, 객체, 배열 혼합', () => {
    expect(clsx('a', { b: true, c: false }, ['d', 'e'])).toBe('a b d e');
  });

  it('인자 없으면 빈 문자열', () => {
    expect(clsx()).toBe('');
  });

  it('모두 falsy이면 빈 문자열', () => {
    expect(clsx(null, undefined, false)).toBe('');
  });
});
