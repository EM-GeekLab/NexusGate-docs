import type { ComponentPropsWithoutRef } from 'react';

type InlineCodeProps = ComponentPropsWithoutRef<'code'>;

export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  // If this is a code block (has language class), use default rendering
  if (className?.includes('language-')) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // For inline code, render without backticks
  return (
    <code className="fd-inline-code" {...props}>
      {children}
    </code>
  );
}
