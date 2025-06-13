'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const UserFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z\s]+$/, 'Name must not contain numbers'),

  email: z
    .string()
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

	confirmPassword: z.string(),

	date_added: z
    .string()
    .regex(dateRegex, 'Date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),

  date_updated: z
    .string()
    .regex(dateRegex, 'Date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

const CreateUser = UserFormSchema
	.omit({ id: true, date_added: true, date_updated: true })
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});
const UpdateUser = UserFormSchema
	.omit({ id: true, date_added: true, date_updated: true })
	.extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
	.refine(
    (data) =>
      !data.password || data.password === data.confirmPassword,
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
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
	const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
  });

	if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

	const { name, email, password } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);
	const date_added = new Date().toISOString().split('T')[0];
	const date_updated = new Date().toISOString().split('T')[0];

	try {
		await sql`
    INSERT INTO users (name, email, password, date_added, date_updated)
    VALUES (${name}, ${email}, ${hashedPassword}, ${date_added}, ${date_updated})
  `;
	} catch (error) {
		console.error(error);
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to Update User. Please fix the errors.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const date_updated = new Date().toISOString().split('T')[0];

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name = ${name},
            email = ${email},
            password = ${hashedPassword},
            date_updated = ${date_updated}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name},
            email = ${email},
            date_updated = ${date_updated}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to update user.');
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}


export async function deleteUser(id: string) {
  try {
		await sql`DELETE FROM users WHERE id = ${id}`;
	} catch (error) {
		console.log(error);
	}
  revalidatePath('/dashboard/users');
}

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }