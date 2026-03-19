/**
 * E06 P05: Build — Organisms
 * Molecules/Atoms 조합으로 페이지 섹션: HeaderBar, SidebarNav, CardGrid, FormCard, StatusBanner
 */
import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ComponentCard,
  ComponentDetailModal,
  CompositionMap,
  Icon,
  Input,
  TokenSection,
} from '../../components';
import { LabLayout } from '../../layouts';
import { ORGANISMS } from '@app/content/build-content';
import type { OrganismId } from '@app/content/build-content';
import styles from './Components/Components.module.css';

function OrganismPreview({ id }: { id: OrganismId }) {
  const wrapper = (node: React.ReactNode) => (
    <div data-context="preview" style={{ width: '100%' }}>
      {node}
    </div>
  );

  switch (id) {
    case 'header-bar':
      return wrapper(
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--ds-spacing-4)',
            background: 'var(--shell-bg-base)',
            borderBottom: 'var(--ds-border-width) solid var(--shell-border-default)',
            borderRadius: 'var(--ds-radius-md)',
          }}
        >
          <nav style={{ display: 'flex', gap: 'var(--ds-spacing-4)' }}>
            <span style={{ fontSize: 'var(--ds-text-sm)', fontWeight: 600 }}>Home</span>
            <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-muted)' }}>Docs</span>
            <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-muted)' }}>About</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-3)' }}>
            <Avatar initials="JD" size="sm" variant="primary" />
            <span style={{ fontSize: 'var(--ds-text-sm)', fontWeight: 500 }}>Jane</span>
            <Badge variant="subtle">Pro</Badge>
            <Button variant="outline" size="sm">Sign out</Button>
          </div>
        </header>
      );
    case 'sidebar-nav':
      return wrapper(
        <aside
          style={{
            padding: 'var(--ds-spacing-4)',
            background: 'var(--shell-bg-surface)',
            borderRadius: 'var(--ds-radius-md)',
            border: 'var(--ds-border-width) solid var(--shell-border-subtle)',
            width: 'var(--shell-size-sidebar-width)',
            margin: '0 auto',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-2)' }}>
            {['Dashboard', 'Projects', 'Settings'].map((label, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--ds-spacing-2) var(--ds-spacing-3)',
                  fontSize: 'var(--ds-text-sm)',
                  borderRadius: 'var(--ds-radius-md)',
                  background: i === 0 ? 'var(--ds-color-bg-muted)' : 'transparent',
                }}
              >
                {label}
                {label === 'Projects' && <Badge variant="primary" size="sm">3</Badge>}
              </div>
            ))}
          </nav>
        </aside>
      );
    case 'card-grid':
      return wrapper(
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(var(--ds-component-size-select-lg-min), 1fr))',
            gap: 'var(--ds-spacing-6)',
          }}
        >
          {[1, 2, 3].map((n) => (
            <Card key={n} variant="elevated" padding="md" hoverable>
              <Card.Header><span style={{ fontSize: 'var(--ds-text-md)', fontWeight: 600 }}>Card {n}</span></Card.Header>
              <Card.Body><span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)' }}>Short description.</span></Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm">Action</Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      );
    case 'form-card':
      return wrapper(
        <div style={{ maxWidth: 'var(--ds-component-size-form-card-max-width)', margin: '0 auto' }}>
          <Card variant="elevated" padding="lg">
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <Input label="Name" placeholder="Your name" fullWidth />
              <Input label="Email" type="email" placeholder="you@example.com" fullWidth />
              <Button variant="primary" fullWidth>Submit</Button>
            </div>
          </Card.Body>
        </Card>
        </div>
      );
    case 'status-banner':
      return wrapper(
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-2)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-spacing-2)',
              padding: 'var(--ds-spacing-3)',
              borderRadius: 'var(--ds-radius-md)',
              background: 'var(--sys-color-info-subtle)',
              color: 'var(--sys-color-info)',
              fontSize: 'var(--ds-text-sm)',
            }}
          >
            <Icon name="info" size="sm" title="Info" />
            <span>Your session will expire in 5 minutes.</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-spacing-2)',
              padding: 'var(--ds-spacing-3)',
              borderRadius: 'var(--ds-radius-md)',
              background: 'var(--sys-color-warning-subtle)',
              color: 'var(--sys-color-warning)',
              fontSize: 'var(--ds-text-sm)',
            }}
          >
            <Icon name="warning" size="sm" title="Warning" />
            <span>Please save your work.</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-spacing-2)',
              padding: 'var(--ds-spacing-3)',
              borderRadius: 'var(--ds-radius-md)',
              background: 'var(--sys-color-error-subtle)',
              color: 'var(--sys-color-error)',
              fontSize: 'var(--ds-text-sm)',
            }}
          >
            <Icon name="error" size="sm" title="Error" />
            <span>Something went wrong.</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function OrganismModalContent({ id }: { id: OrganismId }) {
  const def = ORGANISMS.find((o) => o.id === id);
  if (!def) return null;
  return (
    <>
      <section className={styles.showcaseModalSection}>
        <h2 className={styles.showcaseModalSectionTitle}>Composition</h2>
        <div className={styles.showcaseModalSectionContent}>
          <CompositionMap lines={def.compositionLines} />
        </div>
      </section>
      <section className={styles.showcaseModalSection}>
        <h2 className={styles.showcaseModalSectionTitle}>Preview</h2>
        <div className={styles.showcaseModalSectionContent}>
          <OrganismPreview id={id} />
        </div>
      </section>
      {def.tokens && def.tokens.length > 0 && (
        <section className={styles.showcaseModalSection}>
          <h2 className={styles.showcaseModalSectionTitle}>Key tokens</h2>
          <div className={styles.showcaseModalSectionContent}>
            <TokenSection tokens={def.tokens ?? []} />
          </div>
        </section>
      )}
    </>
  );
}

export function Organisms() {
  const [detailId, setDetailId] = useState<OrganismId | null>(null);

  return (
    <>
      <LabLayout
        title="Organisms"
        showToc={false}
        tocItems={[]}
      >
        <div data-context="preview" className={styles.buildPreviewWrap}>
          <div className={styles.showcaseGrid} style={{ gridTemplateColumns: '1fr' }}>
            {ORGANISMS.map((o) => (
              <ComponentCard
                key={o.id}
                id={o.id}
                title={o.title}
                variantCount={o.variantCount}
                preview={<OrganismPreview id={o.id} />}
                onClick={() => setDetailId(o.id)}
                composedOf={o.composedOf}
                composedOfLabel="Molecules:"
              />
            ))}
          </div>
        </div>
      </LabLayout>

      <ComponentDetailModal
        open={!!detailId}
        onClose={() => setDetailId(null)}
        title={detailId ? ORGANISMS.find((o) => o.id === detailId)?.title ?? '' : ''}
        previewStyle={{}}
      >
        {detailId && <OrganismModalContent id={detailId} />}
      </ComponentDetailModal>
    </>
  );
}
