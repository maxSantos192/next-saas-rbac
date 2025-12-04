import Image from 'next/image';

import nextjsIcon from '@/assets/nextjs-icon.svg';

import { ProfileButton } from './profile-button';

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={nextjsIcon} alt="NextJs" className="size-6 dark:invert" />
      </div>

      <ProfileButton />
    </header>
  );
}
