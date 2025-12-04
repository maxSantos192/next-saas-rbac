import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { getInitials } from '@/helpers/get-initials';
import { getOrganizations } from '@/http/get-organization';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export async function OrganizationSwitcher() {
  const cookieStore = await cookies();

  const currentOrg = cookieStore.get('org')?.value;
  const { organizations } = await getOrganizations();

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {currentOrganization ? (
          <>
            <Avatar className="mr-2 size-5">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback>
                {getInitials(currentOrganization.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{currentOrganization.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((organization) => {
            return (
              <DropdownMenuItem key={organization.id} asChild>
                <Link href={`/org/${organization.slug}`}>
                  <Avatar className="mr-2 size-5">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl} />
                    )}
                    <AvatarFallback>
                      {getInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-5" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
