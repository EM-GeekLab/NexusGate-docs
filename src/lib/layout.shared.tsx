import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { SidebarFooter } from '@/components/sidebar-footer';

export function baseOptions(): Omit<DocsLayoutProps, 'tree' | 'children'> {
  return {
    nav: {
      title: 'NexusGate Docs',
    },
    links: [
      {
        text: 'Dashboard',
        url: '/',
      },
    ],
    sidebar: {
      footer: <SidebarFooter />,
    },
  };
}
