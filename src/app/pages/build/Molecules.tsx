/**
 * E06 P05: Build — Molecules
 * Atoms 조합 패턴: FormField, SearchBar, ProfileCard, ActionCard, TagGroup
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
import { MOLECULES } from '@app/content/build-content';
import type { MoleculeId } from '@app/content/build-content';
import styles from './Components/Components.module.css';

function MoleculePreview({ id }: Readonly<{ id: MoleculeId }>) {
  switch (id) {
    case 'form-field':
      return (
        <div data-context="preview" style={{ minWidth: 200 }}>
          <Input
            label="Email"
            placeholder="you@example.com"
            fullWidth
          />
          <span style={{ fontSize: 'var(--ds-text-caption-size)', color: 'var(--ds-color-text-muted)', marginTop: 4, display: 'block' }}>
            We'll never share your email.
          </span>
        </div>
      );
    case 'search-bar':
      return (
        <div data-context="preview" style={{ display: 'flex', gap: 'var(--ds-spacing-2)', alignItems: 'center' }}>
          <div style={{ width: 160 }}>
            <Input placeholder="Search…" variant="outline" size="md" />
          </div>
          <Button variant="primary" size="md" aria-label="Search">
            <Icon name="search" size="sm" title="Search" />
          </Button>
        </div>
      );
    case 'profile-card':
      return (
        <div data-context="preview" style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-3)' }}>
          <Avatar initials="JD" size="md" variant="primary" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 'var(--ds-text-sm)', fontWeight: 600 }}>Jane Doe</span>
            <span style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-color-text-muted)' }}>Designer</span>
          </div>
          <Badge variant="accent">Pro</Badge>
        </div>
      );
    case 'action-card':
      return (
        <div data-context="preview" style={{ width: '100%', maxWidth: 220 }}>
          <Card variant="elevated" padding="md" hoverable>
            <Card.Header><span style={{ fontSize: 'var(--ds-text-md)', fontWeight: 600 }}>Get started</span></Card.Header>
            <Card.Body><span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)' }}>Create your first project in minutes.</span></Card.Body>
            <Card.Footer>
              <Button variant="primary" size="sm">Create project</Button>
            </Card.Footer>
          </Card>
        </div>
      );
    case 'tag-group':
      return (
        <div data-context="preview" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-2)' }}>
          <Badge variant="primary">React</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="subtle">Design</Badge>
        </div>
      );
    default:
      return null;
  }
}

function MoleculeModalContent({ id }: Readonly<{ id: MoleculeId }>) {
  const def = MOLECULES.find((m) => m.id === id);
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
        <h2 className={styles.showcaseModalSectionTitle}>Variants</h2>
        <div className={styles.showcaseModalSectionContent} data-context="preview">
          <MoleculePreview id={id} />
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

export function Molecules() {
  const [detailId, setDetailId] = useState<MoleculeId | null>(null);

  return (
    <>
      <LabLayout
        title="Molecules"
        showToc={false}
        tocItems={[]}
      >
        <div data-context="preview" className={styles.buildPreviewWrap}>
          <div className={styles.showcaseGrid}>
            {MOLECULES.map((m) => (
              <ComponentCard
                key={m.id}
                id={m.id}
                title={m.title}
                variantCount={m.variantCount}
                preview={<MoleculePreview id={m.id} />}
                onClick={() => setDetailId(m.id)}
                composedOf={m.composedOf}
              />
            ))}
          </div>
        </div>
      </LabLayout>

      <ComponentDetailModal
        open={!!detailId}
        onClose={() => setDetailId(null)}
        title={detailId ? MOLECULES.find((m) => m.id === detailId)?.title ?? '' : ''}
        previewStyle={{}}
      >
        {detailId && <MoleculeModalContent id={detailId} />}
      </ComponentDetailModal>
    </>
  );
}
