import { useState } from 'react';
import { ThemeProvider } from './themes';
import { Navigation, Button } from './components';
import { Landing, Components, PaletteLab, StyleLab, Playground } from './pages';

export type PageName = 'landing' | 'palette' | 'style' | 'playground' | 'components';

function App() {
  const [page, setPage] = useState<PageName>('landing');

  const pageNavigation = (
    <>
      <Button
        variant={page === 'landing' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('landing')}
      >
        Landing
      </Button>
      <Button
        variant={page === 'palette' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('palette')}
      >
        Palette
      </Button>
      <Button
        variant={page === 'style' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('style')}
      >
        Style
      </Button>
      <Button
        variant={page === 'playground' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('playground')}
      >
        Playground
      </Button>
      <Button
        variant={page === 'components' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('components')}
      >
        Components
      </Button>
    </>
  );

  const renderPage = () => {
    switch (page) {
      case 'palette': return <PaletteLab />;
      case 'style': return <StyleLab />;
      case 'playground': return <Playground />;
      case 'components': return <Components />;
      default: return <Landing />;
    }
  };

  return (
    <ThemeProvider
      initialTheme="minimal"
      initialPalette={{
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        sub: '#E5E7EB',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--ds-color-bg-base)',
          transition: 'background-color 300ms ease-in-out',
        }}
      >
        <Navigation
          brand="Yamang Design"
          showThemeToggle
          showColorEditor
          sticky
          centerContent={pageNavigation}
        />
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}

export default App;
