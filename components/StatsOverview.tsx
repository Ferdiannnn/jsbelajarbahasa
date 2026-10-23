'use client';

import { useEffect, useState } from 'react';
import { getScores } from '@/lib/storage';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const scores = getScores();
    if (scores.length === 0) {
      return;
    }

    const total = scores.reduce((sum, s) => sum + s.percentage, 0);
    const best = Math.max(...scores.map((s) => s.percentage));

    setStats({
      totalAttempts: scores.length,
      averageScore: Math.round(total / scores.length),
      bestScore: best,
    });
  }, [mounted]);

  if (stats.totalAttempts === 0) {
    return null;
  }

  const statCards = [
    {
      icon: Zap,
      label: 'Total Attempts',
      value: stats.totalAttempts,
      bg: 'bg-orange-50 dark:bg-orange-950',
      border: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      accentBg: 'bg-orange-100/50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      accentBg: 'bg-blue-100/50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Award,
      label: 'Best Score',
      value: `${stats.bestScore}%`,
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      accentBg: 'bg-green-100/50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className={`stat-card ${stat.bg} border ${stat.border}`}>
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.accentBg}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              
              <div className={`mt-4 h-1 rounded-full opacity-20 group-hover:opacity-100 transition-opacity`} style={{
                background: stat.textColor.includes('orange') ? '#ea580c' : stat.textColor.includes('blue') ? '#2563eb' : '#16a34a'
              }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
