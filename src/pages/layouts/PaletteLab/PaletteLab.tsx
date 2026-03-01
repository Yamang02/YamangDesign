/**
 * E05: Palette Lab - 배색 비교 뷰 + DetailPanel
 * P05: Default/Natural 카테고리를 별도 섹션으로 표시 (탭/검색/Custom은 모달에서)
 */
import { useState, useMemo } from 'react';
import {
  LabLayout,
  LabSection,
  LabOverview,
  ComparisonCard,
  type TocItem,
} from '../../../layouts';
import { DetailPanel } from '../../../components';
import {
  getPaletteVariablesFromDefinition,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
  sectionTitles,
} from '../../../constants';
import { createPalette } from '../../../palettes';
import { getThemesByCategory } from '../../../palettes/presets/registry';
import { defaultSemanticMappings } from '../../../palettes/strategies/default-mappings';
import { getMergedMapping } from '../../../palettes/mapping/resolve';
import { neutralPresets } from '../../../tokens/primitives/neutral-presets';
import { systemColorPresets } from '../../../tokens/primitives/system-colors';
import type { SystemPresetName } from '../../../@types/theme';
import type { NeutralPresetName } from '../../../tokens/primitives/neutral-presets';
import type { PaletteDefinition, SemanticMapping } from '../../../palettes/types';
import { ColorUsageDiagram } from './ColorUsageDiagram';
import { EmptyCategory } from './EmptyCategory';
import { PaletteCategoryTabs, type BrandColorTabId } from './PaletteCategoryTabs';
import { SemanticMappingModal } from './SemanticMappingModal';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import styles from './PaletteLab.module.css';

