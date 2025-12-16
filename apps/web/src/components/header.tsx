import { Slash } from 'lucide-react';
import Image from 'next/image';

import nextjsIcon from '@/assets/nextjs-icon.svg';
import { ability } from '@/auth/auth';

import { OrganizationSwitcher } from './organization-switcher';
import { ProfileButton } from './profile-button';
import { ProjectSwitcher } from './project-switcher';
import { ThemeSwitcher } from './theme/theme-switcher';
import { Separator } from './ui/separator';

export async function Header() {
  const permissions = await ability();

  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={nextjsIcon} alt="NextJs" className="size-6 dark:invert" />

        <Slash className="-rotate-24 text-border size-3" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="-rotate-24 text-border size-3" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex h-5 items-center gap-4">
        <ThemeSwitcher />

        <Separator orientation="vertical" />

        <ProfileButton />
      </div>
    </header>
  );
}
