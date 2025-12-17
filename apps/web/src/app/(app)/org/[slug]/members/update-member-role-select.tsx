'use client';

import { Role } from '@saas/auth';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ComponentProps } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { updateMemberAction } from './actions';

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string;
}

export function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
  const { mutate: updateMemberRole, isPending } = useMutation({
    mutationFn: updateMemberAction,
  });

  return (
    <Select
      onValueChange={(role: Role) => updateMemberRole({ memberId, role })}
      {...props}
    >
      <SelectTrigger className="w-32" disabled={isPending}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="ADMIN">
            Admin
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </SelectItem>
          <SelectItem value="MEMBER">
            Member
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </SelectItem>
          <SelectItem value="BILLING">
            Billing
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
