/**
 * Color Usage Diagram - 브랜드 컬러 용도 시각화
 * PaletteLab 상단에 표시되는 인터랙티브 다이어그램
 * P04: 인터랙티브 모드 - 스와치 클릭 시 ScaleSelectionModal 또는 onTokenSelect (인라인)
 */
import { useState } from 'react';
import { resolveColorValue } from '../../../palettes/mapping/resolve';
import { ScaleSelectionModal } from './ScaleSelectionModal';
import type { SemanticTokenPath } from '../../../palettes/mapping/recommendations';
import type { BgStrategy, SemanticMapping } from '../../../palettes/types';
import type { ComputedPalette } from '../../../palettes/types';
import type { GeneratedScales } from '../../../@types/tokens';
import styles from './ColorUsageDiagram.module.css';

/** 편집 가능한 토큰 → SemanticTokenPath 매핑 (text.inverse, action-* 제외) */
const TOKEN_TO_PATH: Record<string, SemanticTokenPath> = {
  '--ds-color-bg-base': 'bg.base',
  '--ds-color-bg-surface': 'bg.surface',
  '--ds-color-bg-surface-brand': 'bg.surfaceBrand',
  '--ds-color-bg-elevated': 'bg.elevated',
  '--ds-color-bg-muted': 'bg.muted',
  '--ds-color-text-primary': 'text.primary',
  '--ds-color-text-secondary': 'text.secondary',
  '--ds-color-text-muted': 'text.muted',
  '--ds-color-text-on-action': 'text.onAction',
  '--ds-color-border-default': 'border.default',
  '--ds-color-border-subtle': 'border.subtle',
  '--ds-color-border-accent': 'border.accent',
  '--ds-color-border-focus': 'border.focus',
};

interface ColorRole {
  key: string;
  label: string;
  description: string;
  usages: string[];
  cssVar: string;
}

const colorRoles: ColorRole[] = [
  {
    key: 'primary',
    label: 'Primary',
    description: '브랜드 정체성, 주요 액션',
    usages: ['주요 버튼', 'CTA', '링크', '로고', '포커스 링'],
    cssVar: '--ds-color-primary-500',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    description: '보조 액션, 대안적 강조',
    usages: ['보조 버튼', '선택된 항목', '태그', '탭'],
    cssVar: '--ds-color-secondary-500',
  },
  {
    key: 'accent',
    label: 'Accent',
    description: '하이라이트, 주의 끌기',
    usages: ['CTA 강조', '배지', '알림', '프로모션'],
    cssVar: '--ds-color-accent-500',
  },
  {
    key: 'sub',
    label: 'Sub',
    description: '미묘한 강조, 보조 UI',
    usages: ['비활성 요소', '구분선', '아이콘', '보조 텍스트'],
    cssVar: '--ds-color-sub-500',
  },
  {
    key: 'neutral',
    label: 'Neutral',
    description: '배경, 텍스트, 테두리',
    usages: ['본문 텍스트', '배경', '테두리', '그림자'],
    cssVar: '--ds-color-neutral-500',
  },
];

/** 코드에서 사용하는 시맨틱 토큰 (ThemeProvider가 theme.colors → --ds-color-* 로 주입) */
interface SemanticToken {
  token: string;
  note: string;
  /** light-bg 기준 프리미티브 매핑 (예: neutral-300, primary-500) */
  source?: string | null;
}

