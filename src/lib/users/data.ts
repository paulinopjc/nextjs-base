'use server';

import { prisma } from '@/lib/prisma';
import { User } from '@/lib/definitions';

const ITEMS_PER_PAGE = 6;

export async function fetchUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,  // add this
        roleId: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return users.map((user: User) => ({
      ...user,
      name: user.name ?? '',
      roleName: user.role?.name ?? 'No Role',
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchUserPages(query: string) {
  try {
    const count = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}

export async function fetchUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch User.');
  }
}

