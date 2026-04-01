/**
 * E10: 공유 토큰 섹션 — Build 모달 내 Design/Key tokens 표시
 * Atoms, Molecules, Organisms 공통 사용. 카테고리 자동 분류, 빈 카테고리 스킵.
 */
import { useMemo } from 'react';
import type { TokenSectionProps } from './TokenSection.types';
import styles from '../../pages/build/Components/Components.module.css';

type TokenCategory = 'color' | 'spacing' | 'typography' | 'size' | 'shadow' | 'other';

const CATEGORY_ORDER: TokenCategory[] = ['color', 'spacing', 'typography', 'size', 'shadow', 'other'];

const CATEGORY_LABELS: Record<TokenCategory, string> = {
  color: '색상',
  spacing: '간격 / 모양',
  typography: '타이포그래피',
  size: '크기 / 테두리',
  shadow: '그림자 / 트랜지션',
  other: '기타',
};

function getTokenCategory(token: string): TokenCategory {
  if (token.includes('color')) return 'color';
  if (token.includes('spacing') || token.includes('radius') || token.includes('z-')) return 'spacing';
  if (token.includes('font') || token.includes('text-') || token.includes('weight') || token.includes('leading')) return 'typography';
  if (token.includes('size') || token.includes('border')) return 'size';
  if (token.includes('shadow') || token.includes('transition')) return 'shadow';
  return 'other';
}

function stripPrefix(token: string): string {
  return token.replace(/^--(ds|sys|shell)-/, '');
}

export function TokenSection({ tokens }: Readonly<TokenSectionProps>) {
  const values = useMemo(() => {
    const computed = getComputedStyle(document.documentElement);
    const result: Record<string, string> = {};
    tokens.forEach(({ token }) => {
      result[token] = computed.getPropertyValue(token).trim() || '(미정의)';
    });
    return result;
  }, [tokens]);

  if (!tokens.length) return null;

  const unique = Array.from(new Map(tokens.map((t) => [t.token, t])).values());

  const byCategory = unique.reduce<Record<TokenCategory, typeof unique>>(
    (acc, t) => {
      const cat = getTokenCategory(t.token);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(t);
      return acc;
    },
    {} as Record<TokenCategory, typeof unique>
  );

  return (
    <div className={styles.componentDetail}>
      {CATEGORY_ORDER.map((cat) => {
        const list = byCategory[cat];
        if (!list?.length) return null;
        return (
          <section key={cat} className={styles.tokenGroup}>
            <h4 className={styles.tokenGroupTitle}>{CATEGORY_LABELS[cat]}</h4>
            <div className={styles.tokenTable}>
              {list.map(({ token, label }) => {
                const value = values[token] ?? '(로딩 중…)';
                const isColor =
                  token.includes('color') &&
                  (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));
                return (
                  <div key={token} className={styles.tokenRow}>
                    <div className={styles.tokenMeta}>
                      <code className={styles.tokenName}>{stripPrefix(token)}</code>
                      {label && <span className={styles.tokenLabel}>{label}</span>}
                    </div>
                    <div className={styles.tokenValueCell}>
                      {isColor && (
                        <span
                          className={styles.tokenSwatch}
                          style={{ backgroundColor: value }}
                          title={value}
                        />
                      )}
                      <code className={styles.tokenValue}>{value}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
