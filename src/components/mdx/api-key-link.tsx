'use client';

import { useEffect, useState } from 'react';

interface ApiKeyLinkProps {
  text?: string;
}

export function ApiKeyLink({ text }: ApiKeyLinkProps) {
  const [isZh, setIsZh] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsZh(window.location.pathname.includes('/zh/'));
    }
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/docs\/?$/, '');
      window.location.href = `${origin}/api-keys`;
    }
  };

  const displayText = text || (isZh ? '点此查看 API Key' : 'Click to view API Key');
  const title = isZh ? '点击前往 API Keys 页面' : 'Click to go to API Keys page';

  return (
    <button
      onClick={handleClick}
      className="fd-inline-code cursor-pointer underline decoration-dotted underline-offset-2 hover:text-fd-primary transition-colors"
      title={title}
    >
      {displayText}
    </button>
  );
}
