import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

export default defineConfig({
  site: 'https://professionalterroir.com',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
});
