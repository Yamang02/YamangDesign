const fs = require('node:fs');

const LAB_CONTENT_ITEMS = ['sampleText','buttonLabels','inputPlaceholders','sectionTitles','formatters','fontFamilyLabels','semanticPreviews'];
const SHOWCASE_ITEMS = ['showcaseSections','showcaseLabels','showcaseContent','showcaseSectionTokens','ATOM_USED_IN','buttonShowcase','cardShowcase','inputShowcase','selectShowcase','iconShowcase','ShowcaseSectionId'];
const BUILD_ITEMS = ['MOLECULES','ORGANISMS','MoleculeId','OrganismId','MoleculeDef','OrganismDef'];

const files = [
  'src/app/pages/labs/PaletteLab/PaletteLab.tsx',
  'src/app/pages/labs/Playground/Playground.tsx',
  'src/app/pages/labs/Playground/PreviewPanel.tsx',
  'src/app/pages/labs/StyleLab/StyleLab.tsx',
  'src/app/pages/labs/TokenLab/TokenLab.tsx',
  'src/app/pages/labs/DesignSettingsLab/ComponentMappingTab.tsx',
  'src/app/pages/build/Molecules.tsx',
  'src/app/pages/build/Organisms.tsx',
];

const importDomainConstants = /import\s+(type\s+)?\{([^}]+)\}\s+from\s+'@domain\/constants';/g;

files.forEach((f) => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  const original = c;

  c = c.replaceAll(importDomainConstants, (match, isType, imports) => {
    const items = imports.split(',').map((i) => i.trim()).filter(Boolean);
    const labItems = items.filter((i) => LAB_CONTENT_ITEMS.includes(i));
    const showcaseItems = items.filter((i) => SHOWCASE_ITEMS.includes(i));
    const buildItems = items.filter((i) => BUILD_ITEMS.includes(i));
    const domainItems = items.filter(
      (i) =>
        !LAB_CONTENT_ITEMS.includes(i) &&
        !SHOWCASE_ITEMS.includes(i) &&
        !BUILD_ITEMS.includes(i),
    );

    const prefix = isType || '';
    let result = '';
    if (labItems.length) result += 'import ' + prefix + '{ ' + labItems.join(', ') + " } from '@app/content/lab-content';\n";
    if (showcaseItems.length) result += 'import ' + prefix + '{ ' + showcaseItems.join(', ') + " } from '@app/content/showcase-content';\n";
    if (buildItems.length) result += 'import ' + prefix + '{ ' + buildItems.join(', ') + " } from '@app/content/build-content';\n";
    if (domainItems.length) result += 'import ' + prefix + '{ ' + domainItems.join(', ') + " } from '@domain/constants';";
    return result.trimEnd();
  });

  if (c !== original) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed:', f);
  }
});

console.log('Done.');
