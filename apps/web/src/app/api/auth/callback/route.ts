import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { acceptInvite } from '@/http/accept-invite';
import { signInWithGithub } from '@/http/sign-in-with-github';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { message: 'github oauth code was not found.' },
      { status: 400 }
    );
  }

  const { token } = await signInWithGithub({ code });

  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const inviteId = cookieStore.get('inviteId')?.value;

  if (inviteId) {
    try {
      await acceptInvite(inviteId);

      cookieStore.delete('inviteId');
    } catch {}
  }

  redirect('/');
}
