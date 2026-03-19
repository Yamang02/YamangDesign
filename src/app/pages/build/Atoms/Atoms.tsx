/**
 * E06 P04: Build — Atoms
 * 단일 UI 요소(Atom) 전시. Molecules 사용처는 P05에서 연결.
 */
import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ComponentCard,
  ComponentDetailModal,
  Icon,
  Input,
  Select,
  TokenSection,
} from '../../../components';
import { LabLayout, type TocItem } from '../../../layouts';
import {
  showcaseSections,
  showcaseLabels,
  showcaseContent,
  showcaseSectionTokens,
  ATOM_USED_IN,
  buttonShowcase,
  cardShowcase,
  inputShowcase,
  selectShowcase,
  iconShowcase,
} from '@app/content/showcase-content';
import type { ShowcaseSectionId } from '@app/content/showcase-content';
import styles from '../Components/Components.module.css';

/** 복잡도 순: Badge → Icon → Avatar → Button → Input → Select → Card */
const tocItems: TocItem[] = [
  { id: 'badge', label: showcaseSections.badge },
  { id: 'icon', label: showcaseSections.icon },
  { id: 'avatar', label: showcaseSections.avatar },
  { id: 'button', label: showcaseSections.button },
  { id: 'input', label: showcaseSections.input },
  { id: 'select', label: showcaseSections.select },
  { id: 'card', label: showcaseSections.card },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** E06 P04: Atoms 그리드 (Badge, Icon, Avatar, Button, Input, Select, Card) */
const SHOWCASE_GRID_IDS: ShowcaseSectionId[] = [
  'badge',
  'icon',
  'avatar',
  'button',
  'input',
  'select',
  'card',
];

const VARIANT_COUNTS: Record<ShowcaseSectionId, number> = {
  badge: 5,
  icon: 3,
  avatar: 4,
  button: 6,
  card: 3,
  select: 3,
  input: 3,
};

/** 모달 내 쇼케이스 — 폰트 위계·공간 활용·Variants 그리드 배치 */
function ComponentShowcase({ id }: { id: ShowcaseSectionId }) {
  const hasTokens = (showcaseSectionTokens[id]?.length ?? 0) > 0;
  return (
    <>
      <section className={styles.showcaseModalSection}>
        <h2 className={styles.showcaseModalSectionTitle}>Variants</h2>
        <div className={styles.showcaseModalSectionContent}>
          <SectionContent id={id} />
        </div>
      </section>
      {hasTokens && (
        <section className={styles.showcaseModalSection}>
          <h2 className={styles.showcaseModalSectionTitle}>Design tokens</h2>
          <div className={styles.showcaseModalSectionContent}>
            <TokenSection tokens={showcaseSectionTokens[id] ?? []} />
          </div>
        </section>
      )}
    </>
  );
}

/** 그리드 한 셀: 라벨(shell) + 컴포넌트(ds, data-context="preview") */
function VariantCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.showcaseVariantItem}>
      <span className={styles.showcaseVariantItemLabel}>{label}</span>
      <div data-context="preview" className={styles.showcaseVariantPreview}>
        {children}
      </div>
    </div>
  );
}

