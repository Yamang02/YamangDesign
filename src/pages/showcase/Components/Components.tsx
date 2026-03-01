import { useState, useEffect } from 'react';
import { Avatar, Badge, Button, Card, DetailPanel, Icon, Input, Profile, Select } from '../../../components';
import { LabLayout, type TocItem } from '../../../layouts';
import {
  showcaseSections,
  showcaseLabels,
  showcaseContent,
  showcaseSectionTokens,
  buttonShowcase,
  cardShowcase,
  inputShowcase,
  selectShowcase,
  iconShowcase,
  formExample,
} from '../../../constants';
import type { ShowcaseSectionId } from '../../../constants';
import styles from './Components.module.css';

/** 복잡도 순: Badge → Icon → Avatar → Button → Input → Select → Card → Form Example */
const tocItems: TocItem[] = [
  { id: 'badge', label: showcaseSections.badge },
  { id: 'icon', label: showcaseSections.icon },
  { id: 'avatar', label: showcaseSections.avatar },
  { id: 'button', label: showcaseSections.button },
  { id: 'input', label: showcaseSections.input },
  { id: 'select', label: showcaseSections.select },
  { id: 'card', label: showcaseSections.card },
  { id: 'form-example', label: formExample.title },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 중앙 정렬된 콘텐츠 영역 - LabLayout 내부에서 섹션들이 동일 시작점으로 왼쪽 정렬 */
const contentAreaStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
} as const;

const sectionStyle = {
  padding: 'var(--ds-spacing-8) 0',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--ds-spacing-6)',
  justifyItems: 'start' as const,
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 'var(--ds-spacing-3)',
  marginBottom: 'var(--ds-spacing-4)',
  justifyContent: 'flex-start' as const,
};

const labelStyle = {
  fontSize: 'var(--ds-text-sm)',
  color: 'var(--ds-color-text-secondary)',
  marginBottom: 'var(--ds-spacing-2)',
};

const itemWrapperStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  gap: 'var(--ds-spacing-1)',
};

/** 카드 섹션: 그리드 셀 전체 너비 사용하여 레이아웃 안정화 */
const cardItemWrapperStyle = {
  ...itemWrapperStyle,
  alignItems: 'stretch' as const,
  minWidth: 0,
};

const itemLabelStyle = {
  fontSize: 'var(--ds-text-xs)',
  color: 'var(--ds-color-text-muted)',
};

const dividerStyle = {
  borderTop: '1px solid var(--ds-color-border-default)',
  margin: 0,
  width: '100%',
} as const;

function SectionDivider() {
  return <div style={dividerStyle} />;
}

type TokenCategory = 'color' | 'spacing' | 'typography' | 'size' | 'shadow' | 'other';

function getTokenCategory(token: string): TokenCategory {
  if (token.includes('color')) return 'color';
  if (token.includes('spacing') || token.includes('radius') || token.includes('z-')) return 'spacing';
  if (token.includes('font') || token.includes('text-') || token.includes('weight') || token.includes('leading')) return 'typography';
  if (token.includes('size') || token.includes('border')) return 'size';
  if (token.includes('shadow') || token.includes('transition')) return 'shadow';
  return 'other';
}

const CATEGORY_LABELS: Record<TokenCategory, string> = {
  color: '색상',
  spacing: '간격 / 모양',
  typography: '타이포그래피',
  size: '크기 / 테두리',
  shadow: '그림자 / 트랜지션',
  other: '기타',
};

