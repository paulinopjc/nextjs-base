import { Metadata } from 'next';
import { fetchCMSBySlug } from '@/lib/cms/data';
import { notFound } from 'next/navigation';

// Define the type for params as a Promise
type ParamsType = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchCMSBySlug(slug);

  if (!page) return {};

  return {
    title: page.name,
    description: page.content?.replace(/<[^>]*>/g, '').slice(0, 150) || '',
  };
}

export default async function CMSPage({
  params,
}: {
  params: ParamsType;
}) {
  const { slug } = await params;
  const page = await fetchCMSBySlug(slug);

  if (!page || page.status !== 'published') {
    notFound();
  }

  return (
    <main className="prose mx-auto px-4 py-8">
      <h1>{page.name}</h1>
      <article dangerouslySetInnerHTML={{ __html: page.content ?? '' }} />
    </main>
  );
}
