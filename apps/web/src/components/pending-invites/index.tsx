'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Check, UserPlus2, X } from 'lucide-react';
import { useState } from 'react';

import { getPendingInvites } from '@/http/get-pending-invites';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import { acceptInviteAction, rejectInviteAction } from './actions';

dayjs.extend(relativeTime);

export function PendingInvites() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: () => getPendingInvites(),
    enabled: isOpen,
  });

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId);

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId);

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending Invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending invites {data?.invites.length ?? 0}
        </span>

        {data?.invites.length === 0 && (
          <p className="text-muted-foreground text-sm">No invites pending</p>
        )}

        {isLoading ? (
          <>
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </>
        ) : (
          <>
            {data?.invites?.map((invite) => (
              <div key={invite.id} className="space-y-2">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <span className="text-foreground font-medium">
                    {invite.author?.name}
                  </span>{' '}
                  invited you to join{' '}
                  <span className="text-foreground font-medium">
                    {invite.organization.name}
                  </span>{' '}
                  <span>{dayjs(invite.createdAt).fromNow()}</span>
                </p>

                <div className="flex gap-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleAcceptInvite(invite.id)}
                    className="text-muted-foreground"
                  >
                    <Check className="size-3" />
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleRejectInvite(invite.id)}
                    className="text-muted-foreground"
                  >
                    <X className="size-3" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
