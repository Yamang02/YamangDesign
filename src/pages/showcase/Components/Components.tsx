import { useState } from 'react';
import { Button, Card, Icon, Input, Select } from '../../../components';
import {
  showcaseSections,
  showcaseLabels,
  showcaseContent,
  buttonShowcase,
  cardShowcase,
  inputShowcase,
  selectShowcase,
  iconShowcase,
  showcaseFooter,
} from '../../../constants';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const sectionStyle = {
  padding: 'var(--ds-spacing-8) var(--ds-spacing-6)',
  maxWidth: '1200px',
  margin: '0 auto',
};

const sectionTitleStyle = {
  fontSize: 'var(--ds-text-2xl)',
  fontWeight: 'var(--ds-font-weight-bold)',
  color: 'var(--ds-color-text-primary)',
  marginBottom: 'var(--ds-spacing-6)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--ds-spacing-6)',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 'var(--ds-spacing-3)',
  marginBottom: 'var(--ds-spacing-4)',
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

const itemLabelStyle = {
  fontSize: 'var(--ds-text-xs)',
  color: 'var(--ds-color-text-muted)',
};

function SelectSection() {
  const [value1, setValue1] = useState('apple');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('banana');

  const options = [...selectShowcase.fruitOptions];
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{showcaseSections.select}</h2>

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
  return (
    <>
      {/* Button Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{showcaseSections.button}</h2>

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

      {/* Card Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{showcaseSections.card}</h2>

        <div style={gridStyle}>
          <div style={itemWrapperStyle}>
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

          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{cardShowcase.variantLabels.outlined}</span>
            <Card variant="outlined" hoverable>
              <Card.Header>{showcaseContent.card.title}</Card.Header>
              <Card.Body>{showcaseContent.card.body}</Card.Body>
              <Card.Footer>
                <Button variant="outline" size="sm">{showcaseContent.button}</Button>
              </Card.Footer>
            </Card>
          </div>

          <div style={itemWrapperStyle}>
            <span style={itemLabelStyle}>{cardShowcase.variantLabels.flat}</span>
            <Card variant="flat" padding="lg">
              <Card.Body>{showcaseContent.card.body}</Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Select Section */}
      <SelectSection />

      {/* Icon Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{showcaseSections.icon}</h2>

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

      {/* Input Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{showcaseSections.input}</h2>

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

      {/* Footer */}
      <footer
        style={{
          padding: 'var(--ds-spacing-6)',
          textAlign: 'center',
          color: 'var(--ds-color-text-secondary)',
          fontSize: 'var(--ds-text-sm)',
          borderTop: '1px solid var(--ds-color-border-subtle)',
          position: 'relative',
          zIndex: 'var(--ds-z-sticky)',
        }}
      >
        {showcaseFooter.text} - {showcaseFooter.themeInfo}
      </footer>
    </>
  );
}
