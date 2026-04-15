import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

export default defineConfig({
  site: 'https://professional-terroir.pages.dev',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
});
