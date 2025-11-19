/**
 * Test file to verify TypeScript path alias resolution
 * This file imports from various path aliases to ensure they resolve correctly
 */

// Test @/core/* alias
import { greet, GRIMOIRE_VERSION } from '@/core/lib/test-utils';

// Test @/config/* alias
import { testConfig } from '@/config/test-config';

/**
 * Verify all path aliases resolve correctly
 */
export function testPathAliases(): void {
  // Test @/core/* imports
  const greeting = greet('Grimoire');
  console.log('✓ @/core/* alias works:', greeting);
  console.log('✓ @/core/* constant:', GRIMOIRE_VERSION);

  // Test @/config/* imports
  console.log('✓ @/config/* alias works:', testConfig.appName);

  console.log('\n✅ All path aliases resolved successfully!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPathAliases();
}
