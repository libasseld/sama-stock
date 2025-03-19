'use client';

import { UserButton } from '@/components/user-button';
import { ModeToggle } from '@/components/mode-toggle';

export function Navbar() {
  return (
    <div className="flex items-center p-4">
      <div className="flex w-full justify-end space-x-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}