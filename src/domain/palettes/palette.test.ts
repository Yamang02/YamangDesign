import { describe, it, expect } from 'vitest';
import {
  resolvePalette,
  generateColorScale,
  generateColorScales,
} from './palette';

describe('resolvePalette', () => {
  it('primary만 제공하면 나머지를 자동 파생', () => {
    const result = resolvePalette({ primary: '#FF0000' });
    expect(result.primary).toBe('#FF0000');
    expect(result.secondary).toBeTruthy();
    expect(result.accent).toBeTruthy();
    expect(result.neutral).toBeTruthy();
    expect(result.sub).toBeTruthy();
  });

  it('자동 파생된 색상은 _meta.derived가 true', () => {
    const result = resolvePalette({ primary: '#FF0000' });
    expect(result._meta.derived.secondary).toBe(true);
    expect(result._meta.derived.accent).toBe(true);
    expect(result._meta.derived.neutral).toBe(true);
    expect(result._meta.derived.sub).toBe(true);
  });

  it('명시적으로 제공한 색상은 _meta.derived가 false', () => {
    const result = resolvePalette({
      primary: '#FF0000',
      secondary: '#00FF00',
      accent: '#0000FF',
    });
    expect(result.secondary).toBe('#00FF00');
    expect(result.accent).toBe('#0000FF');
    expect(result._meta.derived.secondary).toBe(false);
    expect(result._meta.derived.accent).toBe(false);
  });

  it('sub만 제공하면 neutral은 sub에서 파생', () => {
    const result = resolvePalette({
      primary: '#FF0000',
      sub: '#FFAAAA',
    });
    expect(result.sub).toBe('#FFAAAA');
    expect(result.neutral).toBe('#FFAAAA'); // neutral = sub when no neutral provided
    expect(result._meta.derived.sub).toBe(false);
  });

  it('neutral을 명시하면 해당 값 사용', () => {
    const result = resolvePalette({
      primary: '#FF0000',
      neutral: '#888888',
    });
    expect(result.neutral).toBe('#888888');
    expect(result._meta.derived.neutral).toBe(false);
  });
});

describe('generateColorScale', () => {
  it('10단계 스케일 생성', () => {
    const scale = generateColorScale('#FF0000');
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
    for (const step of steps) {
      expect(scale[step]).toBeTruthy();
      expect(scale[step]).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('500 단계는 원본 색상', () => {
    const scale = generateColorScale('#FF0000');
    expect(scale[500]).toBe('#FF0000');
  });

  it('50 → 900 순으로 밝기 감소', () => {
    const scale = generateColorScale('#3366FF');
    // 50이 가장 밝고 900이 가장 어두워야 함
    expect(scale[50]).not.toBe(scale[900]);
  });
});

describe('generateColorScales', () => {
  it('모든 팔레트 키에 대해 스케일 생성', () => {
    const resolved = resolvePalette({ primary: '#FF0000' });
    const scales = generateColorScales(resolved);

    expect(scales.primary).toBeDefined();
    expect(scales.secondary).toBeDefined();
    expect(scales.accent).toBeDefined();
    expect(scales.neutral).toBeDefined();
    expect(scales.sub).toBeDefined();
  });

  it('각 스케일은 10단계를 가짐', () => {
    const resolved = resolvePalette({ primary: '#3366FF' });
    const scales = generateColorScales(resolved);

    for (const key of ['primary', 'secondary', 'accent', 'neutral', 'sub'] as const) {
      expect(Object.keys(scales[key])).toHaveLength(10);
    }
  });
});
