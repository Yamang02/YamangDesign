import { useState, useCallback } from 'react';
import { ThemeProvider } from '@domain/themes';
import { Footer, Header, HeaderNav } from '@app/components';
import {
  GLOBAL_SETTINGS_STORAGE_KEY,
  migrateV1ToV2,
  isStoredSettingsV1,
  normalizeStoredSettings,
  type StoredSettings,
} from '@app/components/GlobalSettings';
import { loadPaletteSelection, createCustomSelection } from '@app/state/palette-selection';
import { findThemeById } from '@domain/palettes/presets/registry';
import { saveComponentMappingOverrides } from '@app/infra/storage';
import {
  Landing,
  PaletteLab,
  StyleLab,
  Playground,
  FontLab,
  TokenLab,
  DesignSettingsLab,
  SpacingLab,
  GridLab,
  MotionLab,
  ResponsiveLab,
  Atoms,
  Molecules,
  Organisms,
  Service,
  Shell,
  LayoutLanding,
  LayoutDashboard,
  LayoutArticle,
  MonetWaterLilies,
  MatisseDanceII,
} from '@app/pages';
import type { DesignSettingsTabId } from '@app/pages/labs/DesignSettingsLab';
import { DesignSettingsNavContext } from '@app/context/DesignSettingsNavContext';
import { InspectorProvider } from '@app/context/InspectorContext';
import { LayoutPreviewControlsProvider } from '@app/context/LayoutPreviewControlsContext';
import { ComponentInspectorPanel } from '@app/components/ComponentInspector/ComponentInspectorPanel';

/** E06 P01 + P05: Labs / Build / Context / Playground / Design Settings */
export type PageName =
  | 'landing'
  | 'dashboard'
  | 'card-grid'
  | 'design-settings'
  | 'palette'
  | 'style'
  | 'font'
  | 'tokens'
  | 'atoms'
  | 'molecules'
  | 'organisms'
  | 'service'
  | 'shell'
  | 'layout-landing'
  | 'layout-dashboard'
  | 'layout-article'
  | 'playground'
  | 'spacing'
  | 'grid'
  | 'motion'
  | 'responsive'
  | 'monet-water-lilies'
  | 'matisse-dance-ii';

/** P08: design-settings 블롭에서 componentMapping 동기화 후 설정만 반환 */
function parseDesignSystemBlob(raw: string): StoredSettings | null {
  const parsed = JSON.parse(raw) as Record<string, unknown> & { componentMapping?: unknown };
  if (!parsed || typeof parsed !== 'object' || !parsed.palette) return null;
  const componentMapping = parsed.componentMapping;
  if (componentMapping && typeof componentMapping === 'object' && !Array.isArray(componentMapping)) {
    saveComponentMappingOverrides(componentMapping as Record<string, Record<string, string>>);
  }
  const { componentMapping: _cm, ...rest } = parsed;
  const migrated = isStoredSettingsV1(rest)
    ? migrateV1ToV2(rest as Parameters<typeof migrateV1ToV2>[0])
    : (rest as unknown as StoredSettings);
  const normalized = normalizeStoredSettings(migrated);
  return normalized as StoredSettings;
}

/** P08: palette-selection만 있을 때 design-settings 1회 생성 */
function migratePaletteSelectionToDesignSettings(): StoredSettings | null {
  const selection = loadPaletteSelection();
  let palette: StoredSettings['palette'] = { ...defaultPalette };
  if (selection?.type === 'custom') {
    palette = selection.colors;
  } else if (selection?.type === 'preset') {
    const def = findThemeById(selection.presetId);
    if (def?.colors) palette = def.colors as StoredSettings['palette'];
  }
  const settings: StoredSettings = {
    version: '2.0',
    palette,
    semanticMapping: null,
    styleName: 'minimal',
    systemPreset: 'default',
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    return null;
  }
  return settings;
}

function loadAppliedSettings(): StoredSettings | null {
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
    if (!raw) {
      const migrated = migratePaletteSelectionToDesignSettings();
      if (migrated) return migrated;
      return null;
    }
    return parseDesignSystemBlob(raw);
  } catch {
    return null;
  }
}

