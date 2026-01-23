import { createFileRoute } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { createSearchAPI, type AdvancedIndex } from 'fumadocs-core/search/server';

// Create a non-i18n search index using English tokenizer for all content
// Orama doesn't support Chinese, so we use a single English index for all languages
function getIndexes(): AdvancedIndex[] {
  const languages = ['en', 'zh'];
  return languages.flatMap((lang) =>
    source.getPages(lang).map((page) => ({
      id: `${lang}:${page.url}`,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    }))
  );
}

const server = createSearchAPI('advanced', {
  indexes: getIndexes,
  language: 'english',
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: () => server.staticGET(),
    },
  },
});
