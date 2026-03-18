/**
 * E06 P03: Token Lab 3-레이어 뷰
 * --shell-* / --ds-* / --sys-* 구분, Architecture 다이어그램, 카테고리별 토큰 표시
 */
import { useState } from 'react';
import {
  LabLayout,
  LabSection,
  LabPanel,
  LabOverview,
  TokenValueRow,
  MetadataTable,
  type TocItem,
  type TocItemTree,
} from '../../../layouts';
import { DetailPanel } from '../../../components';
import { useCssVar } from '@app/hooks/useCssVar';
import { formatStructuredDisplay } from '@shared/utils/css-structured';
import { TokenOverviewDiagram } from './TokenOverviewDiagram';
import categoriesJson from '../../../content/labs/token-lab/categories.json';
import styles from './TokenLab.module.css';

type ShellCategory = { title: string; tokens: string[]; fullRow?: boolean };
type TokenGroup = { title: string; tokens: string[] };
type GlobalGroup = { title: string; tokens: string[]; showSwatch: boolean; fullRow?: boolean };

const {
  shellCategories: SHELL_CATEGORIES,
  globalGroups: GLOBAL_GROUPS,
  aliasGroups: ALIAS_GROUPS,
  sysGroups: SYS_GROUPS,
} = categoriesJson as {
  shellCategories: ShellCategory[];
  globalGroups: GlobalGroup[];
  aliasGroups: TokenGroup[];
  sysGroups: TokenGroup[];
};

/** 구조화 필요한 값(shadow, border, transition 등)은 구조화 표기로 표시 */
function formatTokenDisplayValue(token: string, value: string): string {
  return formatStructuredDisplay(token, value || '');
}

const tocItems: (TocItem | TocItemTree)[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'shell-tokens', label: 'Shell' },
  {
    id: 'ds-tokens',
    label: 'Design System',
    children: [
      { id: 'ds-global', label: 'Global' },
      { id: 'ds-alias', label: 'Alias' },
    ],
  },
  { id: 'sys-tokens', label: 'System' },
];

// E08 P08: 토큰 → 카테고리·레이어 (Detail Panel용)
function getTokenMeta(token: string): { layer: string; layerNote: string; category: string } {
  if (token.startsWith('--shell-')) {
    const m = token.match(/^--shell-([a-z]+)/);
    const cat = m ? m[1] : '—';
    return {
      layer: 'Shell',
      layerNote: '고정 라이트, 테마 무관',
      category: cat === 'bg' ? '배경 (bg)' : cat === 'text' ? '텍스트 (text)' : cat === 'border' ? '경계선 (border)' : cat === 'action' ? '액션 (action)' : cat === 'shadow' ? '그림자 (shadow)' : cat,
    };
  }
  if (token.startsWith('--ds-')) {
    const m = token.match(/^--ds-(?:color-)?([a-z]+)/);
    const cat = m ? m[1] : '—';
    return {
      layer: 'DS',
      layerNote: '테마 반응형 (ThemeProvider)',
      category: cat === 'bg' ? '배경' : cat === 'text' ? '텍스트' : cat === 'border' ? '경계선' : cat === 'spacing' ? '간격' : cat === 'duration' || cat === 'ease' ? 'motion' : cat,
    };
  }
  if (token.startsWith('--sys-')) {
    return {
      layer: 'Sys',
      layerNote: '상태 색상, 테마 무관',
      category: token.includes('error') ? 'Error' : token.includes('warning') ? 'Warning' : token.includes('success') ? 'Success' : token.includes('info') ? 'Info' : '—',
    };
  }
  return { layer: '—', layerNote: '', category: '—' };
}


function TokenDetailContent({ token }: { token: string }) {
  const value = useCssVar(token);
  const meta = getTokenMeta(token);

  return (
    <div className={styles.tokenDetail}>
      <MetadataTable
        rows={[
          { key: '카테고리', value: meta.category },
          { key: '레이어', value: `${meta.layer} — ${meta.layerNote}` },
        ]}
      />
      <TokenValueRow
        label="현재 값"
        token={token}
        value={formatTokenDisplayValue(token, value || '')}
      />
    </div>
  );
}

