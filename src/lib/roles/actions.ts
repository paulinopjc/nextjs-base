'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
 
const RoleFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z ]+$/, 'Name must contain only letters and spaces')
});

const CreateRole = RoleFormSchema
    .omit({ id: true });
const UpdateRole = RoleFormSchema
    .omit({ id: true });

export type State = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export async function createRole(prevState: State, formData: FormData) {
    const validatedFields = CreateRole.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Role.',
    };
  }

    const { name } = validatedFields.data;

  try {
    await prisma.role.create({
      data: {
        name,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create role.');
  }

    revalidatePath('/admin/roles');
    redirect('/admin/roles');
}

export async function updateRole(id: string, formData: FormData) {
  const validatedFields = UpdateRole.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to Update Role. Please fix the errors.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await prisma.role.update({
      where: { id },
      data: {
        name,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update role.');
  }

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}


export async function deleteRole(id: string) {
  try {
    await prisma.role.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath('/admin/roles');
}