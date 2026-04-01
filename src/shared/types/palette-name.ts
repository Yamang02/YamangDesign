/**
 * 팔레트 ID 계약 — shared 단일 정의 (shared → domain 역방향 import 방지).
 * 런타임 소스는 `domain/constants/theme-presets`의 registry; **새 테마 추가 시 이 유니온에 id를 반드시 추가**한다.
 */
export type BuiltinPaletteId =
  | 'default'
  | 'spring-cream-soda-01'
  | 'vaporwave-neon'
  | 'swiss-mono'
  | 'memphis-pop'
  | 'bauhaus-classic'
  | 'art-deco-gold'
  | 'oriental-chinese-restaurant-01';

export type CustomSemanticPaletteId = `custom-semantic:${string}`;

export type PaletteName = BuiltinPaletteId | 'custom' | CustomSemanticPaletteId;