function ComponentDetail({ sectionId }: { sectionId: ShowcaseSectionId }) {
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({});
  const tokens = showcaseSectionTokens[sectionId] ?? [];

  useEffect(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const list = showcaseSectionTokens[sectionId] ?? [];
    const unique = Array.from(new Map(list.map((t) => [t.token, t])).values());
    const next: Record<string, string> = {};
    unique.forEach(({ token }) => {
      const val = computed.getPropertyValue(token).trim();
      next[token] = val || '(미정의)';
    });
    setTokenValues(next);
  }, [sectionId]);

  const uniqueTokens = Array.from(
    new Map(tokens.map((t) => [t.token, t])).values()
  );
  const tokensByCategory = uniqueTokens.reduce<Record<TokenCategory, typeof uniqueTokens>>(
    (acc, t) => {
      const cat = getTokenCategory(t.token);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(t);
      return acc;
    },
    {} as Record<TokenCategory, typeof uniqueTokens>
  );
  const order: TokenCategory[] = ['color', 'spacing', 'typography', 'size', 'shadow', 'other'];

  if (!tokens.length) return null;

  return (
    <div className={styles.componentDetail}>
      {order.map((cat) => {
        const list = tokensByCategory[cat];
        if (!list?.length) return null;
        return (
          <section key={cat} className={styles.tokenGroup}>
            <h4 className={styles.tokenGroupTitle}>{CATEGORY_LABELS[cat]}</h4>
            <div className={styles.tokenTable}>
              {list.map(({ token, label }) => {
                const value = tokenValues[token] ?? '(로딩 중…)';
                const isColor =
                  token.includes('color') &&
                  (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));
                const isLongValue = value.length > 50;
                const shortName = token.replace(/^--ds-/, '');
                const displayValue =
                  isLongValue && value.includes(', ')
                    ? value.split(', ').join(',\n  ')
                    : value;
                return (
                  <div
                    key={token}
                    className={
                      isLongValue
                        ? `${styles.tokenRow} ${styles.tokenRowLong}`
                        : styles.tokenRow
                    }
                  >
                    <div className={styles.tokenMeta}>
                      <code className={styles.tokenName}>{shortName}</code>
                      {label && <span className={styles.tokenLabel}>{label}</span>}
                    </div>
                    <div className={styles.tokenValueCell}>
                      {isColor && (
                        <span
                          className={styles.tokenSwatch}
                          style={{ backgroundColor: value }}
                          title={value}
                        />
                      )}
                      <code className={styles.tokenValue}>{displayValue}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  onInfoClick: () => void;
}

function SectionHeader({ title, onInfoClick }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>
      <button
        type="button"
        className={styles.infoButton}
        onClick={onInfoClick}
        aria-label={`${title} 상세 정보 보기`}
      >
        <Icon name="info" size="sm" />
      </button>
    </div>
  );
}

function SelectSection({ id, onInfoClick }: { id: string; onInfoClick: () => void }) {
  const [value1, setValue1] = useState('apple');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('banana');

  const options = [...selectShowcase.fruitOptions];
  return (
    <section id={id} style={sectionStyle}>
      <SectionHeader title={showcaseSections.select} onInfoClick={onInfoClick} />

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <p style={labelStyle}>{showcaseLabels.variants}</p>
        <div style={rowStyle}>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.variants.outline}</span>
            <Select
              options={options}
              value={value1}
              onChange={setValue1}
              variant="outline"
              placeholder={showcaseContent.select}
            />
          </div>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.variants.filled}</span>
            <Select
              options={options}
              value={value2}
              onChange={setValue2}
              variant="filled"
              placeholder={showcaseContent.select}
            />
          </div>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.variants.ghost}</span>
            <Select
              options={options}
              value={value3}
              onChange={setValue3}
              variant="ghost"
              placeholder={showcaseContent.select}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <p style={labelStyle}>{showcaseLabels.sizes}</p>
        <div style={rowStyle}>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.sizes.sm}</span>
            <Select options={options} value="apple" onChange={() => {}} size="sm" placeholder={showcaseContent.select} />
          </div>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.sizes.md}</span>
            <Select options={options} value="banana" onChange={() => {}} size="md" placeholder={showcaseContent.select} />
          </div>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.sizes.lg}</span>
            <Select options={options} value="cherry" onChange={() => {}} size="lg" placeholder={showcaseContent.select} />
          </div>
        </div>
      </div>

      <div>
        <p style={labelStyle}>{showcaseLabels.states}</p>
        <div style={rowStyle}>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.states.disabled}</span>
            <Select options={options} value="apple" onChange={() => {}} disabled placeholder={showcaseContent.select} />
          </div>
          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{selectShowcase.states.placeholder}</span>
            <Select options={options} value="" onChange={() => {}} placeholder={showcaseContent.select} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Components() {
  const [detailSection, setDetailSection] = useState<ShowcaseSectionId | null>(null);

  return (
    <>
    <LabLayout title="Components"  tocItems={tocItems}>
      <div style={contentAreaStyle}>
      {/* Badge Section */}
      <section id="badge" style={sectionStyle}>
        <SectionHeader title={showcaseSections.badge} onInfoClick={() => setDetailSection('badge')} />

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.variants}</p>
          <div style={rowStyle}>
            <Badge variant="primary">{showcaseContent.badge}</Badge>
            <Badge variant="secondary">{showcaseContent.badge}</Badge>
            <Badge variant="accent">{showcaseContent.badge}</Badge>
            <Badge variant="outline">{showcaseContent.badge}</Badge>
            <Badge variant="subtle">{showcaseContent.badge}</Badge>
          </div>
        </div>

        <div>
          <p style={labelStyle}>{showcaseLabels.sizes}</p>
          <div style={rowStyle}>
            <Badge size="sm">{showcaseContent.badge}</Badge>
            <Badge size="md">{showcaseContent.badge}</Badge>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Icon Section */}
      <section id="icon" style={sectionStyle}>
        <SectionHeader title={showcaseSections.icon} onInfoClick={() => setDetailSection('icon')} />

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.materialIcons}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            {iconShowcase.material.map((name) => (
              <Icon key={name} name={name} title={capitalize(name)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.nucleoIcons}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            {iconShowcase.nucleo.map((name) => (
              <Icon key={name} name={name} library="nucleo" title={capitalize(name)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.sizes}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Icon name="star" size="sm" title={showcaseContent.icon} />
            <Icon name="star" size="md" title={showcaseContent.icon} />
            <Icon name="star" size="lg" title={showcaseContent.icon} />
            <Icon name="star" size={32} title={showcaseContent.icon} />
            <Icon name="star" size={48} title={showcaseContent.icon} />
          </div>
        </div>

        <div>
          <p style={labelStyle}>{showcaseLabels.colors}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Icon name="favorite" color="var(--ds-color-action-primary-default)" />
            <Icon name="favorite" color="var(--ds-color-action-secondary-default)" />
            <Icon name="favorite" color="var(--ds-color-action-accent-default)" />
            <Icon name="favorite" color="var(--ds-color-text-muted)" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Avatar Section */}
      <section id="avatar" style={sectionStyle}>
        <SectionHeader title={showcaseSections.avatar} onInfoClick={() => setDetailSection('avatar')} />

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.sizes}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Avatar initials={showcaseContent.avatar} size="sm" />
            <Avatar initials={showcaseContent.avatar} size="md" />
            <Avatar initials={showcaseContent.avatar} size="lg" />
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.variants}</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Avatar initials={showcaseContent.avatar} variant="primary" />
            <Avatar initials={showcaseContent.avatar} variant="secondary" />
            <Avatar initials={showcaseContent.avatar} variant="accent" />
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>With Icon</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Avatar size="lg" variant="primary">
              <Icon name="speed" size="lg" color="var(--ds-color-text-on-action)" />
            </Avatar>
            <Avatar size="lg" variant="secondary">
              <Icon name="palette" size="lg" color="var(--ds-color-text-on-action)" />
            </Avatar>
            <Avatar size="lg" variant="accent">
              <Icon name="code" size="lg" color="var(--ds-color-text-on-action)" />
            </Avatar>
            <Avatar size="md" variant="primary">
              <Icon name="star" size="md" color="var(--ds-color-text-on-action)" />
            </Avatar>
          </div>
        </div>

        <div>
          <p style={labelStyle}>Profile (Avatar + name + role)</p>
          <div style={rowStyle}>
            <Profile initials="SK" name="Sarah Kim" role="Lead Developer, TechCorp" />
            <Profile initials="JC" name="James Chen" role="Product Designer" avatarVariant="accent" />
            <Profile initials="EP" name="Emily Park" avatarSize="sm" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Button Section */}
      <section id="button" style={sectionStyle}>
        <SectionHeader title={showcaseSections.button} onInfoClick={() => setDetailSection('button')} />

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.variants}</p>
          <div style={rowStyle}>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.primary}</span>
              <Button variant="primary">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.secondary}</span>
              <Button variant="secondary">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.accent}</span>
              <Button variant="accent">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.outline}</span>
              <Button variant="outline">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.ghost}</span>
              <Button variant="ghost">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.variants.subtle}</span>
              <Button variant="subtle">{showcaseContent.button}</Button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>{showcaseLabels.sizes}</p>
          <div style={rowStyle}>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.sizes.sm}</span>
              <Button size="sm">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.sizes.md}</span>
              <Button size="md">{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.sizes.lg}</span>
              <Button size="lg">{showcaseContent.button}</Button>
            </div>
          </div>
        </div>

        <div>
          <p style={labelStyle}>{showcaseLabels.states}</p>
          <div style={rowStyle}>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.states.disabled}</span>
              <Button disabled>{showcaseContent.button}</Button>
            </div>
            <div style={itemWrapperStyle}>
              <span style={itemLabelStyle}>{buttonShowcase.states.fullWidth}</span>
              <Button fullWidth>{showcaseContent.button}</Button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Card Section */}
      <section id="card" style={sectionStyle}>
        <SectionHeader title={showcaseSections.card} onInfoClick={() => setDetailSection('card')} />

        <div style={gridStyle}>
          <div style={cardItemWrapperStyle}>
            <span style={itemLabelStyle}>{cardShowcase.variantLabels.elevated}</span>
            <Card variant="elevated" hoverable>
              <Card.Header>{showcaseContent.card.title}</Card.Header>
              <Card.Body>{showcaseContent.card.body}</Card.Body>
              <Card.Footer>
                <Button variant="ghost" size="sm">{showcaseContent.button}</Button>
                <Button variant="primary" size="sm">{showcaseContent.button}</Button>
              </Card.Footer>
            </Card>
          </div>

          <div style={cardItemWrapperStyle}>
            <span style={itemLabelStyle}>{cardShowcase.variantLabels.outlined}</span>
            <Card variant="outlined" hoverable>
              <Card.Header>{showcaseContent.card.title}</Card.Header>
              <Card.Body>{showcaseContent.card.body}</Card.Body>
              <Card.Footer>
                <Button variant="outline" size="sm">{showcaseContent.button}</Button>
              </Card.Footer>
            </Card>
          </div>

          <div style={cardItemWrapperStyle}>
            <span style={itemLabelStyle}>{cardShowcase.variantLabels.flat}</span>
            <Card variant="flat" padding="lg">
              <Card.Body>{showcaseContent.card.body}</Card.Body>
            </Card>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Select Section */}
      <SelectSection id="select" onInfoClick={() => setDetailSection('select')} />

      <SectionDivider />

      {/* Input Section */}
      <section id="input" style={sectionStyle}>
        <SectionHeader title={showcaseSections.input} onInfoClick={() => setDetailSection('input')} />

        <div style={gridStyle}>
          <div>
            <p style={labelStyle}>{showcaseLabels.variants}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.variants.outline}</span>
                <Input variant="outline" placeholder={showcaseContent.input} />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.variants.filled}</span>
                <Input variant="filled" placeholder={showcaseContent.input} />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.variants.flushed}</span>
                <Input variant="flushed" placeholder={showcaseContent.input} />
              </div>
            </div>
          </div>

          <div>
            <p style={labelStyle}>{showcaseLabels.sizes}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.sizes.sm}</span>
                <Input size="sm" placeholder={showcaseContent.input} />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.sizes.md}</span>
                <Input size="md" placeholder={showcaseContent.input} />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.sizes.lg}</span>
                <Input size="lg" placeholder={showcaseContent.input} />
              </div>
            </div>
          </div>

          <div>
            <p style={labelStyle}>{showcaseLabels.states}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.states.required}</span>
                <Input placeholder={showcaseContent.input} required />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.states.error}</span>
                <Input
                  isError
                  errorMessage={inputShowcase.errorMessage}
                  placeholder={showcaseContent.input}
                />
              </div>
              <div style={itemWrapperStyle}>
                <span style={itemLabelStyle}>{inputShowcase.states.disabled}</span>
                <Input disabled placeholder={showcaseContent.input} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Form Example (랜딩 Contact 패턴 이식) */}
      <section id="form-example" style={sectionStyle}>
        <SectionHeader title={formExample.title} onInfoClick={() => setDetailSection('form-example')} />
        <p style={{ ...labelStyle, marginBottom: 'var(--ds-spacing-4)' }}>{formExample.subtitle}</p>
        <div style={{ maxWidth: 400 }}>
          <Card variant="elevated" padding="lg">
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
                <Input label={formExample.fields.name} placeholder={formExample.fields.namePlaceholder} fullWidth />
                <Input label={formExample.fields.email} type="email" placeholder={formExample.fields.emailPlaceholder} fullWidth />
                <Input label={formExample.fields.message} placeholder={formExample.fields.messagePlaceholder} fullWidth />
                <Button variant="primary" fullWidth>
                  {formExample.submitLabel}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>
      </div>
    </LabLayout>

    <DetailPanel
      open={!!detailSection}
      onClose={() => setDetailSection(null)}
      title={detailSection === 'form-example' ? formExample.title : detailSection ? showcaseSections[detailSection] ?? '' : ''}
    >
      {detailSection && <ComponentDetail sectionId={detailSection} />}
    </DetailPanel>
    </>
  );
}
