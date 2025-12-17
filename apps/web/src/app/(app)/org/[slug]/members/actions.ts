'use server';

import { getCurrentOrg } from '@/auth/auth';
import { removeMember } from '@/http/remove-member';

export async function removerMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg();

  await removeMember({
    org: currentOrg!,
    memberId,
  });
}
