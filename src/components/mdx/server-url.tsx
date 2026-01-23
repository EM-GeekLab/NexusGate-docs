'use client';

import { useState, useEffect } from 'react';

interface ServerUrlProps {
  path?: string;
  suffix?: string;
}

export function ServerUrl({ path = '', suffix = '' }: ServerUrlProps) {
  const [url, setUrl] = useState<string>('https://your-server.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/docs\/?$/, '');
      setUrl(origin);
    }
  }, []);

  const fullUrl = `${url}${path}${suffix}`;

  return (
    <code className="fd-inline-code" title={fullUrl}>
      {fullUrl}
    </code>
  );
}
