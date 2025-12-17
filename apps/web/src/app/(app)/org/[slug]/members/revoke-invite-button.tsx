'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2, XOctagon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { revokeInviteAction } from './actions';

interface RevokeInviteButtonProps {
  inviteId: string;
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  const { mutate: revokeInvite, isPending } = useMutation({
    mutationFn: revokeInviteAction,
  });

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => revokeInvite(inviteId)}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <XOctagon className="size-4" />
      )}
      Revoke invite
    </Button>
  );
}
