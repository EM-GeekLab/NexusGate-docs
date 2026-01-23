'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useApiKey } from './api-key-context';

interface ApiKeyLinkProps {
  text?: string;
}

export function ApiKeyLink({ text }: ApiKeyLinkProps) {
  const [isZh, setIsZh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { apiKeys, selectedApiKey, setSelectedApiKey, isLoading, error } = useApiKey();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsZh(window.location.pathname.includes('/zh/'));
    }
  }, []);

  // Update dropdown position
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // getBoundingClientRect returns viewport-relative position
      // position: fixed also uses viewport-relative position
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  };

  // Update position when opening and on scroll/resize
  useEffect(() => {
    if (isOpen) {
      updatePosition();

      // Listen for scroll and resize events to update position
      const handleScrollOrResize = () => updatePosition();

      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);

      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [isOpen]);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/docs\/?$/, '');
      window.location.href = `${origin}/apps`;
    }
  };

  // If loading, error, or no API keys, fallback to original behavior
  if (isLoading || error || apiKeys.length === 0) {
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

  // Find the selected key info
  const selectedKeyInfo = apiKeys.find(k => k.key === selectedApiKey);
  const displayName = selectedKeyInfo?.comment || (isZh ? '选择 API Key' : 'Select API Key');

  // Mask the API key for display
  const maskedKey = selectedApiKey
    ? `${selectedApiKey.slice(0, 8)}...${selectedApiKey.slice(-4)}`
    : '';

  return (
    <span className="inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fd-inline-code cursor-pointer inline-flex items-center gap-1 hover:text-fd-primary transition-colors"
        title={isZh ? '点击选择 API Key' : 'Click to select API Key'}
      >
        <span>{maskedKey || displayName}</span>
        <ChevronDown className="size-3" />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown menu */}
          <div
            className="fixed z-[9999] min-w-[200px] rounded-md border bg-fd-popover p-1 shadow-lg"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {apiKeys.map((apiKey) => (
              <button
                key={apiKey.key}
                onClick={() => {
                  setSelectedApiKey(apiKey.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors ${
                  selectedApiKey === apiKey.key ? 'bg-fd-accent/50' : ''
                }`}
              >
                <div className="font-medium">{apiKey.comment || (isZh ? '未命名' : 'Unnamed')}</div>
                <div className="text-xs text-fd-muted-foreground font-mono">
                  {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                </div>
              </button>
            ))}
            <div className="border-t mt-1 pt-1">
              <button
                onClick={handleClick}
                className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors text-fd-muted-foreground"
              >
                {isZh ? '管理 API Keys →' : 'Manage API Keys →'}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </span>
  );
}