// E08 P05: 공통 토큰 테이블 (Build Design tokens 패턴 정렬)
function isColorValue(value: string): boolean {
  if (!value) return false;
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl')
  );
}

/** 토큰 배열에서 공통 접두사 추출 — 첫 열에는 접미사만 표시 */
function getLongestCommonPrefix(tokens: string[]): string {
  if (tokens.length === 0) return '';
  let prefix = tokens[0];
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    while (prefix && !t.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) return '';
  }
  while (prefix.length > 0) {
    const allNonEmpty = tokens.every((t) => t.slice(prefix.length).length > 0);
    if (allNonEmpty) return prefix;
    const lastHyphen = prefix.lastIndexOf('-');
    if (lastHyphen <= 0) break;
    prefix = prefix.slice(0, lastHyphen + 1);
  }
  return prefix;
}

function TokenTableRow({
  token,
  displayLabel,
  showSwatchColumn,
  onSelect,
  formatDisplayValue,
}: {
  token: string;
  displayLabel: string;
  showSwatchColumn: boolean;
  onSelect?: (token: string) => void;
  formatDisplayValue?: (token: string, value: string) => string;
}) {
  const value = useCssVar(token);
  const displayValue = formatDisplayValue
    ? formatDisplayValue(token, value || '')
    : value || '(not set)';
  const showSwatch = showSwatchColumn && isColorValue(value);
  return (
    <tr
      onClick={() => onSelect?.(token)}
      style={{ cursor: onSelect ? 'pointer' : undefined }}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(token);
              }
            }
          : undefined
      }
    >
      <td className={styles.tokenNameCell} title={token}>
        <span className={styles.tokenNameInner}>{displayLabel}</span>
      </td>
      <td
        className={styles.tokenValueCell}
        title={value || undefined}
        data-structured={displayValue.includes('\n') ? true : undefined}
      >
        {displayValue}
      </td>
      {showSwatchColumn && (
        <td className={styles.tokenSwatchCell}>
          {showSwatch ? (
            <span
              className={styles.tokenSwatch}
              data-context="preview"
              style={{ backgroundColor: value }}
              title={value}
            />
          ) : null}
        </td>
      )}
    </tr>
  );
}

