'use client';

import Link from 'next/link';
import { Chapter } from '@/lib/data';
import { getChapterStats } from '@/lib/storage';
import { BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const stats = getChapterStats(chapter.id);
  const progressPercent = stats.attempts > 0 ? Math.round((stats.bestScore / 100) * 100) : 0;

  return (
    <Link href={`/chapter/${encodeURIComponent(chapter.id)}`}>
      <div className="chapter-card">
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">{chapter.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{chapter.questionCount} questions</p>
              </div>
            </div>
            
            {stats.attempts > 0 && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{stats.bestScore}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <Badge className="badge-glow">{chapter.level}</Badge>
            <ChevronRight className="w-6 h-6 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
