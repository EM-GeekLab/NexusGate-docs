'use client';

import { ReactNode } from 'react';

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
  return (
    <figure className="fd-codeblock not-prose relative my-4">
      <pre className="p-4 overflow-x-auto rounded-lg border bg-fd-secondary/50 text-sm">
        <code className={lang ? `language-${lang}` : undefined}>
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
