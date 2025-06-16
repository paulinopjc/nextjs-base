'use server';

import { prisma } from '@/lib/prisma';

const ITEMS_PER_PAGE = 6;

export async function fetchCMSPages(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const cmsPages = await prisma.cms.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
      include: {
        updated_by: {
          select: {
            name: true,
          },
        },
      },
    });

    return cmsPages.map((cms) => ({
      ...cms,
      updatedByName: cms.updated_by?.name ?? '—',
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch CMS pages.');
  }
}

export async function fetchCMSPageCount(query: string) {
  try {
    const count = await prisma.cms.count({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of CMS pages.');
  }
}

export async function fetchCMSById(id: string) {
  try {
    const cms = await prisma.cms.findUnique({
      where: { id },
      include: {
        updated_by: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      ...cms,
      updatedByName: cms?.updated_by?.name ?? '—',
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch CMS.');
  }
}

export async function fetchCMSBySlug(slug: string) {
  const page = await prisma.cms.findFirst({
    where: { slug },
  });

  return page;
}
