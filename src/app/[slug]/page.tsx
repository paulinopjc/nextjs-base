// app/[slug]/page.tsx
import { Metadata } from 'next';
import { fetchCMSBySlug } from '@/lib/cms/data'; // Assuming this correctly fetches from Prisma
import { notFound } from 'next/navigation';

// Correct type definition for params: it's a direct object, not a Promise
interface CMSPageProps {
  params: {
    slug: string; // The slug parameter is directly a string
  };
}

export async function generateMetadata({
  params,
}: CMSPageProps): Promise<Metadata> {
  // Access slug directly from params, no await needed
  const { slug } = params;
  const page = await fetchCMSBySlug(slug);

  if (!page || page.status !== 'published') { // Also check status here for metadata
    return {}; // Return empty metadata if not found or not published
  }

  return {
    title: page.name,
    // Safely remove HTML tags for description
    description: page.content?.replace(/<[^>]*>/g, '').slice(0, 150) || '',
  };
}

export default async function CMSPage({
  params,
}: CMSPageProps) {
  // Access slug directly from params, no await needed
  const { slug } = params;
  const page = await fetchCMSBySlug(slug);

  if (!page || page.status !== 'published') {
    notFound(); // Correctly handles 404 for non-existent or unpublished pages
  }

  return (
    <main className="prose mx-auto px-4 py-8">
      <h1>{page.name}</h1>
      {/* Ensure page.content is not null/undefined before rendering */}
      <article dangerouslySetInnerHTML={{ __html: page.content ?? '' }} />
    </main>
  );
}