'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const CreateCMSSchema = z.object({
  name: z.string().min(1, 'Title is required'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and URL-friendly (e.g., "page-title")'),

  content: z.string().min(1, 'Content is required'),

  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Status must be either "draft", "published", or "archived"' }),
  }),
});

const UpdateCMSSchema = CreateCMSSchema;

export type State = {
  errors?: {
    name?: string[];
    slug?: string[];
    content?: string[];
    status?: string[];
  };
  message?: string | null;
};

async function checkSlugConflict(slug: string, currentId?: string) {
  const existing = await prisma.cms.findFirst({
    where: {
      slug,
      status: 'published',
      ...(currentId && { NOT: { id: currentId } }),
    },
  });

  return !!existing;
}

export async function createCMS(prevState: State, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const validatedFields = CreateCMSSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create CMS.',
    };
  }

  const { name, slug, content, status } = validatedFields.data;

  if (status === 'published') {
    const conflict = await checkSlugConflict(slug);
    if (conflict) {
      return {
        errors: {
          slug: ['A published page with this slug already exists.'],
        },
        message: 'Slug must be unique among published pages.',
      };
    }
  }

  try {
    await prisma.cms.create({
      data: {
        name,
        slug,
        content,
        status,
        updatedById: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create CMS page.');
  }

  revalidatePath('/dashboard/cms');
  redirect('/dashboard/cms');
}

export async function updateCMS(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const validatedFields = UpdateCMSSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update CMS. Please fix the errors.',
    };
  }

  const { name, slug, content, status } = validatedFields.data;

  if (status === 'published') {
    const conflict = await checkSlugConflict(slug, id);
    if (conflict) {
      return {
        errors: {
          slug: ['Another published page already uses this slug.'],
        },
        message: 'Slug must be unique among published pages.',
      };
    }
  }

  try {
    await prisma.cms.update({
      where: { id },
      data: {
        name,
        slug,
        content,
        status,
        updatedById: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update CMS page.');
  }

  revalidatePath('/dashboard/cms');
  redirect('/dashboard/cms');
}

export async function deleteCMS(id: string) {
  try {
    await prisma.cms.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete CMS page.');
  }

  revalidatePath('/dashboard/cms');
}
