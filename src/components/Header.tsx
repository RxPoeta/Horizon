'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Búsqueda', href: '/search' },
    { name: 'Favoritos', href: '/favorites' },
  ];

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-primary dark:text-primary-fixed-dim font-sans">
              AURANEWS
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-sans tracking-tight py-1 transition-colors ${
                    isActive
                      ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-1.5 sm:p-2 hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">palette</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <Link 
              href="/settings"
              className="p-1.5 sm:p-2 hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">account_circle</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
