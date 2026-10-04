import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|mjs|cjs)'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [
    { from: '../src/images', to: '/images' },
    { from: '../src/fonts', to: '/fonts' },
  ],
};

export default config;
