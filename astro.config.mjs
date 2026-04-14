import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://professional-terroir.samglay0531.workers.dev',
  output: 'static',

  markdown: {
    remarkPlugins: [remarkBreaks],
  },

  adapter: cloudflare()
});