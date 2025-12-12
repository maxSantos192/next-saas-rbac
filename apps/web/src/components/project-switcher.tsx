'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { getProjects } from '@/http/get-projects';

import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{
    slug: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  });

  console.log(data);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        <span className="text-muted-foreground">Select project</span>
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="">
              <Avatar className="mr-2 size-5">
                <AvatarFallback />
              </Avatar>
              <span className="line-clamp-1">Projeto teste</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="">
            <PlusCircle className="mr-2 size-5" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
