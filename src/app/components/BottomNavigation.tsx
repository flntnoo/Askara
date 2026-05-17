'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Heart, Settings } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/decks', icon: Layers, label: 'Decks' },
    { path: '/favorites', icon: Heart, label: 'Favorit' },
    { path: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fcf9f8] border-t-2 border-[#1c1b1b] z-50">
      <div className="max-w-[1152px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-around h-16 md:h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                aria-label={item.label}
                className={`flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#a93718]'
                    : 'text-[#58413c] hover:text-[#a93718]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                <span
                  className={`text-xs md:text-sm font-['Hanken_Grotesk',sans-serif] ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
