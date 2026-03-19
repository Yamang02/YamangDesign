/**
 * P07: 프리셋 탭 — 2-column (현재 설정 | 프리셋 브라우저), Custom 탭은 userPresets(v2)만
 */
import { useState, useMemo, useCallback } from 'react';
import { Icon, Select, Tooltip } from '../../../components';
import { GenericTabs } from '../../../components/GenericTabs';
import {
  themeRegistry,
  getThemesByCategory,
  searchThemesByName,
  getAllThemes,
} from '@domain/palettes/presets/registry';
import type { ThemeCategory } from '@domain/palettes/types';
import type { ColorInput } from '@shared/@types/tokens';
import type { StyleName, SystemPresetName } from '@shared/@types/theme';
import { ThemeSearchBar } from '../PaletteLab/ThemeSearchBar';
import { EmptyCategory } from '../PaletteLab/EmptyCategory';
import { getStylePresetNames } from '@domain/themes/presets';
import type { StoredPreset } from '../../../components/GlobalSettings/types';
import { useGlobalSettings } from '../../../components/GlobalSettings';
import styles from './PresetTab.module.css';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const CATEGORY_LABEL: Record<ThemeCategory, string> = {
  default: '기본',
  custom: '커스텀',
  natural: '내추럴',
  pop: '팝',
  historical: '히스토리컬',
};

const COLOR_FIELDS: {
  key: keyof ColorInput;
  label: string;
  required: boolean;
}[] = [
  { key: 'primary', label: 'Primary', required: true },
  { key: 'secondary', label: 'Secondary', required: false },
  { key: 'accent', label: 'Accent', required: false },
  { key: 'sub', label: 'Sub', required: false },
  { key: 'neutral', label: 'Neutral', required: false },
];

const STYLE_OPTIONS: { value: StyleName; label: string }[] =
  getStylePresetNames().map((name) => ({ value: name, label: capitalize(name) }));

const SYSTEM_OPTIONS: { value: SystemPresetName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'muted', label: 'Muted' },
];

function getPresetColorsFromPalette(p: ColorInput) {
  return [
    p.primary || '#CCC',
    p.secondary || '#CCC',
    p.accent || '#CCC',
    p.sub || '#CCC',
    p.neutral || '#CCC',
  ];
}

function hasSemanticOverrides(settings: StoredPreset['settings']): boolean {
  const m = settings.semanticMapping;
  if (!m || typeof m !== 'object') return false;
  return (
    Object.keys(m.bg ?? {}).length > 0 ||
    Object.keys(m.text ?? {}).length > 0 ||
    Object.keys(m.border ?? {}).length > 0 ||
    Object.keys((m as Record<string, unknown>).action ?? {}).length > 0 ||
    Object.keys((m as Record<string, unknown>).feedback ?? {}).length > 0
  );
}

/** P08: 두 팔레트의 5색이 동일한지 (빌트인 적용 여부 등) */
function isPaletteEqual(
  current: ColorInput | undefined,
  preset: ColorInput | undefined
): boolean {
  if (!current && !preset) return true;
  if (!current || !preset) return false;
  const keys: (keyof ColorInput)[] = ['primary', 'secondary', 'accent', 'sub', 'neutral'];
  return keys.every((k) => (current[k] ?? '') === (preset[k] ?? ''));
}

