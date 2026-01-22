'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2, UserMinus } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { removeMemberAction } from './actions';

interface RemoveMemberButtonProps {
  memberId: string;
  disabled?: boolean;
}

export function RemoveMemberButton({
  memberId,
  disabled,
}: RemoveMemberButtonProps) {
  const { mutate: removeMember, isPending } = useMutation({
    mutationFn: removeMemberAction,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={disabled}>
          <UserMinus className="size-4" />
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this member?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => removeMember(memberId)}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Remove'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