function TokenTable({
  tokens,
  showHeader = true,
  showSwatchColumn = true,
  onSelectToken,
  formatDisplayValue,
}: {
  tokens: string[];
  showHeader?: boolean;
  showSwatchColumn?: boolean;
  onSelectToken?: (token: string) => void;
  formatDisplayValue?: (token: string, value: string) => string;
}) {
  const prefix = getLongestCommonPrefix(tokens);
  const hasMeaningfulPrefix = prefix.length >= 3;
  const getDisplayLabel = (token: string) =>
    hasMeaningfulPrefix ? token.slice(prefix.length) || token : token;

  return (
    <div className={styles.tokenTableWrap}>
      <table
        className={styles.tokenTable}
        data-has-swatch={showSwatchColumn || undefined}
      >
        {showHeader && (
          <thead>
            <tr>
              <th>이름</th>
              <th>값</th>
              {showSwatchColumn && (
                <th className={styles.tokenSwatchTh} aria-label="스와치" />
              )}
            </tr>
          </thead>
        )}
        <tbody>
          {tokens.map((token) => (
            <TokenTableRow
              key={token}
              token={token}
              displayLabel={getDisplayLabel(token)}
              showSwatchColumn={showSwatchColumn}
              onSelect={onSelectToken}
              formatDisplayValue={formatDisplayValue}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Shell Tokens ---
function ShellTokensSection({ onSelectToken }: { onSelectToken?: (token: string) => void }) {
  const gridCategories = SHELL_CATEGORIES.filter((c) => !c.fullRow);
  const fullRowCategories = SHELL_CATEGORIES.filter((c) => c.fullRow);

  return (
    <LabSection title="Shell" id="shell-tokens">
      <div className={styles.tokenCategoryGrid}>
        {gridCategories.map((cat) => (
          <div key={cat.title} className={styles.tokenCategory}>
            <h3 className={styles.categoryTitle}>{cat.title}</h3>
            <TokenTable
              tokens={cat.tokens}
              onSelectToken={onSelectToken}
              formatDisplayValue={formatTokenDisplayValue}
            />
          </div>
        ))}
      </div>
      {fullRowCategories.map((cat) => (
        <div key={cat.title} className={styles.tokenCategoryFullRow}>
          <h3 className={styles.categoryTitle}>{cat.title}</h3>
          <TokenTable
              tokens={cat.tokens}
              onSelectToken={onSelectToken}
              formatDisplayValue={formatTokenDisplayValue}
            />
        </div>
      ))}
    </LabSection>
  );
}

// --- DS Global ---
function GlobalSection({ onSelectToken }: { onSelectToken?: (token: string) => void }) {
  const gridGroups = GLOBAL_GROUPS.filter((g) => !g.fullRow);
  const fullRowGroups = GLOBAL_GROUPS.filter((g) => g.fullRow);

  return (
    <LabPanel title="Global" id="ds-global">
      <div className={styles.tokenCategoryGrid}>
        {gridGroups.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <h3 className={styles.categoryTitle}>{g.title}</h3>
            <TokenTable
              tokens={g.tokens}
              showSwatchColumn={g.showSwatch}
              onSelectToken={onSelectToken}
              formatDisplayValue={formatTokenDisplayValue}
            />
          </div>
        ))}
      </div>
      {fullRowGroups.map((g) => (
        <div key={g.title} className={styles.tokenCategoryFullRow}>
          <h3 className={styles.categoryTitle}>{g.title}</h3>
          <TokenTable
            tokens={g.tokens}
            showSwatchColumn={g.showSwatch}
            onSelectToken={onSelectToken}
            formatDisplayValue={formatTokenDisplayValue}
          />
        </div>
      ))}
    </LabPanel>
  );
}

// --- DS Alias (역할별 세분화) ---
function AliasSection({ onSelectToken }: { onSelectToken?: (token: string) => void }) {
  return (
    <LabPanel title="Alias" id="ds-alias">
      <div className={styles.tokenCategoryGrid}>
        {ALIAS_GROUPS.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <h3 className={styles.categoryTitle}>{g.title}</h3>
            <TokenTable tokens={g.tokens} showSwatchColumn onSelectToken={onSelectToken} />
          </div>
        ))}
      </div>
    </LabPanel>
  );
}

// --- Sys Tokens ---
function SysTokensSection({ onSelectToken }: { onSelectToken?: (token: string) => void }) {
  return (
    <LabSection title="System" id="sys-tokens">
      <div className={styles.tokenCategoryGrid}>
        {SYS_GROUPS.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <h3 className={styles.categoryTitle}>{g.title}</h3>
            <TokenTable tokens={g.tokens} onSelectToken={onSelectToken} />
          </div>
        ))}
      </div>
    </LabSection>
  );
}


export function TokenLab() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  return (
    <>
      <LabLayout title="Token Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <TokenOverviewDiagram />
          </LabOverview>
        </LabSection>
        <ShellTokensSection onSelectToken={setSelectedToken} />
        <LabSection title="Design System" id="ds-tokens" card={false}>
          <GlobalSection onSelectToken={setSelectedToken} />
          <AliasSection onSelectToken={setSelectedToken} />
        </LabSection>
        <SysTokensSection onSelectToken={setSelectedToken} />
      </LabLayout>

      <DetailPanel
        open={selectedToken != null}
        onClose={() => setSelectedToken(null)}
        title={selectedToken ?? ''}
      >
        {selectedToken && <TokenDetailContent token={selectedToken} />}
      </DetailPanel>
    </>
  );
}
