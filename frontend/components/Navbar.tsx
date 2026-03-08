'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold gradient-text font-syne hover:scale-105 transition-transform">
            TinLearn
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/home" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              Home
            </Link>
            <Link href="/dashboard" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              Dashboard
            </Link>
            <Link href="/domains" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              Domains
            </Link>
            <Link href="/community" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              Community
            </Link>
            <Link href="/mentor" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              AI Mentor
            </Link>
            <Link href="/profile" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition hover:scale-110 disabled:opacity-50"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
