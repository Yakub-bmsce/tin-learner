'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { darkMode } = useUserStore();

  useEffect(() => {
    // Set dark mode by default on mount
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}