const semanticMappings: Array<{ category: string; items: SemanticToken[] }> = [
  {
    category: 'Background',
    items: [
      { token: '--ds-color-bg-base', note: '페이지 배경', source: null },
      { token: '--ds-color-bg-surface', note: 'Flat 카드', source: 'neutral-50' },
      { token: '--ds-color-bg-surface-brand', note: '브랜드톤이 가미된 배경', source: 'primary-50' },
      { token: '--ds-color-bg-elevated', note: '모달, 팝오버', source: null },
      { token: '--ds-color-bg-muted', note: '비활성 영역', source: 'neutral-100' },
    ],
  },
  {
    category: 'Text',
    items: [
      { token: '--ds-color-text-primary', note: '본문', source: 'neutral-900' },
      { token: '--ds-color-text-secondary', note: '부제목', source: 'neutral-700' },
      { token: '--ds-color-text-muted', note: '플레이스홀더, 힌트', source: 'neutral-500' },
      { token: '--ds-color-text-inverse', note: '어두운 배경 위', source: null },
      { token: '--ds-color-text-on-action', note: '버튼 위 텍스트', source: null },
    ],
  },
  {
    category: 'Border',
    items: [
      { token: '--ds-color-border-default', note: '기본', source: 'neutral-300' },
      { token: '--ds-color-border-subtle', note: '미묘한 구분선', source: 'neutral-200' },
      { token: '--ds-color-border-accent', note: 'Outlined 카드/강조 테두리', source: 'primary-200' },
      { token: '--ds-color-border-focus', note: '포커스 링', source: 'primary-500' },
    ],
  },
  {
    category: 'Action',
    items: [
      { token: '--ds-color-action-primary-default', note: 'Primary 기본', source: 'primary-500' },
      { token: '--ds-color-action-primary-hover', note: 'Primary 호버', source: 'primary-600' },
      { token: '--ds-color-action-primary-active', note: 'Primary 액티브', source: 'primary-700' },
      { token: '--ds-color-action-secondary-default', note: 'Secondary 기본', source: 'secondary-500' },
      { token: '--ds-color-action-secondary-hover', note: 'Secondary 호버', source: 'secondary-600' },
      { token: '--ds-color-action-secondary-active', note: 'Secondary 액티브', source: 'secondary-700' },
      { token: '--ds-color-action-accent-default', note: 'Accent 기본', source: 'accent-500' },
      { token: '--ds-color-action-accent-hover', note: 'Accent 호버', source: 'accent-600' },
      { token: '--ds-color-action-accent-active', note: 'Accent 액티브', source: 'accent-700' },
    ],
  },
];

function getValueByPath(
  mapping: SemanticMapping,
  path: SemanticTokenPath
): string | import('../../../palettes/types').ScaleReference {
  const [cat, key] = path.split('.');
  const category = mapping[cat as keyof SemanticMapping];
  if (!category || typeof category !== 'object') return '#999';
  return (category as Record<string, string | import('../../../palettes/types').ScaleReference>)[key] ?? '#999';
}

