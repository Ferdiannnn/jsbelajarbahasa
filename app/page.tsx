'use client';

import { useEffect, useState } from 'react';
import { getChapters, Chapter } from '@/lib/data';
import ChapterCard from '@/components/ChapterCard';
import StatsOverview from '@/components/StatsOverview';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { History, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                日本語を学ぼう
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Master Japanese step by step with interactive lessons</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              title="Toggle theme"
              className="dark:border-slate-700 h-12 w-12 rounded-xl"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>
            <Link href="/history">
              <Button size="icon" variant="outline" title="View history" className="dark:border-slate-700 h-12 w-12 rounded-xl">
                <History className="w-6 h-6" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              onClick={handleLogout}
              title="Logout"
              className="dark:border-slate-700 h-12 w-12 rounded-xl"
            >
              <LogOut className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="mb-8 card-elevated p-6 border-l-4 border-l-blue-500">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome back, <span className="font-bold text-slate-900 dark:text-slate-50">{user.email}</span>
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Your Progress</h2>
          <StatsOverview />
        </div>

        {/* Chapters Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Choose a Chapter
            </h2>
            <div className="hidden sm:flex gap-1">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>

        {/* Footer Motivation */}
        <div className="mt-16 text-center card-elevated p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border-t-2 border-b-2 border-blue-200 dark:border-blue-800">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            🎯 Keep learning, stay consistent!
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Every lesson brings you closer to fluency. You've got this! 💪
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
