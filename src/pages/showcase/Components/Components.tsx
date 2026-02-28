import { useState } from 'react';
import { Button, Card, Icon, Input, Select } from '../../../components';

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

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

function SelectSection() {
  const [value1, setValue1] = useState('apple');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('banana');

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Select</h2>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <p style={labelStyle}>Variants</p>
        <div style={rowStyle}>
          <Select
            options={fruitOptions}
            value={value1}
            onChange={setValue1}
            variant="outline"
            label="Outline"
          />
          <Select
            options={fruitOptions}
            value={value2}
            onChange={setValue2}
            variant="filled"
            placeholder="Filled variant"
          />
          <Select
            options={fruitOptions}
            value={value3}
            onChange={setValue3}
            variant="ghost"
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <p style={labelStyle}>Sizes</p>
        <div style={rowStyle}>
          <Select options={fruitOptions} value="apple" onChange={() => {}} size="sm" />
          <Select options={fruitOptions} value="banana" onChange={() => {}} size="md" />
          <Select options={fruitOptions} value="cherry" onChange={() => {}} size="lg" />
        </div>
      </div>

      <div>
        <p style={labelStyle}>States</p>
        <div style={rowStyle}>
          <Select options={fruitOptions} value="apple" onChange={() => {}} disabled />
          <Select options={fruitOptions} value="" onChange={() => {}} placeholder="With placeholder" />
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
        <h2 style={sectionTitleStyle}>Button</h2>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>Variants</p>
          <div style={rowStyle}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>Sizes</p>
          <div style={rowStyle}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <p style={labelStyle}>States</p>
          <div style={rowStyle}>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Card</h2>

        <div style={gridStyle}>
          <Card variant="elevated" hoverable>
            <Card.Header>Elevated Card</Card.Header>
            <Card.Body>
              This card has elevation with shadow. Hover to see the effect.
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Confirm</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined" hoverable>
            <Card.Header>Outlined Card</Card.Header>
            <Card.Body>
              This card has a border outline. Good for minimal style.
            </Card.Body>
            <Card.Footer>
              <Button variant="outline" size="sm">Learn More</Button>
            </Card.Footer>
          </Card>

          <Card variant="flat" padding="lg">
            <Card.Body>
              Flat card with no shadow or border. Simple and clean.
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Select Section */}
      <SelectSection />

      {/* Icon Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Icon</h2>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>Material Icons</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Icon name="palette" title="Palette" />
            <Icon name="settings" title="Settings" />
            <Icon name="search" title="Search" />
            <Icon name="check" title="Check" />
            <Icon name="close" title="Close" />
            <Icon name="add" title="Add" />
            <Icon name="edit" title="Edit" />
            <Icon name="delete" title="Delete" />
            <Icon name="save" title="Save" />
            <Icon name="info" title="Info" />
            <Icon name="warning" title="Warning" />
            <Icon name="error" title="Error" />
            <Icon name="success" title="Success" />
            <Icon name="star" title="Star" />
            <Icon name="favorite" title="Favorite" />
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>Nucleo Icons</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Icon name="sun" library="nucleo" title="Sun" />
            <Icon name="moon" library="nucleo" title="Moon" />
            <Icon name="home" library="nucleo" title="Home" />
            <Icon name="user" library="nucleo" title="User" />
            <Icon name="users" library="nucleo" title="Users" />
            <Icon name="cog" library="nucleo" title="Settings" />
            <Icon name="document" library="nucleo" title="Document" />
            <Icon name="folder" library="nucleo" title="Folder" />
            <Icon name="download" library="nucleo" title="Download" />
            <Icon name="upload" library="nucleo" title="Upload" />
            <Icon name="refresh" library="nucleo" title="Refresh" />
            <Icon name="bell" library="nucleo" title="Bell" />
            <Icon name="chat" library="nucleo" title="Chat" />
          </div>
        </div>

        <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
          <p style={labelStyle}>Sizes</p>
          <div style={{ ...rowStyle, alignItems: 'center' }}>
            <Icon name="star" size="sm" />
            <Icon name="star" size="md" />
            <Icon name="star" size="lg" />
            <Icon name="star" size={32} />
            <Icon name="star" size={48} />
          </div>
        </div>

        <div>
          <p style={labelStyle}>Colors</p>
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
        <h2 style={sectionTitleStyle}>Input</h2>

        <div style={gridStyle}>
          <div>
            <p style={labelStyle}>Variants</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <Input variant="outline" placeholder="Outline variant" label="Outline" />
              <Input variant="filled" placeholder="Filled variant" label="Filled" />
              <Input variant="flushed" placeholder="Flushed variant" label="Flushed" />
            </div>
          </div>

          <div>
            <p style={labelStyle}>Sizes</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input" />
              <Input size="lg" placeholder="Large input" />
            </div>
          </div>

          <div>
            <p style={labelStyle}>States</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
              <Input placeholder="Required field" label="Required" required />
              <Input isError errorMessage="This field has an error" placeholder="Error state" />
              <Input disabled placeholder="Disabled input" />
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
        Yamang Design System POC - Theme: Minimal / Neumorphism
      </footer>
    </>
  );
}