/** 섹션별 본문 (모달 Variants). 그리드 배치 + 폰트 위계(그룹 라벨 > 셀 라벨) */
function SectionContent({ id }: { id: ShowcaseSectionId }) {
  switch (id) {
    case 'badge':
      return (
        <>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.variants}</p>
            <div className={styles.showcaseVariantGrid}>
              {(['primary', 'secondary', 'accent', 'outline', 'subtle'] as const).map((v) => (
                <VariantCell key={v} label={capitalize(v)}>
                  <Badge variant={v}>{showcaseContent.badge}</Badge>
                </VariantCell>
              ))}
            </div>
          </div>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
            <div className={styles.showcaseVariantGrid}>
              <VariantCell label="Small"><Badge size="sm">{showcaseContent.badge}</Badge></VariantCell>
              <VariantCell label="Medium"><Badge size="md">{showcaseContent.badge}</Badge></VariantCell>
            </div>
          </div>
        </>
      );
    case 'icon':
      return (
        <>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.materialIcons}</p>
            <div className={styles.showcaseVariantGrid}>
              {iconShowcase.material.slice(0, 5).map((name) => (
                <VariantCell key={name} label={capitalize(name)}>
                  <Icon name={name} title={capitalize(name)} />
                </VariantCell>
              ))}
            </div>
          </div>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
            <div className={styles.showcaseVariantGrid}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <VariantCell key={s} label={s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}>
                  <Icon name="star" size={s} title={showcaseContent.icon} />
                </VariantCell>
              ))}
            </div>
          </div>
        </>
      );
    case 'avatar':
      return (
        <>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
            <div className={styles.showcaseVariantGrid}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <VariantCell key={s} label={s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}>
                  <Avatar initials={showcaseContent.avatar} size={s} />
                </VariantCell>
              ))}
            </div>
          </div>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.variants}</p>
            <div className={styles.showcaseVariantGrid}>
              {(['primary', 'secondary', 'accent'] as const).map((v) => (
                <VariantCell key={v} label={capitalize(v)}>
                  <Avatar initials={showcaseContent.avatar} variant={v} />
                </VariantCell>
              ))}
            </div>
          </div>
        </>
      );
    case 'button':
      return (
        <>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.variants}</p>
            <div className={styles.showcaseVariantGrid}>
              <VariantCell label={buttonShowcase.variants.primary}>
                <Button variant="primary">{showcaseContent.button}</Button>
              </VariantCell>
              <VariantCell label={buttonShowcase.variants.outline}>
                <Button variant="outline">{showcaseContent.button}</Button>
              </VariantCell>
              <VariantCell label={buttonShowcase.variants.ghost}>
                <Button variant="ghost">{showcaseContent.button}</Button>
              </VariantCell>
            </div>
          </div>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
            <div className={styles.showcaseVariantGrid}>
              <VariantCell label={buttonShowcase.sizes.sm}>
                <Button size="sm">{showcaseContent.button}</Button>
              </VariantCell>
              <VariantCell label={buttonShowcase.sizes.md}>
                <Button size="md">{showcaseContent.button}</Button>
              </VariantCell>
              <VariantCell label={buttonShowcase.sizes.lg}>
                <Button size="lg">{showcaseContent.button}</Button>
              </VariantCell>
            </div>
          </div>
        </>
      );
    case 'card':
      return (
        <div className={styles.showcaseVariantGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--ds-component-size-showcase-card-min), 1fr))' }}>
          <div className={styles.showcaseVariantItem} style={{ alignItems: 'stretch' }}>
            <span className={styles.showcaseVariantItemLabel}>{cardShowcase.variantLabels.elevated}</span>
            <Card variant="elevated" hoverable>
              <Card.Header>{showcaseContent.card.title}</Card.Header>
              <Card.Body>{showcaseContent.card.body}</Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm">{showcaseContent.button}</Button>
              </Card.Footer>
            </Card>
          </div>
          <div className={styles.showcaseVariantItem} style={{ alignItems: 'stretch' }}>
            <span className={styles.showcaseVariantItemLabel}>{cardShowcase.variantLabels.outlined}</span>
            <Card variant="outlined" hoverable>
              <Card.Header>{showcaseContent.card.title}</Card.Header>
              <Card.Body>{showcaseContent.card.body}</Card.Body>
            </Card>
          </div>
          <div className={styles.showcaseVariantItem} style={{ alignItems: 'stretch' }}>
            <span className={styles.showcaseVariantItemLabel}>{cardShowcase.variantLabels.flat}</span>
            <Card variant="flat" padding="lg">
              <Card.Body>{showcaseContent.card.body}</Card.Body>
            </Card>
          </div>
        </div>
      );
    case 'select':
      return <SelectSectionBody />;
    case 'input':
      return (
        <>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.variants}</p>
            <div className={styles.showcaseVariantGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--ds-component-size-select-lg-min), 1fr))' }}>
              <VariantCell label={inputShowcase.variants.outline}>
                <Input variant="outline" placeholder={showcaseContent.input} />
              </VariantCell>
              <VariantCell label={inputShowcase.variants.filled}>
                <Input variant="filled" placeholder={showcaseContent.input} />
              </VariantCell>
              <VariantCell label={inputShowcase.variants.flushed}>
                <Input variant="flushed" placeholder={showcaseContent.input} />
              </VariantCell>
            </div>
          </div>
          <div className={styles.showcaseModalGroup}>
            <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
            <div className={styles.showcaseVariantGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--ds-component-size-select-lg-min), 1fr))' }}>
              <VariantCell label={inputShowcase.sizes.sm}>
                <Input size="sm" placeholder={showcaseContent.input} />
              </VariantCell>
              <VariantCell label={inputShowcase.sizes.md}>
                <Input size="md" placeholder={showcaseContent.input} />
              </VariantCell>
              <VariantCell label={inputShowcase.sizes.lg}>
                <Input size="lg" placeholder={showcaseContent.input} />
              </VariantCell>
            </div>
          </div>
        </>
      );
    default:
      return null;
  }
}

