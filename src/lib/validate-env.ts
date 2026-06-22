/**
 * Environment validation - run at build/startup time
 * Ensures all required environment variables are configured
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
];

const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_ANALYTICS_ID',
];

export function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const variable of REQUIRED_ENV_VARS) {
    if (!process.env[variable]) {
      errors.push(`Missing required environment variable: ${variable}`);
    }
  }

  // Check optional variables
  for (const variable of OPTIONAL_ENV_VARS) {
    if (!process.env[variable]) {
      warnings.push(`Optional environment variable not set: ${variable}`);
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️ Environment Configuration Warnings:');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  // Exit on errors
  if (errors.length > 0) {
    console.error('❌ Environment Configuration Errors:');
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}

// Run validation if this is executed
if (require.main === module) {
  validateEnvironment();
}
