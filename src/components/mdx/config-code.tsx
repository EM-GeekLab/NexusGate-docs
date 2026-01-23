'use client';

import { ReactNode, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useApiKey } from './api-key-context';

interface ConfigCodeProps {
  children: ReactNode;
  lang?: string;
}

/**
 * A code block component that can render React components inline.
 * Use this instead of fenced code blocks when you need to include
 * dynamic components like ServerUrl or ApiKeyLink.
 *
 * Usage:
 * <ConfigCode lang="bash">
 *   export ANTHROPIC_BASE_URL="<ServerUrl path="/v1" />"
 *   export ANTHROPIC_API_KEY="<ApiKeyLink />"
 * </ConfigCode>
 */
export function ConfigCode({ children, lang }: ConfigCodeProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { selectedApiKey } = useApiKey();

  const handleCopy = async () => {
    if (!codeRef.current) return;

    // Get the text content and replace API key placeholder
    let text = codeRef.current.innerText || codeRef.current.textContent || '';

    // If an API key is selected, the text should already contain it
    // But we need to handle the case where the ApiKeyLink shows masked key
    // We'll replace any masked API key pattern with the full key
    if (selectedApiKey) {
      // Replace masked key pattern (e.g., "ng-xxxxx...xxxx") with full key
      const maskedPattern = new RegExp(
        `${selectedApiKey.slice(0, 8)}\\.\\.\\.${selectedApiKey.slice(-4)}`,
        'g'
      );
      text = text.replace(maskedPattern, selectedApiKey);

      // Also replace the fallback text if present
      text = text.replace(/点此查看 API Key/g, selectedApiKey);
      text = text.replace(/Click to view API Key/g, selectedApiKey);
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <figure className="fd-codeblock not-prose relative my-4 group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-md bg-fd-secondary/80 hover:bg-fd-secondary border border-fd-border opacity-0 group-hover:opacity-100 transition-opacity"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4 text-fd-muted-foreground" />
        )}
      </button>
      <pre className="p-4 overflow-x-auto rounded-lg border bg-fd-secondary/50 text-sm">
        <code ref={codeRef} className={lang ? `language-${lang}` : undefined}>
          {children}
        </code>
      </pre>
    </figure>
  );
}

/**
 * A styled span for code keywords/commands
 */
export function CodeKeyword({ children }: { children: ReactNode }) {
  return <span className="text-fd-primary font-semibold">{children}</span>;
}

/**
 * A styled span for code strings
 */
export function CodeString({ children }: { children: ReactNode }) {
  return <span className="text-green-600 dark:text-green-400">{children}</span>;
}

/**
 * A styled span for code comments
 */
export function CodeComment({ children }: { children: ReactNode }) {
  return <span className="text-fd-muted-foreground italic">{children}</span>;
}

/**
 * A line break in ConfigCode
 */
export function CodeLine({ children }: { children?: ReactNode }) {
  return (
    <span className="block">
      {children}
    </span>
  );
}
