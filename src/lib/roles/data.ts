'use server';

import { prisma } from '@/lib/prisma';

const ITEMS_PER_PAGE = 6;

export async function fetchAllRoles() {
  return await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function fetchRoles(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const roles = await prisma.role.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name ?? '',
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch roles.');
  }
}

export async function fetchRolePages(query: string) {
  try {
    const count = await prisma.role.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of roles.');
  }
}

export async function fetchRoleById(id: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    return role;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Role.');
  }
}