function PresetItemCustom({
  preset,
  onLoad,
  onDelete,
  isApplied,
}: {
  preset: StoredPreset;
  onLoad: (p: StoredPreset) => void;
  onDelete: (id: string) => void;
  isApplied?: boolean;
}) {
  const palette = preset.settings.palette || {};
  const styleLabel = capitalize(preset.settings.styleName ?? 'minimal');
  const hasSemantic = hasSemanticOverrides(preset.settings);
  return (
    <div className={`${styles.presetItem} ${isApplied ? styles.presetItemApplied : ''}`}>
      <div className={styles.presetBadges}>
        <span className={`${styles.presetBadge} ${styles.custom}`}>커스텀</span>
        <span className={styles.styleBadge}>{styleLabel}</span>
        {hasSemantic && <span className={styles.semanticDot} aria-hidden>·</span>}
      </div>
      <button
        type="button"
        className={styles.presetName}
        title={preset.name}
        onClick={() => onLoad(preset)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
        }}
      >
        {preset.name}
      </button>
      <div className={styles.presetColors}>
        {getPresetColorsFromPalette(palette).map((color, i) => (
          <span key={i} className={styles.presetDot} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className={styles.presetDeleteSlot}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset.id);
          }}
          aria-label={`${preset.name} 삭제`}
        >
          <Icon name="delete" size="sm" />
        </button>
      </div>
    </div>
  );
}

export type PresetTabSettings = ReturnType<typeof useGlobalSettings>;

export interface PresetTabProps {
  settings: PresetTabSettings;
}

