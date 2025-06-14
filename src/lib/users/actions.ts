'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

const UserFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z\s]+$/, 'Name must not contain numbers'),

  email: z.string().email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),
  roleId: z.string().min(1, 'Role is required'),
});

const CreateUser = UserFormSchema
  .omit({ id: true })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const UpdateUser = UserFormSchema
  .omit({ id: true })
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    }
  );

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    roleId?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    roleId: formData.get('roleId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create user.',
    };
  }

  const { name, email, password, roleId } = validatedFields.data;

  const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
  if (!roleExists) {
    return {
      errors: { roleId: ['Selected role does not exist.'] },
      message: 'Failed to create user.',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return {
        errors: {
          email: ['Email already exists.'],
        },
        message: 'Failed to create user.',
      };
    }
    throw new Error('Failed to create user.');
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(id: string, formData: FormData) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
    roleId: formData.get('roleId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update user. Please fix the errors.',
    };
  }

  const { name, email, password, roleId } = validatedFields.data;

  const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
  if (!roleExists) {
    return {
      errors: { roleId: ['Selected role does not exist.'] },
      message: 'Failed to create user.',
    };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roleId,
        ...(password && {
          password: await bcrypt.hash(password, 10),
        }),
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user.');
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete user.');
  }

  revalidatePath('/dashboard/users');
}
