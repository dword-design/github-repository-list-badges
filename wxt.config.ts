import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'GitHub Repository List Badges',

    permissions: ['https://api.github.com/*'],
  },
});
