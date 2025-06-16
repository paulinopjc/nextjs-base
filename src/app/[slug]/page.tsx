import { Metadata } from 'next';
import { fetchCMSBySlug } from '@/lib/cms/data';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchCMSBySlug(slug);
  if (!page) return {};

  return {
    title: page.name,
    description: page.content?.replace(/<[^>]*>/g, '').slice(0, 150) || '',
  };
}

export default async function CMSPage({ params }: PageProps) {
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
