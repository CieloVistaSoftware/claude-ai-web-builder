// Main entry point for Website Builder
export { WebsiteBuilder } from './core/builder';
export * from './types';
export * from './utils/event-emitter';
export * from './utils/history-manager';
export * from './utils/validation';

// Version information
export const VERSION = '1.0.0';

// Initialize global builder instance if in browser
let globalBuilder: import('./core/builder').WebsiteBuilder | null = null;

/**
 * Get or create global builder instance
 */
export function getBuilder(): import('./core/builder').WebsiteBuilder {
  if (!globalBuilder) {
    const { WebsiteBuilder } = require('./core/builder');
    globalBuilder = new WebsiteBuilder();
  }
  return globalBuilder!;
}

/**
 * Initialize Website Builder
 */
export async function initializeBuilder(): Promise<import('./core/builder').WebsiteBuilder> {
  const builder = getBuilder();
  await builder.initialize();
  return builder;
}

/**
 * Create new builder instance
 */
export function createBuilder(): import('./core/builder').WebsiteBuilder {
  const { WebsiteBuilder } = require('./core/builder');
  return new WebsiteBuilder();
}

// Browser global registration
if (typeof window !== 'undefined') {
  (window as unknown as { WebsiteBuilder: unknown }).WebsiteBuilder = {
    getBuilder,
    initializeBuilder,
    createBuilder,
    VERSION
  };
}

console.log(`Website Builder v${VERSION} loaded`);