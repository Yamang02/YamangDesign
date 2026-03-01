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
  PALETTE_SCALES,
  SCALE_STEPS,
  SYSTEM_COLOR_KEYS,
  SYSTEM_SCALE_STEPS,
} from '../../../constants';
import { createPalette } from '../../../palettes';
import { getThemesByCategory } from '../../../palettes/presets/registry';
import { useTheme } from '../../../themes';
import { palettePresets } from '../../../themes/presets';
import { presetToPaletteDefinition } from '../../../constants/semantic-presets';
import type { CustomSemanticPreset } from '../../../constants/semantic-presets';
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
import { ScaleGuide } from './ScaleGuide';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import styles from './PaletteLab.module.css';

// 상수는 constants/palette-scales.ts에서 import
// PALETTE_SCALES, SCALE_STEPS, SYSTEM_COLOR_KEYS, SYSTEM_SCALE_STEPS

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
        {PALETTE_SCALES.map((colorKey) => {
          const scale = expanded.scales[colorKey];
          if (!scale) return null;
          return (
            <div key={colorKey} className={styles.scaleColumn}>
              <span className={styles.scaleLabel}>{capitalize(colorKey)}</span>
              <div className={styles.scaleRow}>
                {SCALE_STEPS.map((step) => {
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
                {SCALE_STEPS.map((step) => (
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
  | { type: 'custom'; preset: CustomSemanticPreset }
  | { type: 'neutral'; name: NeutralPresetName }
  | { type: 'system'; name: SystemPresetName }
  | null;

type MappingModalTarget =
  | { type: 'built-in'; definition: PaletteDefinition }
  | { type: 'custom'; preset: CustomSemanticPreset }
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
  const base = scale[500] ?? scale[400] ?? Object.values(scale)[0];

  return (
    <div className={styles.paletteDetail}>
      <h4 className={styles.detailSectionTitle}>기본 색상</h4>
      <div className={styles.colorSwatches}>
        <div className={styles.colorRow}>
          <span className={styles.colorLabel}>Neutral</span>
          <span
            className={styles.colorSample}
            style={{ backgroundColor: base }}
            title={base}
          />
          <code className={styles.colorHex}>{base}</code>
        </div>
      </div>
      <h4 className={styles.detailSectionTitle}>Neutral 스케일 (50~900)</h4>
      <div className={styles.scaleGrid}>
        <div className={styles.scaleColumn}>
          <span className={styles.scaleLabel}>Neutral</span>
          <div className={styles.scaleRow}>
            {SCALE_STEPS.map((step) => {
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
            {SCALE_STEPS.map((step) => (
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
      <h4 className={styles.detailSectionTitle}>기본 색상</h4>
      <div className={styles.colorSwatches}>
        {SYSTEM_COLOR_KEYS.map((colorKey) => {
          const base =
            preset.colors[colorKey as keyof typeof preset.colors][500];
          return (
            <div key={colorKey} className={styles.colorRow}>
              <span className={styles.colorLabel}>{capitalize(colorKey)}</span>
              <span
                className={styles.colorSample}
                style={{ backgroundColor: base }}
                title={base}
              />
              <code className={styles.colorHex}>{base}</code>
            </div>
          );
        })}
      </div>
      <h4 className={styles.detailSectionTitle}>시스템 컬러 (50, 500, 700)</h4>
      <div className={styles.scaleGrid}>
        {SYSTEM_COLOR_KEYS.map((colorKey) => (
          <div key={colorKey} className={styles.scaleColumn}>
            <span className={styles.scaleLabel}>{capitalize(colorKey)}</span>
            <div className={styles.scaleRow}>
              {SYSTEM_SCALE_STEPS.map((step) => {
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
              {SYSTEM_SCALE_STEPS.map((step) => (
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
      {SYSTEM_COLOR_KEYS.map((colorKey) => (
        <div key={colorKey} className={styles.colorColumn}>
          <p className={styles.colorKeyLabel}>{capitalize(colorKey)}</p>
          <div className={styles.swatchRow}>
            {SYSTEM_SCALE_STEPS.map((step) => {
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
      {PALETTE_SCALES.map((colorKey) => (
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

function CustomPresetCard({
  preset,
  onClick,
  onMappingClick,
  onDelete,
  selected,
}: {
  preset: CustomSemanticPreset;
  onClick: () => void;
  onMappingClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  selected: boolean;
}) {
  const def = presetToPaletteDefinition(preset);
  if (!def) return null;
  const expanded = createPalette(def);
  const styleVars = getPaletteVariablesFromDefinition(def);
  const baseDisplayName =
    palettePresets[preset.basePaletteId as keyof typeof palettePresets]
      ?.metadata?.displayName ?? capitalize(preset.basePaletteId);
  const title = preset.displayName ?? `${baseDisplayName} (커스텀)`;

  return (
    <ComparisonCard
      key={preset.id}
      title={title}
      subtitle={`기반: ${baseDisplayName}`}
      styleVars={styleVars}
      onClick={onClick}
      selected={selected}
      headerAction={
        <span className={styles.customCardActions}>
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
          <Tooltip content="삭제" portal position="top">
            <button
              type="button"
              className={styles.mappingIconBtn}
              onClick={onDelete}
              aria-label="삭제"
            >
              <Icon name="delete" size="sm" />
            </button>
          </Tooltip>
        </span>
      }
    >
      {PALETTE_SCALES.map((colorKey) => (
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
  const [mappingModalTarget, setMappingModalTarget] = useState<MappingModalTarget>(null);
  const [mappingOverrides, setMappingOverrides] = useState<Partial<SemanticMapping> | null>(null);
  const [activeBrandTab, setActiveBrandTab] = useState<BrandColorTabId>('default');

  const {
    paletteDefinition: currentPaletteDefinition,
    customSemanticPresets,
    addCustomSemanticPreset,
    updateCustomSemanticPreset,
    deleteCustomSemanticPreset,
    applyCustomSemanticPreset,
  } = useTheme();
  const defaultThemes = useMemo(
    () => getThemesByCategory('default'),
    []
  );
  const naturalThemes = useMemo(
    () => getThemesByCategory('natural'),
    []
  );
  /** 컬러팔레트 Overview 전용 - ThemeProvider의 현재 테마 반영 */
  const overviewColorPalette = useMemo(() => {
    const def = currentPaletteDefinition;
    const expanded = createPalette(def);
    const mapping = def.semanticMapping
      ? getMergedMapping(defaultSemanticMappings[def.bgStrategy], def.semanticMapping)
      : getMergedMapping(defaultSemanticMappings[def.bgStrategy], undefined);
    return { expanded, mapping };
  }, [currentPaletteDefinition]);

  const handlePaletteSelect = (def: PaletteDefinition) => {
    setDetailSelection({ type: 'palette', definition: def });
  };

  const handleCustomPresetSelect = (preset: CustomSemanticPreset) => {
    setDetailSelection({ type: 'custom', preset });
  };

  const handleMappingIconClick = (def: PaletteDefinition) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setMappingModalTarget({ type: 'built-in', definition: def });
    setMappingOverrides(null);
  };

  const handleCustomMappingClick = (preset: CustomSemanticPreset) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setMappingModalTarget({ type: 'custom', preset });
    setMappingOverrides(preset.semanticOverrides ?? null);
  };

  const handleCustomDelete = (preset: CustomSemanticPreset) => (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomSemanticPreset(preset.id);
    if (detailSelection?.type === 'custom' && detailSelection.preset.id === preset.id) {
      setDetailSelection(null);
    }
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
      : detailSelection.type === 'custom'
        ? detailSelection.preset.displayName ??
          `${palettePresets[detailSelection.preset.basePaletteId as keyof typeof palettePresets]?.metadata?.displayName ?? detailSelection.preset.basePaletteId} (커스텀)`
        : capitalize(detailSelection.name)
    : '';
  const detailOpen = !!detailSelection;

  return (
    <>
      <LabLayout title="Palette Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <ColorUsageDiagram
              palette={overviewColorPalette?.expanded}
              mapping={overviewColorPalette?.mapping}
              hideTokenExample
            />
            <ScaleGuide primaryScale={overviewColorPalette?.expanded?.scales.primary} />
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
            {activeBrandTab === 'custom' && (
              <div className={styles.comparisonGrid}>
                {customSemanticPresets.length === 0 ? (
                  <EmptyCategory message="저장된 커스텀 프리셋이 없습니다. 다른 탭에서 시맨틱 매핑을 편집한 뒤 적용해 보세요." />
                ) : (
                  customSemanticPresets.map((preset) => (
                    <CustomPresetCard
                      key={preset.id}
                      preset={preset}
                      onClick={() => handleCustomPresetSelect(preset)}
                      onMappingClick={handleCustomMappingClick(preset)}
                      onDelete={handleCustomDelete(preset)}
                      selected={
                        detailSelection?.type === 'custom' &&
                        detailSelection.preset.id === preset.id
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

      {mappingModalTarget && (
        <SemanticMappingModal
          open={!!mappingModalTarget}
          onClose={() => {
            setMappingModalTarget(null);
            setMappingOverrides(null);
          }}
          definition={
            mappingModalTarget.type === 'built-in'
              ? mappingModalTarget.definition
              : presetToPaletteDefinition(mappingModalTarget.preset) ?? palettePresets.default
          }
          overrides={mappingOverrides ?? undefined}
          onOverridesChange={setMappingOverrides}
          mode={mappingModalTarget.type}
          onApply={
            mappingModalTarget.type === 'built-in'
              ? () => {
                  if (!mappingOverrides || Object.keys(mappingOverrides).length === 0) return;
                  const baseName =
                    palettePresets[mappingModalTarget.definition.metadata?.id as keyof typeof palettePresets]
                      ?.metadata?.displayName ?? mappingModalTarget.definition.metadata?.displayName ?? mappingModalTarget.definition.name;
                  const preset = addCustomSemanticPreset({
                    basePaletteId: themeId(mappingModalTarget.definition) as import('../../../@types/theme').PaletteName,
                    semanticOverrides: mappingOverrides,
                    displayName: `${baseName} (커스텀)`,
                  });
                  applyCustomSemanticPreset(preset);
                  setMappingModalTarget(null);
                  setMappingOverrides(null);
                  setActiveBrandTab('custom');
                }
              : () => {
                  updateCustomSemanticPreset(mappingModalTarget.preset.id, {
                    semanticOverrides: mappingOverrides ?? {},
                  });
                  setMappingModalTarget(null);
                  setMappingOverrides(null);
                }
          }
          onExport={() => {
            const data = mappingOverrides ?? {};
            const blob = new Blob([JSON.stringify({ semanticOverrides: data, exportedAt: new Date().toISOString() }, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `semantic-mapping-${mappingModalTarget.type === 'built-in' ? themeId(mappingModalTarget.definition) : mappingModalTarget.preset.id}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onImport={(parsed) => {
            setMappingOverrides(parsed);
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
        {detailSelection?.type === 'custom' && (
          <PaletteDetail
            definition={
              presetToPaletteDefinition(detailSelection.preset) ?? palettePresets.default
            }
          />
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
