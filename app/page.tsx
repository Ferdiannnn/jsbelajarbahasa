'use client';

import { useEffect, useState } from 'react';
import { getChapters, Chapter } from '@/lib/data';
import ChapterCard from '@/components/ChapterCard';
import StatsOverview from '@/components/StatsOverview';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { History, LogOut, Sun, Moon, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function HomeContent() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setChapters(getChapters());
  }, [mounted]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text break-words">
                日本語を学ぼう
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Master Japanese step by step with interactive lessons</p>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              title="Toggle theme"
              className="dark:border-slate-700 h-10 w-10 rounded-xl"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link href="/history">
              <Button size="icon" variant="outline" title="View history" className="dark:border-slate-700 h-10 w-10 rounded-xl">
                <History className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              onClick={handleLogout}
              title="Logout"
              className="dark:border-slate-700 h-10 w-10 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="dark:border-slate-700 h-12 w-12 rounded-xl">
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-3">
                <DropdownMenuItem onClick={toggleTheme} className="py-3 px-4 text-base">
                  {isDark ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <Link href="/history">
                  <DropdownMenuItem className="py-3 px-4 text-base">
                    <History className="w-5 h-5 mr-3" />
                    History
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={handleLogout} className="py-3 px-4 text-base text-red-600 dark:text-red-400">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="mb-8 card-elevated p-4 sm:p-6 border-l-4 border-l-blue-500">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Welcome back, <span className="font-bold text-slate-900 dark:text-slate-50">{user.email}</span>
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Your Progress</h2>
          <StatsOverview />
        </div>

        {/* Chapters Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Choose a Chapter
            </h2>
            <div className="hidden sm:flex gap-1">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>

        {/* Footer Motivation */}
        <div className="mt-16 text-center card-elevated p-6 sm:p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border-t-2 border-b-2 border-blue-200 dark:border-blue-800">
          <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            🎯 Keep learning, stay consistent!
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every lesson brings you closer to fluency. You&apos;ve got this! 💪
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
