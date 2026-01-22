'use server';

import { Role, roleSchema } from '@saas/auth';
import { HTTPError } from 'ky';
import { z } from 'zod';

import { getCurrentOrg } from '@/auth/auth';
import { createInvite } from '@/http/create-invite';
import { removeMember } from '@/http/remove-member';
import { revokeInvite } from '@/http/revoke-invite';
import { transferOrganization } from '@/http/transfer-organization';
import { updateMember } from '@/http/update-member';

interface UpdateMemberActionProps {
  memberId: string;
  role: Role;
}

const inviteSchema = z.object({
  email: z.email({ message: 'Invalid e-mail address.' }),
  role: roleSchema,
});

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten((insue) => insue.message).fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, role } = result.data;

  try {
    await createInvite({
      org: (await getCurrentOrg())!,
      email,
      role,
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    return { success: false, message: 'unexpected error.', errors: null };
  }

  return {
    success: true,
    message: 'Successfully invited the user.',
    errors: null,
  };
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg();

  await revokeInvite({
    org: currentOrg!,
    inviteId,
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

export async function transferOwnershipAction(transferToUserId: string) {
  const currentOrg = await getCurrentOrg();

  await transferOrganization({
    org: currentOrg!,
    transferToUserId,
  });
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg();

  await removeMember({
    org: currentOrg!,
    memberId,
  });
}
