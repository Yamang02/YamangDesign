import { useEffect, useState } from 'react';
import { LabLayout, LabSection, LabCard, ComparisonCard, type TocItem } from '../../../layouts';
import { Button, Input, Card, Badge, Select } from '../../../components';
import { componentTokenMap, sampleText } from '../../../constants';
import styles from './TokenLab.module.css';

const tocItems: TocItem[] = [
  { id: 'global-tokens', label: 'Global Tokens' },
  { id: 'alias-tokens', label: 'Alias Tokens' },
  { id: 'component-inspector', label: 'Component Inspector' },
];

function useCssVar(name: string): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      setValue(v);
    };
    read();
    const id = window.setInterval(read, 500);
    return () => window.clearInterval(id);
  }, [name]);

  return value;
}

function ColorTokenCard({ token }: { token: string }) {
  const value = useCssVar(token);
  return (
    <div className={styles.tokenCard}>
      <div className={styles.tokenHeader}>
        <div className={styles.row}>
          <div
            className={styles.swatch}
            style={{ backgroundColor: value || `var(${token})` }}
          />
          <div className={styles.meta}>
            <span className={styles.label}>Token</span>
            <code className={styles.tokenName}>{token}</code>
          </div>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.label}>Current value</span>
        <span className={styles.tokenValue}>{value || '(not set)'}</span>
      </div>
    </div>
  );
}

function GlobalSection() {
  const globalColorTokens = [
    '--ds-color-primary-500',
    '--ds-color-secondary-500',
    '--ds-color-accent-500',
    '--ds-color-neutral-500',
    '--ds-color-sub-500',
  ];

  return (
    <section id="global-tokens" className={styles.tokenLab}>
      <h2 className={styles.sectionTitle}>Section 1 · Global Tokens</h2>
      <div className={styles.grid}>
        {globalColorTokens.map((token) => (
          <ColorTokenCard key={token} token={token} />
        ))}
      </div>
    </section>
  );
}

function AliasSection() {
  const aliasTokens = [
    '--ds-color-bg-base',
    '--ds-color-bg-surface',
    '--ds-color-bg-muted',
    '--ds-color-text-primary',
    '--ds-color-text-secondary',
    '--ds-color-border-default',
    '--ds-color-border-focus',
    '--ds-color-action-primary-default',
    '--ds-color-action-primary-hover',
    '--ds-color-action-primary-active',
  ];

  return (
    <section id="alias-tokens" className={styles.tokenLab}>
      <h2 className={styles.sectionTitle}>Section 2 · Alias Tokens</h2>
      <div className={styles.grid}>
        {aliasTokens.map((token) => (
          <ColorTokenCard key={token} token={token} />
        ))}
      </div>
    </section>
  );
}

type ComponentKey = keyof typeof componentTokenMap;

const COMPONENT_ORDER: ComponentKey[] = ['Button', 'Input', 'Card', 'Badge'];

function ComponentInspector() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>('Button');
  const tokens = componentTokenMap[activeComponent];

  return (
    <section id="component-inspector" className={styles.tokenLab}>
      <h2 className={styles.sectionTitle}>Section 3 · Component Inspector</h2>

      <div className={styles.componentTabs}>
        {COMPONENT_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            className={styles.componentTab}
            data-active={activeComponent === key}
            onClick={() => setActiveComponent(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className={styles.componentLayout}>
        <LabCard>
          <h3 className={styles.previewTitle}>사용 토큰 목록</h3>
          <div className={styles.tokenList}>
            {Object.entries(tokens).map(([role, token]) => (
              <div key={role} className={styles.tokenListItem}>
                <span className={styles.tokenRole}>{role}</span>
                <code className={styles.tokenNameInline}>{token}</code>
              </div>
            ))}
          </div>
        </LabCard>

        <div className={styles.previewCard}>
          <h3 className={styles.previewTitle}>라이브 프리뷰</h3>
          <div className={styles.previewBody}>
            {activeComponent === 'Button' && (
              <ComparisonCard title="Button">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </ComparisonCard>
            )}
            {activeComponent === 'Input' && (
              <ComparisonCard title="Input">
                <Input placeholder="이메일을 입력하세요" />
                <Input placeholder="에러 상태" isError errorMessage="필수 입력값입니다" />
              </ComparisonCard>
            )}
            {activeComponent === 'Card' && (
              <ComparisonCard title="Card">
                <Card padding="md">
                  <h4
                    style={{
                      margin: 0,
                      marginBottom: 'var(--ds-spacing-2)',
                      fontSize: 'var(--ds-text-lg)',
                      fontWeight: 'var(--ds-font-weight-semibold)',
                    }}
                  >
                    Card Title
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--ds-text-sm)',
                    }}
                  >
                    {sampleText.pangram.en}
                  </p>
                </Card>
              </ComparisonCard>
            )}
            {activeComponent === 'Badge' && (
              <ComparisonCard title="Badge">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
              </ComparisonCard>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TokenLab() {
  return (
    <LabLayout title="Token Lab" tocItems={tocItems}>
      <GlobalSection />
      <AliasSection />
      <ComponentInspector />
    </LabLayout>
  );
}
