import { getCurrentOrg } from '@/auth/auth';

import { NavLink } from './nav-link';
import { Button } from './ui/button';

export async function Tabs() {
  const currentOrg = await getCurrentOrg();

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          asChild
        >
          <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/settings`}>
            Settings & Billing
          </NavLink>
        </Button>
      </nav>
    </div>
  );
}
