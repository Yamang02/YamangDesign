import { useState } from 'react';
import { ThemeProvider } from './themes';
import { Navigation, NavDropdown } from './components';
import { navCategories } from './config/nav-categories';
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSelect = (itemId: string) => {
    setPage(itemId as PageName);
    setOpenDropdown(null);
  };

  const centerContent = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-2)' }}>
      {navCategories.map((category) => (
        <NavDropdown
          key={category.id}
          category={category}
          isOpen={openDropdown === category.id}
          onToggle={() =>
            setOpenDropdown((prev) => (prev === category.id ? null : category.id))
          }
          onSelect={handleSelect}
          activeItem={page}
        />
      ))}
    </div>
  );

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
      initialTheme="minimal"
      initialPalette={{
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        neutral: '#E5E7EB',
      }}
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation
          brand="Yamang Design"
          showThemeToggle
          showColorEditor
          sticky
          centerContent={centerContent}
        />
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
      </div>
    </ThemeProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: 'var(--ds-spacing-8)',
        maxWidth: 600,
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