const colorKeys = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
const systemColorKeys = ['error', 'warning', 'success', 'info'] as const;
const systemScaleSteps = [50, 500, 700] as const;
const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PaletteDetail({
  definition,
}: {
  definition: PaletteDefinition;
}) {
  const expanded = createPalette(definition);

  return (
    <div className={styles.paletteDetail}>
      {definition.subname && (
        <p className={styles.paletteSubname}>{definition.subname}</p>
      )}
      <h4 className={styles.detailSectionTitle}>기본 색상</h4>
      <div className={styles.colorSwatches}>
        {(['primary', 'secondary', 'accent', 'sub', 'neutral'] as const).map(
          (key) => {
            const scale = expanded.scales[key];
            if (!scale || Object.keys(scale).length === 0) return null;
            const base = scale[500] ?? scale[400] ?? Object.values(scale)[0];
            return (
              <div key={key} className={styles.colorRow}>
                <span className={styles.colorLabel}>{capitalize(key)}</span>
                <span
                  className={styles.colorSample}
                  style={{ backgroundColor: base }}
                  title={base}
                />
                <code className={styles.colorHex}>{base}</code>
              </div>
            );
          }
        )}
      </div>
      <h4 className={styles.detailSectionTitle}>확장 스케일 (50~900)</h4>
      <div className={styles.scaleGrid}>
        {colorKeys.map((colorKey) => {
          const scale = expanded.scales[colorKey];
          if (!scale) return null;
          return (
            <div key={colorKey} className={styles.scaleColumn}>
              <span className={styles.scaleLabel}>{capitalize(colorKey)}</span>
              <div className={styles.scaleRow}>
                {scaleSteps.map((step) => {
                  const color = scale[step as keyof typeof scale];
                  if (!color) return null;
                  return (
                    <div
                      key={step}
                      className={styles.scaleSwatch}
                      style={{ backgroundColor: color }}
                      title={`${colorKey} ${step}: ${color}`}
                    />
                  );
                })}
              </div>
              <div className={styles.scaleLabels}>
                {scaleSteps.map((step) => (
                  <span key={step} className={styles.scaleStep}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type DetailSelection =
  | { type: 'palette'; definition: PaletteDefinition }
  | { type: 'neutral'; name: NeutralPresetName }
  | { type: 'system'; name: SystemPresetName }
  | null;

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand-colors', label: 'Brand Colors' },
  { id: 'neutral-presets', label: sectionTitles.neutralPresets },
  { id: 'system-colors', label: sectionTitles.systemColors },
];

function NeutralPresetDetail({ presetName }: { presetName: NeutralPresetName }) {
  const preset = neutralPresets[presetName];
  if (!preset) return null;
  const { scale } = preset;

  return (
    <div className={styles.paletteDetail}>
      <h4 className={styles.detailSectionTitle}>Neutral 스케일 (50~900)</h4>
      <div className={styles.scaleGrid}>
        <div className={styles.scaleColumn}>
          <span className={styles.scaleLabel}>Neutral</span>
          <div className={styles.scaleRow}>
            {scaleSteps.map((step) => {
              const color = scale[step as keyof typeof scale];
              if (!color) return null;
              return (
                <div
                  key={step}
                  className={styles.scaleSwatch}
                  style={{ backgroundColor: color }}
                  title={`neutral ${step}: ${color}`}
                />
              );
            })}
          </div>
          <div className={styles.scaleLabels}>
            {scaleSteps.map((step) => (
              <span key={step} className={styles.scaleStep}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemPresetDetail({ presetName }: { presetName: SystemPresetName }) {
  const preset = systemColorPresets[presetName];
  if (!preset) return null;

  return (
    <div className={styles.paletteDetail}>
      <h4 className={styles.detailSectionTitle}>시스템 컬러 (50, 500, 700)</h4>
      <div className={styles.scaleGrid}>
        {systemColorKeys.map((colorKey) => (
          <div key={colorKey} className={styles.scaleColumn}>
            <span className={styles.scaleLabel}>{capitalize(colorKey)}</span>
            <div className={styles.scaleRow}>
              {systemScaleSteps.map((step) => {
                const color = preset.colors[colorKey as keyof typeof preset.colors][
                  step as 50 | 500 | 700
                ];
                return (
                  <div
                    key={step}
                    className={styles.scaleSwatch}
                    style={{ backgroundColor: color }}
                    title={`${colorKey} ${step}: ${color}`}
                  />
                );
              })}
            </div>
            <div className={styles.scaleLabels}>
              {systemScaleSteps.map((step) => (
                <span key={step} className={styles.scaleStep}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeutralPresetCard({
  presetName,
  onClick,
  selected,
}: {
  presetName: NeutralPresetName;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <ComparisonCard
      title={capitalize(presetName)}
      styleVars={getNeutralPresetVariables(presetName)}
      onClick={onClick}
      selected={selected}
    >
      <div className={styles.colorColumn}>
        <p className={styles.colorKeyLabel}>Neutral</p>
        <div className={styles.swatchRow}>
          {[100, 300, 500, 700, 900].map((step) => (
            <div
              key={step}
              className={styles.swatch}
              style={{
                backgroundColor: `var(--ds-color-neutral-${step})`,
              }}
              title={`neutral ${step}`}
            />
          ))}
        </div>
      </div>
    </ComparisonCard>
  );
}

function SystemColorCard({
  presetName,
  onClick,
  selected,
}: {
  presetName: SystemPresetName;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <ComparisonCard
      title={capitalize(presetName)}
      styleVars={getSystemColorVariables(presetName)}
      onClick={onClick}
      selected={selected}
    >
      {systemColorKeys.map((colorKey) => (
        <div key={colorKey} className={styles.colorColumn}>
          <p className={styles.colorKeyLabel}>{capitalize(colorKey)}</p>
          <div className={styles.swatchRow}>
            {systemScaleSteps.map((step) => {
              const varSuffix =
                step === 50 ? '-bg' : step === 700 ? '-emphasis' : '';
              return (
                <div
                  key={step}
                  className={styles.swatch}
                  style={{
                    backgroundColor: `var(--ds-color-system-${colorKey}${varSuffix})`,
                  }}
                  title={`${colorKey} ${step}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </ComparisonCard>
  );
}

function ThemeCard({
  def,
  onClick,
  onMappingClick,
  selected,
}: {
  def: PaletteDefinition;
  onClick: () => void;
  onMappingClick: (e: React.MouseEvent) => void;
  selected: boolean;
}) {
  const expanded = createPalette(def);
  const styleVars = getPaletteVariablesFromDefinition(def);

  return (
    <ComparisonCard
      key={def.metadata?.id ?? def.name}
      title={def.metadata?.displayName ?? capitalize(def.name)}
      subtitle={def.subname}
      styleVars={styleVars}
      onClick={onClick}
      selected={selected}
      headerAction={
        <Tooltip content="시맨틱 매핑 편집" portal position="top">
          <button
            type="button"
            className={styles.mappingIconBtn}
            onClick={onMappingClick}
            aria-label="시맨틱 매핑 편집"
          >
            <Icon name="tune" size="sm" />
          </button>
        </Tooltip>
      }
    >
      {colorKeys.map((colorKey) => (
        <div key={colorKey} className={styles.colorColumn}>
          <p className={styles.colorKeyLabel}>{capitalize(colorKey)}</p>
          <div className={styles.swatchRow}>
            {[100, 300, 500, 700, 900].map((step) => {
              const scale = expanded.scales[colorKey];
              const color = scale?.[step as keyof typeof scale];
              if (!color) return null;
              return (
                <div
                  key={step}
                  className={styles.swatch}
                  style={{ backgroundColor: color }}
                  title={`${colorKey} ${step}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </ComparisonCard>
  );
}

export function PaletteLab() {
  const [detailSelection, setDetailSelection] = useState<DetailSelection>(null);
  const [mappingModalDef, setMappingModalDef] = useState<PaletteDefinition | null>(null);
  const [mappingOverrides, setMappingOverrides] = useState<Record<string, Partial<SemanticMapping>>>({});
  const [activeBrandTab, setActiveBrandTab] = useState<BrandColorTabId>('default');

  const defaultThemes = useMemo(
    () => getThemesByCategory('default'),
    []
  );
  const naturalThemes = useMemo(
    () => getThemesByCategory('natural'),
    []
  );
  const overviewPalette = useMemo(() => {
    const def = defaultThemes[0];
    if (!def) return undefined;
    const expanded = createPalette(def);
    const mapping = getMergedMapping(
      defaultSemanticMappings[def.bgStrategy],
      def.semanticMapping
    );
    return { expanded, mapping };
  }, [defaultThemes]);

  const handlePaletteSelect = (def: PaletteDefinition) => {
    setDetailSelection({ type: 'palette', definition: def });
  };

  const handleMappingIconClick = (def: PaletteDefinition) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setMappingModalDef(def);
  };

  const themeId = (def: PaletteDefinition) => def.metadata?.id ?? def.name;

  const handleNeutralSelect = (name: NeutralPresetName) => {
    setDetailSelection({ type: 'neutral', name });
  };

  const handleSystemSelect = (name: SystemPresetName) => {
    setDetailSelection({ type: 'system', name });
  };

  const detailTitle = detailSelection
    ? detailSelection.type === 'palette'
      ? detailSelection.definition.metadata?.displayName ??
        capitalize(detailSelection.definition.name)
      : capitalize(detailSelection.name)
    : '';
  const detailOpen = !!detailSelection;

  return (
    <>
      <LabLayout title="Palette Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <ColorUsageDiagram
              palette={overviewPalette?.expanded}
              mapping={overviewPalette?.mapping}
            />
          </LabOverview>
        </LabSection>

        <LabSection title="Brand Colors" id="brand-colors">
          <div className={styles.brandColorsBody}>
            <PaletteCategoryTabs
              activeTab={activeBrandTab}
              onTabChange={setActiveBrandTab}
            />
            <div className={styles.categoryContent}>
            {activeBrandTab === 'default' && (
              <div className={styles.comparisonGrid}>
                {defaultThemes.length === 0 ? (
                  <EmptyCategory message="등록된 Default 테마가 없습니다" />
                ) : (
                  defaultThemes.map((def) => (
                    <ThemeCard
                      key={def.metadata?.id ?? def.name}
                      def={def}
                      onClick={() => handlePaletteSelect(def)}
                      onMappingClick={handleMappingIconClick(def)}
                      selected={
                        detailSelection?.type === 'palette' &&
                        detailSelection.definition.metadata?.id === def.metadata?.id
                      }
                    />
                  ))
                )}
              </div>
            )}
            {activeBrandTab === 'natural' && (
              <div className={styles.comparisonGrid}>
                {naturalThemes.length === 0 ? (
                  <EmptyCategory />
                ) : (
                  naturalThemes.map((def) => (
                    <ThemeCard
                      key={def.metadata?.id ?? def.name}
                      def={def}
                      onClick={() => handlePaletteSelect(def)}
                      onMappingClick={handleMappingIconClick(def)}
                      selected={
                        detailSelection?.type === 'palette' &&
                        detailSelection.definition.metadata?.id === def.metadata?.id
                      }
                    />
                  ))
                )}
              </div>
            )}
            </div>
          </div>
        </LabSection>

        <LabSection title={sectionTitles.neutralPresets} id="neutral-presets">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.neutralPresets.map((presetName) => (
              <NeutralPresetCard
                key={presetName}
                presetName={presetName}
                onClick={() => handleNeutralSelect(presetName)}
                selected={
                  detailSelection?.type === 'neutral' &&
                  detailSelection.name === presetName
                }
              />
            ))}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.systemColors} id="system-colors">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.systemPresets.map((presetName) => (
              <SystemColorCard
                key={presetName}
                presetName={presetName}
                onClick={() => handleSystemSelect(presetName)}
                selected={
                  detailSelection?.type === 'system' &&
                  detailSelection.name === presetName
                }
              />
            ))}
          </div>
        </LabSection>
      </LabLayout>

      {mappingModalDef && (
        <SemanticMappingModal
          open={!!mappingModalDef}
          onClose={() => setMappingModalDef(null)}
          definition={mappingModalDef}
          overrides={mappingModalDef ? mappingOverrides[themeId(mappingModalDef)] : undefined}
          onOverridesChange={(overrides) => {
            if (!mappingModalDef) return;
            const id = themeId(mappingModalDef);
            setMappingOverrides((prev) => {
              const next = { ...prev };
              if (overrides) next[id] = overrides;
              else delete next[id];
              return next;
            });
          }}
        />
      )}

      <DetailPanel
        open={detailOpen}
        onClose={() => setDetailSelection(null)}
        title={detailTitle}
      >
        {detailSelection?.type === 'palette' && (
          <PaletteDetail definition={detailSelection.definition} />
        )}
        {detailSelection?.type === 'neutral' && (
          <NeutralPresetDetail presetName={detailSelection.name} />
        )}
        {detailSelection?.type === 'system' && (
          <SystemPresetDetail presetName={detailSelection.name} />
        )}
      </DetailPanel>
    </>
  );
}
