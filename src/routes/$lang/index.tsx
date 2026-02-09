import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { createServerFn } from '@tanstack/react-start';
import { source } from '@/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { baseOptions } from '@/lib/layout.shared';
import { staticFunctionMiddleware } from '@/lib/static-function-middleware';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import { ServerUrl, ApiKeyLink, InlineCode } from '@/components/mdx';

export const Route = createFileRoute('/$lang/' as any)({
  component: Page,
  loader: async ({ params }) => {
    const { lang } = params as { lang: string };
    const data = await loader({ data: { lang } });
    await clientLoader.preload(data.path);
    return data;
  },
});

const loader = createServerFn({
  method: 'GET',
})
  .inputValidator((input: { lang: string }) => input)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: { lang } }) => {
    const page = source.getPage([], lang);
    if (!page) throw notFound();

    return {
      path: page.path,
      lang,
      pageTree: await source.serializePageTree(source.getPageTree(lang)),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    props: {
      className?: string;
    },
  ) {
    return (
      <DocsPage toc={toc} {...props}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
              ServerUrl,
              ApiKeyLink,
              code: InlineCode,
            }}
          />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());
  const { lang } = Route.useParams();

  return (
    <DocsLayout {...baseOptions(lang)} tree={data.pageTree}>
      <Suspense>
        {clientLoader.useContent(data.path, {
          className: '',
        })}
      </Suspense>
    </DocsLayout>
  );
}
