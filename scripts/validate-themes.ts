/**
 * Theme Validation Script
 *
 * Validates all themes for WCAG AA contrast compliance.
 * Run with: npx tsx scripts/validate-themes.ts
 */

import { getAllThemes } from '../src/theme/skins';
import { validateTheme, formatValidationReport } from '../src/theme/contrast-checker';

console.log('🎨 Grimoire Theme Validation\n');
console.log('Checking all themes for WCAG AA contrast compliance...\n');
console.log('='.repeat(60));
console.log('');

const themes = getAllThemes();
let allPass = true;

themes.forEach((theme) => {
  const report = validateTheme(theme);
  console.log(formatValidationReport(report));
  console.log('='.repeat(60));
  console.log('');

  if (!report.passes) {
    allPass = false;
  }
});

if (allPass) {
  console.log('✅ All themes pass WCAG AA standards!');
  process.exit(0);
} else {
  console.log('❌ Some themes have contrast issues that need to be addressed.');
  process.exit(1);
}
