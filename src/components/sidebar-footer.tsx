import { ArrowLeft } from 'lucide-react';

interface SidebarFooterProps {
  locale?: string;
}

export function SidebarFooter({ locale }: SidebarFooterProps) {
  const isZh = locale === 'zh';

  return (
    <div className="border-t p-4">
      <a
        href="/"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        <ArrowLeft className="size-4" />
        {isZh ? '返回控制台' : 'Back to Dashboard'}
      </a>
    </div>
  );
}
