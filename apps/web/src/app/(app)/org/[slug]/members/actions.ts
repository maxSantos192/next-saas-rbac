'use server';

import { Role } from '@saas/auth';

import { getCurrentOrg } from '@/auth/auth';
import { removeMember } from '@/http/remove-member';
import { updateMember } from '@/http/update-member';

interface UpdateMemberActionProps {
  memberId: string;
  role: Role;
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg();

  await removeMember({
    org: currentOrg!,
    memberId,
  });
}

export async function updateMemberAction({
  memberId,
  role,
}: UpdateMemberActionProps) {
  const currentOrg = await getCurrentOrg();

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  });
}
