import { organizationSchema } from '@saas/auth';
import { Crown } from 'lucide-react';

import { ability, getCurrentOrg } from '@/auth/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getInitials } from '@/helpers/get-initials';
import { getMembers } from '@/http/get-members';
import { getMembership } from '@/http/get-membership';
import { getOrganization } from '@/http/get-organization';

import { RemoveMemberButton } from './remove-member-button';
import { TransferOwnershipButton } from './transfer-ownership-button';
import { UpdateMemberRoleSelect } from './update-member-role-select';

export async function MemberList() {
  const currentOrg = await getCurrentOrg();
  const permissions = await ability();

  const [{ members }, { membership }, { organization }] = await Promise.all([
    getMembers(currentOrg!),
    getMembership(currentOrg!),
    getOrganization(currentOrg!),
  ]);

  const authOrganization = organizationSchema.parse(organization);

  const canTransferOwnership = permissions?.can(
    'transfer_ownership',
    authOrganization
  );
  const canDeleteUser = permissions?.can('delete', 'User');
  const cannotUpdateMember = permissions?.cannot('update', 'User');

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    <AvatarImage src={member.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {getInitials(member.name ?? 'U')}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}
                      {member.userId === membership.userId && (
                        <span className="text-muted-foreground text-xs">
                          (You)
                        </span>
                      )}
                      {organization.ownerId === member.userId && (
                        <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                          <Crown className="size-3" />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {canTransferOwnership && (
                      <TransferOwnershipButton
                        transferToUserId={member.userId}
                      />
                    )}

                    <UpdateMemberRoleSelect
                      memberId={member.id}
                      value={member.role}
                      disabled={
                        member.userId === membership.userId ||
                        member.userId === organization.ownerId ||
                        cannotUpdateMember
                      }
                    />

                    {canDeleteUser && (
                      <RemoveMemberButton
                        memberId={member.id}
                        disabled={
                          member.userId === membership.userId ||
                          member.userId === organization.ownerId
                        }
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
