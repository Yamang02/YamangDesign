const fs = require('fs');

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

files.forEach(function(f) {
  if (!fs.existsSync(f)) return;
  var c = fs.readFileSync(f, 'utf8');
  var original = c;

  // Replace each import { ... } from '@domain/constants' or from '@app/content/build-content' etc.
  c = c.replace(/import\s+(type\s+)?\{([^}]+)\}\s+from\s+'@domain\/constants';/g, function(match, isType, imports) {
    var items = imports.split(',').map(function(i) { return i.trim(); }).filter(Boolean);
    var labItems = items.filter(function(i) { return LAB_CONTENT_ITEMS.indexOf(i) >= 0; });
    var showcaseItems = items.filter(function(i) { return SHOWCASE_ITEMS.indexOf(i) >= 0; });
    var buildItems = items.filter(function(i) { return BUILD_ITEMS.indexOf(i) >= 0; });
    var domainItems = items.filter(function(i) {
      return LAB_CONTENT_ITEMS.indexOf(i) < 0 && SHOWCASE_ITEMS.indexOf(i) < 0 && BUILD_ITEMS.indexOf(i) < 0;
    });

    var prefix = isType || '';
    var result = '';
    if (labItems.length) result += 'import ' + prefix + '{ ' + labItems.join(', ') + " } from '@app/content/lab-content';\n";
    if (showcaseItems.length) result += 'import ' + prefix + '{ ' + showcaseItems.join(', ') + " } from '@app/content/showcase-content';\n";
    if (buildItems.length) result += 'import ' + prefix + '{ ' + buildItems.join(', ') + " } from '@app/content/build-content';\n";
    if (domainItems.length) result += 'import ' + prefix + '{ ' + domainItems.join(', ') + " } from '@domain/constants';";
    return result.trimRight();
  });

  if (c !== original) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed:', f);
  }
});

console.log('Done.');