/** Select 섹션 본문 (state 유지 필요해 별도 컴포넌트). 그리드 + 그룹 라벨 */
function SelectSectionBody() {
  const [value, setValue] = useState('apple');
  const options = [...selectShowcase.fruitOptions];
  return (
    <>
      <div className={styles.showcaseModalGroup}>
        <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.variants}</p>
        <div className={styles.showcaseVariantGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--ds-component-size-dropdown-min), 1fr))' }}>
          <VariantCell label={selectShowcase.variants.outline}>
            <Select options={options} value={value} onChange={setValue} variant="outline" placeholder={showcaseContent.select} />
          </VariantCell>
          <VariantCell label={selectShowcase.variants.filled}>
            <Select options={options} value="" onChange={() => {}} variant="filled" placeholder={showcaseContent.select} />
          </VariantCell>
          <VariantCell label={selectShowcase.variants.ghost}>
            <Select options={options} value="" onChange={() => {}} variant="ghost" placeholder={showcaseContent.select} />
          </VariantCell>
        </div>
      </div>
      <div className={styles.showcaseModalGroup}>
        <p className={styles.showcaseModalGroupLabel}>{showcaseLabels.sizes}</p>
        <div className={styles.showcaseVariantGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--ds-component-size-dropdown-min), 1fr))' }}>
          <VariantCell label={selectShowcase.sizes.sm}>
            <Select options={options} value="apple" onChange={() => {}} size="sm" placeholder={showcaseContent.select} />
          </VariantCell>
          <VariantCell label={selectShowcase.sizes.md}>
            <Select options={options} value="banana" onChange={() => {}} size="md" placeholder={showcaseContent.select} />
          </VariantCell>
          <VariantCell label={selectShowcase.sizes.lg}>
            <Select options={options} value="cherry" onChange={() => {}} size="lg" placeholder={showcaseContent.select} />
          </VariantCell>
        </div>
      </div>
    </>
  );
}

function getSectionTitle(id: ShowcaseSectionId): string {
  return showcaseSections[id];
}

export function Atoms() {
  const [detailSection, setDetailSection] = useState<ShowcaseSectionId | null>(null);

  return (
    <>
      <LabLayout
        title="Atoms"
        showToc={false}
        tocItems={tocItems}
      >
        <div data-context="preview" className={styles.buildPreviewWrap}>
          <div className={styles.showcaseGrid}>
            {SHOWCASE_GRID_IDS.map((id) => (
              <ComponentCard
                key={id}
                id={id}
                title={getSectionTitle(id)}
                variantCount={VARIANT_COUNTS[id]}
                preview={getCardPreview(id)}
                onClick={() => setDetailSection(id)}
                usedIn={ATOM_USED_IN[id]}
              />
            ))}
          </div>

        </div>
      </LabLayout>

      <ComponentDetailModal
        open={!!detailSection}
        onClose={() => setDetailSection(null)}
        title={detailSection ? getSectionTitle(detailSection) : ''}
        previewStyle={{}}
      >
        {detailSection && <ComponentShowcase id={detailSection} />}
      </ComponentDetailModal>
    </>
  );
}

/** 그리드 카드용 미리보기 (대표 2~3개 variant) */
function getCardPreview(id: ShowcaseSectionId): React.ReactNode {
  switch (id) {
    case 'badge':
      return (
        <>
          <Badge variant="primary">{showcaseContent.badge}</Badge>
          <Badge variant="outline">{showcaseContent.badge}</Badge>
          <Badge variant="subtle">{showcaseContent.badge}</Badge>
        </>
      );
    case 'icon':
      return (
        <>
          <Icon name="palette" title="Palette" />
          <Icon name="settings" title="Settings" />
          <Icon name="star" title="Star" />
        </>
      );
    case 'avatar':
      return (
        <>
          <Avatar initials={showcaseContent.avatar} size="sm" />
          <Avatar initials={showcaseContent.avatar} variant="primary" />
          <Avatar initials={showcaseContent.avatar} variant="accent" />
        </>
      );
    case 'button':
      return (
        <>
          <Button variant="primary">{showcaseContent.button}</Button>
          <Button variant="outline">{showcaseContent.button}</Button>
          <Button variant="ghost">{showcaseContent.button}</Button>
        </>
      );
    case 'card':
      return (
        <Card variant="elevated" padding="md">
          <Card.Body>{showcaseContent.card.body}</Card.Body>
        </Card>
      );
    case 'select':
      return (
        <Select
          options={[...selectShowcase.fruitOptions]}
          value="apple"
          onChange={() => {}}
          variant="outline"
          placeholder={showcaseContent.select}
        />
      );
    case 'input':
      return (
        <>
          <Input placeholder={showcaseContent.input} />
        </>
      );
    default:
      return null;
  }
}
