export default {
  globs: ['components/*//*.js'],
  exclude: [
    'node_modules/**',
    '**/node_modules/**',
    'dist/**',
    '**/dist/**',
    'build/**',
    'scripts/**',
    'tests/**',
    '**/tests/**',
    'Working/**',
    '**/*.test.js',
    '**/*.spec.js',
    '**/playwright-report/**',
    '**/test-results/**'
  ],
  outdir: 'data',
  litelement: true,
  dev: false,
  watch: false,
  dependencies: true,
  packagejson: false
};
