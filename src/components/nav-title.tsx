'use client';

import { ArrowLeft } from 'lucide-react';

interface NavTitleProps {
  locale?: string;
}

export function NavTitle({ locale }: NavTitleProps) {
  const isZh = locale === 'zh';

  // Use relative path to go up from /docs/ to root /
  return (
    <a
      href="/"
      className="flex items-center gap-2 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-foreground/80"
    >
      <ArrowLeft className="size-4" />
      {isZh ? '返回控制台' : 'Back to Dashboard'}
    </a>
  );
}
