'use client';

import Link from 'next/link';
import { Chapter } from '@/lib/data';
import { getChapterStats } from '@/lib/storage';
import { BookOpen, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const stats = getChapterStats(chapter.id);
  const progressPercent = stats.attempts > 0 ? Math.round((stats.bestScore / 100) * 100) : 0;

  const getLevelColor = (level: string) => {
    if (level === 'N5') {
      return 'from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950';
    }
    if (level === 'N4') {
      return 'from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950';
    }
    return 'from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950';
  };

  const getLevelBadgeColor = (level: string) => {
    if (level === 'N5') {
      return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
    }
    if (level === 'N4') {
      return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  };

  return (
    <TooltipProvider>
      <Link href={`/chapter/${encodeURIComponent(chapter.id)}`}>
        <div className="group chapter-card cursor-pointer transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 bg-gradient-to-br ${getLevelColor(chapter.level)} rounded-lg transition-transform group-hover:scale-110`}>
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {chapter.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{chapter.questionCount} questions</p>
                </div>
              </div>
              
              {stats.attempts > 0 && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-700 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 cursor-help">
                          {stats.bestScore}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Best score</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {stats.attempts === 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>No attempts yet</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2 sm:gap-3 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={`text-xs sm:text-sm font-semibold border-0 cursor-help ${getLevelBadgeColor(chapter.level)}`}>
                    {chapter.level}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {chapter.level === 'N5' && 'Beginner level - Perfect for just starting out'}
                  {chapter.level === 'N4' && 'Intermediate level - Build on your existing knowledge'}
                </TooltipContent>
              </Tooltip>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </TooltipProvider>
  );
}
