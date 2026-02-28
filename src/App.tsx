import { useState } from 'react';
import { ThemeProvider } from './themes';
import { Navigation, Button } from './components';
import { Landing, Components } from './pages';

export type PageName = 'landing' | 'components';

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
        variant={page === 'components' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('components')}
      >
        Components
      </Button>
    </>
  );

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
        {page === 'landing' ? <Landing /> : <Components />}
      </div>
    </ThemeProvider>
  );
}

export default App;
