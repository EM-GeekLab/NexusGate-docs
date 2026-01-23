import { createFileRoute, redirect } from '@tanstack/react-router';
import { i18n } from '@/lib/i18n';

export const Route = createFileRoute('/' as any)({
  beforeLoad: () => {
    throw redirect({
      to: `/${i18n.defaultLanguage}` as any,
    });
  },
  component: () => null,
});
