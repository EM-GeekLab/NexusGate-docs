'use client';

import { ArrowLeft } from 'lucide-react';

interface SidebarBannerProps {
  locale?: string;
}

export function SidebarBanner({ locale }: SidebarBannerProps) {
  const isZh = locale === 'zh';

  return (
    <div className="px-4 pb-2">
      <a
        href="/"
        className="flex items-center justify-center gap-2 rounded-md border border-fd-border px-3 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        <ArrowLeft className="size-4" />
        {isZh ? '返回控制台' : 'Back to Dashboard'}
      </a>
    </div>
  );
}
