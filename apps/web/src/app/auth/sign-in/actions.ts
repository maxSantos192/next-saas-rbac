'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { signInWithPassword } from '@/http/sign-in-with-password';

const signInSchema = z.object({
  email: z.email({ message: 'Provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Provide your password.' }),
});

export async function signInWithEmailAndPasswordAction(data: FormData) {
  const cookieStore = await cookies();
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten((issue) => issue.message).fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    });

    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    console.error(err);

    return { success: false, message: 'unexpected error.', errors: null };
  }

  redirect('/');
}
