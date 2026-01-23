import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docs } from 'fumadocs-mdx:collections/server';
import { i18n } from './i18n';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/',
  i18n,
  plugins: [lucideIconsPlugin()],
});
