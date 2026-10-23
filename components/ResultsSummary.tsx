'use client';

import { QuestionResult } from '@/lib/data';
import { CheckCircle, XCircle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';
import AutoEvaluation from './AutoEvaluation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ResultsSummaryProps {
  results: QuestionResult[];
  chapterName: string;
  onRetry: () => void;
}

export default function ResultsSummary({
  results,
  chapterName,
  onRetry,
}: ResultsSummaryProps) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const percentage = Math.round((correctCount / results.length) * 100);
  const manualCorrect = results
    .filter((r) => r.questionType === 'manual' && r.isCorrect)
    .length;
  const manualTotal = results.filter((r) => r.questionType === 'manual').length;
  const multipleCorrect = results
    .filter((r) => r.questionType === 'multiple' && r.isCorrect)
    .length;
  const multipleTotal = results.filter((r) => r.questionType === 'multiple').length;

  const getGrade = (percent: number) => {
    if (percent >= 90) return { 
      grade: 'A', 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
    };
    if (percent >= 80) return { 
      grade: 'B', 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
    };
    if (percent >= 70) return { 
      grade: 'C', 
      color: 'text-yellow-600 dark:text-yellow-400', 
      bg: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' 
    };
    if (percent >= 60) return { 
      grade: 'D', 
      color: 'text-orange-600 dark:text-orange-400', 
      bg: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' 
    };
    return { 
      grade: 'F', 
      color: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' 
    };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quiz Complete!</h1>
          <p className="text-slate-600 dark:text-slate-400">{chapterName}</p>
        </div>

        <Card className={`border-2 mb-8 ${gradeInfo.bg}`}>
          <div className="p-8 sm:p-12 text-center">
            <div className={`text-7xl sm:text-8xl font-bold ${gradeInfo.color} mb-4`}>
              {gradeInfo.grade}
            </div>
            <div className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-3">{percentage}%</div>
            <div className="text-slate-600 dark:text-slate-400">
              {correctCount} out of {results.length} correct
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {manualTotal > 0 && (
            <Card className="border-slate-200 dark:border-slate-700">
              <div className="p-6">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Write Answer</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {manualCorrect}/{manualTotal}
                </p>
              </div>
            </Card>
          )}
          {multipleTotal > 0 && (
            <Card className="border-slate-200 dark:border-slate-700">
              <div className="p-6">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Multiple Choice</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {multipleCorrect}/{multipleTotal}
                </p>
              </div>
            </Card>
          )}
        </div>

        <Card className="border-slate-200 dark:border-slate-700 mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">Answer Review</h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <div key={idx} className="px-6 py-4">
                <div className="flex items-start gap-4">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">Q{idx + 1}</span>
                      <Badge variant="outline" className="text-xs dark:border-slate-600 dark:text-slate-400">
                        {result.questionType === 'manual' ? 'Write' : 'Multiple'}
                      </Badge>
                    </div>
                    {!result.isCorrect && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                        <p>
                          <span className="font-medium">Your answer:</span> {result.userAnswer}
                        </p>
                        <p>
                          <span className="font-medium">Correct:</span> {result.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium h-11"
          >
            <RotateCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300 h-11">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Separator className="my-8" />

        <AutoEvaluation wrongAnswers={results.filter((r) => !r.isCorrect)} />
      </div>
    </div>
  );
}
