/**
 * E06 P03: Token Lab 3-레이어 뷰
 * --shell-* / --ds-* / --sys-* 구분, Architecture 다이어그램, 카테고리별 토큰 표시
 */
import { useEffect, useState } from 'react';
import {
  LabLayout,
  LabSection,
  LabCard,
  ComparisonCard,
  type TocItem,
  type TocItemTree,
} from '../../../layouts';
import { Button, Input, Card, Badge } from '../../../components';
import { componentTokenMap, sampleText, getThemeVariables } from '../../../constants';
import { useTheme } from '../../../themes';
import styles from './TokenLab.module.css';

const tocItems: (TocItem | TocItemTree)[] = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'shell-tokens', label: 'Shell Tokens' },
  {
    id: 'ds-tokens',
    label: 'DS Tokens',
    children: [
      { id: 'ds-global', label: 'Global' },
      { id: 'ds-alias', label: 'Alias' },
    ],
  },
  { id: 'sys-tokens', label: 'Sys Tokens' },
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

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Architecture: 3-layer diagram ---
function LayerDiagram() {
  return (
    <LabSection title="Architecture" id="architecture" card={false}>
      <div className={styles.layerDiagram} role="img" aria-label="3-layer token architecture">
        <div className={styles.diagramBlock}>
          <h3 className={styles.diagramTitle}>[data-shell] 컨텍스트</h3>
          <ul className={styles.diagramList}>
            <li>
              <code>--shell-bg-base</code> → <code>--ds-color-bg-base</code>
            </li>
            <li>
              <code>--shell-text-primary</code> → <code>--ds-color-text-primary</code>
            </li>
            <li>
              <code>--shell-shadow-*</code> → <code>--ds-shadow-*</code>
            </li>
          </ul>
          <p className={styles.diagramNote}>고정 라이트, 테마 무관</p>
          <button
            type="button"
            className={styles.diagramLink}
            onClick={() => scrollToSection('shell-tokens')}
          >
            Shell Tokens →
          </button>
        </div>

        <div className={styles.diagramArrow} aria-hidden>
          ↓
        </div>

        <div className={styles.diagramBlock}>
          <h3 className={styles.diagramTitle}>:root DS 컨텍스트 (ThemeProvider)</h3>
          <ul className={styles.diagramList}>
            <li>
              <code>--ds-color-bg-base</code> ← 팔레트 × 스타일
            </li>
            <li>
              <code>--ds-shadow-*</code> ← 스타일 정의
            </li>
          </ul>
          <p className={styles.diagramNote}>테마 반응형</p>
          <button
            type="button"
            className={styles.diagramLink}
            onClick={() => scrollToSection('ds-global')}
          >
            DS Tokens →
          </button>
        </div>

        <div className={styles.diagramArrow} aria-hidden>
          ↓
        </div>

        <div className={styles.diagramBlock}>
          <h3 className={styles.diagramTitle}>[어디서나] Sys 토큰</h3>
          <ul className={styles.diagramList}>
            <li>
              <code>--sys-color-error</code>, <code>--sys-color-warning</code>
            </li>
            <li>
              <code>--sys-color-success</code>, <code>--sys-color-info</code>
            </li>
          </ul>
          <p className={styles.diagramNote}>상태 색상, 테마 무관</p>
          <button
            type="button"
            className={styles.diagramLink}
            onClick={() => scrollToSection('sys-tokens')}
          >
            Sys Tokens →
          </button>
        </div>
      </div>
    </LabSection>
  );
}

