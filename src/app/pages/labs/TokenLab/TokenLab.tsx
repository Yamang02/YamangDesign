/**
 * E06 P03: Token Lab 3-레이어 뷰
 * --shell-* / --ds-* / --sys-* 구분, Architecture 다이어그램, 카테고리별 토큰 표시
 * P04: Overview 항목을 ThemeTokenSet 데이터에서 동적 생성
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
import categoriesJson from '@shared/content/labs/token-lab/categories.json';
import styles from './TokenLab.module.css';

type ShellCategory = { title: string; tokens: string[]; fullRow?: boolean };
type TokenGroup = { title: string; tokens: string[] };
type GlobalGroup = { title: string; tokens: string[]; showSwatch: boolean; fullRow?: boolean };

type SortMode = 'semantic' | 'name';

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

function filterAndSortTokens(
  tokens: string[],
  search: string,
  sortMode: SortMode
): string[] {
  const q = search.trim().toLowerCase();
  const filtered = q ? tokens.filter((t) => t.toLowerCase().includes(q)) : tokens;
  if (sortMode === 'name') return [...filtered].sort((a, b) => a.localeCompare(b));
  return filtered;
}

function groupKey(prefix: string, title: string): string {
  return `${prefix}:${title}`;
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
const SHELL_CATEGORY_MAP: Record<string, string> = {
  bg: '배경 (bg)',
  text: '텍스트 (text)',
  border: '경계선 (border)',
  action: '액션 (action)',
  shadow: '그림자 (shadow)',
};

const DS_CATEGORY_MAP: Record<string, string> = {
  bg: '배경',
  text: '텍스트',
  border: '경계선',
  spacing: '간격',
  duration: 'motion',
  ease: 'motion',
};

const SYS_KEYWORDS: [string, string][] = [
  ['error', 'Error'],
  ['warning', 'Warning'],
  ['success', 'Success'],
  ['info', 'Info'],
];

const SHELL_TOKEN_RE = /^--shell-([a-z]+)/;

function getShellMeta(token: string): { layer: string; layerNote: string; category: string } {
  const m = SHELL_TOKEN_RE.exec(token);
  const cat = m ? m[1] : '—';
  return { layer: 'Shell', layerNote: '고정 라이트, 테마 무관', category: SHELL_CATEGORY_MAP[cat] ?? cat };
}

const DS_TOKEN_RE = /^--ds-(?:color-)?([a-z]+)/;

function getDsMeta(token: string): { layer: string; layerNote: string; category: string } {
  const m = DS_TOKEN_RE.exec(token);
  const cat = m ? m[1] : '—';
  return { layer: 'DS', layerNote: '테마 반응형 (ThemeProvider)', category: DS_CATEGORY_MAP[cat] ?? cat };
}

function getSysMeta(token: string): { layer: string; layerNote: string; category: string } {
  const found = SYS_KEYWORDS.find(([kw]) => token.includes(kw));
  return { layer: 'Sys', layerNote: '상태 색상, 테마 무관', category: found ? found[1] : '—' };
}

function getTokenMeta(token: string): { layer: string; layerNote: string; category: string } {
  if (token.startsWith('--shell-')) return getShellMeta(token);
  if (token.startsWith('--ds-')) return getDsMeta(token);
  if (token.startsWith('--sys-')) return getSysMeta(token);
  return { layer: '—', layerNote: '', category: '—' };
}


function TokenDetailContent({ token }: Readonly<{ token: string }>) {
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
}: Readonly<{
  token: string;
  displayLabel: string;
  showSwatchColumn: boolean;
  onSelect?: (token: string) => void;
  formatDisplayValue?: (token: string, value: string) => string;
}>) {
  const value = useCssVar(token);
  const displayValue = formatDisplayValue
    ? formatDisplayValue(token, value || '')
    : value || '(not set)';
  const showSwatch = showSwatchColumn && isColorValue(value);
  return (
    <tr // NOSONAR typescript:S6819 — 테이블 행 클릭 선택
      onClick={() => onSelect?.(token)} // NOSONAR
      style={{ cursor: onSelect ? 'pointer' : undefined }}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined} // NOSONAR
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
}: Readonly<{
  tokens: string[];
  showHeader?: boolean;
  showSwatchColumn?: boolean;
  onSelectToken?: (token: string) => void;
  formatDisplayValue?: (token: string, value: string) => string;
}>) {
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
export function ShellTokensSection({
  onSelectToken,
  search,
  sortMode,
  collapsed,
  onToggleCollapsed,
}: Readonly<{
  onSelectToken?: (token: string) => void;
  search: string;
  sortMode: SortMode;
  collapsed: Record<string, boolean>;
  onToggleCollapsed: (key: string) => void;
}>) {
  const gridCategories = SHELL_CATEGORIES.filter((c) => !c.fullRow);
  const fullRowCategories = SHELL_CATEGORIES.filter((c) => c.fullRow);

  return (
    <LabSection title="Shell" id="shell-tokens">
      <div className={styles.tokenCategoryGrid}>
        {gridCategories.map((cat) => (
          <div key={cat.title} className={styles.tokenCategory}>
            <button
              type="button"
              className={styles.groupHeaderBtn}
              aria-expanded={!collapsed[groupKey('shell', cat.title)]}
              onClick={() => onToggleCollapsed(groupKey('shell', cat.title))}
            >
              <span>{cat.title}</span>
              <span className={styles.groupHeaderIcon}>
                {collapsed[groupKey('shell', cat.title)] ? '+' : '-'}
              </span>
            </button>
            {!collapsed[groupKey('shell', cat.title)] && (
              <TokenTable
                tokens={filterAndSortTokens(cat.tokens, search, sortMode)}
                onSelectToken={onSelectToken}
                formatDisplayValue={formatTokenDisplayValue}
              />
            )}
          </div>
        ))}
      </div>
      {fullRowCategories.map((cat) => (
        <div key={cat.title} className={styles.tokenCategoryFullRow}>
          <button
            type="button"
            className={styles.groupHeaderBtn}
            aria-expanded={!collapsed[groupKey('shell', cat.title)]}
            onClick={() => onToggleCollapsed(groupKey('shell', cat.title))}
          >
            <span>{cat.title}</span>
            <span className={styles.groupHeaderIcon}>
              {collapsed[groupKey('shell', cat.title)] ? '+' : '-'}
            </span>
          </button>
          {!collapsed[groupKey('shell', cat.title)] && (
            <TokenTable
              tokens={filterAndSortTokens(cat.tokens, search, sortMode)}
              onSelectToken={onSelectToken}
              formatDisplayValue={formatTokenDisplayValue}
            />
          )}
        </div>
      ))}
    </LabSection>
  );
}

// --- DS Global ---
export function GlobalSection({
  onSelectToken,
  search,
  sortMode,
  collapsed,
  onToggleCollapsed,
}: Readonly<{
  onSelectToken?: (token: string) => void;
  search: string;
  sortMode: SortMode;
  collapsed: Record<string, boolean>;
  onToggleCollapsed: (key: string) => void;
}>) {
  const gridGroups = GLOBAL_GROUPS.filter((g) => !g.fullRow);
  const fullRowGroups = GLOBAL_GROUPS.filter((g) => g.fullRow);

  return (
    <LabPanel title="Global" id="ds-global">
      <div className={styles.tokenCategoryGrid}>
        {gridGroups.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <button
              type="button"
              className={styles.groupHeaderBtn}
              aria-expanded={!collapsed[groupKey('global', g.title)]}
              onClick={() => onToggleCollapsed(groupKey('global', g.title))}
            >
              <span>{g.title}</span>
              <span className={styles.groupHeaderIcon}>
                {collapsed[groupKey('global', g.title)] ? '+' : '-'}
              </span>
            </button>
            {!collapsed[groupKey('global', g.title)] && (
              <TokenTable
                tokens={filterAndSortTokens(g.tokens, search, sortMode)}
                showSwatchColumn={g.showSwatch}
                onSelectToken={onSelectToken}
                formatDisplayValue={formatTokenDisplayValue}
              />
            )}
          </div>
        ))}
      </div>
      {fullRowGroups.map((g) => (
        <div key={g.title} className={styles.tokenCategoryFullRow}>
          <button
            type="button"
            className={styles.groupHeaderBtn}
            aria-expanded={!collapsed[groupKey('global', g.title)]}
            onClick={() => onToggleCollapsed(groupKey('global', g.title))}
          >
            <span>{g.title}</span>
            <span className={styles.groupHeaderIcon}>
              {collapsed[groupKey('global', g.title)] ? '+' : '-'}
            </span>
          </button>
          {!collapsed[groupKey('global', g.title)] && (
            <TokenTable
              tokens={filterAndSortTokens(g.tokens, search, sortMode)}
              showSwatchColumn={g.showSwatch}
              onSelectToken={onSelectToken}
              formatDisplayValue={formatTokenDisplayValue}
            />
          )}
        </div>
      ))}
    </LabPanel>
  );
}

// --- DS Alias (역할별 세분화) ---
export function AliasSection({
  onSelectToken,
  search,
  sortMode,
  collapsed,
  onToggleCollapsed,
}: Readonly<{
  onSelectToken?: (token: string) => void;
  search: string;
  sortMode: SortMode;
  collapsed: Record<string, boolean>;
  onToggleCollapsed: (key: string) => void;
}>) {
  return (
    <LabPanel title="Alias" id="ds-alias">
      <div className={styles.tokenCategoryGrid}>
        {ALIAS_GROUPS.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <button
              type="button"
              className={styles.groupHeaderBtn}
              aria-expanded={!collapsed[groupKey('alias', g.title)]}
              onClick={() => onToggleCollapsed(groupKey('alias', g.title))}
            >
              <span>{g.title}</span>
              <span className={styles.groupHeaderIcon}>
                {collapsed[groupKey('alias', g.title)] ? '+' : '-'}
              </span>
            </button>
            {!collapsed[groupKey('alias', g.title)] && (
              <TokenTable
                tokens={filterAndSortTokens(g.tokens, search, sortMode)}
                showSwatchColumn
                onSelectToken={onSelectToken}
              />
            )}
          </div>
        ))}
      </div>
    </LabPanel>
  );
}

// --- Sys Tokens ---
export function SysTokensSection({
  onSelectToken,
  search,
  sortMode,
  collapsed,
  onToggleCollapsed,
}: Readonly<{
  onSelectToken?: (token: string) => void;
  search: string;
  sortMode: SortMode;
  collapsed: Record<string, boolean>;
  onToggleCollapsed: (key: string) => void;
}>) {
  return (
    <LabSection title="System" id="sys-tokens">
      <div className={styles.tokenCategoryGrid}>
        {SYS_GROUPS.map((g) => (
          <div key={g.title} className={styles.tokenCategory}>
            <button
              type="button"
              className={styles.groupHeaderBtn}
              aria-expanded={!collapsed[groupKey('sys', g.title)]}
              onClick={() => onToggleCollapsed(groupKey('sys', g.title))}
            >
              <span>{g.title}</span>
              <span className={styles.groupHeaderIcon}>
                {collapsed[groupKey('sys', g.title)] ? '+' : '-'}
              </span>
            </button>
            {!collapsed[groupKey('sys', g.title)] && (
              <TokenTable
                tokens={filterAndSortTokens(g.tokens, search, sortMode)}
                onSelectToken={onSelectToken}
              />
            )}
          </div>
        ))}
      </div>
    </LabSection>
  );
}


export function TokenLab() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('semantic');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const normalizedSearch = search.trim().toLowerCase();

  return (
    <>
      <LabLayout title="Token Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <TokenOverviewDiagram />
          </LabOverview>
        </LabSection>
        <div className={styles.tokenLabControls}>
          <div className={styles.controlRow}>
            <label className={styles.controlGroup}>
              <span className={styles.controlLabel}>검색</span>
              <input
                className={styles.controlInput}
                value={search}
                placeholder="토큰 이름/키워드 검색"
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label className={styles.controlGroup}>
              <span className={styles.controlLabel}>정렬</span>
              <select
                className={styles.controlSelect}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="semantic">역할/시멘틱 그룹 순</option>
                <option value="name">이름순(보조)</option>
              </select>
            </label>
          </div>
        </div>
        <ShellTokensSection
          onSelectToken={setSelectedToken}
          search={normalizedSearch}
          sortMode={sortMode}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />
        <LabSection title="Design System" id="ds-tokens" card={false}>
          <GlobalSection
            onSelectToken={setSelectedToken}
            search={normalizedSearch}
            sortMode={sortMode}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
          <AliasSection
            onSelectToken={setSelectedToken}
            search={normalizedSearch}
            sortMode={sortMode}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        </LabSection>
        <SysTokensSection
          onSelectToken={setSelectedToken}
          search={normalizedSearch}
          sortMode={sortMode}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />
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
