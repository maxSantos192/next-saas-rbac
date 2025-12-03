'use server';

import { redirect } from 'next/navigation';

export async function signInWithGithub() {
  const githubSigninUrl = new URL(
    '/login/oauth/authorize',
    'https://github.com'
  );

  githubSigninUrl.searchParams.set('client_id', 'Ov23lieLNNIDlRfc7SkA');
  githubSigninUrl.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback'
  );
  githubSigninUrl.searchParams.set('scope', 'user');

  redirect(githubSigninUrl.toString());
}
