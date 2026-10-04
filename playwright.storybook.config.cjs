const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/storybook',
  outputDir: './test-results/storybook',
  timeout: 45000,
  expect: { timeout: 15000 },
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:6106',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
  webServer: {
    command: 'node tests/serve-storybook.cjs',
    url: 'http://127.0.0.1:6106/index.json',
    reuseExistingServer: false,
  },
});
