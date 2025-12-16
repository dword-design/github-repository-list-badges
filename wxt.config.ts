import { defineConfig } from 'wxt';

export default defineConfig({
  autoIcons: { developmentIndicator: false },
  manifest: {
    name: 'GitHub Repository List Badges',

    permissions: ['https://api.github.com/*'],
  },
  modules: ['@wxt-dev/auto-icons'],
});