function SemanticMappingTabs({
  mappings,
  interactive,
  mapping,
  scales,
  bgStrategy,
  onMappingChange,
  onTokenSelect,
}: {
  mappings: Array<{ category: string; items: SemanticToken[] }>;
  interactive?: boolean;
  mapping?: SemanticMapping;
  scales?: GeneratedScales;
  bgStrategy?: BgStrategy;
  onMappingChange?: (path: SemanticTokenPath, value: string | import('../../../palettes/types').ScaleReference) => void;
  /** 인라인 모드: 스와치 클릭 시 모달 대신 콜백 호출 */
  onTokenSelect?: (path: SemanticTokenPath) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(mappings[0]?.category ?? '');
  const [modalToken, setModalToken] = useState<SemanticTokenPath | null>(null);
  const activeMapping = mappings.find((m) => m.category === activeCategory);
  const useInline = !!onTokenSelect;

  const handleSwatchClick = (item: SemanticToken) => {
    const path = TOKEN_TO_PATH[item.token];
    if (!path || !interactive) return;
    if (useInline && onTokenSelect) {
      onTokenSelect(path);
      return;
    }
    if (!mapping || !onMappingChange) return;
    setModalToken(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: SemanticToken) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSwatchClick(item);
    }
  };

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        시맨틱 컬러 매핑
        <span className={styles.sectionHint}>
          {bgStrategy ? ` (${bgStrategy}-bg 기준)` : ' (light-bg 기준)'}
        </span>
      </h4>
      <div className={styles.mappingTabs}>
        <div className={styles.tabList} role="tablist">
          {mappings.map((m) => (
            <button
              key={m.category}
              type="button"
              role="tab"
              aria-selected={activeCategory === m.category}
              aria-controls={`panel-${m.category}`}
              id={`tab-${m.category}`}
              className={styles.tab}
              data-active={activeCategory === m.category}
              onClick={() => setActiveCategory(m.category)}
              tabIndex={activeCategory === m.category ? 0 : -1}
            >
              {m.category}
            </button>
          ))}
        </div>
        <div className={styles.tabPanel} role="tabpanel">
          {activeMapping && (
            <div className={styles.tokenList}>
              {activeMapping.items.map((item) => {
                const path = TOKEN_TO_PATH[item.token];
                const isEditable =
                  !!path &&
                  interactive &&
                  (useInline ? !!onTokenSelect : !!(mapping && scales && onMappingChange));
                const displayColor =
                  mapping && scales && path
                    ? resolveColorValue(getValueByPath(mapping, path), scales)
                    : `var(${item.token})`;
                const sourceVar = item.source && `--ds-color-${item.source}`;
                return (
                  <div key={item.token} className={styles.tokenRow}>
                    <div
                      className={styles.tokenSwatch}
                      style={{ backgroundColor: displayColor }}
                      title={item.token}
                      role={isEditable ? 'button' : undefined}
                      tabIndex={isEditable ? 0 : undefined}
                      onClick={isEditable ? () => handleSwatchClick(item) : undefined}
                      onKeyDown={isEditable ? (e) => handleKeyDown(e, item) : undefined}
                      aria-label={isEditable ? `${item.token} 매핑 편집` : undefined}
                    />
                    <code className={styles.tokenName}>{item.token}</code>
                    {item.source && sourceVar && !mapping && (
                      <span
                        className={styles.sourceBadge}
                        style={{
                          backgroundColor: `var(${sourceVar})`,
                          color: (() => {
                            const step = parseInt(
                              item.source!.split('-').pop() ?? '500',
                              10
                            );
                            return step <= 400 ? 'var(--shell-text-primary)' : 'var(--shell-text-on-action, #FFF)';
                          })(),
                        }}
                        title={`light-bg 기준: ${item.source}`}
                      >
                        → {item.source}
                      </span>
                    )}
                    {mapping && path && (
                      <span className={styles.tokenNote}>
                        {typeof getValueByPath(mapping, path) === 'object'
                          ? `${(getValueByPath(mapping, path) as { scale: string; step: number }).scale}-${(getValueByPath(mapping, path) as { scale: string; step: number }).step}`
                          : (getValueByPath(mapping, path) as string)}
                      </span>
                    )}
                    {!mapping && item.note && (
                      <span className={styles.tokenNote}>{item.note}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {interactive &&
        !useInline &&
        modalToken &&
        mapping &&
        scales &&
        bgStrategy &&
        onMappingChange && (
          <ScaleSelectionModal
            open={!!modalToken}
            onClose={() => setModalToken(null)}
            semanticToken={modalToken}
            tokenLabel={modalToken}
            currentValue={getValueByPath(mapping, modalToken)}
            scales={scales}
            bgStrategy={bgStrategy}
            onSelect={(value) => {
              onMappingChange(modalToken, value);
              setModalToken(null);
            }}
          />
        )}
    </div>
  );
}

const COMPONENT_TOKENS: Array<{
  path: SemanticTokenPath;
  type: 'bg' | 'text' | 'border' | 'button';
}> = [
  { path: 'bg.base', type: 'bg' },
  { path: 'bg.surface', type: 'bg' },
  { path: 'bg.muted', type: 'bg' },
  { path: 'text.primary', type: 'text' },
  { path: 'text.secondary', type: 'text' },
  { path: 'text.muted', type: 'text' },
  { path: 'border.default', type: 'border' },
  { path: 'border.subtle', type: 'border' },
  { path: 'text.onAction', type: 'button' },
];

function ComponentDiagram({
  mapping,
  scales,
}: {
  mapping?: SemanticMapping;
  scales?: GeneratedScales;
}) {
  return (
    <div className={styles.componentDiagram}>
      <div className={styles.diagramTitle}>토큰 예시</div>
      <div className={styles.tokenExampleList}>
        {COMPONENT_TOKENS.map(({ path, type }) => {
          const color =
            mapping && scales
              ? resolveColorValue(getValueByPath(mapping, path), scales)
              : `var(--ds-color-${path.replace(/\./g, '-')})`;
          if (type === 'bg') {
            return (
              <div key={path} className={styles.tokenExampleRow}>
                <div className={styles.tokenExampleSample}>
                  <div
                    className={styles.tokenExampleSwatch}
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className={styles.tokenExampleLabel}>{path}</span>
              </div>
            );
          }
          if (type === 'text') {
            return (
              <div key={path} className={styles.tokenExampleRow}>
                <div className={styles.tokenExampleSample}>
                  <span
                    className={styles.tokenExampleText}
                    style={{ color }}
                  >
                    Aa
                  </span>
                </div>
                <span className={styles.tokenExampleLabel}>{path}</span>
              </div>
            );
          }
          if (type === 'border') {
            return (
              <div key={path} className={styles.tokenExampleRow}>
                <div className={styles.tokenExampleSample}>
                  <div
                    className={styles.tokenExampleBorder}
                    style={{ borderColor: color }}
                  />
                </div>
                <span className={styles.tokenExampleLabel}>{path}</span>
              </div>
            );
          }
          if (type === 'button') {
            const btnBg =
              scales?.primary?.[500] ?? 'var(--ds-color-primary-500)';
            return (
              <div key={path} className={styles.tokenExampleRow}>
                <div className={styles.tokenExampleSample}>
                  <div
                    className={styles.tokenExampleBtn}
                    style={{
                      backgroundColor: btnBg,
                      color,
                    }}
                  >
                    Btn
                  </div>
                </div>
                <span className={styles.tokenExampleLabel}>{path}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export interface ColorUsageDiagramProps {
  /** 인터랙티브 모드 (스와치 클릭 시 매핑 편집) */
  interactive?: boolean;
  /** 팔레트 (scales + semantic) */
  palette?: ComputedPalette;
  /** 현재 시맨틱 매핑 (편집 시) */
  mapping?: SemanticMapping;
  /** 매핑 변경 콜백 */
  onMappingChange?: (path: SemanticTokenPath, value: string | import('../../../palettes/types').ScaleReference) => void;
  /** 브랜드 컬러 역할 섹션 숨김 (모달 등에서 mapping+component만 표시) */
  hideColorRoles?: boolean;
  /** 인라인 모드: 스와치 클릭 시 onTokenSelect 호출, ScaleSelectionModal 미사용 */
  onTokenSelect?: (path: SemanticTokenPath) => void;
  /** mapping + component를 가로 배치 (모달용) */
  horizontalLayout?: boolean;
  /** 토큰 예시 섹션 숨김 (Lab Overview용) */
  hideTokenExample?: boolean;
}

export function ColorUsageDiagram({
  interactive = false,
  palette,
  mapping,
  onMappingChange,
  hideColorRoles = false,
  onTokenSelect,
  horizontalLayout = false,
  hideTokenExample = false,
}: ColorUsageDiagramProps = {}) {
  const scales = palette?.scales;
  const bgStrategy = palette?.bgStrategy;

  const mainContent = (
    <>
      {/* Semantic Mapping Section */}
      <SemanticMappingTabs
        mappings={semanticMappings}
        interactive={interactive}
        mapping={mapping}
        scales={scales}
        bgStrategy={bgStrategy}
        onMappingChange={onMappingChange}
        onTokenSelect={onTokenSelect}
      />

      {/* Component Diagram (토큰 예시) - Overview에서는 hideTokenExample로 숨김 */}
      {!hideTokenExample && (
        <ComponentDiagram mapping={mapping} scales={scales} />
      )}
    </>
  );

  return (
    <div className={styles.diagram} data-layout={horizontalLayout ? 'horizontal' : undefined}>
      {/* Color Roles Section */}
      {!hideColorRoles && (
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>브랜드 컬러 역할</h4>
        <div className={styles.roleGrid}>
          {colorRoles.map((role) => (
            <div key={role.key} className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: `var(${role.cssVar})` }}
                />
                <div className={styles.roleInfo}>
                  <span className={styles.roleLabel}>{role.label}</span>
                  <span className={styles.roleDesc}>{role.description}</span>
                </div>
              </div>
              <div className={styles.usageList}>
                {role.usages.map((usage, i) => (
                  <span key={i} className={styles.usageTag}>
                    {usage}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {horizontalLayout ? (
        <div className={styles.diagramRow}>{mainContent}</div>
      ) : (
        mainContent
      )}
    </div>
  );
}