export function PresetTab({ settings }: PresetTabProps) {
  const {
    palette,
    styleName,
    systemPreset,
    setPalette,
    setStyleName,
    setSystemPreset,
    selectPreset,
    userPresets,
    saveAsPreset,
    loadUserPreset,
    deleteUserPreset,
    getDraft,
  } = settings;

  const [saveName, setSaveName] = useState('');
  type PresetSubTab = ThemeCategory | 'all';
  const [presetTab, setPresetTab] = useState<PresetSubTab>('all');
  const [presetSearch, setPresetSearch] = useState('');

  const draftForCompare = useMemo(() => {
    const d = getDraft();
    return {
      palette: d.palette,
      styleName: d.styleName,
      systemPreset: d.systemPreset,
      semanticMapping: d.semanticMapping ?? null,
    };
  }, [getDraft]);

  const isUserPresetApplied = useCallback(
    (preset: StoredPreset) => {
      const s = preset.settings;
      return (
        JSON.stringify(draftForCompare.palette ?? {}) === JSON.stringify(s.palette ?? {}) &&
        draftForCompare.styleName === s.styleName &&
        draftForCompare.systemPreset === s.systemPreset &&
        JSON.stringify(draftForCompare.semanticMapping ?? {}) === JSON.stringify(s.semanticMapping ?? {})
      );
    },
    [draftForCompare]
  );

  const themesByCategory = useMemo(
    () =>
      Object.fromEntries(
        themeRegistry.map((g) => [g.category, getThemesByCategory(g.category)])
      ),
    []
  );

  const filteredThemesByCategory = useMemo(() => {
    if (!presetSearch.trim()) return themesByCategory;
    const all = searchThemesByName(presetSearch);
    return Object.fromEntries(
      Object.entries(themesByCategory).map(([cat, themes]) => [
        cat,
        themes.filter((t) => all.some((a) => a.id === t.id)),
      ])
    );
  }, [themesByCategory, presetSearch]);

  const allThemes = useMemo(() => getAllThemes(), []);
  const filteredAllThemes = useMemo(() => {
    if (!presetSearch.trim()) return allThemes;
    return searchThemesByName(presetSearch);
  }, [allThemes, presetSearch]);

  const filteredUserPresets = useMemo(() => {
    if (!presetSearch.trim()) return userPresets;
    const q = presetSearch.toLowerCase();
    return userPresets.filter((p) => p.name.toLowerCase().includes(q));
  }, [userPresets, presetSearch]);

  const handleColorChange = (key: keyof ColorInput, value: string) => {
    setPalette({ ...palette, [key]: value || undefined });
  };

  const handleClearColor = (key: keyof ColorInput) => {
    const newPalette = { ...palette };
    delete newPalette[key];
    setPalette(newPalette);
  };

  const handleSavePreset = () => {
    if (saveName.trim()) {
      saveAsPreset(saveName.trim());
      setSaveName('');
    }
  };

  const presetSubTabs: { id: PresetSubTab; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'custom', label: '커스텀' },
    ...themeRegistry
      .filter((g) => g.category !== 'custom')
      .map((g) => ({
        id: g.category as PresetSubTab,
        label: CATEGORY_LABEL[g.category] ?? g.displayName,
      })),
  ];

  return (
    <div className={styles.content}>
      <div className={styles.leftColumn}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>프리셋으로 저장</h3>
          <div className={styles.saveRow}>
            <input
              type="text"
              className={styles.saveInlineInput}
              placeholder="프리셋 이름"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePreset();
              }}
              aria-label="프리셋 이름"
            />
            <Tooltip content="현재 설정을 프리셋으로 저장" portal position="top">
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSavePreset}
                aria-label="프리셋으로 저장"
              >
                <Icon name="save" size="sm" />
                저장
              </button>
            </Tooltip>
          </div>
        </section>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>컬러 팔레트</h3>
          <div className={styles.paletteList}>
          {COLOR_FIELDS.map((field) => (
            <div
              key={field.key}
              className={`${styles.flatCard} ${styles.paletteRow}`}
            >
              <span className={styles.paletteLabel}>
                {field.label}
                {field.required && ' *'}
              </span>
              <div className={styles.paletteInputRow}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: palette[field.key] || '#CCCCCC' }}
                >
                  <input
                    type="color"
                    value={palette[field.key] || '#CCCCCC'}
                    onChange={(e) =>
                      handleColorChange(field.key, e.target.value)
                    }
                  />
                </div>
                <input
                  type="text"
                  className={styles.hexInput}
                  value={palette[field.key] || ''}
                  onChange={(e) =>
                    handleColorChange(field.key, e.target.value)
                  }
                  placeholder={field.required ? '' : 'Auto'}
                />
                <div className={styles.paletteDeleteSlot}>
                  {!field.required && palette[field.key] && (
                    <button
                      type="button"
                      className={styles.paletteClearBtn}
                      onClick={() => handleClearColor(field.key)}
                      aria-label={`${field.label} 초기화`}
                    >
                      <Icon name="delete" size="sm" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>스타일 / 시스템</h3>
        <div className={styles.settingsList}>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>스타일</span>
            <div className={styles.settingSelect}>
              <Select
                options={STYLE_OPTIONS}
                value={styleName}
                onChange={(v) => setStyleName(v as StyleName)}
                size="sm"
              />
            </div>
          </div>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>시스템 색상</span>
            <div className={styles.settingSelect}>
              <Select
                options={SYSTEM_OPTIONS}
                value={systemPreset}
                onChange={(v) => setSystemPreset(v as SystemPresetName)}
                size="sm"
              />
            </div>
          </div>
        </div>
        </section>
      </div>

      <div className={styles.presetBrowser}>
        <div className={styles.presetTabsWrapper}>
          <GenericTabs
            tabs={presetSubTabs}
            activeTab={presetTab}
            onTabChange={setPresetTab}
            ariaLabel="프리셋 카테고리"
          />
          <ThemeSearchBar
            value={presetSearch}
            onChange={setPresetSearch}
            placeholder="프리셋 검색..."
          />
        </div>
        <div
          id="panel-all"
          role="tabpanel"
          aria-labelledby="tab-all"
          hidden={presetTab !== 'all'}
          className={styles.presetPanel}
        >
          {presetTab === 'all' && (
            <>
              {filteredAllThemes.length === 0 ? (
                <EmptyCategory
                  message={presetSearch ? '검색 결과가 없습니다' : '프리셋이 없습니다'}
                />
              ) : (
                <div className={styles.presetList}>
                  {filteredAllThemes.map((def) => {
                    const presetId = def.id;
                    const isApplied = isPaletteEqual(draftForCompare.palette, def.colors);
                    const category = themeRegistry.find((g) =>
                      g.themes.some((t) => t.id === presetId)
                    )?.category;
                    return (
                      <button
                        key={presetId}
                        type="button"
                        className={`${styles.presetItem} ${isApplied ? styles.presetItemApplied : ''}`}
                        onClick={() => {
                          if (presetId) selectPreset(presetId);
                          else setPalette(def.colors as ColorInput);
                        }}
                      >
                        <div className={styles.presetBadges}>
                          <span className={styles.presetBadge + ' ' + styles.category}>
                            {(category ? CATEGORY_LABEL[category] : undefined) ?? '프리셋'}
                          </span>
                        </div>
                        <span className={styles.presetName} title={def.displayName ?? def.id}>
                          {def.displayName ?? def.id}
                        </span>
                        <div className={styles.presetColors}>
                          {getPresetColorsFromPalette(def.colors as ColorInput).map((color, i) => (
                            <span key={i} className={styles.presetDot} style={{ backgroundColor: color }} />
                          ))}
                        </div>
                        <div className={styles.presetDeleteSlot} aria-hidden />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div
          id="panel-custom"
          role="tabpanel"
          aria-labelledby="tab-custom"
          hidden={presetTab !== 'custom'}
          className={styles.presetPanel}
        >
          {presetTab === 'custom' && (
            <>
              {filteredUserPresets.length === 0 ? (
                <EmptyCategory
                  message={
                    presetSearch
                      ? '검색 결과가 없습니다'
                      : '저장된 커스텀 프리셋이 없습니다. 편집 후 저장하세요.'
                  }
                />
              ) : (
                <div className={styles.presetList}>
                  {filteredUserPresets.map((preset) => (
                    <PresetItemCustom
                      key={preset.id}
                      preset={preset}
                      onLoad={loadUserPreset}
                      onDelete={deleteUserPreset}
                      isApplied={isUserPresetApplied(preset)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {themeRegistry.map((group) => {
          const filtered =
            filteredThemesByCategory[group.category] ?? [];
          const badgeClass =
            group.category === 'default'
              ? styles.yamang
              : group.category === 'natural'
                ? styles.natural
                : styles.category;
          return (
            <div
              key={group.category}
              id={`panel-${group.category}`}
              role="tabpanel"
              aria-labelledby={`tab-${group.category}`}
              hidden={presetTab !== group.category}
              className={styles.presetPanel}
            >
              {presetTab === group.category && (
                <>
                  {filtered.length === 0 ? (
                    <EmptyCategory
                      message={
                        presetSearch
                          ? '검색 결과가 없습니다'
                          : `${CATEGORY_LABEL[group.category] ?? group.displayName} 테마가 없습니다`
                      }
                    />
                  ) : (
                    <div className={styles.presetList}>
                      {filtered.map((def) => {
                        const presetId = def.id;
                        const isApplied = isPaletteEqual(draftForCompare.palette, def.colors);
                        return (
                          <button
                            key={presetId}
                            type="button"
                            className={`${styles.presetItem} ${isApplied ? styles.presetItemApplied : ''}`}
                            onClick={() => {
                              if (presetId) {
                                selectPreset(presetId);
                              } else {
                                setPalette(def.colors as ColorInput);
                              }
                            }}
                          >
                            <div className={styles.presetBadges}>
                              <span
                                className={
                                  styles.presetBadge + ' ' + badgeClass
                                }
                              >
                                {CATEGORY_LABEL[group.category] ?? group.displayName}
                              </span>
                            </div>
                            <span className={styles.presetName} title={def.displayName ?? def.id}>
                              {def.displayName ?? def.id}
                            </span>
                            <div className={styles.presetColors}>
                              {getPresetColorsFromPalette(
                                def.colors as ColorInput
                              ).map((color, i) => (
                                <span
                                  key={i}
                                  className={styles.presetDot}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div
                              className={styles.presetDeleteSlot}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
