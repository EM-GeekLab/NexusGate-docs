import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { SidebarBanner } from '@/components/sidebar-banner';
import { i18n } from './i18n';

export function baseOptions(locale: string): Omit<DocsLayoutProps, 'tree' | 'children'> {
  return {
    i18n,
    nav: {
      title: 'NexusGate Docs',
    },
    sidebar: {
      banner: <SidebarBanner locale={locale} />,
    },
  };
}
