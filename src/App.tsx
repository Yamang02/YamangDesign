import { useState, useMemo } from 'react';
import { ThemeProvider } from './themes';
import { Footer, Header, HeaderNav } from './components';
import { GLOBAL_SETTINGS_STORAGE_KEY } from './components/GlobalSettings';
import { Landing, Components, PaletteLab, StyleLab, Playground, FontLab } from './pages';

export type PageName =
  | 'landing'
  | 'dashboard'
  | 'card-grid'
  | 'components'
  | 'palette'
  | 'style'
  | 'font'
  | 'playground';

function App() {
  const [page, setPage] = useState<PageName>('landing');

  const initialSettings = useMemo(() => {
    try {
      const raw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.palette) return null;
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const handleSelect = (itemId: string) => {
    setPage(itemId as PageName);
  };

  const renderPage = () => {
    switch (page) {
      case 'palette':
        return <PaletteLab />;
      case 'style':
        return <StyleLab />;
      case 'font':
        return <FontLab />;
      case 'playground':
        return <Playground />;
      case 'components':
        return <Components />;
      case 'dashboard':
      case 'card-grid':
        return <PlaceholderPage title={page === 'dashboard' ? 'Dashboard' : 'Card Grid'} />;
      default:
        return <Landing />;
    }
  };

  return (
    <ThemeProvider
      initialTheme={initialSettings?.styleName ?? 'minimal'}
      initialPalette={initialSettings?.palette ?? {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        neutral: '#E5E7EB',
      }}
      systemPreset={initialSettings?.systemPreset ?? 'default'}
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header onLogoClick={() => setPage('landing')}>
          <HeaderNav activePage={page} onSelect={handleSelect} />
        </Header>
        <main
          data-showcase="service"
          style={{
            flex: 1,
            backgroundColor: 'var(--ds-color-bg-base)',
            transition: 'background-color 300ms ease-in-out',
          }}
        >
          {renderPage()}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
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
