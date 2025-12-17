'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowLeftRight, Loader2 } from 'lucide-react';

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

import { transferOwnershipAction } from './actions';

interface TransferOwnershipButtonProps {
  transferToUserId: string;
}

export function TransferOwnershipButton({
  transferToUserId,
}: TransferOwnershipButtonProps) {
  const { mutate: transferOwnership, isPending } = useMutation({
    mutationFn: transferOwnershipAction,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isPending}>
          <ArrowLeftRight className="size-4" />
          Transfer ownership
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transfer ownership</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to transfer this organization ownership?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => transferOwnership(transferToUserId)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Transfer'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
