'use client';

import { useEffect, useState, useCallback } from 'react';
import { getScores, getChapterStats } from '@/lib/storage';
import { getChapters, Chapter } from '@/lib/data';
import { UserScore } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, Trash2, TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function HistoryContent() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const { user } = useAuth();

  const fetchCloudScores = useCallback(async () => {
    setLoadingCloud(true);
    try {
      const response = await fetch('/api/scores');
      if (response.ok) {
        const data = await response.json();
        console.log('Cloud scores fetched:', data.scores);
      }
    } catch (error) {
      console.error('Failed to fetch cloud scores:', error);
    } finally {
      setLoadingCloud(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const allChapters = getChapters();
    setChapters(allChapters);
    if (allChapters.length > 0) {
      setSelectedChapter(allChapters[0].id);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !selectedChapter) return;

    const allScores = getScores();
    const filtered = allScores.filter((s) => s.chapter === selectedChapter);
    setScores(filtered.sort((a, b) => b.timestamp - a.timestamp));

    fetchCloudScores();
  }, [selectedChapter, mounted, fetchCloudScores]);

  const stats = selectedChapter ? getChapterStats(selectedChapter) : null;

  const handleClearHistory = () => {
    if (selectedChapter) {
      const allScores = getScores();
      const filtered = allScores.filter((s) => s.chapter !== selectedChapter);
      localStorage.setItem('language_learning_scores', JSON.stringify(filtered));
      setScores([]);
    }
  };

  const getScoreColor = (percent: number) => {
    if (percent >= 90) return { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
    if (percent >= 80) return { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
    if (percent >= 70) return { bg: 'bg-yellow-50 dark:bg-yellow-950', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
    if (percent >= 60) return { bg: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
    return { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
  };

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="sticky top-0 bg-white dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 border-b border-slate-200 dark:border-slate-700 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">History & Stats</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Track your learning progress</p>
        </div>

        {user && (
          <Card className="card-elevated mb-8 border-l-4 border-l-blue-500">
            <div className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Learning as <span className="font-bold text-slate-900 dark:text-slate-50">{user.email}</span>
              </p>
            </div>
          </Card>
        )}

        <div className="mb-8">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Select Chapter
          </label>
          <Select value={selectedChapter || ''} onValueChange={setSelectedChapter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a chapter..." />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((ch) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {ch.name} ({ch.level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {stats && stats.attempts > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="stat-card bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 p-4 sm:p-6">
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 bg-orange-100/50 dark:bg-orange-900/30">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Attempts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.attempts}</p>
                </div>
              </Card>

              <Card className="stat-card bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 p-4 sm:p-6">
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 bg-green-100/50 dark:bg-green-900/30">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Best Score</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.bestScore}%</p>
                </div>
              </Card>

              <Card className="stat-card bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 p-4 sm:p-6">
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 bg-blue-100/50 dark:bg-blue-900/30">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Average</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.averageScore}%</p>
                </div>
              </Card>

              <Card className="stat-card bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 p-4 sm:p-6">
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 bg-purple-100/50 dark:bg-purple-900/30">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Questions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalQuestions}</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {loadingCloud && (
          <Card className="card-elevated mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="p-4">
              <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200">🔄 Syncing cloud data...</p>
            </div>
          </Card>
        )}

        {scores.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">Recent Attempts</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear History</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to clear all history for this chapter? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={handleClearHistory}
                    >
                      Clear
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {scores.map((score) => {
                const date = new Date(score.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const colors = getScoreColor(score.percentage);

                return (
                  <Card key={score.id} className={`${colors.bg} border ${colors.border} card-elevated`}>
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{formattedDate}</span>
                        <Badge className={`text-sm sm:text-lg font-bold ${colors.text} ${colors.bg} border ${colors.border}`}>
                          {score.percentage}%
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{score.correctAnswers}</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {' '}
                          out of {score.totalQuestions} correct
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="card-elevated text-center py-12">
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">No attempts yet for this chapter</p>
              <Link href="/">
                <Button className="btn-gradient">
                  Start Learning
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
