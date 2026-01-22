'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2, XCircle } from 'lucide-react';

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

import { shutdownOrganizationAction } from './actions';

export function ShutdownOrganizationButton() {
  const { mutate: shutdownOrganization, isPending } = useMutation({
    mutationFn: shutdownOrganizationAction,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-56">
          <XCircle className="size-4" />
          Shutdown organization
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Shutdown organization</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all organization data including all projects. You
            cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => shutdownOrganization()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Shutdown'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
