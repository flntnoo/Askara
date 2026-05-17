'use client';

import { usePathname } from 'next/navigation';
import BottomNavigation from './BottomNavigation';

const bottomNavPaths = new Set(['/home', '/decks', '/favorites', '/settings']);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = bottomNavPaths.has(pathname);

  return (
    <div
      className={`min-h-screen w-full flex flex-col ${showBottomNav ? 'pb-20 md:pb-24' : ''}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgb(252, 249, 248) 0%, rgb(252, 249, 248) 100%)',
      }}
    >
      <main className="flex-1 w-full">{children}</main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