// --- Token cards ---
function ColorTokenCard({ token }: { token: string }) {
  const value = useCssVar(token);
  return (
    <div className={styles.tokenCard}>
      <div className={styles.tokenHeader}>
        <div className={styles.row}>
          <div
            className={styles.swatch}
            data-context="preview"
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

function ScalarTokenCard({ token }: { token: string }) {
  const value = useCssVar(token);
  return (
    <div className={styles.scalarCard}>
      <code className={styles.tokenName}>{token}</code>
      <span className={styles.tokenValue}>{value || '(not set)'}</span>
    </div>
  );
}

// --- Shell Tokens ---
const SHELL_CATEGORIES: { title: string; tokens: string[] }[] = [
  {
    title: '배경 (bg)',
    tokens: [
      '--shell-bg-base',
      '--shell-bg-subtle',
      '--shell-bg-surface',
      '--shell-bg-muted',
      '--shell-bg-elevated',
      '--shell-bg-hover',
      '--shell-bg-primary-subtle',
    ],
  },
  {
    title: '텍스트 (text)',
    tokens: [
      '--shell-text-primary',
      '--shell-text-secondary',
      '--shell-text-tertiary',
      '--shell-text-muted',
      '--shell-text-on-action',
    ],
  },
  {
    title: '경계선 (border)',
    tokens: [
      '--shell-border-default',
      '--shell-border-subtle',
      '--shell-border-strong',
      '--shell-border-hover',
      '--shell-border-focus',
    ],
  },
  {
    title: '액션 (action)',
    tokens: ['--shell-action-primary', '--shell-action-hover', '--shell-action-active'],
  },
  {
    title: '포커스',
    tokens: ['--shell-focus-ring', '--shell-focus-glow'],
  },
  {
    title: '그림자 (shadow)',
    tokens: ['--shell-shadow-sm', '--shell-shadow-md', '--shell-shadow-lg'],
  },
  {
    title: '오버레이',
    tokens: ['--shell-overlay', '--shell-tooltip-bg', '--shell-tooltip-text'],
  },
  {
    title: '배지 (badge)',
    tokens: ['--shell-badge-custom', '--shell-badge-semantic', '--shell-badge-natural'],
  },
];

function ShellTokensSection() {
  return (
    <LabSection title="Shell Tokens" id="shell-tokens">
      <p className={styles.sectionDesc}>
        <code>shell-variables.css</code> :root — 고정 라이트 크롬. [data-shell]에서 DS 오버라이드.
      </p>
      {SHELL_CATEGORIES.map((cat) => (
        <div key={cat.title} className={styles.tokenCategory}>
          <h3 className={styles.categoryTitle}>{cat.title}</h3>
          <div className={styles.grid}>
            {cat.tokens.map((token) => {
              const isShadow = token.includes('shadow') || token.includes('focus-glow');
              if (isShadow) {
                return <ScalarTokenCard key={token} token={token} />;
              }
              return <ColorTokenCard key={token} token={token} />;
            })}
          </div>
        </div>
      ))}
    </LabSection>
  );
}

// --- DS Global ---
const GLOBAL_COLOR_TOKENS = [
  '--ds-color-primary-500',
  '--ds-color-secondary-500',
  '--ds-color-accent-500',
  '--ds-color-neutral-500',
  '--ds-color-sub-500',
];

const GLOBAL_SPACING_TOKENS = [
  '--ds-spacing-1',
  '--ds-spacing-2',
  '--ds-spacing-3',
  '--ds-spacing-4',
  '--ds-spacing-5',
  '--ds-spacing-6',
];

const GLOBAL_TYPOGRAPHY_TOKENS = [
  '--ds-text-xs',
  '--ds-text-sm',
  '--ds-text-md',
  '--ds-text-lg',
  '--ds-font-sans',
  '--ds-font-mono',
];

const GLOBAL_MOTION_TOKENS = [
  '--ds-duration-fast',
  '--ds-duration-normal',
  '--ds-duration-slow',
  '--ds-ease-easeOut',
  '--ds-ease-productive',
];

function GlobalSection() {
  return (
    <LabSection title="Global" id="ds-global">
      <p className={styles.sectionDesc}>원시 토큰 — color scale, spacing, typography, motion.</p>
      <div className={styles.tokenCategory}>
        <h3 className={styles.categoryTitle}>Color</h3>
        <div className={styles.grid}>
          {GLOBAL_COLOR_TOKENS.map((token) => (
            <ColorTokenCard key={token} token={token} />
          ))}
        </div>
      </div>
      <div className={styles.tokenCategory}>
        <h3 className={styles.categoryTitle}>Spacing</h3>
        <div className={styles.grid}>
          {GLOBAL_SPACING_TOKENS.map((token) => (
            <ScalarTokenCard key={token} token={token} />
          ))}
        </div>
      </div>
      <div className={styles.tokenCategory}>
        <h3 className={styles.categoryTitle}>Typography</h3>
        <div className={styles.grid}>
          {GLOBAL_TYPOGRAPHY_TOKENS.map((token) => (
            <ScalarTokenCard key={token} token={token} />
          ))}
        </div>
      </div>
      <div className={styles.tokenCategory}>
        <h3 className={styles.categoryTitle}>Motion</h3>
        <div className={styles.grid}>
          {GLOBAL_MOTION_TOKENS.map((token) => (
            <ScalarTokenCard key={token} token={token} />
          ))}
        </div>
      </div>
    </LabSection>
  );
}

// --- DS Alias ---
const ALIAS_TOKENS = [
  '--ds-color-bg-base',
  '--ds-color-bg-surface',
  '--ds-color-bg-surfaceBrand',
  '--ds-color-bg-elevated',
  '--ds-color-bg-muted',
  '--ds-color-text-primary',
  '--ds-color-text-secondary',
  '--ds-color-text-muted',
  '--ds-color-text-inverse',
  '--ds-color-text-on-action',
  '--ds-color-border-default',
  '--ds-color-border-subtle',
  '--ds-color-border-accent',
  '--ds-color-border-focus',
  '--ds-color-action-primary-default',
  '--ds-color-action-primary-hover',
  '--ds-color-action-primary-active',
  '--ds-color-action-secondary-default',
  '--ds-color-action-secondary-hover',
  '--ds-color-action-secondary-active',
  '--ds-color-action-accent-default',
  '--ds-color-action-accent-hover',
  '--ds-color-action-accent-active',
];

function AliasSection() {
  return (
    <LabSection title="Alias" id="ds-alias">
      <p className={styles.sectionDesc}>
        의미 토큰 — ThemeProvider 주입, 테마 전환 시 실시간 반영.
      </p>
      <div className={styles.grid}>
        {ALIAS_TOKENS.map((token) => (
          <ColorTokenCard key={token} token={token} />
        ))}
      </div>
    </LabSection>
  );
}

// --- Sys Tokens ---
const SYS_GROUPS: { title: string; tokens: string[] }[] = [
  {
    title: 'Error',
    tokens: ['--sys-color-error', '--sys-color-error-subtle', '--sys-color-error-emphasis'],
  },
  {
    title: 'Warning',
    tokens: [
      '--sys-color-warning',
      '--sys-color-warning-subtle',
      '--sys-color-warning-emphasis',
    ],
  },
  {
    title: 'Success',
    tokens: [
      '--sys-color-success',
      '--sys-color-success-subtle',
      '--sys-color-success-emphasis',
    ],
  },
  {
    title: 'Info',
    tokens: ['--sys-color-info', '--sys-color-info-subtle', '--sys-color-info-emphasis'],
  },
];

function SysSubRow({ token }: { token: string }) {
  const value = useCssVar(token);
  return (
    <div className={styles.sysSubRow}>
      <span
        className={styles.sysSwatchSmall}
        style={{ backgroundColor: value || `var(${token})` }}
        title={value}
      />
      <code className={styles.tokenNameInline}>{token}</code>
    </div>
  );
}

function SystemColorGroup({
  title,
  tokens,
}: {
  title: string;
  tokens: string[];
}) {
  const [base, ...rest] = tokens;
  const baseValue = useCssVar(base);

  return (
    <div className={styles.sysGroup}>
      <h3 className={styles.sysGroupTitle}>{title}</h3>
      <div className={styles.sysGroupMain}>
        <div
          className={styles.sysSwatchLarge}
          style={{ backgroundColor: baseValue || `var(${base})` }}
          title={baseValue}
        />
        <code className={styles.tokenName}>{base}</code>
      </div>
      <div className={styles.sysGroupSub}>
        {rest.map((token) => (
          <SysSubRow key={token} token={token} />
        ))}
      </div>
    </div>
  );
}

function SysTokensSection() {
  return (
    <LabSection title="Sys Tokens" id="sys-tokens">
      <p className={styles.sectionDesc}>
        <code>sys-variables.css</code> — 상태 색상, 테마/컨텍스트 무관.
      </p>
      <div className={styles.sysGrid}>
        {SYS_GROUPS.map((g) => (
          <SystemColorGroup key={g.title} title={g.title} tokens={g.tokens} />
        ))}
      </div>
      <div className={styles.sysUsage}>
        <h3 className={styles.categoryTitle}>사용 예시</h3>
        <div className={styles.sysUsageRow} data-context="preview">
          <Input placeholder="정상" />
          <Input placeholder="에러 상태" isError errorMessage="필수 입력값입니다" />
          <Badge variant="primary">Primary</Badge>
        </div>
      </div>
    </LabSection>
  );
}

// --- Component Inspector ---
type ComponentKey = keyof typeof componentTokenMap;
const COMPONENT_ORDER: ComponentKey[] = ['Button', 'Input', 'Card', 'Badge'];

function TokenListRow({ role, token }: { role: string; token: string }) {
  const value = useCssVar(token);
  const isColor =
    value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
  return (
    <div className={styles.tokenListItem}>
      <span className={styles.tokenRole}>{role}</span>
      <div className={styles.tokenListValue}>
        {isColor && (
          <span
            className={styles.tokenListSwatch}
            style={{ backgroundColor: value }}
            title={value}
          />
        )}
        <code className={styles.tokenNameInline}>{value || token}</code>
      </div>
    </div>
  );
}

function ComponentInspector() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>('Button');
  const tokens = componentTokenMap[activeComponent];
  const { theme } = useTheme();
  const styleVars = getThemeVariables(theme.palette, theme.style);

  return (
    <LabSection title="Component Inspector" id="component-inspector">
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
              <TokenListRow key={role} role={role} token={token} />
            ))}
          </div>
        </LabCard>

        <div className={styles.previewCard}>
          <h3 className={styles.previewTitle}>라이브 프리뷰 (테마 반응형)</h3>
          <div className={styles.previewBody}>
            {activeComponent === 'Button' && (
              <ComparisonCard title="Button" styleVars={styleVars}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </ComparisonCard>
            )}
            {activeComponent === 'Input' && (
              <ComparisonCard title="Input" styleVars={styleVars}>
                <Input placeholder="이메일을 입력하세요" />
                <Input placeholder="에러 상태" isError errorMessage="필수 입력값입니다" />
              </ComparisonCard>
            )}
            {activeComponent === 'Card' && (
              <ComparisonCard title="Card" styleVars={styleVars}>
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
                  <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)' }}>{sampleText.pangram.en}</p>
                </Card>
              </ComparisonCard>
            )}
            {activeComponent === 'Badge' && (
              <ComparisonCard title="Badge" styleVars={styleVars}>
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
              </ComparisonCard>
            )}
          </div>
        </div>
      </div>
    </LabSection>
  );
}

export function TokenLab() {
  return (
    <LabLayout title="Token Lab" tocItems={tocItems}>
      <LayerDiagram />
      <ShellTokensSection />
      <section id="ds-tokens" className={styles.dsTokensWrapper}>
        <h2 className={styles.sectionTitle}>DS Tokens</h2>
        <div className={styles.sectionContent}>
          <GlobalSection />
          <AliasSection />
        </div>
      </section>
      <SysTokensSection />
      <ComponentInspector />
    </LabLayout>
  );
}
