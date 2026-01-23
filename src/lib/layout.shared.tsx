import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { NavTitle } from '@/components/nav-title';
import { i18n } from './i18n';

export function baseOptions(locale: string): Omit<DocsLayoutProps, 'tree' | 'children'> {
  return {
    i18n,
    nav: {
      title: <NavTitle locale={locale} />,
    },
  };
}