const defaultPalette = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  neutral: '#E5E7EB',
} as const;

function App() {
  const [page, setPage] = useState<PageName>('landing');
  const [designSettingsInitialTab, setDesignSettingsInitialTab] =
    useState<DesignSettingsTabId>('preset');
  const [appliedSettings, setAppliedSettings] = useState<StoredSettings | null>(
    loadAppliedSettings
  );

  const [initialSettings] = useState(loadAppliedSettings);

  const openDesignSettings = useCallback((initialTab?: DesignSettingsTabId) => {
    setDesignSettingsInitialTab(initialTab ?? 'preset');
    setPage('design-settings');
  }, []);

  const handleSelect = (itemId: string) => {
    setPage(itemId as PageName);
  };

  const handleDesignSettingsApply = useCallback((draft: StoredSettings) => {
    setAppliedSettings(draft);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'design-settings':
        return (
          <DesignSettingsLab
            onApply={handleDesignSettingsApply}
            initialTab={designSettingsInitialTab}
          />
        );
      case 'palette':
        return <PaletteLab />;
      case 'style':
        return <StyleLab />;
      case 'font':
        return <FontLab />;
      case 'tokens':
        return <TokenLab />;
      case 'spacing':
        return <SpacingLab />;
      case 'grid':
        return <GridLab />;
      case 'motion':
        return <MotionLab />;
      case 'responsive':
        return <ResponsiveLab />;
      case 'playground':
        return <Playground />;
      case 'atoms':
        return <Atoms />;
      case 'molecules':
        return <Molecules />;
      case 'organisms':
        return <Organisms />;
      case 'service':
        return <Service />;
      case 'shell':
        return <Shell />;
      case 'layout-landing':
        return <LayoutLanding />;
      case 'layout-dashboard':
        return <LayoutDashboard />;
      case 'layout-article':
        return <LayoutArticle />;
      case 'monet-water-lilies':
        return <MonetWaterLilies />;
      case 'matisse-dance-ii':
        return <MatisseDanceII />;
      case 'dashboard':
      case 'card-grid':
        return <PlaceholderPage title={page === 'dashboard' ? 'Dashboard' : 'Card Grid'} />;
      default:
        return <Landing />;
    }
  };

  return (
    <DesignSettingsNavContext.Provider value={{ openDesignSettings }}>
      <InspectorProvider>
      <ThemeProvider
        initialStyleName={initialSettings?.styleName ?? 'minimal'}
        initialPalette={initialSettings?.palette ?? defaultPalette}
        initialSelection={initialSettings ? createCustomSelection(initialSettings.palette) : undefined}
        systemPreset={initialSettings?.systemPreset ?? 'default'}
        appliedSettings={appliedSettings}
      >
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header onLogoClick={() => setPage('landing')}>
            <HeaderNav
              activePage={page}
              onSelect={handleSelect}
              onOpenSettings={() => openDesignSettings('preset')}
            />
          </Header>
          <main
            data-showcase="service"
            style={{
              flex: 1,
              backgroundColor: 'var(--ds-color-bg-base)',
              transition: 'background-color 300ms ease-in-out',
            }}
          >
            <LayoutPreviewControlsProvider>{renderPage()}</LayoutPreviewControlsProvider>
          </main>
          <Footer />
        </div>
        <ComponentInspectorPanel />
      </ThemeProvider>
      </InspectorProvider>
    </DesignSettingsNavContext.Provider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: 'var(--ds-spacing-8)',
        maxWidth: 'var(--app-max-width)',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--ds-text-2xl)',
          fontWeight: 'var(--ds-font-weight-bold)',
          color: 'var(--ds-color-text-primary)',
          marginBottom: 'var(--ds-spacing-4)',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 'var(--ds-text-md)',
          color: 'var(--ds-color-text-secondary)',
        }}
      >
        Coming soon
      </p>
    </div>
  );
}

export default App;
