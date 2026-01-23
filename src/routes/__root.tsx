import { createRootRoute, HeadContent, Outlet, Scripts, useParams } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import SearchDialog from '@/components/search';
import { i18n } from '@/lib/i18n';

const { provider } = defineI18nUI(i18n, {
  translations: {
    zh: {
      displayName: '中文',
      search: '搜索文档',
      toc: '目录',
      lastUpdate: '最后更新',
      searchNoResult: '未找到结果',
      previousPage: '上一页',
      nextPage: '下一页',
      chooseLanguage: '选择语言',
    },
    en: {
      displayName: 'English',
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'NexusGate Docs',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const params = useParams({ strict: false }) as { lang?: string };
  const lang = params.lang ?? i18n.defaultLanguage;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={provider(lang)} search={{ SearchDialog }}>
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
