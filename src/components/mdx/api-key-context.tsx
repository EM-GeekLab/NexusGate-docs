'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyInfo {
  key: string;
  comment: string;
  revoked: boolean;
}

interface ApiKeyContextType {
  apiKeys: ApiKeyInfo[];
  selectedApiKey: string | null;
  setSelectedApiKey: (key: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        // Get admin secret from localStorage (same as frontend)
        const adminSecret = localStorage.getItem('admin-secret');
        if (!adminSecret) {
          setError('Not authenticated');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/admin/apiKey', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(adminSecret)}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch API keys');
        }

        const data = await response.json();
        // Filter out revoked keys
        const activeKeys = data.filter((k: ApiKeyInfo) => !k.revoked);
        setApiKeys(activeKeys);

        // Auto-select first key if available
        if (activeKeys.length > 0) {
          setSelectedApiKey(activeKeys[0].key);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchApiKeys();
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKeys, selectedApiKey, setSelectedApiKey, isLoading, error }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    // Return default values if used outside provider
    return {
      apiKeys: [],
      selectedApiKey: null,
      setSelectedApiKey: () => {},
      isLoading: false,
      error: 'No provider',
    };
  }
  return context;
}
